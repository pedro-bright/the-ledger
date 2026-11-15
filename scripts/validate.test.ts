import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { dump } from 'js-yaml';
import { PUBLICATION_RULES_FROM } from './publication-rules.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tsx = path.join(root, 'node_modules/.bin/tsx');
const archive = 'https://web.archive.org/web/20261110120000/https://example.com/announcement';

type Event = Record<string, any>;

function complete(id: string): Event {
  return {
    id,
    title: 'Example event',
    date: '2026-11-10',
    category: 'policy',
    significance: 'notable',
    sources: [{
      url: 'https://example.com/announcement',
      title: 'Announcement',
      type: 'official',
      publisher: 'Example Agency',
      date: '2026-11-10',
      accessed: PUBLICATION_RULES_FROM,
      archive_url: archive,
    }],
    state: 'published',
    revision: {
      created: PUBLICATION_RULES_FROM,
      last_reviewed: PUBLICATION_RULES_FROM,
      draft_assistance: 'ai-assisted',
      final_author: 'pedro-bright',
    },
  };
}

function secondary(n: number) {
  return {
    url: `https://news.example.org/story-${n}`,
    title: `Story ${n}`,
    type: 'secondary_reporting',
    publisher: `Outlet ${n}`,
    date: '2026-11-10',
    accessed: PUBLICATION_RULES_FROM,
  };
}

function validate(t: { after: (fn: () => void) => void }, events: Event[]) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ledger-validate-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  for (const name of ['scripts', 'schema']) fs.cpSync(path.join(root, name), path.join(dir, name), { recursive: true });
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(dir, 'node_modules'));
  fs.mkdirSync(path.join(dir, 'content/events/2026'), { recursive: true });
  events.forEach((data, i) => {
    const name = `${String(i + 1).padStart(2, '0')}-${data.id}.md`;
    fs.writeFileSync(path.join(dir, 'content/events/2026', name), `---\n${dump(data)}---\n\n## Summary\n\nBody.\n`);
  });
  const result = spawnSync(tsx, [path.join(dir, 'scripts/validate.ts')], { cwd: dir, encoding: 'utf8' });
  return { status: result.status, output: result.stdout + result.stderr };
}

// Each failure names the file, the field and the rule, followed by the fix.
function assertRejected(output: string, file: string, rule: string, field: string) {
  const escaped = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  assert.match(output, new RegExp(`events/2026/${escaped(file)}\\n\\s+→ Publication rule "${escaped(rule)}": ${escaped(field)} [^\\n]*\\. \\S`), output);
}

function assertNotListed(output: string, file: string) {
  assert.ok(!output.includes(file), `${file} should pass:\n${output}`);
}

test('a complete new event passes', (t) => {
  const result = validate(t, [complete('complete-event')]);
  assert.equal(result.status, 0, result.output);
});

test('events created before the effective date are not checked', (t) => {
  const before = new Date(Date.parse(PUBLICATION_RULES_FROM) - 86400000).toISOString().slice(0, 10);
  const event = complete('older-event');
  event.revision = { created: before, final_author: 'pedro-bright' };
  event.significance = 'major';
  delete event.state;
  event.sources = [{ url: 'https://example.com/a', title: 'A', type: 'primary_document', archive_url: 'https://web.archive.org/web/*/https://example.com/a' }];
  const result = validate(t, [event]);
  assert.equal(result.status, 0, result.output);
});

for (const field of ['last_reviewed', 'draft_assistance', 'final_author']) {
  test(`revision record rule requires revision.${field}`, (t) => {
    const failing = complete('missing-revision-field');
    delete failing.revision[field];
    const result = validate(t, [complete('complete-revision'), failing]);
    assert.equal(result.status, 1, result.output);
    assertRejected(result.output, '02-missing-revision-field.md', 'revision record', `revision.${field}`);
    assertNotListed(result.output, '01-complete-revision.md');
  });
}

const createdCases: Array<[string, (event: Event) => void]> = [
  ['an event with no revision block', (event) => { delete event.revision; }],
  ['a revision without created', (event) => { delete event.revision.created; }],
  ['a revision.created that is not a string', (event) => { event.revision.created = 20261115; }],
];
for (const [name, change] of createdCases) {
  test(`revision record rule requires revision.created on ${name}`, (t) => {
    const failing = complete('missing-created');
    change(failing);
    const result = validate(t, [complete('complete-created'), failing]);
    assert.equal(result.status, 1, result.output);
    assertRejected(result.output, '02-missing-created.md', 'revision record', 'revision.created');
    assertNotListed(result.output, '01-complete-created.md');
  });
}

test('an event with no revision block is checked against every publication rule', (t) => {
  const failing = complete('no-revision');
  delete failing.revision;
  failing.significance = 'major';
  failing.sources[0].archive_url = 'https://web.archive.org/web/*/https://example.com/announcement';
  const result = validate(t, [failing]);
  assert.equal(result.status, 1, result.output);
  for (const field of ['created', 'last_reviewed', 'draft_assistance', 'final_author']) {
    assertRejected(result.output, '01-no-revision.md', 'revision record', `revision.${field}`);
  }
  assertRejected(result.output, '01-no-revision.md', 'fixed archive capture', 'sources[0].archive_url');
});

test('lifecycle state rule requires state', (t) => {
  const failing = complete('missing-state');
  delete failing.state;
  const result = validate(t, [complete('with-state'), failing]);
  assert.equal(result.status, 1, result.output);
  assertRejected(result.output, '02-missing-state.md', 'lifecycle state', 'state');
  assertNotListed(result.output, '01-with-state.md');
});

for (const field of ['publisher', 'date', 'accessed']) {
  test(`source details rule requires ${field} on every source`, (t) => {
    const passing = complete('detailed-sources');
    passing.sources.push(secondary(1));
    const failing = complete('missing-source-field');
    const source = secondary(1);
    delete (source as Record<string, unknown>)[field];
    failing.sources.push(source);
    const result = validate(t, [passing, failing]);
    assert.equal(result.status, 1, result.output);
    assertRejected(result.output, '02-missing-source-field.md', 'source details', `sources[1].${field}`);
    assertNotListed(result.output, '01-detailed-sources.md');
  });
}

test('minimum sourcing rule accepts two secondary sources and rejects one', (t) => {
  const passing = complete('two-secondary');
  passing.sources = [secondary(1), secondary(2)];
  const failing = complete('one-secondary');
  failing.sources = [secondary(1)];
  const result = validate(t, [passing, failing]);
  assert.equal(result.status, 1, result.output);
  assertRejected(result.output, '02-one-secondary.md', 'minimum sourcing', 'sources');
  assertNotListed(result.output, '01-two-secondary.md');
});

for (const type of ['official', 'primary_document']) {
  test(`archived primary sources rule requires archive_url on a ${type} source`, (t) => {
    const passing = complete('archived-source');
    passing.sources[0].type = type;
    const failing = complete('unarchived-source');
    failing.sources[0].type = type;
    delete failing.sources[0].archive_url;
    const result = validate(t, [passing, failing]);
    assert.equal(result.status, 1, result.output);
    assertRejected(result.output, '02-unarchived-source.md', 'archived primary sources', 'sources[0].archive_url');
    assertNotListed(result.output, '01-archived-source.md');
  });
}

for (const unpinned of [
  'https://web.archive.org/web/*/https://example.com/announcement',
  'https://web.archive.org/web/https://example.com/announcement',
  'https://web.archive.org/web/2026/https://example.com/announcement',
]) {
  test(`fixed archive capture rule rejects ${unpinned}`, (t) => {
    const passing = complete('pinned-capture');
    passing.sources.push({ ...secondary(1), archive_url: 'https://web.archive.org/web/20261110120000id_/https://news.example.org/story-1' });
    const failing = complete('unpinned-capture');
    failing.sources.push({ ...secondary(1), archive_url: unpinned });
    const result = validate(t, [passing, failing]);
    assert.equal(result.status, 1, result.output);
    assertRejected(result.output, '02-unpinned-capture.md', 'fixed archive capture', 'sources[1].archive_url');
    assertNotListed(result.output, '01-pinned-capture.md');
  });
}

test('automatic entries are notable rule limits pedro-bright entries to notable', (t) => {
  const human = complete('human-major');
  human.revision.final_author = 'terry-tang';
  human.significance = 'major';
  const failing = complete('automatic-major');
  failing.significance = 'major';
  const unrated = complete('automatic-unrated');
  delete unrated.significance;
  const result = validate(t, [complete('automatic-notable'), human, failing, unrated]);
  assert.equal(result.status, 1, result.output);
  assertRejected(result.output, '03-automatic-major.md', 'automatic entries are notable', 'significance');
  assertRejected(result.output, '04-automatic-unrated.md', 'automatic entries are notable', 'significance');
  assertNotListed(result.output, '01-automatic-notable.md');
  assertNotListed(result.output, '02-human-major.md');
});
