import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { test } from 'node:test';
import { dump } from 'js-yaml';
import { parseFrontmatter } from './frontmatter.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const today = '2026-11-14';
const stamp = '20261114';
const summary = 'First paragraph with **markup**.\n\nSecond paragraph with a [source](https://example.com).';

function fixture(t: { after: (fn: () => void) => void }) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ledger-record-files-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  for (const name of ['scripts', 'schema']) fs.cpSync(path.join(root, name), path.join(dir, name), { recursive: true });
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(dir, 'node_modules'));
  fs.copyFileSync(path.join(root, 'package.json'), path.join(dir, 'package.json'));
  fs.mkdirSync(path.join(dir, 'content/events/2023'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'content/events/2023/01-gpt-4-release.md'), `---\nid: gpt-4-release\ntitle: GPT-4\ndate: '2023-03-14'\ncategory: models\nsources:\n  - url: https://example.com\n    title: A source\nrevision:\n  created: '2023-03-20'\n---\n\n## Summary\n\n${summary}\n\n## What Happened\n\nDo not copy this section.\n\n## Why It Matters\n\nNor this one.\n`);
  fs.writeFileSync(path.join(dir, 'fixed-clock.mjs'), `
    const RealDate = Date;
    globalThis.Date = class extends RealDate {
      constructor(...args) {
        if (args.length === 0) super('2026-11-15T00:30:00Z');
        else super(...args);
      }
      static now() { return RealDate.parse('2026-11-15T00:30:00Z'); }
    };
  `);
  return dir;
}

function scaffold(dir: string, command: string, args: string[]) {
  const contentDir = path.join(dir, 'content');
  const before = fs.readdirSync(contentDir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const filename = path.join(entry.parentPath, entry.name);
      return { filename, raw: fs.readFileSync(filename, 'utf8') };
    });
  const result = spawnSync('npm', ['run', `new-${command}`, '--', ...args], {
    cwd: dir, encoding: 'utf8',
    env: { ...process.env, TZ: 'America/Los_Angeles', NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --import=${pathToFileURL(path.join(dir, 'fixed-clock.mjs')).href}` },
  });
  for (const { filename, raw } of before) assert.equal(fs.readFileSync(filename, 'utf8'), raw, filename);
  return { status: result.status, output: result.stdout + result.stderr + (result.error?.message ?? '') + (result.signal ?? ''), error: result.stderr };
}

function validate(dir: string) {
  const result = spawnSync('npm', ['run', 'validate'], { cwd: dir, encoding: 'utf8' });
  return { status: result.status, output: result.stdout + result.stderr };
}

function record(dir: string, folder: string, id: string) {
  const filename = path.join(dir, 'content', folder, `${id}.md`);
  return { filename, ...parseFrontmatter(fs.readFileSync(filename, 'utf8')) };
}

function fill(filename: string, data: object, content: string) {
  fs.writeFileSync(filename, `---\n${dump(data)}---\n${content}`);
}

// The challenge scaffold asks the editor to mark the entry; validation requires it.
function markContested(dir: string) {
  const filename = path.join(dir, 'content/events/2023/01-gpt-4-release.md');
  fs.writeFileSync(filename, fs.readFileSync(filename, 'utf8').replace('revision:\n', 'contestation:\n  status: contested\nrevision:\n'));
}

function challenge(dir: string) {
  const result = scaffold(dir, 'challenge', ['--target', 'gpt-4-release', '--allegation', 'misquote']);
  assert.equal(result.status, 0, result.output);
  markContested(dir);
  return record(dir, 'challenges', `cc-gpt-4-release-${stamp}`);
}

test('challenge captures allegations, issue and local date, and needs its filer before validation', (t) => {
  const dir = fixture(t);
  const result = scaffold(dir, 'challenge', ['--target', 'gpt-4-release', '--allegation', 'misquote', '--allegation', 'overstatement', '--issue', '123']);
  assert.equal(result.status, 0, result.output);
  const { filename, data, content } = record(dir, 'challenges', `cc-gpt-4-release-${stamp}`);
  assert.equal(data.id, `cc-gpt-4-release-${stamp}`);
  assert.equal(data.target_claim_id, 'gpt-4-release');
  assert.deepEqual(data.allegations, ['misquote', 'overstatement']);
  assert.equal(data.status, 'open');
  assert.equal(data.opened_at, today);
  for (const heading of ['Challenged assertion', 'Basis', 'Procedural status']) assert.ok(content.includes(`## ${heading}\n`));
  assert.match(content, /https:\/\/github.com\/pedro-bright\/the-ledger\/issues\/123/);
  assert.match(result.output, /opened_by/);
  assert.match(result.output, /state.*contestation/);
  const unfilled = validate(dir);
  assert.equal(unfilled.status, 1, unfilled.output);
  assert.match(unfilled.output, /opened_by/);
  data.opened_by = 'example-editor';
  fill(filename, data, content);
  const unmarked = validate(dir);
  assert.equal(unmarked.status, 1, unmarked.output);
  assert.match(unmarked.output, /Consistency rule "challenge target is marked"/);
  markContested(dir);
  const completed = validate(dir);
  assert.equal(completed.status, 0, completed.output);
});

test('revision preserves the current Summary and original metadata and validates after completion', (t) => {
  const dir = fixture(t);
  const c = challenge(dir);
  c.data.opened_by = 'example-editor';
  fill(c.filename, c.data, c.content);
  const result = scaffold(dir, 'revision', ['--target', 'gpt-4-release', '--case', c.data.id]);
  assert.equal(result.status, 0, result.output);
  const { filename, data, content } = record(dir, 'revisions', `sr-gpt-4-release-${stamp}`);
  assert.equal(data.id, `sr-gpt-4-release-${stamp}`);
  assert.equal(data.target_summary_id, 'gpt-4-release');
  assert.equal(data.prior_version, summary);
  assert.equal(data.new_version, '');
  assert.equal(data.created_at, today);
  assert.equal(data.triggered_by_case_id, c.data.id);
  for (const heading of ['Scope', 'Event location and identity', 'Evidence', 'Original metadata']) assert.ok(content.includes(`## ${heading}\n`));
  const original = fs.readFileSync(path.join(dir, 'content/events/2023/01-gpt-4-release.md'), 'utf8');
  assert.ok(content.includes(`\`\`\`yaml\n${parseFrontmatter(original).matter.trim()}\n\`\`\``));
  for (const field of ['new_version', 'reason', 'author', 'changed_claim_ids']) assert.ok(result.output.includes(field));
  assert.match(result.output, /Summary/);
  const unfilled = validate(dir);
  assert.equal(unfilled.status, 1, unfilled.output);
  assert.match(unfilled.output, /reason/);
  data.reason = 'Correct a quoted claim.';
  data.new_version = 'The corrected summary.';
  data.author = 'example-editor';
  data.changed_claim_ids = ['gpt-4-release'];
  fill(filename, data, content);
  const completed = validate(dir);
  assert.equal(completed.status, 0, completed.output);
});

test('revision allows no case and copies the repository GPT-4 summary rather than a fixture assumption', (t) => {
  const dir = fixture(t);
  const files = fs.readdirSync(path.join(root, 'content/events/2023'));
  const name = files.find((name) => name.endsWith('-gpt-4-release.md'))!;
  const raw = fs.readFileSync(path.join(root, 'content/events/2023', name), 'utf8');
  fs.writeFileSync(path.join(dir, 'content/events/2023/01-gpt-4-release.md'), raw);
  const result = scaffold(dir, 'revision', ['--target', 'gpt-4-release']);
  assert.equal(result.status, 0, result.output);
  const { data } = record(dir, 'revisions', `sr-gpt-4-release-${stamp}`);
  const body = parseFrontmatter(raw).content;
  const expected = body.split('## Summary')[1].split('\n## ')[0].trim();
  assert.equal(data.prior_version, expected);
  assert.equal(data.triggered_by_case_id, null);
});

test('resolution uses the case target, leaves editorial decisions unfinished and validates after completion', (t) => {
  const dir = fixture(t);
  const c = challenge(dir);
  c.data.opened_by = 'example-editor';
  fill(c.filename, c.data, c.content);
  const result = scaffold(dir, 'resolution', ['--case', c.data.id, '--disposition', 'rejected']);
  assert.equal(result.status, 0, result.output);
  const { filename, data, content } = record(dir, 'resolutions', `rn-gpt-4-release-${stamp}`);
  assert.equal(data.id, `rn-gpt-4-release-${stamp}`);
  assert.equal(data.case_id, c.data.id);
  assert.equal(data.disposition, 'rejected');
  assert.equal(data.issued_at, today);
  for (const heading of ['Decision', 'Evidence', 'Review']) assert.ok(content.includes(`## ${heading}\n`));
  for (const field of ['findings', 'actions', 'decided_by', 'resolution_note_id', 'status', 'summary_revision_id']) assert.ok(result.output.includes(field));
  assert.match(result.output, /curator/);
  assert.match(result.output, /contestation\.status to corrected when an action creates a summary revision/);
  const unfilled = validate(dir);
  assert.equal(unfilled.status, 1, unfilled.output);
  assert.match(unfilled.output, /findings/);
  data.findings = ['The source supports the original claim.'];
  data.actions = [{ type: 'no_action' }];
  data.decided_by = ['example-curator'];
  fill(filename, data, content);
  const completed = validate(dir);
  assert.equal(completed.status, 0, completed.output);
});

test('all commands allocate daily suffixes without changing files, including ids under other filenames', (t) => {
  const dir = fixture(t);
  const c = challenge(dir);
  const commands: [string, string, string, string[]][] = [
    ['challenge', 'challenges', 'cc', ['--target', 'gpt-4-release', '--allegation', 'misquote']],
    ['revision', 'revisions', 'sr', ['--target', 'gpt-4-release']],
    ['resolution', 'resolutions', 'rn', ['--case', c.data.id, '--disposition', 'mixed']],
  ];
  for (const [command, folder, prefix, args] of commands) {
    if (command !== 'challenge') assert.equal(scaffold(dir, command, args).status, 0);
    const base = `${prefix}-gpt-4-release-${stamp}`;
    const first = record(dir, folder, base);
    fs.copyFileSync(first.filename, path.join(dir, 'content', folder, 'another-name.md'));
    const hidden = record(dir, folder, base);
    hidden.data.id = `${base}-2`;
    fill(path.join(dir, 'content', folder, 'another-name.md'), hidden.data, hidden.content);
    hidden.data.id = 'unrelated-record';
    fill(path.join(dir, 'content', folder, `${base}-3.md`), hidden.data, hidden.content);
    const before = new Map(fs.readdirSync(path.join(dir, 'content', folder)).map((name) => [name, fs.readFileSync(path.join(dir, 'content', folder, name), 'utf8')]));
    assert.equal(scaffold(dir, command, args).status, 0);
    assert.equal(record(dir, folder, `${base}-4`).data.id, `${base}-4`);
    for (const [name, raw] of before) assert.equal(fs.readFileSync(path.join(dir, 'content', folder, name), 'utf8'), raw);
  }
});

test('invalid arguments and unknown or mismatched references return one line and create nothing', (t) => {
  const dir = fixture(t);
  const c = challenge(dir);
  const before = fs.readdirSync(path.join(dir, 'content'), { recursive: true });
  const invalid: [string, string[]][] = [
    ['challenge', ['--target', 'unknown', '--allegation', 'misquote']],
    ['challenge', ['--target', '../escape', '--allegation', 'misquote']],
    ['challenge', ['--target', 'gpt-4-release', '--allegation', 'unknown']],
    ['challenge', ['--target', 'gpt-4-release']],
    ['challenge', ['--target', 'gpt-4-release', '--allegation', 'misquote', '--issue', 'abc']],
    ['challenge', ['--target', 'gpt-4-release', '--allegation', 'misquote', '--issue', '0']],
    ['challenge', ['--allegation', 'misquote']],
    ['revision', []],
    ['revision', ['--target', 'unknown']],
    ['revision', ['--target', 'gpt-4-release', '--case', 'unknown']],
    ['resolution', ['--case', 'unknown', '--disposition', 'sustained']],
    ['resolution', ['--case', c.data.id, '--disposition', 'unknown']],
    ['resolution', ['--case', c.data.id]],
    ['resolution', ['--disposition', 'sustained']],
    ['challenge', ['--bogus']],
  ];
  for (const [command, args] of invalid) {
    const result = scaffold(dir, command, args);
    assert.equal(result.status, 1, result.output);
    assert.equal(result.error.trim().split('\n').length, 1, result.output);
    assert.deepEqual(fs.readdirSync(path.join(dir, 'content'), { recursive: true }), before);
  }
  c.data.target_claim_id = 'another-event';
  fill(c.filename, c.data, c.content);
  const mismatch = scaffold(dir, 'revision', ['--target', 'gpt-4-release', '--case', c.data.id]);
  assert.equal(mismatch.status, 1, mismatch.output);
  assert.match(mismatch.output, /target/);
  const unknownTarget = scaffold(dir, 'resolution', ['--case', c.data.id, '--disposition', 'sustained']);
  assert.equal(unknownTarget.status, 1, unknownTarget.output);
  assert.deepEqual(fs.readdirSync(path.join(dir, 'content'), { recursive: true }), before);
});

test('all commands accept a synthesis entry as the schema permits', (t) => {
  const dir = fixture(t);
  fs.mkdirSync(path.join(dir, 'content/syntheses'));
  fs.writeFileSync(path.join(dir, 'content/syntheses/example-synthesis.md'), `---\nid: example-synthesis\nthread: example-thread\nauthor: example-editor\ndate: '2026-01-01'\ntype: canonical-synthesis\n---\n\n## Summary\n\nA synthesis summary.\n`);
  const c = scaffold(dir, 'challenge', ['--target', 'example-synthesis', '--allegation', 'overstatement']);
  assert.equal(c.status, 0, c.output);
  const caseId = `cc-example-synthesis-${stamp}`;
  assert.equal(record(dir, 'challenges', caseId).data.target_claim_id, 'example-synthesis');
  const r = scaffold(dir, 'revision', ['--target', 'example-synthesis', '--case', caseId]);
  assert.equal(r.status, 0, r.output);
  assert.equal(record(dir, 'revisions', `sr-example-synthesis-${stamp}`).data.prior_version, 'A synthesis summary.');
  const n = scaffold(dir, 'resolution', ['--case', caseId, '--disposition', 'deferred']);
  assert.equal(n.status, 0, n.output);
  assert.equal(record(dir, 'resolutions', `rn-example-synthesis-${stamp}`).data.case_id, caseId);
});

test('revision refuses a missing Summary instead of guessing prior_version', (t) => {
  const dir = fixture(t);
  const filename = path.join(dir, 'content/events/2023/01-gpt-4-release.md');
  fs.writeFileSync(filename, fs.readFileSync(filename, 'utf8').replace('## Summary', '## Overview'));
  const result = scaffold(dir, 'revision', ['--target', 'gpt-4-release']);
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /Summary/);
  assert.equal(fs.existsSync(path.join(dir, 'content/revisions')), false);
});

test('CONTRIBUTING.md lists every contestation status in the event schema', () => {
  const schema = JSON.parse(fs.readFileSync(path.join(root, 'schema/event.schema.json'), 'utf8'));
  const contributing = fs.readFileSync(path.join(root, 'CONTRIBUTING.md'), 'utf8');
  const line = contributing.split('\n').find((text) => text.includes('`contestation.status` from the event schema'));
  assert.ok(line, 'CONTRIBUTING.md has no line listing contestation statuses');
  const listed = [...line.matchAll(/`([a-z]+)`/g)].map((match) => match[1]);
  assert.deepEqual(listed, schema.properties.contestation.properties.status.enum);
});
