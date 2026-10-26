#!/usr/bin/env tsx
/**
 * Check source URLs with GET, preserving occurrences and redirect destinations.
 * The weekly stale-sources job reads broken-links-report.md on a nonzero exit.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import yaml from "js-yaml";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "content");
const CONCURRENCY = 2;
const HOST_DELAY_MS = 1000;
const TIMEOUT_MS = 15000;
const MAX_REDIRECTS = 20;

interface LinkOccurrence {
  url: string;
  file: string;
  field: string;
}

interface UrlResult {
  status: number | string;
  ok: boolean;
  finalUrl: string;
  issue?: string;
}

interface LinkResult extends UrlResult {
  url: string;
  occurrences: LinkOccurrence[];
}

function walkDir(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkDir(fullPath));
    else if (/\.(md|ya?ml)$/.test(entry.name)) results.push(fullPath);
  }
  return results;
}

export function extractUrls(filePath: string): LinkOccurrence[] {
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = /\.ya?ml$/.test(filePath) ? yaml.load(raw) : matter(raw).data;
  const file = path.relative(CONTENT_DIR, filePath);
  const urls: LinkOccurrence[] = [];

  function extract(obj: unknown, field: string) {
    if (Array.isArray(obj)) {
      obj.forEach((item, i) => extract(item, `${field}[${i}]`));
    } else if (obj && typeof obj === "object") {
      for (const [key, value] of Object.entries(obj)) {
        const location = field ? `${field}.${key}` : key;
        if (["url", "archive_url", "website"].includes(key) && typeof value === "string" && /^https?:\/\//.test(value)) {
          urls.push({ url: value, file, field: location });
        } else {
          extract(value, location);
        }
      }
    }
  }

  extract(data, "");
  return urls;
}

// Serialize request starts per hostname, including each redirect hop.
const hostQueues = new Map<string, Promise<void>>();
const lastStarts = new Map<string, number>();
async function waitForHost(url: string): Promise<void> {
  const host = new URL(url).hostname;
  const turn = (hostQueues.get(host) ?? Promise.resolve()).then(async () => {
    const last = lastStarts.get(host);
    if (last !== undefined) {
      const delay = HOST_DELAY_MS - (performance.now() - last);
      if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
    }
    lastStarts.set(host, performance.now());
  });
  hostQueues.set(host, turn);
  await turn;
}

function unpinnedArchive(url: string): boolean {
  const parsed = new URL(url);
  return parsed.hostname === "web.archive.org" &&
    !/^\/web\/\d{14}(?:[a-z_]+)?\/https?:\/\//i.test(parsed.pathname);
}

export async function checkUrl(url: string): Promise<UrlResult> {
  let finalUrl = url;
  let unpinned = false;
  try {
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      unpinned ||= unpinnedArchive(finalUrl);
      await waitForHost(finalUrl);
      const response = await fetch(finalUrl, {
        method: "GET",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        redirect: "manual",
        headers: { "User-Agent": "The-Ledger-Link-Checker/1.0" },
      });
      // GET checks the article endpoint; do not download entire PDFs or videos.
      await response.body?.cancel();
      const location = response.headers.get("location");
      if ([301, 302, 303, 307, 308].includes(response.status) && location) {
        if (hop === MAX_REDIRECTS) return { status: "TOO_MANY_REDIRECTS", ok: false, finalUrl };
        finalUrl = new URL(location, finalUrl).href;
        continue;
      }
      return {
        status: response.status,
        ok: response.ok && !unpinned,
        finalUrl,
        ...(unpinned ? { issue: "UNPINNED_ARCHIVE" } : {}),
      };
    }
    throw new Error("Redirect limit exceeded");
  } catch (error) {
    const timeout = error instanceof Error && ["AbortError", "TimeoutError"].includes(error.name);
    const message = error instanceof Error ? error.message : String(error);
    return { status: timeout ? "TIMEOUT" : message.slice(0, 60), ok: false, finalUrl };
  }
}

export function groupLinks(links: LinkOccurrence[]): Map<string, LinkOccurrence[]> {
  const grouped = new Map<string, LinkOccurrence[]>();
  for (const link of links) {
    const occurrences = grouped.get(link.url) ?? [];
    occurrences.push(link);
    grouped.set(link.url, occurrences);
  }
  return grouped;
}

export function formatReport(results: LinkResult[]): string {
  const broken = results.filter((r) => !r.ok);
  const detail = (link: LinkResult) =>
    `Status: \`${link.status}\`${link.issue ? ` (${link.issue})` : ""}` +
    (link.finalUrl !== link.url ? ` - Final URL: [${link.finalUrl}](${link.finalUrl})` : "");
  const entries = (links: LinkResult[]) => links.flatMap((link) =>
    link.occurrences.map((occurrence) =>
      `- **${occurrence.file} (${occurrence.field})**: [${link.url}](${link.url}) - ${detail(link)}`,
    ),
  );
  const redirects = results.filter((r) => r.finalUrl !== r.url);
  return [
    "## Broken Links Report", "",
    `Found ${broken.length} broken link(s) on ${new Date().toISOString().slice(0, 10)}:`, "",
    ...entries(broken),
    ...(redirects.length ? ["", "## Redirects", "", ...entries(redirects)] : []),
  ].join("\n");
}

async function main() {
  console.log("The Ledger - Checking source links...\n");
  const grouped = groupLinks(walkDir(CONTENT_DIR).flatMap(extractUrls));
  const uniqueLinks = Array.from(grouped.entries());
  console.log(`Found ${uniqueLinks.length} unique URLs to check.\n`);
  const results: LinkResult[] = [];

  for (let i = 0; i < uniqueLinks.length; i += CONCURRENCY) {
    const batch = await Promise.all(uniqueLinks.slice(i, i + CONCURRENCY).map(async ([url, occurrences]) => ({
      url, occurrences, ...await checkUrl(url),
    })));
    results.push(...batch);
    process.stdout.write(`\r  Checked ${results.length}/${uniqueLinks.length} URLs...`);
  }
  console.log("\n");

  for (const result of results.filter((r) => r.finalUrl !== r.url)) {
    console.log(`  Redirect: ${result.url} -> ${result.finalUrl} (Status: ${result.status})`);
  }
  const broken = results.filter((r) => !r.ok);
  const reportPath = path.join(ROOT, "broken-links-report.md");
  if (broken.length === 0) {
    fs.rmSync(reportPath, { force: true });
    console.log("All links are valid.\n");
    return;
  }

  console.log(`Found ${broken.length} broken link(s):\n`);
  for (const link of broken) {
    for (const occurrence of link.occurrences) console.log(`  ${occurrence.file} (${occurrence.field})`);
    console.log(`    -> ${link.url}`);
    console.log(`    -> Final URL: ${link.finalUrl}`);
    console.log(`    -> Status: ${link.status}${link.issue ? ` (${link.issue})` : ""}\n`);
  }
  fs.writeFileSync(reportPath, formatReport(results), "utf-8");
  console.log("Report written to broken-links-report.md\n");
  process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
