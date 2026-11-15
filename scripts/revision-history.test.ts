import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildRevisionHistory } from '../site/src/lib/revision-history.ts';
import type { ChallengeCase, ResolutionNote, SummaryRevision } from '../site/src/lib/content.ts';

const challenge = (overrides: Partial<ChallengeCase>): ChallengeCase => ({
  id: 'ch-some-event',
  target_claim_id: 'some-event',
  allegations: ['timeline_error'],
  status: 'sustained',
  opened_at: '2026-01-10',
  ...overrides,
});

const revision = (overrides: Partial<SummaryRevision>): SummaryRevision => ({
  id: 'rev-some-event',
  target_summary_id: 'some-event',
  reason: 'Fixed a date.',
  created_at: '2026-01-10',
  ...overrides,
});

const resolution = (overrides: Partial<ResolutionNote>): ResolutionNote => ({
  id: 'res-some-event',
  case_id: 'ch-some-event',
  disposition: 'sustained',
  findings: ['The date was wrong.'],
  actions: [],
  issued_at: '2026-02-01',
  ...overrides,
});

const ids = (entries: ReturnType<typeof buildRevisionHistory>) =>
  entries.map((e) => `${e.kind} ${e.date} ${e.kind === 'challenge' ? e.challenge.id : e.kind === 'revision' ? e.revision.id : e.resolution.id}`);

test('a resolved challenge lists its resolution as its own entry, oldest first', () => {
  const entries = buildRevisionHistory('some-event', {
    challenges: [challenge({})],
    revisions: [
      revision({ id: 'rev-later', created_at: '2026-02-01' }),
      revision({ id: 'rev-first', created_at: '2026-01-10' }),
    ],
    resolutions: [resolution({})],
  });

  assert.deepEqual(ids(entries), [
    'challenge 2026-01-10 ch-some-event',
    'revision 2026-01-10 rev-first',
    'revision 2026-02-01 rev-later',
    'resolution 2026-02-01 res-some-event',
  ]);
});

test('on one day a challenge is opened, the summary revised, then the challenge resolved', () => {
  const entries = buildRevisionHistory('some-event', {
    resolutions: [resolution({ issued_at: '2026-03-03' })],
    revisions: [revision({ created_at: '2026-03-03' })],
    challenges: [challenge({ opened_at: '2026-03-03' })],
  });

  assert.deepEqual(entries.map((e) => e.kind), ['challenge', 'revision', 'resolution']);
});

test('an open challenge without a resolution lists the challenge and revisions only', () => {
  const entries = buildRevisionHistory('some-event', {
    challenges: [challenge({ status: 'open', opened_at: '2026-01-10' })],
    revisions: [
      revision({ id: 'rev-later', created_at: '2026-01-20' }),
      revision({ id: 'rev-same-day', created_at: '2026-01-10' }),
      revision({ id: 'rev-earlier', created_at: '2026-01-05' }),
    ],
    resolutions: [],
  });

  assert.deepEqual(ids(entries), [
    'revision 2026-01-05 rev-earlier',
    'challenge 2026-01-10 ch-some-event',
    'revision 2026-01-10 rev-same-day',
    'revision 2026-01-20 rev-later',
  ]);
});

test('records about other events are left out', () => {
  const entries = buildRevisionHistory('some-event', {
    challenges: [challenge({ id: 'ch-other', target_claim_id: 'other-event' })],
    revisions: [revision({ id: 'rev-other', target_summary_id: 'other-event' })],
    resolutions: [resolution({ id: 'res-other', case_id: 'ch-other' })],
  });

  assert.deepEqual(entries, []);
});
