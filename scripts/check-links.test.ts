import assert from "node:assert/strict";
import { once } from "node:events";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { checkUrl, extractUrls, groupLinks, formatReport } from "./check-links.js";

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
  assert.match(report, /^## Broken Links Report/);
  assert.match(report, /Found 1 broken link\(s\)/);
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
