#!/usr/bin/env tsx
/**
 * test-no-dark-leaks.ts — Scan site/dist/**\/*.html for residual dark-mode
 * markers that shouldn't appear after the redesign.
 *
 * Reports offenders (file + matched string + line number) and exits 1 if any
 * are found.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT, "site", "dist");

// Static markers that should not appear in the built HTML after redesign.
// Order matters only for reporting consistency.
const MARKERS: string[] = [
  "text-white",
  "bg-ledger-bg",
  "bg-ledger-surface",
  "text-ledger-text",
  'class="dark"',
];

interface Hit {
  file: string;
  marker: string;
  line: number;
  snippet: string;
}

function listHtmlFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, {
    recursive: true,
    withFileTypes: true,
  }) as fs.Dirent[];
  const files: string[] = [];
  for (const e of entries) {
    if (!e.isFile()) continue;
    if (!e.name.endsWith(".html")) continue;
    // Dirent.path is the parent directory (Node >= 20). Fall back to DIST_DIR.
    const parent = (e as unknown as { parentPath?: string; path?: string }).parentPath
      ?? (e as unknown as { path?: string }).path
      ?? DIST_DIR;
    files.push(path.join(parent, e.name));
  }
  return files;
}

function scanFile(file: string): Hit[] {
  const hits: Hit[] = [];
  const raw = fs.readFileSync(file, "utf-8");
  const lines = raw.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const marker of MARKERS) {
      if (line.includes(marker)) {
        hits.push({
          file,
          marker,
          line: i + 1,
          snippet: line.trim().slice(0, 200),
        });
      }
    }
  }
  return hits;
}

function main() {
  console.log("Dark-mode leak check — scanning site/dist/**/*.html\n");

  if (!fs.existsSync(DIST_DIR)) {
    console.error(`ERROR: site/dist/ does not exist at ${DIST_DIR}`);
    console.error("Run `cd site && npm run build` first.");
    process.exit(1);
  }

  const files = listHtmlFiles(DIST_DIR);
  const allHits: Hit[] = [];
  for (const f of files) {
    allHits.push(...scanFile(f));
  }

  // Group by marker for summary
  const byMarker: Record<string, number> = {};
  for (const m of MARKERS) byMarker[m] = 0;
  for (const h of allHits) byMarker[h.marker]++;

  // Group by file for display (cap per-file output to keep noise down)
  const byFile = new Map<string, Hit[]>();
  for (const h of allHits) {
    const list = byFile.get(h.file) ?? [];
    list.push(h);
    byFile.set(h.file, list);
  }

  const PER_FILE_CAP = 5;
  for (const [file, hits] of byFile) {
    const rel = path.relative(ROOT, file);
    console.log(`${rel}  (${hits.length} hit${hits.length === 1 ? "" : "s"})`);
    const shown = hits.slice(0, PER_FILE_CAP);
    for (const h of shown) {
      console.log(`  L${h.line}  [${h.marker}]  ${h.snippet}`);
    }
    if (hits.length > PER_FILE_CAP) {
      console.log(`  ... ${hits.length - PER_FILE_CAP} more in this file`);
    }
  }

  console.log("");
  console.log(`Scanned: ${files.length} HTML files`);
  console.log("Summary by marker:");
  for (const m of MARKERS) {
    console.log(`  ${m.padEnd(22)} ${byMarker[m]}`);
  }
  console.log(`Total hits: ${allHits.length}`);
  console.log(`Files with hits: ${byFile.size}`);

  if (allHits.length === 0) {
    console.log("\nOK: no dark-mode leaks.");
    process.exit(0);
  }

  process.exit(1);
}

main();
