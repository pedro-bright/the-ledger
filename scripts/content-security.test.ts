import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import matter from "gray-matter";
import { parseFrontmatter as siteParseFrontmatter } from "../site/src/lib/markdown.js";
import { parseFrontmatter } from "./frontmatter.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TSX = path.join(ROOT, "node_modules", ".bin", "tsx");

const VALID_FRONTMATTER = `id: zz-valid-event
title: A valid event
date: 2026-10-01
category: safety
sources:
  - url: https://example.com/a
    title: A source
    type: official`;

// Runs as code only if the parser honors the file's choice of language.
function codeFrontmatterPoc(language: string): string {
  return `---${language}
(function () {
  require("fs").appendFileSync(process.env.POC_MARKER, "ran");
  return { id: "zz-rce-poc", title: "Looks like a normal event", date: "2026-10-01", category: "safety", sources: [{ url: "https://example.com/a", title: "a" }] };
})()
---

## Summary

Body.
`;
}

function withMarker(run: (marker: string) => void) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ledger-poc-marker-"));
  const marker = path.join(dir, "marker");
  const previous = process.env.POC_MARKER;
  process.env.POC_MARKER = marker;
  try {
    run(marker);
  } finally {
    if (previous === undefined) delete process.env.POC_MARKER;
    else process.env.POC_MARKER = previous;
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// A throwaway project: the real scripts and schemas with the given content files.
function withSandbox(files: Record<string, string>, run: (sandbox: string) => void) {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "ledger-poc-sandbox-"));
  try {
    fs.cpSync(path.join(ROOT, "scripts"), path.join(sandbox, "scripts"), { recursive: true });
    fs.cpSync(path.join(ROOT, "schema"), path.join(sandbox, "schema"), { recursive: true });
    fs.symlinkSync(path.join(ROOT, "node_modules"), path.join(sandbox, "node_modules"));
    fs.mkdirSync(path.join(sandbox, "site", "dist"), { recursive: true });
    for (const [relative, body] of Object.entries(files)) {
      const target = path.join(sandbox, "content", relative);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, body);
    }
    run(sandbox);
  } finally {
    fs.rmSync(sandbox, { recursive: true, force: true });
  }
}

function runScript(sandbox: string, script: string) {
  const result = spawnSync(TSX, [path.join("scripts", script)], {
    cwd: sandbox,
    encoding: "utf-8",
    env: process.env,
    timeout: 60_000,
  });
  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

// ─── Finding 1: frontmatter is YAML only ──────────────────────

test("the proof of concept runs code under unguarded gray-matter", () => {
  withMarker((marker) => {
    matter(codeFrontmatterPoc("js"));
    assert.equal(fs.readFileSync(marker, "utf-8"), "ran");
  });
});

for (const [name, parse] of [
  ["scripts", parseFrontmatter],
  ["site", siteParseFrontmatter],
] as const) {
  for (const language of ["js", "javascript", "JS", " js", "js ", "JavaScript"]) {
    test(`${name} parser rejects "---${language}" without running it`, () => {
      withMarker((marker) => {
        assert.throws(() => parse(codeFrontmatterPoc(language)), /Only YAML frontmatter is allowed/);
        assert.equal(fs.existsSync(marker), false);
      });
    });
  }

  test(`${name} parser rejects code frontmatter behind a byte order mark or CRLF`, () => {
    withMarker((marker) => {
      assert.throws(() => parse(`﻿${codeFrontmatterPoc("js")}`), /Only YAML frontmatter is allowed/);
      assert.throws(() => parse(codeFrontmatterPoc("js").replace(/\n/g, "\r\n")), /Only YAML frontmatter is allowed/);
      assert.equal(fs.existsSync(marker), false);
    });
  });

  for (const opening of ["---json", "---constructor", "---toString", "---coffee", "---toml"]) {
    test(`${name} parser rejects "${opening}"`, () => {
      assert.throws(() => parse(`${opening}\n{"id": "x"}\n---\nBody\n`));
    });
  }

  for (const opening of ["---", "---yaml", "---yml", "---YAML", "--- "]) {
    test(`${name} parser accepts "${opening}" with the same data as gray-matter`, () => {
      const raw = `${opening}\n${VALID_FRONTMATTER}\n---\n\nBody.\n`;
      const { data, content } = parse(raw);
      const expected = matter(raw);
      assert.deepEqual(data, expected.data);
      assert.equal(content, expected.content);
      assert.equal(data.id, "zz-valid-event");
    });
  }

  for (const [label, raw] of [
    ["an empty file", ""],
    ["a file with no frontmatter", "Just a body.\n"],
    ["a file with only a newline", "\n"],
    ["a file with only a byte order mark", "﻿"],
  ] as const) {
    test(`${name} parser reads ${label} the same as gray-matter`, () => {
      const { data, content } = parse(raw);
      const expected = matter(raw);
      assert.deepEqual(data, {});
      assert.deepEqual(data, expected.data);
      assert.equal(content, expected.content);
    });
  }
}

test("no command-line tool runs a code frontmatter file", () => {
  withMarker((marker) => {
    withSandbox({ "events/2026/01-rce-poc.md": codeFrontmatterPoc("js") }, (sandbox) => {
      for (const script of ["validate.ts", "build-graph.ts", "generate-feed.ts", "test-parity.ts", "check-links.ts"]) {
        runScript(sandbox, script);
        assert.equal(fs.existsSync(marker), false, `${script} ran the frontmatter`);
      }
      for (const script of ["validate.ts", "build-graph.ts"]) {
        const { status, output } = runScript(sandbox, script);
        assert.equal(status, 1, `${script} should fail:\n${output}`);
        assert.match(output, /Only YAML frontmatter is allowed/);
      }
      const { status, output } = runScript(sandbox, "test-parity.ts");
      assert.equal(status, 1, output);
      assert.match(output, /Malformed \(missing id\) in frontmatter: 1\n\s+content\/events\/2026\/01-rce-poc\.md/);
    });
  });
});

test("command-line tools still accept an empty content file", () => {
  withSandbox({ "events/2026/01-empty.md": "" }, (sandbox) => {
    for (const script of ["build-graph.ts", "check-links.ts"]) {
      const { status, output } = runScript(sandbox, script);
      assert.equal(status, 0, `${script} should pass:\n${output}`);
    }
  });
  withSandbox({ "perspectives/empty.md": "" }, (sandbox) => {
    const { status, output } = runScript(sandbox, "validate.ts");
    assert.equal(status, 0, output);
  });
});

// ─── Finding 11: schema URL fields ────────────────────────────

function schemaValidators() {
  const ajv = new Ajv({ allErrors: true, strict: false, allowUnionTypes: true });
  addFormats(ajv);
  const load = (name: string) => JSON.parse(fs.readFileSync(path.join(ROOT, "schema", `${name}.schema.json`), "utf-8"));
  return { source: ajv.compile(load("source")), actor: ajv.compile(load("actor")) };
}

const UNSAFE_URLS = [
  "javascript:alert(1)",
  "JAVASCRIPT:alert(1)",
  "vbscript:x",
  "file:///etc/passwd",
  "data:text/html,%3Cscript%3Ealert(1)%3C/script%3E",
];

for (const url of UNSAFE_URLS) {
  test(`schema rejects ${url} as a source url, archive url and actor website`, () => {
    const { source, actor } = schemaValidators();
    const base = { url: "https://example.com/a", title: "t" };
    assert.equal(source({ ...base, url }), false);
    assert.equal(source({ ...base, archive_url: url }), false);
    assert.equal(actor({ id: "zz-actor", name: "Actor", type: "company", website: url }), false);
  });
}

test("schema accepts http and https URLs", () => {
  const { source, actor } = schemaValidators();
  for (const url of ["https://example.com/a?x=1&y=2", "http://example.com/"]) {
    assert.equal(source({ url, archive_url: url, title: "t" }), true);
    assert.equal(actor({ id: "zz-actor", name: "Actor", type: "company", website: url }), true);
  }
});

test("validate rejects the proof-of-concept URLs and passes the same files with safe ones", () => {
  const event = (url: string, archive: string) => `---
id: zz-poc-event
title: PoC event
date: 2026-10-01
category: safety
sources:
  - url: "${url}"
    title: A source
    type: official
    archive_url: "${archive}"
---

## Summary

Body.
`;
  const actor = (website: string) => `id: zz-poc-actor\nname: PoC actor\ntype: company\nwebsite: "${website}"\n`;

  withSandbox(
    {
      "events/2026/01-poc.md": event(
        "javascript:window.opener=null;document.title='POC_SOURCE_URL_RAN';alert(1)",
        "data:text/html,%3Cscript%3Edocument.title='POC_ARCHIVE_RAN'%3C/script%3E",
      ),
      "actors/zz-poc-actor.yml": actor("javascript:window.__poc_actor_website=1"),
    },
    (sandbox) => {
      const { status, output } = runScript(sandbox, "validate.ts");
      assert.equal(status, 1, output);
      assert.match(output, /01-poc\.md/);
      assert.match(output, /zz-poc-actor\.yml/);
    },
  );

  withSandbox(
    {
      "events/2026/01-poc.md": event("https://example.com/poc", "https://example.com/poc-arc"),
      "actors/zz-poc-actor.yml": actor("https://example.com/"),
    },
    (sandbox) => {
      const { status, output } = runScript(sandbox, "validate.ts");
      assert.equal(status, 0, output);
    },
  );
});
