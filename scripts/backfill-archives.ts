#!/usr/bin/env tsx
/**
 * Backfill primary and official event sources from existing Wayback captures.
 * Run with `npx tsx scripts/backfill-archives.ts > archive-report.md`.
 * Only archive_url lines are written; stdout contains the capture audit tables.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { parse, type DefaultTreeAdapterMap } from "parse5";
import { parseFrontmatter } from "./frontmatter.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EVENTS = path.join(ROOT, "content/events");
const DELAY_MS = 1200;
const FIXED = /^https?:\/\/web\.archive\.org\/web\/(\d{14})(?:[a-z_]+)?\/(https?:\/\/.+)$/i;
const STOP_WORDS = new Set("a an and are as at be by for from in is it of on or that the their this to was were with full text pdf official post press release blog".split(" "));

interface Source {
  url: string;
  title: string;
  type?: string;
  accessed?: string | Date;
  date?: string | Date;
  archive_url?: string;
}

interface Result {
  file: string;
  index: number;
  source: Source;
  reference: string;
  referenceField: string;
  capture?: string;
  captureDate?: string;
  days?: number;
  reason?: string;
}

let lastRequest = -Infinity;
async function request(url: string): Promise<Response> {
  const delay = DELAY_MS - (performance.now() - lastRequest);
  if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
  lastRequest = performance.now();
  const response = await fetch(url, {
    redirect: "manual",
    headers: { "User-Agent": "ArchiveClient/1.0" },
    signal: AbortSignal.timeout(30000),
  });
  if (response.status === 403 || response.status === 429) {
    throw new Error(`Archive access blocked or rate limited (HTTP ${response.status}); stopping without writing records.`);
  }
  return response;
}

function dateString(value: string | Date): string {
  return value instanceof Date ? value.toISOString().slice(0, 10) : value;
}

// Parse visible text rather than searching markup, URLs, or replay metadata.
function htmlText(html: string): string {
  function visit(node: DefaultTreeAdapterMap["node"]): string {
    if ("tagName" in node && ["script", "style", "noscript", "template", "svg"].includes(node.tagName)) return "";
    if ("attrs" in node && node.attrs.some((attr) => attr.name === "id" && /^wm-ipp/.test(attr.value))) return "";
    if ("value" in node) return node.value;
    return "childNodes" in node ? node.childNodes.map(visit).join(" ") : "";
  }
  return visit(parse(html));
}

function words(text: string): string[] {
  return text.normalize("NFKC").toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
}

async function findCapture(result: Result): Promise<void> {
  const api = new URL("https://archive.org/wayback/available");
  api.searchParams.set("url", result.source.url);
  api.searchParams.set("timestamp", result.reference.replaceAll("-", "") + "000000");
  const available = await request(api.href);
  if (available.status !== 200) {
    result.reason = `Availability API returned HTTP ${available.status}`;
    return;
  }
  const data = await available.json() as {
    archived_snapshots?: { closest?: { available: boolean; status: string; url: string; timestamp: string } };
  };
  const closest = data.archived_snapshots?.closest;
  if (!closest?.available || closest.status !== "200" || !/^\d{14}$/.test(closest.timestamp)) {
    result.reason = closest ? `Closest capture is not HTTP 200 (${closest.status})` : "No available capture";
    return;
  }
  let capture = closest.url.replace(/^http:/, "https:");
  if (!FIXED.test(capture)) throw new Error(`Availability API returned an unexpected capture URL: ${capture}`);
  for (let hop = 0; hop <= 20; hop++) {
    const response = await request(capture);
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      await response.body?.cancel();
      const next = location ? new URL(location, capture).href.replace(/^http:/, "https:") : "";
      if (!FIXED.test(next)) {
        result.reason = "Capture redirects outside a fixed Wayback capture";
        return;
      }
      capture = next;
      continue;
    }
    if (response.status !== 200) {
      result.reason = `Capture returned HTTP ${response.status}`;
      await response.body?.cancel();
      return;
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    let text: string;
    if (buffer.subarray(0, 5).toString() === "%PDF-") {
      // pdftotext reads the preserved document; no source-site request is made.
      text = execFileSync("pdftotext", ["-", "-"], { input: buffer, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
    } else {
      text = htmlText(buffer.toString("utf8"));
    }
    if (/too many requests|rate limit exceeded|your ip address has been blocked/i.test(text)) {
      throw new Error("Archive access blocked or rate limited; stopping without writing records.");
    }
    const distinctive = [...new Set(words(result.source.title).filter((word) => !STOP_WORDS.has(word)))];
    const found = new Set(words(text));
    const missing = distinctive.filter((word) => !found.has(word));
    if (!distinctive.length || missing.length) {
      result.reason = `Document text does not match title${missing.length ? ` (missing: ${missing.join(", ")})` : ""}`;
      return;
    }
    const [, timestamp, original] = capture.match(FIXED)!;
    result.capture = `https://web.archive.org/web/${timestamp}/${original}`;
    result.captureDate = `${timestamp.slice(0, 4)}-${timestamp.slice(4, 6)}-${timestamp.slice(6, 8)}`;
    result.days = Math.round((Date.parse(result.captureDate) - Date.parse(result.reference)) / 86400000);
    return;
  }
  result.reason = "Capture exceeded 20 redirects";
}

function patchArchive(raw: string, index: number, archive: string): string {
  const end = raw.indexOf("\n---", 4);
  const frontmatter = raw.slice(0, end);
  const section = /^sources:\s*$/m.exec(frontmatter);
  if (!section) throw new Error("Cannot locate sources frontmatter");
  const tail = frontmatter.slice(section.index + section[0].length);
  const sectionEnd = tail.search(/\n[^\s#]/);
  const sources = sectionEnd < 0 ? tail : tail.slice(0, sectionEnd);
  const starts = [...sources.matchAll(/^  - /gm)];
  const start = starts[index]?.index;
  if (start === undefined) throw new Error(`Cannot locate sources[${index}]`);
  const stop = starts[index + 1]?.index ?? sources.length;
  const block = sources.slice(start, stop);
  const newline = raw.includes("\r\n") ? "\r\n" : "\n";
  const replacement = /^    archive_url:.*$/m.test(block)
    ? block.replace(/^    archive_url:.*$/m, `    archive_url: ${archive}`)
    : block.replace(/\s*$/, (space) => `${newline}    archive_url: ${archive}${space}`);
  const offset = section.index + section[0].length + start;
  return raw.slice(0, offset) + replacement + raw.slice(offset + block.length);
}

const cell = (value: unknown) => String(value ?? "").replaceAll("|", "\\|").replace(/[\r\n]+/g, " ");
function report(results: Result[]): void {
  const accepted = results.filter((result) => result.capture).sort((a, b) =>
    Number(Math.abs(b.days!) > 365) - Number(Math.abs(a.days!) > 365));
  console.log("Captures more than a year from the reference date are flagged and listed first.\n");
  console.log("| File and source | Source URL | Chosen capture | Capture date | Days from access date (or fallback) | Reference date |\n| --- | --- | --- | --- | ---: | --- |");
  for (const result of accepted) {
    console.log(`| ${cell(result.file)} sources[${result.index}] | ${cell(result.source.url)} | ${cell(result.capture)} | ${result.captureDate} | ${Math.abs(result.days!) > 365 ? "**OVER A YEAR** " : ""}${result.days} | ${result.reference} (${result.referenceField}) |`);
  }
  console.log("\n| File and source | Source URL | Why no capture was accepted |\n| --- | --- | --- |");
  for (const result of results.filter((result) => !result.capture)) {
    console.log(`| ${cell(result.file)} sources[${result.index}] | ${cell(result.source.url)} | ${cell(result.reason)} |`);
  }
}

async function main(): Promise<void> {
  const results: Result[] = [];
  const originals = new Map<string, string>();
  for (const year of fs.readdirSync(EVENTS).sort()) {
    for (const name of fs.readdirSync(path.join(EVENTS, year)).sort()) {
      if (!name.endsWith(".md")) continue;
      const file = path.join("content/events", year, name);
      const raw = fs.readFileSync(path.join(ROOT, file), "utf8");
      const { data } = parseFrontmatter(raw);
      originals.set(file, raw);
      (data.sources as Source[]).forEach((source, index) => {
        if (!(source.type?.startsWith("primary") || source.type === "official")) return;
        if (source.archive_url && (!source.archive_url.includes("web.archive.org/") || FIXED.test(source.archive_url))) return;
        const referenceField = source.accessed ? "accessed" : source.date ? "source date" : "event date";
        const reference = dateString(source.accessed || source.date || data.date);
        results.push({ file, index, source, reference, referenceField });
      });
    }
  }
  for (const [index, result] of results.entries()) {
    await findCapture(result);
    console.error(`${index + 1}/${results.length} ${result.file} sources[${result.index}]: ${result.capture ?? result.reason}`);
  }
  // Keep all records unchanged if a request is blocked or the run is interrupted.
  const updated = new Map<string, string>();
  for (const result of results.filter((result) => result.capture)) {
    updated.set(result.file, patchArchive(updated.get(result.file) ?? originals.get(result.file)!, result.index, result.capture!));
  }
  for (const [file, raw] of updated) fs.writeFileSync(path.join(ROOT, file), raw);
  report(results);
}

main().catch((error: Error) => {
  console.error(error.message);
  process.exitCode = 1;
});
