import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { parseFrontmatter } from "./frontmatter.js";
import { loadYaml } from "./yaml.js";
import { parseYaml as siteParseYaml } from "../site/src/lib/content.ts";

const contentDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../content");

// The baseline is gray-matter, which parses Markdown frontmatter with its own
// nested js-yaml 3. Before the upgrade the standalone YAML files went through
// js-yaml 4, so this compares against js-yaml 3. When gray-matter is replaced,
// this test needs a new baseline.
function parseBefore(yaml: string): unknown {
  return parseFrontmatter(`---\n${yaml}\n---\n`).data;
}

// Compare values by type, so a date never equals its string form and a set
// never equals an object with null values.
function typed(value: unknown): unknown {
  if (value instanceof Date) return { Date: value.toISOString() };
  if (value instanceof Set) return { Set: [...value].map(typed) };
  if (value instanceof Map) return { Map: [...value].map(([k, v]) => [typed(k), typed(v)]) };
  if (Array.isArray(value)) return value.map(typed);
  if (value && typeof value === "object") {
    const proto = Object.getPrototypeOf(value);
    assert.ok(proto === Object.prototype || proto === null, `unexpected ${proto?.constructor?.name} value`);
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, typed(v)]));
  }
  return value;
}

function contentFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return contentFiles(full);
    return /\.(md|ya?ml)$/.test(entry.name) ? [full] : [];
  });
}

test("every content file parses to the same values as before the upgrade", () => {
  const files = contentFiles(contentDir);
  assert.ok(files.some((file) => file.endsWith(".yml")), "no YAML files found");
  assert.ok(files.some((file) => file.endsWith(".md")), "no Markdown files found");
  const differences: string[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(file, "utf-8");
    const yaml = file.endsWith(".md") ? parseFrontmatter(raw).matter : raw;
    const before = JSON.stringify(typed(parseBefore(yaml)));
    if ([loadYaml(yaml), siteParseYaml(yaml)].some((value) => JSON.stringify(typed(value)) !== before)) {
      differences.push(path.relative(contentDir, file));
    }
  }
  assert.deepEqual(differences, []);
});

test("merge keys still copy the referenced mapping", () => {
  const yaml = "base: &base\n  type: company\n  founded: 2015\nactor:\n  <<: *base\n  founded: 2021\n";
  const expected = { base: { type: "company", founded: 2015 }, actor: { type: "company", founded: 2021 } };
  assert.deepEqual(parseBefore(yaml), expected);
  assert.deepEqual(loadYaml(yaml), expected);
  assert.deepEqual(siteParseYaml(yaml), expected);
});

test("an empty file is rejected instead of parsing to nothing", () => {
  assert.throws(() => loadYaml(""), /empty/);
  assert.throws(() => siteParseYaml(""), /empty/);
});
