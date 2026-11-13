#!/usr/bin/env tsx
/**
 * Check source URLs with GET, preserving occurrences and redirect destinations.
 * Exits nonzero on broken links. Problems and unverified links keep
 * broken-links-report.md (full) and broken-links-summary.md, which the weekly
 * stale-sources job uploads and posts.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseFrontmatter } from "./frontmatter.js";
import yaml from "js-yaml";
import { getDomain } from "tldts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "content");
const CONCURRENCY = 2;
const HOST_DELAY_MS = 1000;
const TIMEOUT_MS = 15000;
const MAX_REDIRECTS = 20;
const SUMMARY_ENTRIES = 10;
// GitHub rejects issue and comment bodies over 65,536 characters. Leave room for
// the workflow's heading and artifact link.
const SUMMARY_MAX_CHARS = 60000;
const SUMMARY_LINE_CHARS = 1000;
const REPORT_FILE = "broken-links-report.md";
const SUMMARY_FILE = "broken-links-summary.md";

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
  suspicious?: string;
}

interface LinkResult extends UrlResult {
  url: string;
  occurrences: LinkOccurrence[];
}

// Resolve every selection before fetching, so a typo never falls back to the archive.
function contentFiles(args: string[]): string[] {
  const root = fs.realpathSync(CONTENT_DIR);
  const seen = new Set<string>();
  const files: string[] = [];
  const insideContent = (file: string) => {
    const relative = path.relative(root, file);
    return relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
  };
  function visit(file: string) {
    if (!insideContent(file)) throw new Error(`Path must be under content/: ${file}`);
    const real = fs.realpathSync(file);
    if (!insideContent(real)) throw new Error(`Path must be under content/: ${file}`);
    if (seen.has(real)) return;
    seen.add(real);
    if (fs.statSync(real).isDirectory()) {
      for (const name of fs.readdirSync(real)) visit(path.join(real, name));
    } else if (/\.(md|ya?ml)$/.test(real)) {
      files.push(real);
    }
  }
  for (const arg of args.length ? args : [CONTENT_DIR]) visit(path.resolve(arg));
  return files;
}

export function extractUrls(filePath: string): LinkOccurrence[] {
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = /\.ya?ml$/.test(filePath) ? yaml.load(raw) : parseFrontmatter(raw).data;
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

// Private suffixes keep hosted sites apart, so alice.github.io and bob.github.io differ.
const registrableDomain = (hostname: string) =>
  getDomain(hostname, { allowPrivateDomains: true }) ?? hostname;

const isRoot = (url: URL) =>
  /^\/(?:(?:index|default|home)(?:\.[a-z]+)?|[a-z]{2}(?:[-_][a-z]{2})?)?\/?$/i.test(url.pathname);

export function suspiciousRedirect(url: string, finalUrl: string): string | undefined {
  if (finalUrl === url) return undefined;
  const from = new URL(url);
  const to = new URL(finalUrl);
  if (/\/(?:log-?in|sign-?in|sign_in|auth|sso|subscribe|subscriptions?|paywall)(?:\/|\.[a-z]+)?$/i.test(to.pathname)) {
    return "login or paywall path";
  }
  if (isRoot(to) && !isRoot(from)) return "site root";
  if (registrableDomain(to.hostname) !== registrableDomain(from.hostname)) return "different domain";
  return undefined;
}

export async function checkUrl(url: string): Promise<UrlResult> {
  let finalUrl = url;
  let unpinned = false;
  const visited = new Set<string>();
  try {
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      unpinned ||= unpinnedArchive(finalUrl);
      if (visited.has(finalUrl)) {
        return { status: "TOO_MANY_REDIRECTS", ok: false, finalUrl, ...(unpinned ? { issue: "UNPINNED_ARCHIVE" } : {}) };
      }
      visited.add(finalUrl);
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
        if (hop === MAX_REDIRECTS) return { status: "TOO_MANY_REDIRECTS", ok: false, finalUrl, ...(unpinned ? { issue: "UNPINNED_ARCHIVE" } : {}) };
        finalUrl = new URL(location, finalUrl).href;
        continue;
      }
      const suspicious = suspiciousRedirect(url, finalUrl);
      return {
        status: response.status,
        ok: response.ok && !unpinned,
        finalUrl,
        ...(unpinned ? { issue: "UNPINNED_ARCHIVE" } : {}),
        ...(suspicious ? { suspicious } : {}),
      };
    }
    throw new Error("Redirect limit exceeded");
  } catch (error) {
    const timeout = error instanceof Error && ["AbortError", "TimeoutError"].includes(error.name);
    const message = error instanceof Error ? error.message : String(error);
    // fetch wraps DNS errors in a TypeError; retain the definitive missing-name code.
    let cause: unknown = error;
    const causes = new Set<unknown>();
    let missingName = false;
    while (cause && typeof cause === "object" && !causes.has(cause)) {
      causes.add(cause);
      const failure = cause as { code?: string; cause?: unknown };
      missingName ||= failure.code === "ENOTFOUND";
      cause = failure.cause;
    }
    return {
      status: missingName ? "ENOTFOUND" : timeout ? "TIMEOUT" : message.slice(0, 60),
      ok: false, finalUrl, ...(unpinned ? { issue: "UNPINNED_ARCHIVE" } : {}),
    };
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

// A blocked request cannot establish that a source is gone. Definitive failures
// take precedence over redirect heuristics, which apply to successful responses.
function classification(result: UrlResult): "broken" | "suspicious" | "unverified" | "healthy" {
  if (result.issue === "UNPINNED_ARCHIVE" || [404, 410, "ENOTFOUND", "TOO_MANY_REDIRECTS"].includes(result.status)) return "broken";
  if (!result.ok) return "unverified";
  return result.suspicious ? "suspicious" : "healthy";
}

// Keep whole lines while they fit, clipping any single overlong line.
function fitLines(lines: string[], maxChars: number): string {
  const notice = "_Summary truncated to fit GitHub's size limit. See the full report._";
  const kept: string[] = [];
  let length = 0;
  for (const line of lines) {
    const clipped = line.length > SUMMARY_LINE_CHARS ? `${line.slice(0, SUMMARY_LINE_CHARS - 1)}…` : line;
    if (length + clipped.length + notice.length + 2 > maxChars) return [...kept, "", notice].join("\n");
    kept.push(clipped);
    length += clipped.length + 1;
  }
  return kept.join("\n");
}

// A finite entry limit produces the posted summary, which also gets a hard character budget.
export function formatReport(
  results: LinkResult[],
  limit = Infinity,
  maxChars = Number.isFinite(limit) ? SUMMARY_MAX_CHARS : Infinity,
): string {
  const broken = results.filter((r) => classification(r) === "broken");
  const suspicious = results.filter((r) => classification(r) === "suspicious");
  const unverified = results.filter((r) => classification(r) === "unverified");
  const detail = (link: LinkResult) =>
    `Status: \`${link.status}\`${link.issue ? ` (${link.issue})` : ""}` +
    (link.suspicious ? ` (suspicious redirect: ${link.suspicious})` : "") +
    (link.finalUrl !== link.url ? ` - Final URL: [${link.finalUrl}](${link.finalUrl})` : "");
  const section = (title: string, links: LinkResult[]) => {
    const entries = links.flatMap((link) =>
      link.occurrences.map((occurrence) =>
        `- **${occurrence.file} (${occurrence.field})**: [${link.url}](${link.url}) - ${detail(link)}`,
      ),
    );
    const more = entries.length - limit;
    return ["", `## ${title}`, "", ...entries.slice(0, limit), ...(more > 0 ? [`- ...and ${more} more occurrence(s)`] : [])];
  };
  const counts = new Map<string, number>();
  const count = (type: string) => counts.set(type, (counts.get(type) ?? 0) + 1);
  for (const link of broken) count(`Broken \`${link.issue ?? link.status}\``);
  for (const link of suspicious) count(`Suspicious redirect (${link.suspicious})`);
  const unverifiedCounts = new Map<string, number>();
  for (const link of unverified) {
    const type = `Unverified \`${link.status}\``;
    unverifiedCounts.set(type, (unverifiedCounts.get(type) ?? 0) + 1);
  }
  const lines = [
    `Found ${broken.length} broken link(s), ${suspicious.length} suspicious redirect(s) and ` +
      `${unverified.length} link(s) that could not be verified from this network ` +
      `among ${results.length} URL(s) on ${new Date().toISOString().slice(0, 10)}:`, "",
    ...Array.from(counts, ([type, n]) => `- ${type}: ${n}`),
    ...section("Broken", broken),
    ...section("Suspicious redirects", suspicious),
    ...(Number.isFinite(limit)
      ? ["", "## Could not verify from this network", "", ...Array.from(unverifiedCounts, ([type, n]) => `- ${type}: ${n}`)]
      : section("Could not verify from this network", unverified)),
  ];
  return Number.isFinite(maxChars) ? fitLines(lines, maxChars) : lines.join("\n");
}

export function writeReports(results: LinkResult[], dir = ROOT): boolean {
  const reportPath = path.join(dir, REPORT_FILE);
  const summaryPath = path.join(dir, SUMMARY_FILE);
  if (results.every((r) => classification(r) === "healthy")) {
    fs.rmSync(reportPath, { force: true });
    fs.rmSync(summaryPath, { force: true });
    return false;
  }
  fs.writeFileSync(reportPath, formatReport(results), "utf-8");
  fs.writeFileSync(summaryPath, formatReport(results, SUMMARY_ENTRIES), "utf-8");
  return true;
}

async function main() {
  console.log("The Ledger - Checking source links...\n");
  const grouped = groupLinks(contentFiles(process.argv.slice(2)).flatMap(extractUrls));
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
    const label = result.suspicious ? `Suspicious redirect (${result.suspicious})` : "Redirect";
    console.log(`  ${label}: ${result.url} -> ${result.finalUrl} (Status: ${result.status})`);
  }
  for (const link of results.filter((r) => classification(r) === "unverified")) {
    console.warn(`  Warning: unverified link ${link.url} (Status: ${link.status})`);
  }
  const broken = results.filter((r) => classification(r) === "broken");
  if (broken.length) console.log(`Found ${broken.length} broken link(s):\n`);
  for (const link of broken) {
    for (const occurrence of link.occurrences) console.log(`  ${occurrence.file} (${occurrence.field})`);
    console.log(`    -> ${link.url}`);
    console.log(`    -> Final URL: ${link.finalUrl}`);
    console.log(`    -> Status: ${link.status}${link.issue ? ` (${link.issue})` : ""}\n`);
  }
  console.log(writeReports(results) ? `Report written to ${REPORT_FILE} and ${SUMMARY_FILE}\n` : "All links are valid.\n");
  if (broken.length) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
