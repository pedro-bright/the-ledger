import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { XMLParser, XMLValidator } from "fast-xml-parser";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TSX = path.join(ROOT, "node_modules", ".bin", "tsx");

function event(id: string, date: string, revision: string, summary: string): string {
  return `---
id: ${id}
title: Event ${id}
date: ${date}
category: models
sources:
  - url: https://example.com/${id}
    title: A source
revision:
${revision}
---

## Summary

${summary}
`;
}

function day(start: string, offset: number): string {
  const d = new Date(start);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

// Runs the real feed generator against the given events, or the archive's own events
// when none are given, and returns both feeds.
function generateFeeds(files?: Record<string, string>) {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "ledger-feed-"));
  try {
    fs.cpSync(path.join(ROOT, "scripts"), path.join(sandbox, "scripts"), { recursive: true });
    fs.symlinkSync(path.join(ROOT, "node_modules"), path.join(sandbox, "node_modules"));
    fs.symlinkSync(path.join(ROOT, "site"), path.join(sandbox, "site"));
    if (!files) fs.symlinkSync(path.join(ROOT, "content"), path.join(sandbox, "content"));
    for (const [relative, body] of Object.entries(files ?? {})) {
      const target = path.join(sandbox, "content", "events", relative);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, body);
    }
    const result = spawnSync(TSX, [path.join("scripts", "generate-feed.ts")], {
      cwd: sandbox,
      encoding: "utf-8",
      timeout: 60_000,
    });
    assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
    const atom = fs.readFileSync(path.join(sandbox, "feed.xml"), "utf-8");
    const rss = fs.readFileSync(path.join(sandbox, "rss.xml"), "utf-8");
    assert.equal(XMLValidator.validate(atom), true);
    assert.equal(XMLValidator.validate(rss), true);
    const parser = new XMLParser({ ignoreAttributes: false, isArray: (name) => name === "entry" || name === "item" });
    return { atom: parser.parse(atom).feed, rss: parser.parse(rss).rss.channel };
  } finally {
    fs.rmSync(sandbox, { recursive: true, force: true });
  }
}

const idFromLink = (link: string) => link.split("/").pop();

test("feeds list the 60 most recently added entries, newest first", () => {
  const files: Record<string, string> = {
    // An entry about a 2023 event added after every other entry.
    "2023/01-late-addition.md": event(
      "late-addition",
      "2023-03-14",
      "  created: 2026-11-14\n  last_reviewed: 2026-11-15",
      "Mark Zuckerberg announced the model on stage.",
    ),
  };
  // 64 entries about 2025 events, added two per day, so each pair shares a date added.
  const expected = ["late-addition"];
  for (let i = 63; i >= 0; i--) expected.push(`filler-${i}`);
  for (let i = 0; i < 64; i++) {
    files[`2025/${String(i + 1).padStart(2, "0")}-filler-${i}.md`] = event(
      `filler-${i}`,
      day("2025-01-01", i),
      `  created: ${day("2026-01-01", Math.floor(i / 2))}`,
      `Filler summary ${i}.\n\n## What Happened\n\nNot part of the summary.`,
    );
  }

  const { atom, rss } = generateFeeds(files);

  assert.deepEqual(atom.entry.map((e: { id: string }) => idFromLink(e.id)), expected.slice(0, 60));
  assert.deepEqual(rss.item.map((i: { guid: { "#text": string } }) => idFromLink(i.guid["#text"])), expected.slice(0, 60));

  const [late, newestFiller] = atom.entry;
  assert.equal(late.published, "2026-11-14T00:00:00.000Z");
  assert.equal(late.updated, "2026-11-15T00:00:00.000Z");
  assert.equal(late.summary["#text"], "Event date: 2023-03-14. Mark Zuckerberg announced the model on stage.");
  assert.equal(newestFiller.published, "2026-02-01T00:00:00.000Z");
  assert.equal(newestFiller.updated, "2026-02-01T00:00:00.000Z");
  assert.equal(newestFiller.summary["#text"], "Event date: 2025-03-05. Filler summary 63.");
  assert.equal(atom.updated, "2026-11-15T00:00:00.000Z");

  assert.equal(rss.item[0].pubDate, "Sat, 14 Nov 2026 00:00:00 GMT");
  assert.equal(rss.item[0].description, "Event date: 2023-03-14. Mark Zuckerberg announced the model on stage.");
});

type AtomEntry = { id: string; summary: { "#text": string } };
type RssItem = { guid: { "#text": string }; description: string };

// A summary ends at a sentence end, or with an ellipsis when it was cut inside a sentence.
const ENDS_CLEANLY = /(?:[.!?]["'”’)\]]*|…)$/u;

function assertPlainSummaries(atom: { entry: AtomEntry[] }, rss: { item: RssItem[] }) {
  for (const [i, entry] of atom.entry.entries()) {
    const summary = entry.summary["#text"];
    assert.match(summary, ENDS_CLEANLY, `${entry.id} ends mid-word: ${summary}`);
    assert.doesNotMatch(summary, /\]\(|\*\*/, `${entry.id} contains Markdown: ${summary}`);
    assert.equal(rss.item[i].description, summary);
  }
}

test("feeds carry an author and plain-text summaries shortened at a sentence end or word", () => {
  const filler = Array.from({ length: 12 }, (_, i) => `Filing ${i + 1} adds one more sourced detail to the record.`);
  const longClause = Array.from({ length: 60 }, (_, i) => `clause${i + 1}`).join(" and ");
  const { atom, rss } = generateFeeds({
    "2025/01-markdown.md": event(
      "markdown",
      "2025-03-03",
      "  created: 2026-01-02",
      [
        "Acme released [Widget 2](https://example.com/widget) on **March 3, 2025**,",
        "with *two* sizes, a _faster_ chip and the `widget_cli` tool.",
        ...filler,
      ].join("\n"),
    ),
    "2025/02-one-sentence.md": event("one-sentence", "2025-03-04", "  created: 2026-01-01", `It began with ${longClause}.`),
  });

  assert.deepEqual(atom.author, { name: "The Ledger", uri: "https://the-ledger.net/about" });

  const [markdown, oneSentence] = atom.entry;
  assert.equal(
    markdown.summary["#text"],
    `Event date: 2025-03-03. Acme released Widget 2 on March 3, 2025, with two sizes, a faster chip and the widget_cli tool. ${filler.slice(0, 7).join(" ")}`,
  );
  assert.equal(
    oneSentence.summary["#text"],
    `Event date: 2025-03-04. It began with ${Array.from({ length: 38 }, (_, i) => `clause${i + 1}`).join(" and ")} and…`,
  );
  assertPlainSummaries(atom, rss);
});

test("the archive's feeds have the elements the Atom and RSS specifications require", () => {
  const { atom, rss } = generateFeeds();

  // RFC 4287 4.1.1: a feed needs an id, a title, an updated date and an author.
  for (const key of ["id", "title", "updated"]) assert.ok(atom[key], `feed has no ${key}`);
  assert.equal(atom.author.name, "The Ledger");
  // RFC 4287 4.1.2: an entry needs an id, a title and an updated date, and, without content, a summary and an alternate link.
  assert.equal(atom.entry.length, 60);
  for (const entry of atom.entry) {
    for (const key of ["id", "title", "updated", "summary"]) assert.ok(entry[key], `${entry.id} has no ${key}`);
    assert.equal(entry.link["@_rel"], "alternate");
  }

  // RSS 2.0: a channel needs a title, a link and a description; an item needs a title or a description.
  for (const key of ["title", "link", "description"]) assert.ok(rss[key], `channel has no ${key}`);
  assert.equal(rss.item.length, 60);
  for (const item of rss.item) assert.ok(item.title && item.description, `${item.guid["#text"]} has no title or description`);

  assertPlainSummaries(atom, rss);
});
