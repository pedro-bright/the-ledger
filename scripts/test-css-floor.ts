#!/usr/bin/env tsx
/**
 * test-css-floor.ts - Check the CSS that browsers receive from site/dist/:
 * stylesheets and inline <style> blocks in HTML. Every @media query must avoid
 * range syntax such as (width<=780px), because Chrome before 104 and Safari
 * before 16.4 discard those queries and lose the mobile layout.
 *
 * @container queries are out of scope: Lightning CSS always writes them with
 * range syntax, and browsers without that syntax also lack container queries.
 *
 * Exits 1 if any range query is found, or if no min-width or max-width query
 * is found, which means this check is no longer reading the real CSS.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT, "site", "dist");

const STYLE_BLOCK = /<style\b[^>]*>(.*?)<\/style>/gis;
const MEDIA_QUERY = /@media\b([^{]*)\{/gi;
const RANGE_COMPARISON = /[<>=]/;
const MIN_MAX_WIDTH = /\b(?:min|max)-width\s*:/i;

function cssIn(file: string): string {
  const raw = fs.readFileSync(file, "utf-8");
  if (file.endsWith(".css")) return raw;
  return Array.from(raw.matchAll(STYLE_BLOCK), (match) => match[1]).join("\n");
}

function main() {
  console.log("CSS browser floor check - scanning media queries in site/dist/\n");

  if (!fs.existsSync(DIST_DIR)) {
    console.error(`ERROR: site/dist/ does not exist at ${DIST_DIR}`);
    console.error("Run `cd site && npm run build` first.");
    process.exit(1);
  }

  const files = fs
    .readdirSync(DIST_DIR, { recursive: true, encoding: "utf-8" })
    .filter((file) => file.endsWith(".css") || file.endsWith(".html"));

  let total = 0;
  let minMaxWidth = 0;
  const rangeQueries = new Map<string, string[]>();

  for (const file of files) {
    for (const match of cssIn(path.join(DIST_DIR, file)).matchAll(MEDIA_QUERY)) {
      const query = match[1].trim();
      total++;
      if (MIN_MAX_WIDTH.test(query)) minMaxWidth++;
      if (RANGE_COMPARISON.test(query)) {
        rangeQueries.set(query, [...(rangeQueries.get(query) ?? []), file]);
      }
    }
  }

  const rangeTotal = [...rangeQueries.values()].reduce((sum, list) => sum + list.length, 0);
  console.log(`Scanned: ${files.length} CSS and HTML files`);
  console.log(`Media queries: ${total}`);
  console.log(`  min-width or max-width: ${minMaxWidth}`);
  console.log(`  range syntax:           ${rangeTotal}`);

  if (rangeQueries.size > 0) {
    console.error("\nFAIL: range media queries, which browsers below the floor discard:");
    for (const [query, sources] of rangeQueries) {
      console.error(`  ${query}  (${sources.length}x, first in ${sources[0]})`);
    }
    console.error("\nCheck vite.build.cssTarget in site/astro.config.mjs.");
    process.exit(1);
  }

  if (minMaxWidth === 0) {
    console.error("\nFAIL: found no min-width or max-width media queries in site/dist/.");
    process.exit(1);
  }

  console.log("\nOK: no range media queries.");
}

main();
