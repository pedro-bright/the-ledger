#!/usr/bin/env tsx
/**
 * generate-feed.ts — Generate RSS/Atom XML feed from events sorted by date.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const EVENTS_DIR = path.join(ROOT, "content", "events");

const SITE_URL = "https://the-ledger.net";
const FEED_TITLE = "The Ledger — An Epistemic Ledger of AI History";
const FEED_DESCRIPTION =
  "Tracking how understanding of AI history changes over time. Events, threads, and evolving interpretations.";

interface FeedEvent {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  significance?: string;
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

function extractSummary(content: string): string {
  // Extract the Summary section content, or first paragraph
  const summaryMatch = content.match(/## Summary\s*\n([\s\S]*?)(?=\n## |\n---|\Z)/);
  if (summaryMatch) {
    return summaryMatch[1].trim().slice(0, 500);
  }
  // Fallback: first non-empty paragraph
  const lines = content.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
  return lines.slice(0, 3).join(" ").trim().slice(0, 500);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function main() {
  console.log("📡 The Ledger — Generating RSS/Atom feed...\n");

  const files = walkDir(EVENTS_DIR);
  const events: FeedEvent[] = [];

  for (const filePath of files) {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);

      if (!data.id || !data.title || !data.date) continue;

      events.push({
        id: String(data.id),
        title: String(data.title),
        date: String(data.date),
        category: String(data.category ?? ""),
        summary: extractSummary(content),
        significance: data.significance ? String(data.significance) : undefined,
      });
    } catch {
      // Skip unparseable files
    }
  }

  // Sort by date descending (newest first)
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const now = new Date().toISOString();
  const latestDate = events.length > 0 ? new Date(events[0].date).toISOString() : now;

  // Generate Atom feed
  const atomEntries = events
    .map(
      (e) => `  <entry>
    <id>${SITE_URL}/events/${escapeXml(e.id)}</id>
    <title>${escapeXml(e.title)}</title>
    <link href="${SITE_URL}/events/${escapeXml(e.id)}" rel="alternate"/>
    <updated>${new Date(e.date).toISOString()}</updated>
    <summary type="text">${escapeXml(e.summary)}</summary>
    <category term="${escapeXml(e.category)}"/>
    ${e.significance ? `<category term="significance:${escapeXml(e.significance)}"/>` : ""}
  </entry>`
    )
    .join("\n");

  const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${SITE_URL}/feed.xml</id>
  <title>${escapeXml(FEED_TITLE)}</title>
  <subtitle>${escapeXml(FEED_DESCRIPTION)}</subtitle>
  <link href="${SITE_URL}" rel="alternate"/>
  <link href="${SITE_URL}/feed.xml" rel="self" type="application/atom+xml"/>
  <updated>${latestDate}</updated>
  <generator>The Ledger Feed Generator</generator>
${atomEntries}
</feed>
`;

  // Generate RSS 2.0 feed
  const rssItems = events
    .map(
      (e) => `    <item>
      <title>${escapeXml(e.title)}</title>
      <link>${SITE_URL}/events/${escapeXml(e.id)}</link>
      <guid isPermaLink="true">${SITE_URL}/events/${escapeXml(e.id)}</guid>
      <pubDate>${new Date(e.date).toUTCString()}</pubDate>
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
  fs.writeFileSync(atomPath, atomFeed, "utf-8");
  fs.writeFileSync(rssPath, rssFeed, "utf-8");

  console.log(`  Generated ${events.length} event entries.`);
  console.log(`  📄 Atom feed → feed.xml`);
  console.log(`  📄 RSS feed  → rss.xml\n`);
}

main();
