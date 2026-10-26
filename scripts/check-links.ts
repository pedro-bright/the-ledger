#!/usr/bin/env tsx
/**
 * Check source URLs with GET, preserving occurrences and redirect destinations.
 * Exits nonzero on broken links. Broken links and suspicious redirects keep
 * broken-links-report.md (full) and broken-links-summary.md, which the weekly
 * stale-sources job uploads and posts.
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
const SUMMARY_ENTRIES = 10;
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

function registrableDomain(hostname: string): string {
  if (/^[\d.]+$|:/.test(hostname)) return hostname;
  const labels = hostname.replace(/\.$/, "").split(".");
  const secondLevel = labels.length > 2 && labels.at(-1)!.length === 2 &&
    /^(?:ac|co|com|edu|gov|net|org)$/.test(labels.at(-2)!);
  return labels.slice(secondLevel ? -3 : -2).join(".");
}

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

export function formatReport(results: LinkResult[], limit = Infinity): string {
  const broken = results.filter((r) => !r.ok);
  const suspicious = results.filter((r) => r.ok && r.suspicious);
  const redirects = results.filter((r) => r.finalUrl !== r.url);
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
    if (entries.length === 0) return [];
    const more = entries.length - limit;
    return ["", `## ${title}`, "", ...entries.slice(0, limit), ...(more > 0 ? [`- ...and ${more} more`] : [])];
  };
  const counts = new Map<string, number>();
  const count = (type: string) => counts.set(type, (counts.get(type) ?? 0) + 1);
  for (const link of broken) count(`Broken \`${link.issue ?? link.status}\``);
  for (const link of suspicious) count(`Suspicious redirect (${link.suspicious})`);
  if (redirects.length) counts.set("Redirects", redirects.length);
  return [
    "## Source Link Report", "",
    `Found ${broken.length} broken link(s) and ${suspicious.length} suspicious redirect(s) ` +
      `among ${results.length} URL(s) on ${new Date().toISOString().slice(0, 10)}:`, "",
    ...Array.from(counts, ([type, n]) => `- ${type}: ${n}`),
    ...section("Broken Links", broken),
    ...section("Suspicious Redirects", suspicious),
    ...section("Redirects", redirects),
  ].join("\n");
}

export function writeReports(results: LinkResult[], dir = ROOT): boolean {
  const reportPath = path.join(dir, REPORT_FILE);
  const summaryPath = path.join(dir, SUMMARY_FILE);
  if (!results.some((r) => !r.ok || r.suspicious)) {
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
    const label = result.suspicious ? `Suspicious redirect (${result.suspicious})` : "Redirect";
    console.log(`  ${label}: ${result.url} -> ${result.finalUrl} (Status: ${result.status})`);
  }
  const broken = results.filter((r) => !r.ok);
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
  main();
}
