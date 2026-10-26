import assert from "node:assert/strict";
import { once } from "node:events";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { checkUrl, extractUrls, groupLinks, formatReport, suspiciousRedirect, writeReports } from "./check-links.js";

async function withServer(
  handler: http.RequestListener,
  run: (base: string) => Promise<void>,
) {
  const server = http.createServer(handler);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address() as import("node:net").AddressInfo;
  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test("uses GET for publishers that reject HEAD", async () => {
  const methods: string[] = [];
  await withServer((req, res) => {
    methods.push(req.method!);
    res.writeHead(req.method === "HEAD" ? 403 : 200).end("article");
  }, async (base) => {
    assert.equal((await checkUrl(`${base}/article`)).ok, true);
    assert.deepEqual(methods, ["GET"]);
  });
});

test("reports the final redirect target and spaces every request to a host", async () => {
  const starts: number[] = [];
  await withServer((req, res) => {
    starts.push(performance.now());
    if (req.url === "/old") res.writeHead(302, { Location: "/article" }).end();
    else res.end("article");
  }, async (base) => {
    const results = await Promise.all([checkUrl(`${base}/old`), checkUrl(`${base}/other`)]);
    assert.equal(results[0].finalUrl, `${base}/article`);
    assert.equal(results[0].status, 200);
    assert.equal(results[0].ok, true);
    assert.equal(starts.length, 3);
    for (let i = 1; i < starts.length; i++) {
      assert.ok(starts[i] - starts[i - 1] >= 950, `host requests only ${starts[i] - starts[i - 1]}ms apart`);
    }
  });
});

test("keeps each source occurrence, including nested controversy sources", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ledger-links-"));
  const file = path.join(dir, "event.md");
  try {
    fs.writeFileSync(file, `---\nsources:\n  - url: https://example.com/article\n    archive_url: https://example.com/article\npositions:\n  - sources:\n      - url: https://example.com/article\n---\nBody\n`);
    const links = extractUrls(file);
    assert.equal(links.length, 3);
    assert.deepEqual(links.map((l) => l.field), ["sources[0].url", "sources[0].archive_url", "positions[0].sources[0].url"]);
    assert.equal(new Set(links.map((l) => l.url)).size, 1);
    assert.ok(links.every((l) => l.file.endsWith("event.md")));
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
});

test("flags successful Wayback calendars and year selectors as unpinned", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response("calendar", { status: 200 });
  try {
    for (const selector of ["*", "2026", "202601", "20260101*"]) {
      const result = await checkUrl(`https://web.archive.org/web/${selector}/https://example.com/article`);
      assert.equal(result.ok, false);
      assert.equal(result.issue, "UNPINNED_ARCHIVE");
      assert.equal(result.status, 200);
    }
    assert.equal((await checkUrl("https://web.archive.org/web/20260909181032/https://example.com/article")).ok, true);
  } finally {
    globalThis.fetch = original;
  }
});


test("deduplicates requests while reporting every occurrence and redirect destination", () => {
  const url = "https://example.com/old";
  const links = [
    { url, file: "events/a.md", field: "sources[0].url" },
    { url, file: "events/a.md", field: "sources[1].url" },
    { url, file: "events/b.md", field: "sources[0].url" },
  ];
  const grouped = groupLinks(links);
  assert.equal(grouped.size, 1);
  assert.deepEqual(grouped.get(url), links);
  const report = formatReport([{
    url, occurrences: grouped.get(url)!, status: 404, ok: false,
    finalUrl: "https://example.com/missing",
  }]);
  assert.match(report, /^## Source Link Report/);
  assert.match(report, /Found 1 broken link\(s\) and 0 suspicious redirect\(s\)/);
  assert.match(report, /^- Broken `404`: 1$/m);
  for (const link of links) assert.ok(report.includes(`${link.file} (${link.field})`));
  assert.ok(report.includes("Final URL: [https://example.com/missing]"));
});

test("retains the failing redirect destination on a transport error", async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    if (calls++ === 0) return new Response(null, { status: 302, headers: { location: "https://missing.example/article" } });
    throw new TypeError("fetch failed");
  };
  try {
    const result = await checkUrl("https://example.com/article");
    assert.equal(result.ok, false);
    assert.equal(result.status, "fetch failed");
    assert.equal(result.finalUrl, "https://missing.example/article");
  } finally {
    globalThis.fetch = original;
  }
});

test("flags redirects to a site root, another registrable domain, or a login or paywall path", () => {
  const cases: Array<[string, string, string | undefined]> = [
    ["https://deepmind.google/models/project-mariner/", "https://deepmind.google/", "site root"],
    ["https://example.com/news/article", "https://www.example.com/en-us/", "site root"],
    ["https://smythos.com/ai-agents/grok", "https://github.com/someone/repo", "different domain"],
    ["https://news.example.co.uk/story", "https://other.co.uk/story", "different domain"],
    ["https://one.com.au/article", "https://two.com.au/article", "different domain"],
    ["https://alice.github.io/article", "https://bob.github.io/article", "different domain"],
    ["https://www.example.com/story", "https://www.example.com/account/login?next=/story", "login or paywall path"],
    ["https://www.example.com/story", "https://www.example.com/subscribe/", "login or paywall path"],
    ["http://example.com/story", "https://www.example.com/story/", undefined],
    ["https://blog.example.co.uk/story", "https://www.example.co.uk/2024/story", undefined],
    ["http://alice.github.io/article", "https://alice.github.io/article/", undefined],
    ["https://example.org", "https://www.example.org/", undefined],
    ["https://example.com/story", "https://example.com/story", undefined],
  ];
  for (const [url, finalUrl, reason] of cases) {
    assert.equal(suspiciousRedirect(url, finalUrl), reason, `${url} -> ${finalUrl}`);
  }
});

test("keeps a redirect to the homepage healthy but marks it suspicious", async () => {
  await withServer((req, res) => {
    if (req.url === "/models/project-mariner/") res.writeHead(301, { Location: "/" }).end();
    else res.end("home");
  }, async (base) => {
    const result = await checkUrl(`${base}/models/project-mariner/`);
    assert.equal(result.ok, true);
    assert.equal(result.status, 200);
    assert.equal(result.finalUrl, `${base}/`);
    assert.equal(result.suspicious, "site root");
  });
});

test("keeps report files for suspicious redirects and removes them when every link is clean", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ledger-report-"));
  const report = path.join(dir, "broken-links-report.md");
  const summary = path.join(dir, "broken-links-summary.md");
  const occurrence = { url: "https://example.com/article", file: "events/a.md", field: "sources[0].url" };
  try {
    assert.equal(writeReports([{
      url: occurrence.url, occurrences: [occurrence], status: 200, ok: true,
      finalUrl: "https://example.com/", suspicious: "site root",
    }], dir), true);
    for (const file of [report, summary]) {
      const text = fs.readFileSync(file, "utf-8");
      assert.match(text, /Found 0 broken link\(s\) and 1 suspicious redirect\(s\)/);
      assert.match(text, /^- Suspicious redirect \(site root\): 1$/m);
      assert.match(text, /^## Suspicious Redirects$/m);
      assert.ok(text.includes("events/a.md (sources[0].url)"));
    }

    assert.equal(writeReports([{
      url: occurrence.url, occurrences: [occurrence], status: 200, ok: true, finalUrl: "https://example.com/article/",
    }], dir), false);
    assert.equal(fs.existsSync(report), false);
    assert.equal(fs.existsSync(summary), false);
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
});

test("summarizes large reports well under GitHub's issue body limit", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ledger-summary-"));
  const long = "x".repeat(250);
  const results = Array.from({ length: 600 }, (_, i) => {
    const url = `https://example${i % 50}.com/${long}/${i}`;
    const occurrences = [0, 1].map((n) => ({ url, file: `events/2026/${i}-${long.slice(0, 40)}.md`, field: `sources[${n}].url` }));
    if (i < 400) return { url, occurrences, status: i % 2 ? 404 : 200, ok: false, finalUrl: `${url}/moved`, ...(i % 2 ? {} : { issue: "UNPINNED_ARCHIVE" }) };
    return { url, occurrences, status: 200, ok: true, finalUrl: "https://github.com/", suspicious: "different domain" };
  });
  try {
    assert.equal(writeReports(results, dir), true);
    const full = fs.readFileSync(path.join(dir, "broken-links-report.md"), "utf-8");
    const summary = fs.readFileSync(path.join(dir, "broken-links-summary.md"), "utf-8");
    assert.ok(full.length > 65536);
    assert.ok(summary.length < 40000, `summary is ${summary.length} characters`);
    assert.match(summary, /^- Broken `404`: 200$/m);
    assert.match(summary, /^- Broken `UNPINNED_ARCHIVE`: 200$/m);
    assert.match(summary, /^- Suspicious redirect \(different domain\): 200$/m);
    assert.match(summary, /^- Redirects: 600$/m);
    for (const [title, more] of [["Broken Links", 790], ["Suspicious Redirects", 390], ["Redirects", 1190]] as const) {
      const section = summary.split(`## ${title}\n\n`)[1].split("\n\n")[0].split("\n");
      assert.equal(section.length, 11, title);
      assert.equal(section.at(-1), `- ...and ${more} more occurrence(s)`);
    }
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
});

test("bounds the posted summary by characters while the full report keeps every detail", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ledger-budget-"));
  const url = `https://example.com/${"a".repeat(40000)}`;
  const occurrence = { url, file: "events/example.md", field: "sources[0].url" };
  const longUrl = [{ url, occurrences: [occurrence], status: 404, ok: false, finalUrl: url }];
  const manyTypes = Array.from({ length: 1500 }, (_, i) => {
    const link = `https://example${i}.com/article`;
    return {
      url: link, occurrences: [{ url: link, file: `events/${i}.md`, field: "sources[0].url" }],
      status: `getaddrinfo ENOTFOUND example${i}.com ${"x".repeat(40)}`, ok: false, finalUrl: link,
    };
  });
  try {
    const summary = formatReport(longUrl, 10);
    assert.ok(summary.length <= 60000, `summary is ${summary.length} characters`);
    assert.ok(summary.includes("events/example.md (sources[0].url)"));
    assert.ok(summary.split("\n").every((line) => line.length <= 1000));

    assert.equal(writeReports(manyTypes, dir), true);
    const full = fs.readFileSync(path.join(dir, "broken-links-report.md"), "utf-8");
    const posted = fs.readFileSync(path.join(dir, "broken-links-summary.md"), "utf-8");
    assert.ok(full.length > 65536);
    assert.ok(full.includes("events/1499.md (sources[0].url)"));
    assert.ok(posted.length <= 60000, `summary is ${posted.length} characters`);
    assert.match(posted, /^## Source Link Report$/m);
    assert.match(posted, /^_Summary truncated to fit GitHub's size limit\. See the full report\._$/m);

    writeReports(longUrl, dir);
    assert.ok(fs.readFileSync(path.join(dir, "broken-links-report.md"), "utf-8").includes(url));
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
});
