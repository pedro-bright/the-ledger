import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildCorrectionRecords } from '../site/src/lib/corrections.ts';

const events = [{ id: 'some-event', slug: 'some-event', title: 'Some event' }];

test('records that target a synthesis render unlinked under the synthesis id', () => {
  const records = buildCorrectionRecords({
    events,
    revisions: [
      { id: 'rev-synth', target_summary_id: 'some-synthesis', reason: 'Tightened wording.', created_at: '2026-03-01' },
      { id: 'rev-event', target_summary_id: 'some-event', reason: 'Fixed a date.', created_at: '2026-02-01' },
    ],
    challenges: [
      { id: 'ch-synth', target_claim_id: 'some-synthesis', allegations: ['overstatement'], status: 'sustained', opened_at: '2026-01-15' },
    ],
    resolutions: [
      { id: 'res-synth', case_id: 'ch-synth', disposition: 'upheld', findings: ['Claim overstated.'], actions: [], issued_at: '2026-01-20' },
    ],
  });

  assert.deepEqual(records, [
    {
      kind: 'Summary revision',
      date: '2026-03-01',
      target: { kind: 'synthesis', title: 'some-synthesis' },
      reason: 'Tightened wording.',
    },
    {
      kind: 'Summary revision',
      date: '2026-02-01',
      target: { kind: 'event', title: 'Some event', href: '/events/some-event#revision-history' },
      reason: 'Fixed a date.',
    },
    {
      kind: 'Challenge resolved',
      date: '2026-01-20',
      target: { kind: 'synthesis', title: 'some-synthesis' },
      reason: 'Disposition: upheld. Claim overstated.',
    },
    {
      kind: 'Challenge opened',
      date: '2026-01-15',
      target: { kind: 'synthesis', title: 'some-synthesis' },
      reason: 'Alleges overstatement.',
    },
  ]);
});
