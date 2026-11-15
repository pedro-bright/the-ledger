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

const ENTRY_BODY = '## Summary\n\nBody.\n\n## What Happened\n\nBody.\n\n## Why It Matters\n\nBody.\n';

// Writes events to content/events/2026 in order, numbered from 01, and any other records
// at their paths under content/, then runs the validator over that content alone.
function validate(
  t: { after: (fn: () => void) => void },
  events: Event[],
  records: Record<string, string> = {},
  env: Record<string, string> = {},
) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ledger-validate-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  for (const name of ['scripts', 'schema']) fs.cpSync(path.join(root, name), path.join(dir, name), { recursive: true });
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(dir, 'node_modules'));
  fs.mkdirSync(path.join(dir, 'content/events/2026'), { recursive: true });
  events.forEach((data, i) => {
    const { body = ENTRY_BODY, ...frontmatter } = data;
    const name = `${String(i + 1).padStart(2, '0')}-${data.id}.md`;
    fs.writeFileSync(path.join(dir, 'content/events/2026', name), `---\n${dump(frontmatter)}---\n\n${body}`);
  });
  for (const [file, raw] of Object.entries(records)) {
    fs.mkdirSync(path.dirname(path.join(dir, 'content', file)), { recursive: true });
    fs.writeFileSync(path.join(dir, 'content', file), raw);
  }
  const githubEnv: Record<string, string> = { GITHUB_ACTIONS: '', GITHUB_STEP_SUMMARY: '' };
  const result = spawnSync(tsx, [path.join(dir, 'scripts/validate.ts')], { cwd: dir, encoding: 'utf8', env: { ...process.env, ...githubEnv, ...env } });
  return { status: result.status, output: result.stdout + result.stderr, dir };
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

// --------------- Consistency rules ---------------

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Each finding names the file, the rule and the field, followed by the fix.
function assertRule(output: string, file: string, rule: string, problem: string) {
  assert.match(
    output,
    new RegExp(`${escapeRegExp(file)}\\n\\s+→ Consistency rule "${escapeRegExp(rule)}": ${escapeRegExp(problem)}[^\\n]*\\. \\S`),
    output,
  );
}

function ruleCount(output: string, rule: string) {
  return output.split(`Consistency rule "${rule}"`).length - 1;
}

const frontmatter = (data: object, body = '') => `---\n${dump(data)}---\n\n${body}`;

function challenge(id: string, target: string, status = 'open', extra: object = {}) {
  return {
    [`challenges/${id}.md`]: frontmatter({
      id, target_claim_id: target, allegations: ['misquote'], status,
      opened_at: '2026-11-15', opened_by: 'example-editor', ...extra,
    }),
  };
}

function resolution(id: string, caseId: string, actions: object[] = [{ type: 'no_action' }]) {
  return {
    [`resolutions/${id}.md`]: frontmatter({
      id, case_id: caseId, disposition: 'rejected', findings: ['A finding.'], actions,
      decided_by: ['example-curator'], issued_at: '2026-11-15',
    }),
  };
}

function revision(id: string, target: string, caseId: string | null) {
  return {
    [`revisions/${id}.md`]: frontmatter({
      id, target_summary_id: target, reason: 'Correct the summary.', triggered_by_case_id: caseId, created_at: '2026-11-15',
    }),
  };
}

function contested(id: string, status = 'contested') {
  const event = complete(id);
  event.contestation = { status };
  return event;
}

for (const section of ['Summary', 'What Happened', 'Why It Matters']) {
  test(`entry sections rule requires the ${section} heading`, (t) => {
    const failing = complete('missing-section');
    failing.body = ENTRY_BODY.replace(`## ${section}\n`, `## ${section} and more\n`);
    const result = validate(t, [complete('all-sections'), failing]);
    assert.equal(result.status, 1, result.output);
    assertRule(result.output, 'events/2026/02-missing-section.md', 'entry sections', `body has no "## ${section}" heading`);
    assertNotListed(result.output, '01-all-sections.md');
  });
}

test('unique sources rule rejects a source URL listed twice', (t) => {
  const passing = complete('distinct-sources');
  passing.sources.push(secondary(1));
  const failing = complete('repeated-source');
  failing.sources.push({ ...secondary(1), url: failing.sources[0].url });
  const result = validate(t, [passing, failing]);
  assert.equal(result.status, 1, result.output);
  assertRule(result.output, 'events/2026/02-repeated-source.md', 'unique sources', 'sources[1].url repeats sources[0].url');
  assertNotListed(result.output, '01-distinct-sources.md');
});

test('source dates rule rejects accessed earlier than date', (t) => {
  const withDates = (id: string, read: string) => {
    const event = complete(id);
    event.sources.push({ ...secondary(1), date: '2026-11-10', accessed: read });
    return event;
  };
  const result = validate(t, [withDates('read-after-publication', '2026-11-10'), withDates('read-before-publication', '2026-11-09')]);
  assert.equal(result.status, 1, result.output);
  assertRule(result.output, 'events/2026/02-read-before-publication.md', 'source dates', 'sources[1].accessed (2026-11-09) is earlier than sources[1].date (2026-11-10)');
  assertNotListed(result.output, '01-read-after-publication.md');
});

test('no self reference rule rejects an entry that names itself in related', (t) => {
  const passing = complete('relates-elsewhere');
  passing.related = ['names-itself'];
  const failing = complete('names-itself');
  failing.related = ['relates-elsewhere', 'names-itself'];
  const result = validate(t, [passing, failing]);
  assert.equal(result.status, 1, result.output);
  assertRule(result.output, 'events/2026/02-names-itself.md', 'no self reference', 'related lists the entry\'s own id "names-itself"');
  assertNotListed(result.output, '01-relates-elsewhere.md');
});

for (const status of ['contested', 'unresolved']) {
  test(`contested entry has a challenge rule rejects contestation.status ${status} with no challenge`, (t) => {
    const result = validate(t, [contested('challenged-entry', status), contested('unchallenged-entry', status)], {
      ...challenge('cc-challenged-entry', 'challenged-entry'),
    });
    assert.equal(result.status, 1, result.output);
    assertRule(result.output, 'events/2026/02-unchallenged-entry.md', 'contested entry has a challenge', `contestation.status is "${status}" and no challenge`);
    assertNotListed(result.output, '01-challenged-entry.md');
  });
}

const unmarkedCases = [
  ['no contestation', (event: Event) => event],
  ['contestation.status uncontested', (event: Event) => { event.contestation = { status: 'uncontested' }; }],
] as const;
for (const status of ['open', 'under_review']) {
  for (const [name, change] of unmarkedCases) {
    test(`challenge target is marked rule rejects an ${status} challenge whose entry has ${name}`, (t) => {
      const unmarked = complete('unmarked-entry');
      change(unmarked);
      const dismissedTarget = complete('dismissed-entry');
      change(dismissedTarget);
      const result = validate(t, [contested('marked-entry'), unmarked, dismissedTarget], {
        ...challenge('cc-marked-entry', 'marked-entry', status),
        ...challenge('cc-unmarked-entry', 'unmarked-entry', status),
        ...challenge('cc-dismissed-entry', 'dismissed-entry', 'dismissed', { resolution_note_id: 'rn-dismissed-entry' }),
        ...resolution('rn-dismissed-entry', 'cc-dismissed-entry'),
      });
      assert.equal(result.status, 1, result.output);
      assertRule(result.output, 'challenges/cc-unmarked-entry.md', 'challenge target is marked', 'target_claim_id "unmarked-entry" names an entry whose contestation.status is');
      assert.equal(ruleCount(result.output, 'challenge target is marked'), 1, result.output);
    });
  }
}

test('challenge target is marked rule places no requirement on the entry of a sustained challenge', (t) => {
  const ids = ['contested', 'superseded', 'uncontested'];
  const records = Object.assign({}, ...ids.map((id) => ({
    ...challenge(`cc-${id}-entry`, `${id}-entry`, 'sustained', { resolution_note_id: `rn-${id}-entry` }),
    ...resolution(`rn-${id}-entry`, `cc-${id}-entry`),
  })));
  const result = validate(t, ids.map((id) => contested(`${id}-entry`, id)), records);
  assert.equal(result.status, 0, result.output);
});

test('challenge resolution link rule rejects a missing resolution and one that points elsewhere', (t) => {
  const events = ['linked', 'missing-note', 'crossed-note'].map((id) => contested(id));
  const result = validate(t, events, {
    ...challenge('cc-linked', 'linked', 'sustained', { resolution_note_id: 'rn-linked' }),
    ...resolution('rn-linked', 'cc-linked'),
    ...challenge('cc-missing-note', 'missing-note', 'open', { resolution_note_id: 'rn-absent' }),
    ...challenge('cc-crossed-note', 'crossed-note', 'open', { resolution_note_id: 'rn-linked' }),
  });
  assert.equal(result.status, 1, result.output);
  assertRule(result.output, 'challenges/cc-missing-note.md', 'challenge resolution link', 'resolution_note_id "rn-absent" names no resolution');
  assertRule(result.output, 'challenges/cc-crossed-note.md', 'challenge resolution link', 'resolution_note_id "rn-linked" names a resolution whose case_id is "cc-linked"');
  assert.equal(ruleCount(result.output, 'challenge resolution link'), 2, result.output);
});

for (const status of ['sustained', 'dismissed', 'partially_sustained']) {
  test(`decided challenge has a resolution rule rejects status ${status} with no resolution`, (t) => {
    const result = validate(t, [contested('resolved-case'), contested('unresolved-case')], {
      ...challenge('cc-resolved-case', 'resolved-case', status, { resolution_note_id: 'rn-resolved-case' }),
      ...resolution('rn-resolved-case', 'cc-resolved-case'),
      ...challenge('cc-unresolved-case', 'unresolved-case', status),
    });
    assert.equal(result.status, 1, result.output);
    assertRule(result.output, 'challenges/cc-unresolved-case.md', 'decided challenge has a resolution', `status is "${status}" and no resolution`);
    assert.equal(ruleCount(result.output, 'decided challenge has a resolution'), 1, result.output);
  });
}

test('resolution revision exists rule rejects an unknown summary_revision_id', (t) => {
  const action = (id: string) => [{ type: 'summary_revision_created', claim_id: 'entry', summary_revision_id: id }];
  const result = validate(t, [contested('entry')], {
    ...challenge('cc-entry', 'entry'),
    ...revision('sr-entry', 'entry', 'cc-entry'),
    ...resolution('rn-known-revision', 'cc-entry', action('sr-entry')),
    ...resolution('rn-unknown-revision', 'cc-entry', [{ type: 'no_action' }, ...action('sr-absent')]),
  });
  assert.equal(result.status, 1, result.output);
  assertRule(result.output, 'resolutions/rn-unknown-revision.md', 'resolution revision exists', 'actions[1].summary_revision_id "sr-absent" names no revision');
  assert.equal(ruleCount(result.output, 'resolution revision exists'), 1, result.output);
});

test('revision case exists rule rejects an unknown triggered_by_case_id', (t) => {
  const result = validate(t, [contested('entry')], {
    ...challenge('cc-entry', 'entry'),
    ...revision('sr-known-case', 'entry', 'cc-entry'),
    ...revision('sr-no-case', 'entry', null),
    ...revision('sr-unknown-case', 'entry', 'cc-absent'),
  });
  assert.equal(result.status, 1, result.output);
  assertRule(result.output, 'revisions/sr-unknown-case.md', 'revision case exists', 'triggered_by_case_id "cc-absent" names no challenge');
  assert.equal(ruleCount(result.output, 'revision case exists'), 1, result.output);
});

const namedRecords: Array<[string, string, (id: string) => string]> = [
  ['threads', '.md', (id) => frontmatter({ id, title: 'Thread', status: 'active', started: '2026-11-10', core_question: 'Why did this happen?', curator: 'example-curator', events: ['entry'] })],
  ['controversies', '.md', (id) => frontmatter({ id, thread: 'example-thread', status: 'active', polarity: 'binary', positions: [{ claim: 'Yes.' }, { claim: 'No.' }] })],
  ['actors', '.yml', (id) => dump({ id, name: 'Example', type: 'organization' })],
  ['challenges', '.md', (id) => challenge(id, 'entry')[`challenges/${id}.md`]],
  ['revisions', '.md', (id) => revision(id, 'entry', null)[`revisions/${id}.md`]],
  ['resolutions', '.md', (id) => resolution(id, 'cc-entry')[`resolutions/${id}.md`]],
];
for (const [folder, ext, make] of namedRecords) {
  test(`file named after id rule applies to ${folder}`, (t) => {
    const records: Record<string, string> = {
      ...challenge('cc-entry', 'entry'),
      ...(folder === 'controversies' ? { 'threads/example-thread.md': namedRecords[0][2]('example-thread') } : {}),
      [`${folder}/matching-name${ext}`]: make('matching-name'),
      [`${folder}/other-name${ext}`]: make('renamed-record'),
    };
    const result = validate(t, [contested('entry')], records);
    assert.equal(result.status, 1, result.output);
    assertRule(result.output, `${folder}/other-name${ext}`, 'file named after id', `id "renamed-record" does not match the filename "other-name${ext}"`);
    assert.equal(ruleCount(result.output, 'file named after id'), 1, result.output);
    assertNotListed(result.output, `matching-name${ext}`);
  });
}

// --------------- Warnings ---------------

function assertWarned(output: string, file: string, rule: string, problem: string) {
  const [, warnings = ''] = output.split(/warning\(s\), which do not fail validation:\n/);
  assertRule(warnings, file, rule, problem);
}

test('tag format rule warns about tags that are not lower-case kebab-case without failing', (t) => {
  const passing = complete('kebab-tags');
  passing.tags = ['eu-ai-act', 'gpt-4o', 'asl3'];
  const failing = complete('mixed-case-tags');
  failing.tags = ['eu-ai-act', 'AI-Act', 'cryo EM'];
  const result = validate(t, [passing, failing]);
  assert.equal(result.status, 0, result.output);
  assertWarned(result.output, 'events/2026/02-mixed-case-tags.md', 'tag format', 'tags[1] "AI-Act" is not lower-case kebab-case');
  assert.match(result.output, /tags\[1\] "AI-Act" is not lower-case kebab-case\. Use "ai-act"\./);
  assertWarned(result.output, 'events/2026/02-mixed-case-tags.md', 'tag format', 'tags[2] "cryo EM" is not lower-case kebab-case');
  assert.match(result.output, /tags\[2\] "cryo EM" is not lower-case kebab-case\. Use "cryo-em"\./);
  assert.equal(ruleCount(result.output, 'tag format'), 2, result.output);
});

test('thread start rule warns when a listed or self-assigned entry predates started', (t) => {
  const early = complete('early-entry');
  early.date = '2026-11-01';
  const selfAssigned = complete('self-assigned-entry');
  selfAssigned.date = '2026-11-02';
  selfAssigned.threads = ['assigned-thread'];
  const thread = (id: string, started: string, events: string[]) =>
    ({ [`threads/${id}.md`]: frontmatter({ id, title: 'Thread', status: 'active', started, core_question: 'Why did this happen?', curator: 'example-curator', events }) });
  const result = validate(t, [early, selfAssigned, complete('complete-event')], {
    ...thread('on-time-thread', '2026-11-01', ['early-entry']),
    ...thread('listed-thread', '2026-11-05', ['complete-event', 'early-entry']),
    ...thread('assigned-thread', '2026-11-05', ['complete-event']),
  });
  assert.equal(result.status, 0, result.output);
  assertWarned(result.output, 'threads/listed-thread.md', 'thread start', 'started (2026-11-05) is later than its earliest entry, "early-entry" (2026-11-01)');
  assertWarned(result.output, 'threads/assigned-thread.md', 'thread start', 'started (2026-11-05) is later than its earliest entry, "self-assigned-entry" (2026-11-02)');
  assert.equal(ruleCount(result.output, 'thread start'), 2, result.output);
});

test('in GitHub Actions warnings follow errors as annotations and a summary, and only errors fail', (t) => {
  const tagged = complete('mixed-case-tags');
  tagged.tags = ['GDPR'];
  const self = complete('names-itself');
  self.related = ['names-itself'];
  for (const [events, status] of [[[tagged], 0], [[tagged, self], 1]] as const) {
    const summary = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'ledger-summary-')), 'summary.md');
    t.after(() => fs.rmSync(path.dirname(summary), { recursive: true, force: true }));
    const result = validate(t, [...events], {}, { GITHUB_ACTIONS: 'true', GITHUB_STEP_SUMMARY: summary });
    assert.equal(result.status, status, result.output);
    const warning = result.output.indexOf('::warning file=content/events/2026/01-mixed-case-tags.md,line=1::Consistency rule "tag format"');
    assert.ok(warning >= 0, result.output);
    const written = fs.readFileSync(summary, 'utf8');
    assert.match(written, /### Content validation warnings\n\n1 warning\(s\):\n\n- `content\/events\/2026\/01-mixed-case-tags.md`: Consistency rule "tag format"/);
    if (status === 1) {
      const error = result.output.indexOf('::error file=content/events/2026/02-names-itself.md,line=1::Consistency rule "no self reference"');
      assert.ok(error >= 0 && error < warning, result.output);
      assert.ok(written.indexOf('### Content validation failed') < written.indexOf('### Content validation warnings'), written);
    } else {
      assert.ok(!result.output.includes('::error'), result.output);
      assert.ok(!written.includes('### Content validation failed'), written);
    }
  }
});

test('a corrected entry needs a resolution of its challenge that creates a summary revision', (t) => {
  const decided = (target: string) => challenge(`cc-${target}`, target, 'sustained', { resolution_note_id: `rn-${target}` });
  const result = validate(t, [contested('revised', 'corrected'), contested('not-revised', 'corrected'), contested('unresolved-challenge', 'corrected'), contested('unchallenged', 'corrected')], {
    ...decided('revised'),
    ...revision('sr-revised', 'revised', 'cc-revised'),
    ...resolution('rn-revised', 'cc-revised', [{ type: 'summary_revision_created', claim_id: 'revised', summary_revision_id: 'sr-revised' }]),
    ...decided('not-revised'),
    ...resolution('rn-not-revised', 'cc-not-revised'),
    ...challenge('cc-unresolved-challenge', 'unresolved-challenge'),
  });
  assert.equal(result.status, 1, result.output);
  for (const file of ['02-not-revised.md', '03-unresolved-challenge.md', '04-unchallenged.md']) {
    assert.match(result.output, new RegExp(`events/2026/${file}\\n\\s+→ contestation.status is "corrected"`), result.output);
  }
  assertNotListed(result.output, '01-revised.md');
  for (const id of ['cc-revised', 'rn-revised', 'sr-revised', 'cc-not-revised', 'rn-not-revised']) assertNotListed(result.output, id);
});

const undatedCases: Array<[string, string, Record<string, string>]> = [
  ['challenges/cc-undated.md', 'opened_at', challenge('cc-undated', 'undated-target')],
  ['revisions/sr-undated.md', 'created_at', revision('sr-undated', 'undated-target', null)],
  ['resolutions/rn-undated.md', 'issued_at', resolution('rn-undated', 'cc-undated-target')],
];
for (const [file, field, records] of undatedCases) {
  test(`schema rejects a record in ${file.split('/')[0]} without ${field}`, (t) => {
    const raw = records[file];
    const undated = raw.replace(new RegExp(`^${field}: .*\\n`, 'm'), '');
    assert.notEqual(undated, raw);
    const result = validate(t, [contested('undated-target')], {
      ...challenge('cc-undated-target', 'undated-target'),
      [file]: undated,
    });
    assert.equal(result.status, 1, result.output);
    assert.match(result.output, new RegExp(`${escapeRegExp(file)}\\n\\s+→ Schema: / must have required property '${field}'`), result.output);
    assert.equal(result.output.split('must have required property').length - 1, 1, result.output);
  });
}
