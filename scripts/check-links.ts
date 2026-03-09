#!/usr/bin/env tsx
/**
 * check-links.ts — HTTP HEAD all source URLs in content files, report broken links.
 * Rate-limited to avoid hammering servers.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");

// Rate limiting: max concurrent requests + delay between batches
const CONCURRENCY = 3;
const DELAY_MS = 500;
const TIMEOUT_MS = 15000;

interface LinkResult {
  url: string;
  file: string;
  status: number | string;
  ok: boolean;
}

function walkDir(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else if (
      entry.name !== ".gitkeep" &&
      (entry.name.endsWith(".md") || entry.name.endsWith(".yml") || entry.name.endsWith(".yaml"))
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

function extractUrls(filePath: string): Array<{ url: string; file: string }> {
  const ext = path.extname(filePath);
  const raw = fs.readFileSync(filePath, "utf-8");
  const relativePath = path.relative(CONTENT_DIR, filePath);
  const urls: Array<{ url: string; file: string }> = [];

  let data: Record<string, unknown>;
  if (ext === ".yml" || ext === ".yaml") {
    data = (yaml.load(raw) as Record<string, unknown>) ?? {};
  } else {
    data = matter(raw).data;
  }

  // Recursively extract URLs from data
  function extract(obj: unknown) {
    if (typeof obj === "string" && obj.startsWith("http")) {
      urls.push({ url: obj, file: relativePath });
    } else if (Array.isArray(obj)) {
      for (const item of obj) extract(item);
    } else if (obj && typeof obj === "object") {
      for (const val of Object.values(obj as Record<string, unknown>)) {
        extract(val);
      }
    }
  }

  // Extract from sources array specifically
  const sources = data.sources as Array<Record<string, unknown>> | undefined;
  if (sources) {
    for (const source of sources) {
      if (source.url) urls.push({ url: String(source.url), file: relativePath });
      if (source.archive_url) urls.push({ url: String(source.archive_url), file: relativePath });
    }
  }

  // Also check website field (actors)
  if (data.website && typeof data.website === "string") {
    urls.push({ url: data.website, file: relativePath });
  }

  return urls;
}

async function checkUrl(url: string): Promise<{ status: number | string; ok: boolean }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "The-Ledger-Link-Checker/1.0",
      },
    });
    clearTimeout(timeout);

    // Some sites block HEAD, try GET if 405
    if (response.status === 405) {
      const getResponse = await fetch(url, {
        method: "GET",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        redirect: "follow",
        headers: {
          "User-Agent": "The-Ledger-Link-Checker/1.0",
        },
      });
      return { status: getResponse.status, ok: getResponse.ok };
    }

    return { status: response.status, ok: response.ok };
  } catch (e) {
    clearTimeout(timeout);
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("abort")) return { status: "TIMEOUT", ok: false };
    return { status: msg.slice(0, 60), ok: false };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("🔗 The Ledger — Checking source links...\n");

  const files = walkDir(CONTENT_DIR);
  const allLinks: Array<{ url: string; file: string }> = [];

  for (const f of files) {
    allLinks.push(...extractUrls(f));
  }

  // Deduplicate by URL (keep first occurrence for reporting)
  const seen = new Map<string, { url: string; file: string }>();
  for (const link of allLinks) {
    if (!seen.has(link.url)) {
      seen.set(link.url, link);
    }
  }

  const uniqueLinks = Array.from(seen.values());
  console.log(`Found ${uniqueLinks.length} unique URLs to check.\n`);

  if (uniqueLinks.length === 0) {
    console.log("✅ No URLs found to check.");
    process.exit(0);
  }

  const results: LinkResult[] = [];

  // Process in batches
  for (let i = 0; i < uniqueLinks.length; i += CONCURRENCY) {
    const batch = uniqueLinks.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(async (link) => {
        const { status, ok } = await checkUrl(link.url);
        return { url: link.url, file: link.file, status, ok };
      })
    );
    results.push(...batchResults);

    // Progress
    const checked = Math.min(i + CONCURRENCY, uniqueLinks.length);
    process.stdout.write(`\r  Checked ${checked}/${uniqueLinks.length} URLs...`);

    if (i + CONCURRENCY < uniqueLinks.length) {
      await sleep(DELAY_MS);
    }
  }

  console.log("\n");

  const broken = results.filter((r) => !r.ok);

  if (broken.length === 0) {
    console.log("✅ All links are valid.\n");
    process.exit(0);
  }

  console.log(`❌ Found ${broken.length} broken link(s):\n`);
  for (const link of broken) {
    console.log(`  ${link.file}`);
    console.log(`    → ${link.url}`);
    console.log(`    → Status: ${link.status}\n`);
  }

  // Output markdown for GitHub issue creation
  const issueBody = [
    "## Broken Links Report",
    "",
    `Found ${broken.length} broken link(s) on ${new Date().toISOString().slice(0, 10)}:`,
    "",
    ...broken.map(
      (l) => `- **${l.file}**: [${l.url}](${l.url}) — Status: \`${l.status}\``
    ),
  ].join("\n");

  const reportPath = path.join(ROOT, "broken-links-report.md");
  fs.writeFileSync(reportPath, issueBody, "utf-8");
  console.log(`📄 Report written to broken-links-report.md\n`);

  process.exit(1);
}

main();
