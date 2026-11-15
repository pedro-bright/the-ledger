#!/usr/bin/env tsx
/**
 * generate-feed.ts — Generate RSS/Atom XML feeds of the events most recently
 * added to the ledger, an Atom feed for each thread and an Atom feed of corrections.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { metaDescription, plainParagraphs } from "../site/src/lib/markdown.ts";
import { getThreadEvents, type ChallengeCase, type ResolutionNote, type SummaryRevision } from "../site/src/lib/content.ts";
import { buildCorrectionRecords, type CorrectionRecord } from "../site/src/lib/corrections.ts";
import { parseFrontmatter } from "./frontmatter.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const EVENTS_DIR = path.join(CONTENT_DIR, "events");
// The thread and corrections feeds, at their paths on the site. The build copies this directory to the site root.
const FEEDS_DIR = path.join(ROOT, "feeds");

const SITE_URL = "https://the-ledger.net";
const FEED_TITLE = "The Ledger — An Epistemic Ledger of AI History";
const FEED_DESCRIPTION =
  "Tracking how understanding of AI history changes over time. Events, threads, and evolving interpretations.";
const FEED_LIMIT = 60;
const SUMMARY_LIMIT = 500;

interface FeedEvent {
  id: string;
  title: string;
  date: string;
  /** The day the entry was added to the ledger (`revision.created`). */
  added: string;
  /** The day the entry was last reviewed, or the day it was added. */
  updated: string;
  category: string;
  summary: string;
  significance?: string;
  threads?: string[];
}

function walkDir(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else if (entry.name.endsWith(".md") && entry.name !== ".gitkeep") {
      results.push(fullPath);
    }
  }
  return results;
}

// The Summary section as plain text, or the body's paragraphs when it has none,
// shortened at the last sentence end or word boundary that fits.
function extractSummary(content: string): string {
  const summary = plainParagraphs(content, "Summary");
  return metaDescription((summary.length ? summary : plainParagraphs(content)).join(" "), SUMMARY_LIMIT);
}

// YAML reads an unquoted date as a Date and a quoted one as a string.
function isoDate(value: unknown): string {
  return value instanceof Date ? value.toISOString().slice(0, 10) : String(value).slice(0, 10);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Newest additions first, then the latest event among entries added the same day.
function byAdded(a: FeedEvent, b: FeedEvent): number {
  return b.added.localeCompare(a.added) || b.date.localeCompare(a.date);
}

// The latest of the entries' updated days, so a feed's updated time changes only with its entries.
// A feed with no entries keeps one fixed time.
function feedUpdated(updated: string[]): string {
  const latest = updated.reduce((max, day) => (day > max ? day : max), "");
  return new Date(latest || 0).toISOString();
}

function eventEntry(e: FeedEvent): string {
  return `  <entry>
    <id>${SITE_URL}/events/${escapeXml(e.id)}</id>
    <title>${escapeXml(e.title)}</title>
    <link href="${SITE_URL}/events/${escapeXml(e.id)}" rel="alternate"/>
    <published>${new Date(e.added).toISOString()}</published>
    <updated>${new Date(e.updated).toISOString()}</updated>
    <summary type="text">${escapeXml(e.summary)}</summary>
    <category term="${escapeXml(e.category)}"/>
    ${e.significance ? `<category term="significance:${escapeXml(e.significance)}"/>` : ""}
  </entry>`;
}

const RECORD_DIRS: Record<CorrectionRecord["kind"], string> = {
  "Challenge resolved": "resolutions",
  "Summary revision": "revisions",
  "Challenge opened": "challenges",
};

// A correction links to the corrected entry's revision history, or to the corrections page for a synthesis.
// Its id names the record file, so it never changes once published.
function correctionEntry(r: CorrectionRecord): string {
  if (!r.date) throw new Error(`${RECORD_DIRS[r.kind]}/${r.id} has no date, so the corrections feed cannot list it`);
  const link = r.target.kind === "event" ? `${SITE_URL}${r.target.href}` : `${SITE_URL}/corrections`;
  const day = new Date(r.date).toISOString();
  return `  <entry>
    <id>tag:the-ledger.net,2026:${RECORD_DIRS[r.kind]}/${escapeXml(r.id)}</id>
    <title>${escapeXml(`${r.kind}: ${r.target.title}`)}</title>
    <link href="${escapeXml(link)}" rel="alternate"/>
    <published>${day}</published>
    <updated>${day}</updated>
    <summary type="text">${escapeXml(r.reason)}</summary>
  </entry>`;
}

interface AtomFeed {
  /** The feed's path on the site, which with the site URL is also its id. */
  path: string;
  title: string;
  subtitle: string;
  /** The page the feed follows. */
  alternate: string;
  updated: string;
  entries: string[];
}

function atomFeed(feed: AtomFeed): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${SITE_URL}${feed.path}</id>
  <title>${escapeXml(feed.title)}</title>
  <subtitle>${escapeXml(feed.subtitle)}</subtitle>
  <link href="${feed.alternate}" rel="alternate"/>
  <link href="${SITE_URL}${feed.path}" rel="self" type="application/atom+xml"/>
  <updated>${feed.updated}</updated>
  <author>
    <name>The Ledger</name>
    <uri>${SITE_URL}/about</uri>
  </author>
  <generator>The Ledger Feed Generator</generator>
${feed.entries.join("\n")}
</feed>
`;
}

/** The frontmatter of every record in a flat content directory. */
function loadRecords(dirName: string): Array<Record<string, any>> {
  const dir = path.join(CONTENT_DIR, dirName);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => parseFrontmatter(fs.readFileSync(path.join(dir, file), "utf-8")).data);
}

function writeFeed(feed: AtomFeed): number {
  const xml = atomFeed(feed);
  const file = path.join(FEEDS_DIR, feed.path);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, xml, "utf-8");
  return Buffer.byteLength(xml);
}

function main() {
  console.log("📡 The Ledger — Generating RSS/Atom feed...\n");

  const files = walkDir(EVENTS_DIR);
  const events: FeedEvent[] = [];

  for (const filePath of files) {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = parseFrontmatter(raw);

      if (!data.id || !data.title || !data.date) continue;

      const date = isoDate(data.date);
      const added = data.revision?.created ? isoDate(data.revision.created) : date;
      events.push({
        id: String(data.id),
        title: String(data.title),
        date,
        added,
        updated: data.revision?.last_reviewed ? isoDate(data.revision.last_reviewed) : added,
        category: String(data.category ?? ""),
        summary: `Event date: ${date}. ${extractSummary(content)}`,
        significance: data.significance ? String(data.significance) : undefined,
        threads: data.threads,
      });
    } catch {
      // Skip unparseable files
    }
  }

  events.sort(byAdded);
  const entries = events.slice(0, FEED_LIMIT);

  // Generate Atom feed
  const mainAtomFeed = atomFeed({
    path: "/feed.xml",
    title: FEED_TITLE,
    subtitle: FEED_DESCRIPTION,
    alternate: SITE_URL,
    updated: feedUpdated(entries.map((e) => e.updated)),
    entries: entries.map(eventEntry),
  });

  // Generate RSS 2.0 feed
  const rssItems = entries
    .map(
      (e) => `    <item>
      <title>${escapeXml(e.title)}</title>
      <link>${SITE_URL}/events/${escapeXml(e.id)}</link>
      <guid isPermaLink="true">${SITE_URL}/events/${escapeXml(e.id)}</guid>
      <pubDate>${new Date(e.added).toUTCString()}</pubDate>
      <description>${escapeXml(e.summary)}</description>
      <category>${escapeXml(e.category)}</category>
    </item>`
    )
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>
`;

  // Write feeds
  const atomPath = path.join(ROOT, "feed.xml");
  const rssPath = path.join(ROOT, "rss.xml");
  fs.writeFileSync(atomPath, mainAtomFeed, "utf-8");
  fs.writeFileSync(rssPath, rssFeed, "utf-8");

  console.log(`  Generated ${entries.length} of ${events.length} event entries.`);
  console.log(`  📄 Atom feed → feed.xml`);
  console.log(`  📄 RSS feed  → rss.xml\n`);

  // Rewrite the thread and corrections feeds so a removed thread leaves no feed behind.
  fs.rmSync(FEEDS_DIR, { recursive: true, force: true });
  let bytes = 0;

  // One feed per thread, holding every entry the thread page lists.
  const threads = loadRecords("threads");
  for (const thread of threads) {
    const threadEntries = getThreadEvents({ id: String(thread.id), events: thread.events }, events).sort(byAdded);
    bytes += writeFeed({
      path: `/threads/${thread.id}/feed.xml`,
      title: `The Ledger: ${thread.title}`,
      subtitle: String(thread.core_question),
      alternate: `${SITE_URL}/threads/${thread.id}`,
      updated: feedUpdated(threadEntries.map((e) => e.updated)),
      entries: threadEntries.map(eventEntry),
    });
  }

  // The corrections page's records, newest first.
  const records = buildCorrectionRecords({
    events: events.map((e) => ({ id: e.id, slug: e.id, title: e.title })),
    revisions: loadRecords("revisions").map((d) => ({ ...d, created_at: d.created_at && isoDate(d.created_at) }) as SummaryRevision),
    challenges: loadRecords("challenges").map((d) => ({ ...d, opened_at: d.opened_at && isoDate(d.opened_at) }) as ChallengeCase),
    resolutions: loadRecords("resolutions").map((d) => ({ ...d, issued_at: d.issued_at && isoDate(d.issued_at) }) as ResolutionNote),
  });
  bytes += writeFeed({
    path: "/corrections/feed.xml",
    title: "The Ledger: Corrections and challenges",
    subtitle: "Every correction to a published entry in The Ledger and every formal challenge, newest first.",
    alternate: `${SITE_URL}/corrections`,
    updated: feedUpdated(records.map((r) => r.date ?? "")),
    entries: records.map(correctionEntry),
  });

  console.log(`  📄 ${threads.length} thread feeds and the corrections feed (${records.length} records) → feeds/, ${bytes} bytes\n`);
}

main();
