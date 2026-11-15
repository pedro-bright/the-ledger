import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { test } from 'node:test';
import { parseFrontmatter } from './frontmatter.js';
import { dump } from 'js-yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tsx = path.join(root, 'node_modules/.bin/tsx');

function fixture(t: { after: (fn: () => void) => void }) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ledger-event-files-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  for (const name of ['scripts', 'schema']) fs.cpSync(path.join(root, name), path.join(dir, name), { recursive: true });
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(dir, 'node_modules'));
  fs.copyFileSync(path.join(root, 'package.json'), path.join(dir, 'package.json'));
  fs.mkdirSync(path.join(dir, 'content/events/2026'), { recursive: true });
  return dir;
}

function event(dir: string, name: string, id = 'example-event', date = '2026-01-01') {
  fs.writeFileSync(path.join(dir, 'content/events/2026', name), `---\nid: ${id}\ntitle: Example event\ndate: ${date}\ncategory: policy\nsources:\n  - url: https://example.com/source\n    title: Example source\nrevision:\n  created: '2026-01-01'\n---\n\n## Summary\n\nBody.\n\n## What Happened\n\nBody.\n\n## Why It Matters\n\nBody.\n`);
}

function validate(dir: string) {
  const result = spawnSync(tsx, [path.join(dir, 'scripts/validate.ts')], { cwd: dir, encoding: 'utf8' });
  return { status: result.status, output: result.stdout + result.stderr };
}

test('event filenames require two or three digits and the exact id', (t) => {
  const dir = fixture(t);
  for (const name of ['1-example-event.md', '1000-example-event.md', '01-other-event.md']) {
    event(dir, name);
    const result = validate(dir);
    assert.equal(result.status, 1, result.output);
    assert.ok(result.output.includes(name), result.output);
    assert.match(result.output, /Event filename/);
    fs.unlinkSync(path.join(dir, 'content/events/2026', name));
  }
});

test('event numbers are unique within each year and report both files', (t) => {
  const dir = fixture(t);
  event(dir, '01-example-event.md');
  event(dir, '01-another-event.md', 'another-event');
  const result = validate(dir);
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /Duplicate event number/);
  assert.match(result.output, /01-example-event.md/);
  assert.match(result.output, /01-another-event.md/);
});

test('event directory must match the date year', (t) => {
  const dir = fixture(t);
  event(dir, '01-example-event.md', 'example-event', '2025-12-31');
  const result = validate(dir);
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /01-example-event.md/);
  assert.match(result.output, /Event year directory/);
});

test('the same number in different years is allowed', (t) => {
  const dir = fixture(t);
  event(dir, '01-example-event.md');
  fs.mkdirSync(path.join(dir, 'content/events/2025'));
  fs.writeFileSync(path.join(dir, 'content/events/2025/01-older-event.md'), fs.readFileSync(path.join(dir, 'content/events/2026/01-example-event.md'), 'utf8').replace('example-event', 'older-event').replace('2026-01-01', '2025-01-01'));
  assert.equal(validate(dir).status, 0);
});

function scaffold(dir: string, id = 'zz-example', category = 'policy', date = '2026-11-01', env = process.env) {
  return spawnSync('npm', ['run', 'new-event', '--', '--id', id, '--date', date, '--category', category], { cwd: dir, encoding: 'utf8', env });
}

test('scaffold allocates above the maximum, supplies frontmatter and validates once the publication rules are met', (t) => {
  const dir = fixture(t);
  event(dir, '01-example-event.md');
  event(dir, '99-latest-event.md', 'latest-event');
  const result = scaffold(dir, 'zz-example', 'policy', '2026-11-01', { ...process.env, TZ: 'UTC' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const filename = path.join(dir, 'content/events/2026/100-zz-example.md');
  const raw = fs.readFileSync(filename, 'utf8');
  const { data, content } = parseFrontmatter(raw);
  assert.equal(data.id, 'zz-example');
  assert.equal(String(data.date), '2026-11-01');
  assert.equal(data.category, 'policy');
  assert.equal(data.revision.created, new Date().toISOString().slice(0, 10));
  for (const heading of ['Summary', 'What Happened', 'Why It Matters']) assert.ok(content.includes(`## ${heading}`));
  data.sources = [{ url: 'https://example.com/source', title: 'Example source' }];
  fs.writeFileSync(filename, `---\n${dump(data)}---\n${content}`);
  assert.match(validate(dir).output, /Publication rule "source details": sources\[0\]\.publisher is missing/);
  data.sources[0] = { ...data.sources[0], type: 'secondary_reporting', publisher: 'Example', date: '2026-11-01', accessed: data.revision.created };
  data.sources.push({ ...data.sources[0], url: 'https://example.org/source', publisher: 'Another example' });
  data.state = 'published';
  data.revision = { ...data.revision, draft_assistance: 'human-only', final_author: 'example-editor' };
  fs.writeFileSync(filename, `---\n${dump(data)}---\n${content}`);
  assert.equal(validate(dir).status, 0, validate(dir).output);
  assert.notEqual(scaffold(dir).status, 0);
  assert.equal(fs.readFileSync(filename, 'utf8').includes('Example source'), true);
});

test('scaffold refuses ids in other years and categories outside the schema', (t) => {
  const dir = fixture(t);
  event(dir, '01-example-event.md');
  const duplicate = scaffold(dir, 'example-event', 'policy', '2025-01-01');
  assert.notEqual(duplicate.status, 0);
  assert.match(duplicate.stdout + duplicate.stderr, /already exists/);
  const invalid = scaffold(dir, 'zz-example', 'unknown');
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stdout + invalid.stderr, /category/);
  assert.deepEqual(fs.readdirSync(path.join(dir, 'content/events/2026')), ['01-example-event.md']);
});

test('scaffold starts a new year with 01', (t) => {
  const dir = fixture(t);
  const result = scaffold(dir, 'older-event', 'policy', '2025-01-01');
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.ok(fs.existsSync(path.join(dir, 'content/events/2025/01-older-event.md')));
});

test('scaffold rejects invalid slugs and dates before creating files', (t) => {
  const dir = fixture(t);
  for (const [id, date] of [['../escape', '2026-11-01'], ['zz-example', '2026-02-30'], ['zz-example', 'not-a-date']]) {
    const result = scaffold(dir, id, 'policy', date);
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /Provide --(?:id|date)/);
    assert.deepEqual(fs.readdirSync(path.join(dir, 'content/events/2026')), []);
  }
});

test('scaffold refuses to allocate a four digit number', (t) => {
  const dir = fixture(t);
  event(dir, '999-example-event.md');
  const result = scaffold(dir);
  assert.notEqual(result.status, 0);
  assert.match(result.stdout + result.stderr, /two or three digits/);
  assert.deepEqual(fs.readdirSync(path.join(dir, 'content/events/2026')), ['999-example-event.md']);
});

test('scaffold revision dates use the local calendar day near UTC midnight', (t) => {
  for (const [timeZone, instant, expected] of [
    ['America/Los_Angeles', '2026-11-15T00:30:00Z', '2026-11-14'],
    ['UTC', '2026-11-15T00:30:00Z', '2026-11-15'],
    ['Pacific/Kiritimati', '2026-11-15T12:30:00Z', '2026-11-16'],
  ]) {
    const dir = fixture(t);
    const clock = path.join(dir, 'fixed-clock.mjs');
    fs.writeFileSync(clock, `
      const RealDate = Date;
      globalThis.Date = class extends RealDate {
        constructor(...args) {
          if (args.length === 0) super(${JSON.stringify(instant)});
          else super(...args);
        }
        static now() { return RealDate.parse(${JSON.stringify(instant)}); }
      };
    `);
    const result = scaffold(dir, 'zz-example', 'policy', '2026-11-01', {
      ...process.env,
      TZ: timeZone,
      NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --import=${pathToFileURL(clock).href}`,
    });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    const { data } = parseFrontmatter(fs.readFileSync(path.join(dir, 'content/events/2026/01-zz-example.md'), 'utf8'));
    assert.equal(data.revision.created, expected, timeZone);
    assert.equal(data.revision.last_reviewed, expected, timeZone);
  }
});
