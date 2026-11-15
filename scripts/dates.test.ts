import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getISOYear } from '../site/src/lib/dates';

test('ISO years keep January 1 in its calendar year regardless of local time', () => {
  assert.equal(getISOYear('2027-01-01'), 2027);
  assert.equal(getISOYear('2026-12-31'), 2026);
});
