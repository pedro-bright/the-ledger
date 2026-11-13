#!/usr/bin/env tsx
/**
 * test-parity.ts — After `npm run build` produces site/dist/, verify every
 * piece of content has a corresponding static page. Exits 1 if any expected
 * page is missing.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseFrontmatter } from "./frontmatter.js";
import yaml from "js-yaml";
import assert from "node:assert/strict";
import { XMLParser, XMLValidator } from "fast-xml-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const DIST_DIR = path.join(ROOT, "site", "dist");

// --------------- Helpers ---------------

function walkDir(dir: string, filter: (name: string) => boolean): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath, filter));
    } else if (filter(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function readId(filePath: string): string | null {
  const ext = path.extname(filePath);
  const raw = fs.readFileSync(filePath, "utf-8");
  try {
    if (ext === ".yml" || ext === ".yaml") {
      const data = yaml.load(raw) as Record<string, unknown> | undefined;
      const id = data?.id;
      return typeof id === "string" ? id : null;
    }
    const { data } = parseFrontmatter(raw);
    const id = (data as Record<string, unknown>).id;
    return typeof id === "string" ? id : null;
  } catch {
    return null;
  }
}

interface ContentEntry {
  id: string;
  file: string; // relative path for reporting
}

function collectContent(
  subdir: string,
  ext: "md" | "yml",
): ContentEntry[] {
  const dir = path.join(CONTENT_DIR, subdir);
  const filter = (name: string) =>
    name !== ".gitkeep" &&
    (ext === "md"
      ? name.endsWith(".md")
      : name.endsWith(".yml") || name.endsWith(".yaml"));
  const files = walkDir(dir, filter);
  const entries: ContentEntry[] = [];
  for (const f of files) {
    const id = readId(f);
    const rel = path.relative(ROOT, f);
    if (!id) {
      // Treat as malformed — report later as missing ID.
      entries.push({ id: `__MISSING_ID__:${rel}`, file: rel });
      continue;
    }
    entries.push({ id, file: rel });
  }
  return entries;
}

function existsHtml(relPath: string): boolean {
  return fs.existsSync(path.join(DIST_DIR, relPath));
}

async function checkSitemap(entries: { label: string; file: string; page: string }[]) {
  const { default: config } = await import("../site/astro.config.mjs");
  const parser = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: false,
    isArray: (name) => name === "url" || name === "sitemap",
  });
  const readXml = (file: string) => {
    const xml = fs.readFileSync(path.join(DIST_DIR, file), "utf8");
    assert.equal(XMLValidator.validate(xml), true, `${file} must be valid XML`);
    return parser.parse(xml);
  };
  const namespace = "http://www.sitemaps.org/schemas/sitemap/0.9";
  const index = readXml("sitemap-index.xml").sitemapindex;
  assert.equal(index?.["@_xmlns"], namespace);
  assert.ok(index.sitemap?.length > 0, "Sitemap index must name a sitemap");

  const urls = new Map<string, { lastmod?: string }>();
  for (const sitemap of index.sitemap) {
    const url = new URL(sitemap.loc);
    assert.equal(url.origin, new URL(config.site).origin);
    const document = readXml(decodeURIComponent(url.pathname).replace(/^\//, "")).urlset;
    assert.equal(document?.["@_xmlns"], namespace);
    for (const entry of document.url ?? []) {
      assert.equal(urls.has(entry.loc), false, `Duplicate sitemap URL: ${entry.loc}`);
      assert.doesNotMatch(new URL(entry.loc).pathname, /^\/404(?:\.html|\/)?$/);
      urls.set(entry.loc, entry);
    }
  }
  for (const entry of entries.filter((entry) => entry.label !== "page")) {
    const url = new URL(entry.page.replace(/index\.html$/, ""), config.site).href;
    const item = urls.get(url);
    assert.ok(item, `Missing sitemap URL: ${url} (${entry.file})`);
    if (entry.label === "event" || entry.label === "thread") {
      const { data } = parseFrontmatter(fs.readFileSync(path.join(ROOT, entry.file), "utf8"));
      const date = entry.label === "event"
        ? data.revision?.last_reviewed ?? data.revision?.created ?? data.date
        : data.last_updated;
      if (entry.label === "event") assert.ok(item.lastmod, `Missing event lastmod: ${url}`);
      if (date != null) {
        assert.ok(item.lastmod, `Missing lastmod: ${url}`);
        assert.equal(new Date(item.lastmod).toISOString().slice(0, 10), new Date(date).toISOString().slice(0, 10), url);
      }
    }
  }
  const robots = fs.readFileSync(path.join(DIST_DIR, "robots.txt"), "utf8");
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.doesNotMatch(robots, /^Disallow:\s*\S/m);
  const sitemapLines = [...robots.matchAll(/^Sitemap:\s*(\S+)\s*$/gm)];
  assert.deepEqual(sitemapLines.map((line) => line[1]), [new URL("sitemap-index.xml", config.site).href]);
  console.log(`Sitemap: ${urls.size} unique URLs, content dates and robots.txt verified.\n`);
}

// --------------- Main ---------------

async function main() {
  console.log("Content parity check — comparing content/ to site/dist/\n");

  if (!fs.existsSync(DIST_DIR)) {
    console.error(`ERROR: site/dist/ does not exist at ${DIST_DIR}`);
    console.error("Run `cd site && npm run build` first.");
    process.exit(1);
  }

  const events = collectContent("events", "md");
  const threads = collectContent("threads", "md");
  const controversies = collectContent("controversies", "md");
  const actors = collectContent("actors", "yml");

  interface Check {
    label: string;
    id: string;
    file: string;
    page: string;
  }

  const checks: Check[] = [];

  for (const e of events) {
    checks.push({
      label: "event",
      id: e.id,
      file: e.file,
      page: path.join("events", e.id, "index.html"),
    });
  }
  for (const t of threads) {
    checks.push({
      label: "thread",
      id: t.id,
      file: t.file,
      page: path.join("threads", t.id, "index.html"),
    });
  }
  for (const c of controversies) {
    checks.push({
      label: "controversy",
      id: c.id,
      file: c.file,
      page: path.join("controversies", c.id, "index.html"),
    });
  }
  for (const a of actors) {
    checks.push({
      label: "actor",
      id: a.id,
      file: a.file,
      page: path.join("actors", a.id, "index.html"),
    });
  }

  // Top-level pages
  const topLevelPages = [
    "index.html",
    path.join("about", "index.html"),
    path.join("threads", "index.html"),
    path.join("controversies", "index.html"),
    path.join("actors", "index.html"),
    path.join("explore", "index.html"),
    path.join("graph", "index.html"),
    "404.html",
  ];
  for (const p of topLevelPages) {
    checks.push({ label: "page", id: p, file: "(built-in route)", page: p });
  }

  // Run the checks
  const missing: Check[] = [];
  const malformed: Check[] = [];
  for (const c of checks) {
    if (c.id.startsWith("__MISSING_ID__:")) {
      malformed.push(c);
      continue;
    }
    if (!existsHtml(c.page)) {
      missing.push(c);
    }
  }

  // Counts summary
  const eventPages = events.filter((e) =>
    existsHtml(path.join("events", e.id, "index.html")),
  ).length;
  const threadPages = threads.filter((t) =>
    existsHtml(path.join("threads", t.id, "index.html")),
  ).length;
  const controversyPages = controversies.filter((c) =>
    existsHtml(path.join("controversies", c.id, "index.html")),
  ).length;
  const actorPages = actors.filter((a) =>
    existsHtml(path.join("actors", a.id, "index.html")),
  ).length;

  console.log("Counts:");
  console.log(`  events        ${events.length} content -> ${eventPages} pages`);
  console.log(`  threads       ${threads.length} content -> ${threadPages} pages`);
  console.log(`  controversies ${controversies.length} content -> ${controversyPages} pages`);
  console.log(`  actors        ${actors.length} content -> ${actorPages} pages`);
  console.log(`  top-level pages expected: ${topLevelPages.length}`);
  console.log("");

  if (malformed.length > 0) {
    console.log(`Malformed (missing id) in frontmatter: ${malformed.length}`);
    for (const m of malformed) {
      console.log(`  ${m.file}`);
    }
    console.log("");
  }

  if (missing.length === 0 && malformed.length === 0) {
    await checkSitemap(checks);
    console.log("OK: every content item has a static page and all top-level routes built.");
    process.exit(0);
  }

  if (missing.length > 0) {
    console.log(`Missing static pages: ${missing.length}`);
    for (const m of missing) {
      console.log(`  [${m.label}] ${m.id}`);
      console.log(`    expected: site/dist/${m.page}`);
      console.log(`    source:   ${m.file}`);
    }
    console.log("");
  }

  process.exit(1);
}

main();
