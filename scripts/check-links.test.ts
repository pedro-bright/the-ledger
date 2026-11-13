import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { once } from "node:events";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import yaml from "js-yaml";
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
  assert.match(report, /^Found 1 broken link\(s\), 0 suspicious redirect\(s\) and 0 link\(s\) that could not be verified from this network/);
  assert.match(report, /Found 1 broken link\(s\), 0 suspicious redirect\(s\)/);
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
      assert.match(text, /Found 0 broken link\(s\), 1 suspicious redirect\(s\)/);
      assert.match(text, /^- Suspicious redirect \(site root\): 1$/m);
      assert.match(text, /^## Suspicious redirects$/m);
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
    for (const [title, more] of [["Broken", 790], ["Suspicious redirects", 390]] as const) {
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
      status: `getaddrinfo EAI_AGAIN example${i}.com ${"x".repeat(40)}`, ok: false, finalUrl: link,
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
    assert.match(posted, /^Found 0 broken link\(s\), 0 suspicious redirect\(s\) and 1500 link\(s\)/);
    assert.match(posted, /^_Summary truncated to fit GitHub's size limit\. See the full report\._$/m);

    writeReports(longUrl, dir);
    assert.ok(fs.readFileSync(path.join(dir, "broken-links-report.md"), "utf-8").includes(url));
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
});


// Run the real CLI in a temporary content tree, with deterministic responses.
// The preload prevents publisher availability from affecting exit-code assertions.
function withCliFixture(run: (dir: string, cli: (...args: string[]) => ReturnType<typeof spawnSync>) => void) {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "ledger-cli-")));
  try {
    fs.mkdirSync(path.join(dir, "scripts"));
    fs.mkdirSync(path.join(dir, "content/events/nested"), { recursive: true });
    for (const name of ["check-links.ts", "frontmatter.ts"]) {
      fs.copyFileSync(new URL(name, import.meta.url), path.join(dir, "scripts", name));
    }
    fs.symlinkSync(new URL("../node_modules", import.meta.url), path.join(dir, "node_modules"), "dir");
    fs.writeFileSync(path.join(dir, "package.json"), '{"type":"module"}');
    fs.writeFileSync(path.join(dir, "responses.mjs"), `
      globalThis.fetch = async (url) => {
        console.log("REQUEST " + url);
        const parsed = new URL(url);
        if (parsed.pathname === "/timeout") throw new DOMException("timed out", "TimeoutError");
        if (parsed.pathname === "/dns") throw new TypeError("fetch failed", { cause: Object.assign(new Error("missing"), { code: "ENOTFOUND" }) });
        if (parsed.pathname === "/loop") return new Response(null, { status: 302, headers: { location: url } });
        if (parsed.pathname === "/moved") return new Response(null, { status: 302, headers: { location: parsed.origin + "/" } });
        return new Response(null, { status: Number(parsed.pathname.slice(1)) || 200 });
      };
    `);
    const cli = (...args: string[]) => spawnSync(process.execPath, [
      "--import", import.meta.resolve("tsx"), "--import", path.join(dir, "responses.mjs"),
      path.join(dir, "scripts/check-links.ts"), ...args,
    ], { cwd: dir, encoding: "utf-8", timeout: 30000 });
    run(dir, cli);
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
}

function writeEvent(file: string, urls: string[]) {
  fs.writeFileSync(file, `---\nsources:\n${urls.map((url) => `  - url: ${url}`).join("\n")}\n---\n`);
}

test("CLI scopes files and directories, deduplicates overlaps, and defaults to all content", () => {
  withCliFixture((dir, cli) => {
    writeEvent(path.join(dir, "content/events/chosen.md"), ["https://chosen.example/200"]);
    fs.writeFileSync(path.join(dir, "content/events/nested/actor.yaml"), "website: https://nested.example/200\n");
    fs.writeFileSync(path.join(dir, "content/events/ignored.txt"), "website: https://ignored.example/404\n");
    writeEvent(path.join(dir, "content/other.md"), ["https://other.example/200"]);
    for (const [args, hosts] of [
      [["content/events/chosen.md"], ["chosen"]],
      [[path.join(dir, "content/events")], ["chosen", "nested"]],
      [["content/events", "content/events/chosen.md"], ["chosen", "nested"]],
      [[], ["chosen", "nested", "other"]],
    ] as const) {
      const result = cli(...args);
      assert.equal(result.status, 0, String(result.stderr));
      const requests = String(result.stdout).match(/REQUEST https?:\/\/\S+/g) ?? [];
      assert.deepEqual(requests.sort(), hosts.map((host) => `REQUEST https://${host}.example/200`).sort());
    }
  });
});

test("CLI refuses missing paths and paths or symlinks outside content before fetching", () => {
  withCliFixture((dir, cli) => {
    writeEvent(path.join(dir, "content/event.md"), ["https://chosen.example/200"]);
    writeEvent(path.join(dir, "outside.md"), ["https://outside.example/200"]);
    fs.mkdirSync(path.join(dir, "content-other"));
    fs.symlinkSync(path.join(dir, "outside.md"), path.join(dir, "content/escape.md"));
    for (const arg of ["content/missing.md", "outside.md", "content-other", "content/../outside.md", "content/escape.md", "content"]) {
      const result = cli(arg);
      assert.equal(result.status, 1);
      assert.doesNotMatch(String(result.stdout), /REQUEST /);
    }
  });
});

test("CLI exits zero for unverified or suspicious links and one only for broken links", () => {
  withCliFixture((dir, cli) => {
    const cases = [
      [["https://blocked.example/403", "https://slow.example/timeout"], 0, "Could not verify from this network"],
      [["https://missing.example/404"], 1, "Broken"],
      [["https://web.archive.org/web/*/https://example.com/article"], 1, "Broken"],
      [["https://missing.example/dns"], 1, "Broken"],
      [["https://moved.example/moved"], 0, "Suspicious redirects"],
    ] as const;
    for (const [urls, code, section] of cases) {
      writeEvent(path.join(dir, "content/event.md"), [...urls]);
      const result = cli("content/event.md");
      assert.equal(result.status, code, String(result.stderr));
      const report = fs.readFileSync(path.join(dir, "broken-links-report.md"), "utf-8");
      assert.ok(report.includes(`## ${section}`));
      for (const url of urls) assert.ok(report.split(`## ${section}\n`)[1].includes(url));
      if (section === "Could not verify from this network") {
        assert.match(String(result.stderr), /Warning:.*unverified.*403/i);
        assert.match(String(result.stderr), /Warning:.*unverified.*TIMEOUT/i);
      }
    }
  });
});

test("classifies HTTP failures, DNS failures, timeouts, and other transport errors", async () => {
  const original = globalThis.fetch;
  const cases = [
    [404, "broken"], [410, "broken"], [401, "unverified"], [403, "unverified"],
    [429, "unverified"], [500, "unverified"], [503, "unverified"], [400, "unverified"],
    [new DOMException("timed out", "TimeoutError"), "unverified"],
    [new TypeError("fetch failed"), "unverified"],
    [new TypeError("fetch failed", { cause: Object.assign(new Error("DNS failed"), { code: "EAI_AGAIN" }) }), "unverified"],
    [new TypeError("fetch failed", { cause: Object.assign(new Error("DNS missing"), { code: "ENOTFOUND" }) }), "broken"],
  ] as const;
  try {
    for (const [i, [response, classification]] of cases.entries()) {
      const url = `https://classification-${i}.example/article`;
      globalThis.fetch = async () => {
        if (typeof response !== "number") throw response;
        return new Response(null, { status: response });
      };
      const result = { ...await checkUrl(url), url, occurrences: [{ url, file: "event.md", field: "sources[0].url" }] };
      const report = formatReport([result]);
      assert.match(report, new RegExp(`^Found ${classification === "broken" ? 1 : 0} broken`), String(response));
      assert.ok(report.split(`## ${classification === "broken" ? "Broken" : "Could not verify from this network"}\n`)[1].includes(url));
    }
  } finally {
    globalThis.fetch = original;
  }
});

test("redirect loops are broken and preserve an unpinned archive failure", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (url) => new Response(null, { status: 302, headers: { location: String(url) } });
  try {
    for (const url of ["https://loop.example/article", "https://web.archive.org/web/*/https://example.com/article"]) {
      const result = { ...await checkUrl(url), url, occurrences: [{ url, file: "event.md", field: "sources[0].url" }] };
      assert.equal(result.status, "TOO_MANY_REDIRECTS");
      assert.match(formatReport([result]), /^Found 1 broken/);
      if (url.includes("web.archive.org")) assert.equal(result.issue, "UNPINNED_ARCHIVE");
    }
  } finally {
    globalThis.fetch = original;
  }
});

test("reports three ordered sections and only status counts for unverified summary entries", () => {
  const make = (url: string, status: number | string, ok = false, extra = {}) => ({
    url, status, ok, finalUrl: url, occurrences: [{ url, file: "event.md", field: "sources[0].url" }], ...extra,
  });
  const results = [
    make("https://missing.example/article", 404),
    make("https://moved.example/article", 200, true, { finalUrl: "https://moved.example/", suspicious: "site root" }),
    make("https://blocked.example/article", 403),
    make("https://other.example/article", 403),
    make("https://slow.example/article", "TIMEOUT"),
  ];
  const report = formatReport(results);
  const summary = formatReport(results, 10);
  for (const text of [report, summary]) {
    assert.match(text, /^Found 1 broken link\(s\), 1 suspicious redirect\(s\) and 3 link\(s\) that could not be verified from this network among 5 URL\(s\) on \d{4}-\d{2}-\d{2}:/);
    assert.deepEqual([...text.matchAll(/^## (.*)$/gm)].map((match) => match[1]), ["Broken", "Suspicious redirects", "Could not verify from this network"]);
    assert.ok(text.includes(results[0].url));
    assert.ok(text.includes(results[1].url));
  }
  for (const result of results.slice(2)) {
    assert.ok(report.includes(result.url));
    assert.ok(!summary.includes(result.url));
  }
  assert.match(summary, /^- Unverified `403`: 2$/m);
  assert.match(summary, /^- Unverified `TIMEOUT`: 1$/m);
});

test("unverified-only runs retain the full report and summary", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ledger-unverified-"));
  const url = "https://blocked.example/article";
  try {
    assert.equal(writeReports([{ url, status: 403, ok: false, finalUrl: url,
      occurrences: [{ url, file: "event.md", field: "sources[0].url" }],
    }], dir), true);
    assert.match(fs.readFileSync(path.join(dir, "broken-links-summary.md"), "utf-8"), /^Found 0 broken/);
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
});


test("weekly workflow updates issues in place, closes clean runs, and preserves checker failures", async () => {
  const workflow = yaml.load(fs.readFileSync(new URL("../.github/workflows/stale-sources.yml", import.meta.url), "utf-8")) as {
    jobs: { "check-links": { steps: Array<{ name: string; if?: string; env?: Record<string, string>; with?: { script?: string } }> } };
  };
  const step = workflow.jobs["check-links"].steps.find((step) => step.name === "Post report summary")!;
  assert.equal(step.if, undefined, "clean runs must reach issue cleanup");
  assert.equal(step.env?.CHECK_OUTCOME, "${{ steps.check.outcome }}");
  const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
  const execute = new AsyncFunction("require", "github", "context", "process", step.with!.script!);
  const summary = (broken: number, suspicious: number, unverified: number) =>
    `Found ${broken} broken link(s), ${suspicious} suspicious redirect(s) and ${unverified} link(s) that could not be verified from this network among 8 URL(s) on 2026-11-13:\n\n## Broken\n\n## Suspicious redirects\n\n## Could not verify from this network`;
  for (const scenario of [
    { report: summary(2, 1, 5), exists: true, outcome: "failure", action: "update" },
    { report: summary(2, 1, 5), exists: false, outcome: "failure", action: "create" },
    { report: summary(0, 0, 5), exists: true, outcome: "success", action: "close" },
    { report: undefined, exists: true, outcome: "success", action: "close" },
    { report: summary(0, 0, 5), exists: false, outcome: "success", action: "none" },
    { report: undefined, exists: true, outcome: "failure", action: "failed" },
  ]) {
    const calls: Array<{ method: string; data: Record<string, unknown> }> = [];
    const issues = {
      ...Object.fromEntries(["update", "create", "createComment"].map((method) => [method, async (data: Record<string, unknown>) => {
        calls.push({ method, data });
      }])),
      listForRepo: async () => ({ data: scenario.exists ? [{ number: 162 }] : [] }),
    };
    await execute(() => ({ existsSync: () => scenario.report !== undefined, readFileSync: () => scenario.report }),
      { rest: { issues } },
      { repo: { owner: "example", repo: "ledger" }, serverUrl: "https://github.com", runId: 123 },
      { env: { ARTIFACT_URL: "https://example.com/report", CHECK_OUTCOME: scenario.outcome } });
    const updates = calls.filter((call) => call.method === "update");
    if (scenario.action === "close") {
      assert.equal(updates.length, 1);
      assert.equal(updates[0].data.state, "closed");
      assert.equal(calls.filter((call) => call.method === "createComment").length, 1);
      assert.equal(calls.filter((call) => call.method === "create").length, 0);
    } else if (scenario.action === "none") {
      assert.deepEqual(calls, []);
    } else {
      const call = calls.find((call) => call.method === (scenario.action === "create" ? "create" : "update"))!;
      assert.ok(call, scenario.action);
      assert.equal(calls.filter((call) => call.method === "createComment").length, 0);
      assert.notEqual(call.data.state, "closed");
      if (scenario.action === "failed") assert.match(String(call.data.body), /failed before writing a report/);
      else {
        assert.match(String(call.data.title), /^Source link problems: 2 broken, 1 suspicious \(\d{4}-\d{2}-\d{2}\)$/);
        assert.ok(String(call.data.body).includes(scenario.report!));
        assert.ok(String(call.data.body).includes("https://example.com/report"));
      }
    }
  }
});
