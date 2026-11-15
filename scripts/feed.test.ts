import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { plainParagraphs } from "../site/src/lib/markdown.ts";
import { parseFrontmatter } from "./frontmatter.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TSX = path.join(ROOT, "node_modules", ".bin", "tsx");

function event(id: string, date: string, revision: string, summary: string, frontmatter = ""): string {
  return `---
id: ${id}
title: Event ${id}
date: ${date}
category: models
sources:
  - url: https://example.com/${id}
    title: A source
${frontmatter}revision:
${revision}
---

## Summary

${summary}
`;
}

function thread(id: string, events: string[]): string {
  return `---
id: ${id}
title: Thread ${id}
status: active
started: 2024-01-01
core_question: What happened to ${id}?
curator: A Curator
events:
${events.map((e) => `  - ${e}`).join("\n")}
---

The synthesis.
`;
}

function day(start: string, offset: number): string {
  const d = new Date(start);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

// Each event's whole Summary as plain text, or its body's paragraphs when it has none.
function fullSummaries(eventsDir: string): Map<string, string> {
  const summaries = new Map<string, string>();
  if (!fs.existsSync(eventsDir)) return summaries;
  for (const relative of fs.readdirSync(eventsDir, { recursive: true, encoding: "utf-8" })) {
    if (!relative.endsWith(".md")) continue;
    const { data, content } = parseFrontmatter(fs.readFileSync(path.join(eventsDir, relative), "utf-8"));
    const summary = plainParagraphs(content, "Summary");
    summaries.set(String(data.id), (summary.length ? summary : plainParagraphs(content)).join(" ").replace(/\s+/g, " ").trim());
  }
  return summaries;
}

const parser = new XMLParser({ ignoreAttributes: false, isArray: (name) => name === "entry" || name === "item" || name === "link" });

// Runs the real feed generator against the given content files, keyed by their path under
// content/, or the archive's own content when none are given. Returns the site-wide feeds
// with each event's whole summary, and the thread and corrections feeds by their site path.
function generateFeeds(files?: Record<string, string>) {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "ledger-feed-"));
  try {
    fs.cpSync(path.join(ROOT, "scripts"), path.join(sandbox, "scripts"), { recursive: true });
    fs.symlinkSync(path.join(ROOT, "node_modules"), path.join(sandbox, "node_modules"));
    fs.symlinkSync(path.join(ROOT, "site"), path.join(sandbox, "site"));
    if (!files) fs.symlinkSync(path.join(ROOT, "content"), path.join(sandbox, "content"));
    for (const [relative, body] of Object.entries(files ?? {})) {
      const target = path.join(sandbox, "content", relative);
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
    const feedsDir = path.join(sandbox, "feeds");
    const raw = new Map<string, string>();
    const feeds = new Map<string, AtomFeed>();
    for (const relative of fs.readdirSync(feedsDir, { recursive: true, encoding: "utf-8" })) {
      if (!relative.endsWith(".xml")) continue;
      const sitePath = `/${relative.split(path.sep).join("/")}`;
      const xml = fs.readFileSync(path.join(feedsDir, relative), "utf-8");
      assert.equal(XMLValidator.validate(xml), true, sitePath);
      raw.set(sitePath, xml);
      feeds.set(sitePath, parser.parse(xml).feed);
    }
    return {
      atom: parser.parse(atom).feed,
      rss: parser.parse(rss).rss.channel,
      full: fullSummaries(path.join(sandbox, "content", "events")),
      feeds,
      raw,
    };
  } finally {
    fs.rmSync(sandbox, { recursive: true, force: true });
  }
}

const idFromLink = (link: string) => link.split("/").pop();

test("feeds list the 60 most recently added entries, newest first", () => {
  const files: Record<string, string> = {
    // An entry about a 2023 event added after every other entry.
    "events/2023/01-late-addition.md": event(
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
    files[`events/2025/${String(i + 1).padStart(2, "0")}-filler-${i}.md`] = event(
      `filler-${i}`,
      day("2025-01-01", i),
      `  created: ${day("2026-01-01", Math.floor(i / 2))}`,
      `Filler summary ${i}.\n\n## What Happened\n\nNot part of the summary.`,
    );
  }

  const { atom, rss } = generateFeeds(files);

  assert.deepEqual(atom.entry.map((e: AtomEntry) => idFromLink(e.id)), expected.slice(0, 60));
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

type AtomLink = { "@_href": string; "@_rel": string; "@_type"?: string };
type AtomEntry = {
  id: string;
  title: string;
  link: AtomLink[];
  published: string;
  updated: string;
  summary: { "#text": string };
  category?: unknown;
};
type AtomFeed = {
  id: string;
  title: string;
  subtitle: string;
  link: AtomLink[];
  updated: string;
  author: { name: string; uri: string };
  entry?: AtomEntry[];
};
type RssItem = { guid: { "#text": string }; description: string };

const linkTo = (links: AtomLink[], rel: string) => links.filter((l) => l["@_rel"] === rel).map((l) => l["@_href"]);

// A shortened summary ends at a sentence end, or with an ellipsis when it was cut inside a sentence.
const ENDS_CLEANLY = /(?:[.!?]["'”’)\]]*|…)$/u;

function assertPlainSummaries(atom: { entry?: AtomEntry[] }, rss: { item: RssItem[] } | undefined, full: Map<string, string>) {
  for (const [i, entry] of (atom.entry ?? []).entries()) {
    const summary = entry.summary["#text"];
    const whole = full.get(idFromLink(entry.id)!);
    assert.ok(whole !== undefined, `${entry.id} has no event file`);
    if (summary.replace(/^Event date: \d{4}-\d{2}-\d{2}\. /, "") !== whole) {
      assert.match(summary, ENDS_CLEANLY, `${entry.id} ends mid-word: ${summary}`);
    }
    assert.doesNotMatch(summary, /\]\(|\*\*/, `${entry.id} contains Markdown: ${summary}`);
    if (rss) assert.equal(rss.item[i].description, summary);
  }
}

// RFC 4287 4.1.1: a feed needs an id, a title, an updated date and an author.
// RFC 4287 4.1.2: an entry needs an id, a title and an updated date, and, without content, a summary and an alternate link.
// Every link is an absolute https URL on the canonical host, and a feed links to itself at its own id.
function assertAtomElements(feed: AtomFeed, label: string) {
  for (const key of ["id", "title", "updated"] as const) assert.ok(feed[key], `${label} has no ${key}`);
  assert.deepEqual(feed.author, { name: "The Ledger", uri: "https://the-ledger.net/about" }, label);
  assert.deepEqual(linkTo(feed.link, "self"), [feed.id], label);
  assert.equal(linkTo(feed.link, "alternate").length, 1, label);
  const ids = new Set<string>();
  for (const entry of feed.entry ?? []) {
    for (const key of ["id", "title", "updated", "summary"] as const) assert.ok(entry[key], `${label} ${entry.id} has no ${key}`);
    assert.equal(linkTo(entry.link, "alternate").length, 1, `${label} ${entry.id}`);
    assert.ok(!ids.has(entry.id), `${label} repeats ${entry.id}`);
    ids.add(entry.id);
  }
  for (const href of [...feed.link, ...(feed.entry ?? []).flatMap((e) => e.link)].map((l) => l["@_href"])) {
    assert.match(href, /^https:\/\/the-ledger\.net(?:\/|$)/, `${label} links to ${href}`);
  }
}

test("feeds carry an author and plain-text summaries shortened at a sentence end or word", () => {
  const filler = Array.from({ length: 12 }, (_, i) => `Filing ${i + 1} adds one more sourced detail to the record.`);
  const longClause = Array.from({ length: 60 }, (_, i) => `clause${i + 1}`).join(" and ");
  const { atom, rss, full } = generateFeeds({
    "events/2025/01-markdown.md": event(
      "markdown",
      "2025-03-03",
      "  created: 2026-01-02",
      [
        "Acme released [Widget 2](https://example.com/widget) on **March 3, 2025**,",
        "with *two* sizes, a _faster_ chip and the `widget_cli` tool.",
        ...filler,
      ].join("\n"),
    ),
    "events/2025/02-one-sentence.md": event("one-sentence", "2025-03-04", "  created: 2026-01-01", `It began with ${longClause}.`),
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
  assertPlainSummaries(atom, rss, full);
});

test("the archive's feeds have the elements the Atom and RSS specifications require", () => {
  const { atom, rss, full } = generateFeeds();

  // RFC 4287 4.1.1: a feed needs an id, a title, an updated date and an author.
  for (const key of ["id", "title", "updated"]) assert.ok(atom[key], `feed has no ${key}`);
  assert.equal(atom.author.name, "The Ledger");
  // RFC 4287 4.1.2: an entry needs an id, a title and an updated date, and, without content, a summary and an alternate link.
  assert.equal(atom.entry.length, 60);
  for (const entry of atom.entry) {
    for (const key of ["id", "title", "updated", "summary"]) assert.ok(entry[key], `${entry.id} has no ${key}`);
    assert.deepEqual(entry.link.map((l: AtomLink) => l["@_rel"]), ["alternate"]);
  }

  // RSS 2.0: a channel needs a title, a link and a description; an item needs a title or a description.
  for (const key of ["title", "link", "description"]) assert.ok(rss[key], `channel has no ${key}`);
  assert.equal(rss.item.length, 60);
  for (const item of rss.item) assert.ok(item.title && item.description, `${item.guid["#text"]} has no title or description`);

  assertPlainSummaries(atom, rss, full);
});

// Thread a's entries in the order they were added differ from their order by event date either way.
const THREAD_EVENTS = {
  // Listed by thread a only.
  "events/2025/01-listed.md": event("listed", "2025-01-01", "  created: 2026-01-01", "Listed by the thread."),
  "events/2025/03-first-added.md": event("first-added", "2025-09-01", "  created: 2025-12-01", "Added before the others."),
  // Declares thread a only, about an earlier event and added later.
  "events/2024/01-declared.md": event(
    "declared",
    "2024-06-01",
    "  created: 2026-02-01\n  last_reviewed: 2026-03-01",
    "Declares the thread.",
    "threads:\n  - a\n",
  ),
  "events/2025/02-elsewhere.md": event("elsewhere", "2025-02-01", "  created: 2026-04-01", "Belongs to thread b."),
  "threads/a.md": thread("a", ["listed", "first-added"]),
  "threads/b.md": thread("b", ["elsewhere"]),
};

test("each thread has a feed of the entries its page lists, newest additions first", () => {
  const { atom, feeds, raw } = generateFeeds(THREAD_EVENTS);
  assert.deepEqual([...feeds.keys()].sort(), ["/corrections/feed.xml", "/threads/a/feed.xml", "/threads/b/feed.xml"]);

  const a = feeds.get("/threads/a/feed.xml")!;
  assertAtomElements(a, "thread a");
  assert.equal(a.id, "https://the-ledger.net/threads/a/feed.xml");
  assert.equal(a.title, "The Ledger: Thread a");
  assert.equal(a.subtitle, "What happened to a?");
  assert.deepEqual(linkTo(a.link, "alternate"), ["https://the-ledger.net/threads/a"]);
  assert.equal(a.updated, "2026-03-01T00:00:00.000Z");
  assert.deepEqual(
    a.entry!.map((e) => idFromLink(e.id)),
    ["declared", "listed", "first-added"],
  );
  // A thread feed's entries are the site-wide feed's entries for the same events.
  for (const entry of a.entry!) assert.deepEqual(entry, atom.entry.find((e: AtomEntry) => e.id === entry.id));
  assert.equal(a.entry![0].published, "2026-02-01T00:00:00.000Z");
  assert.equal(a.entry![0].updated, "2026-03-01T00:00:00.000Z");
  assert.equal(a.entry![0].summary["#text"], "Event date: 2024-06-01. Declares the thread.");

  const b = feeds.get("/threads/b/feed.xml")!;
  assert.deepEqual(b.entry!.map((e) => e.id), ["https://the-ledger.net/events/elsewhere"]);
  assert.equal(b.updated, "2026-04-01T00:00:00.000Z");

  // A later run over the same content writes the same bytes, and a new entry changes only
  // the feed it belongs to, leaving the published entries as they were.
  assert.deepEqual(generateFeeds(THREAD_EVENTS).raw, raw);
  const later = generateFeeds({
    ...THREAD_EVENTS,
    "events/2026/01-newer.md": event("newer", "2026-05-01", "  created: 2026-06-01", "A newer entry.", "threads:\n  - a\n"),
  });
  const laterA = later.feeds.get("/threads/a/feed.xml")!;
  assert.equal(laterA.updated, "2026-06-01T00:00:00.000Z");
  assert.deepEqual(laterA.entry!.slice(1), a.entry);
  assert.equal(later.raw.get("/threads/b/feed.xml"), raw.get("/threads/b/feed.xml"));
});

const CORRECTIONS = {
  "events/2025/01-corrected.md": event("corrected", "2025-01-01", "  created: 2026-01-01", "The corrected entry."),
  "revisions/sr-corrected-20260502.md": `---
id: sr-corrected-20260502
target_summary_id: corrected
reason: Fixed a date.
created_at: "2026-05-02"
---
`,
  "revisions/sr-synthesis-20260401.md": `---
id: sr-synthesis-20260401
target_summary_id: some-synthesis
reason: Tightened wording.
created_at: 2026-04-01
---
`,
  "challenges/cc-corrected-20260501.md": `---
id: cc-corrected-20260501
target_claim_id: corrected
allegations:
  - timeline_error
status: sustained
opened_at: "2026-05-01"
---
`,
  "resolutions/rn-corrected-20260502.md": `---
id: rn-corrected-20260502
case_id: cc-corrected-20260501
disposition: sustained
findings:
  - The date was wrong.
actions:
  - type: summary_revision_created
issued_at: "2026-05-02"
---
`,
};

test("the corrections feed has one entry per record, in the corrections page's order, linking to the revision history", () => {
  const { feeds, raw } = generateFeeds(CORRECTIONS);
  const feed = feeds.get("/corrections/feed.xml")!;
  assertAtomElements(feed, "corrections");
  assert.equal(feed.id, "https://the-ledger.net/corrections/feed.xml");
  assert.deepEqual(linkTo(feed.link, "alternate"), ["https://the-ledger.net/corrections"]);
  assert.equal(feed.updated, "2026-05-02T00:00:00.000Z");

  const history = "https://the-ledger.net/events/corrected#revision-history";
  assert.deepEqual(
    feed.entry!.map((e) => [e.id, e.title, linkTo(e.link, "alternate")[0], e.published, e.updated, e.summary["#text"]]),
    [
      [
        "tag:the-ledger.net,2026:resolutions/rn-corrected-20260502",
        "Challenge resolved: Event corrected",
        history,
        "2026-05-02T00:00:00.000Z",
        "2026-05-02T00:00:00.000Z",
        "Disposition: sustained. The date was wrong.",
      ],
      [
        "tag:the-ledger.net,2026:revisions/sr-corrected-20260502",
        "Summary revision: Event corrected",
        history,
        "2026-05-02T00:00:00.000Z",
        "2026-05-02T00:00:00.000Z",
        "Fixed a date.",
      ],
      [
        "tag:the-ledger.net,2026:challenges/cc-corrected-20260501",
        "Challenge opened: Event corrected",
        history,
        "2026-05-01T00:00:00.000Z",
        "2026-05-01T00:00:00.000Z",
        "Alleges timeline error.",
      ],
      [
        "tag:the-ledger.net,2026:revisions/sr-synthesis-20260401",
        "Summary revision: some-synthesis",
        "https://the-ledger.net/corrections",
        "2026-04-01T00:00:00.000Z",
        "2026-04-01T00:00:00.000Z",
        "Tightened wording.",
      ],
    ],
  );

  // The same records give the same bytes; a new record adds an entry and leaves the others as they were.
  assert.deepEqual(generateFeeds(CORRECTIONS).raw, raw);
  const later = generateFeeds({
    ...CORRECTIONS,
    "revisions/sr-corrected-20260601.md": `---
id: sr-corrected-20260601
target_summary_id: corrected
reason: Fixed a name.
created_at: "2026-06-01"
---
`,
  }).feeds.get("/corrections/feed.xml")!;
  assert.equal(later.updated, "2026-06-01T00:00:00.000Z");
  assert.equal(later.entry![0].id, "tag:the-ledger.net,2026:revisions/sr-corrected-20260601");
  assert.deepEqual(later.entry!.slice(1), feed.entry);
});

test("the archive has a valid feed for every thread and one for corrections", () => {
  const { feeds, full } = generateFeeds();
  const content = path.join(ROOT, "content");
  const frontmatter = (dir: string) =>
    fs
      .readdirSync(path.join(content, dir), { recursive: true, encoding: "utf-8" })
      .filter((file) => file.endsWith(".md"))
      .map((file) => parseFrontmatter(fs.readFileSync(path.join(content, dir, file), "utf-8")).data);

  const events = frontmatter("events");
  const threads = frontmatter("threads");
  assert.equal(feeds.size, threads.length + 1);
  for (const t of threads) {
    const label = `/threads/${t.id}/feed.xml`;
    const feed = feeds.get(label);
    assert.ok(feed, `${label} is missing`);
    assertAtomElements(feed, label);
    assertPlainSummaries(feed, undefined, full);
    // The thread page lists the events the thread names and every event that names the thread.
    const expected = events.filter((e) => t.events?.includes(e.id) || e.threads?.includes(t.id)).map((e) => `https://the-ledger.net/events/${e.id}`);
    assert.deepEqual((feed.entry ?? []).map((e) => e.id).sort(), expected.sort(), label);
  }

  const corrections = feeds.get("/corrections/feed.xml")!;
  assertAtomElements(corrections, "corrections");
  const records = ["revisions", "challenges", "resolutions"].flatMap((dir) => frontmatter(dir).map((r) => `tag:the-ledger.net,2026:${dir}/${r.id}`));
  assert.deepEqual(corrections.entry!.map((e) => e.id).sort(), records.sort());
});

test("the root package installs the Markdown packages the feed generator loads from the site, at the site's versions", () => {
  const read = (file: string) => JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf-8"));
  const [rootPackage, sitePackage, rootLock, siteLock] = [
    read("package.json"),
    read("site/package.json"),
    read("package-lock.json"),
    read("site/package-lock.json"),
  ];
  for (const name of ["marked", "parse5"]) {
    assert.equal(rootPackage.devDependencies[name], sitePackage.dependencies[name], `${name} range differs`);
    assert.equal(rootLock.packages[`node_modules/${name}`].version, siteLock.packages[`node_modules/${name}`].version, `${name} version differs`);
  }
});
