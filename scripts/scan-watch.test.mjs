import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ISSUE_LABEL, ISSUE_TITLE, run } from './scan-watch.mjs';

const REPO = 'pedro-bright/the-ledger';

// GitHub REST responses recorded from this repository on 2026-11-15, trimmed to the fields
// the script reads. Tests add a scan pull request or a tracking issue where they need one.
const RECORDED = {
  openPulls: [
    { number: 291, created_at: '2026-11-15T19:09:28Z', head: { repo: { full_name: REPO }, ref: 'fm/rm-ledger-search-filters-and-entry-points', sha: 'c2293e6b15cb58e744756b49986485b57276e38a' } },
    { number: 279, created_at: '2026-11-15T07:47:23Z', head: { repo: { full_name: REPO }, ref: 'dependabot/npm_and_yarn/npm_and_yarn-2720852721', sha: '4123792c7413f5b31aa992109a5408402a38b41a' } },
    { number: 247, created_at: '2026-11-15T05:23:42Z', head: { repo: { full_name: REPO }, ref: 'dependabot/npm_and_yarn/typescript-6.0.3', sha: 'b0d312a3c964140899f2adb0bd8f70b71bb41e13' } },
  ],
  // Sorted by update time, as requested: #221 was updated after #185 merged.
  mergedSearch: {
    total_count: 146,
    items: [
      { number: 286, title: 'Add event: australia-frontier-ai-safety-regulator-rapid-review', updated_at: '2026-11-15T14:12:24Z', pull_request: { merged_at: '2026-11-15T14:12:21Z' } },
      { number: 221, title: 'Add event: google-deepmind-alphaproof-code-signal-verification', updated_at: '2026-11-14T15:46:01Z', pull_request: { merged_at: '2026-11-13T14:14:12Z' } },
      { number: 185, title: 'Add event: metr-anthropic-ai-rd-acceleration-assessment', updated_at: '2026-11-14T06:38:17Z', pull_request: { merged_at: '2026-11-14T06:38:15Z' } },
      { number: 184, title: 'Add event: openai-national-community-compact-data-centers', updated_at: '2026-11-14T06:38:12Z', pull_request: { merged_at: '2026-11-14T06:38:10Z' } },
    ],
  },
  maintenanceIssues: [
    { number: 162, title: 'Source link problems: 32 broken, 6 suspicious (2026-11-15)', body: 'Found 32 broken link(s)', labels: [{ name: 'broken-links' }, { name: 'maintenance' }] },
  ],
  // Check runs of #286's head commit, all passed.
  checkRuns: {
    total_count: 5,
    check_runs: [
      { name: 'Playwright (2/2)', status: 'completed', conclusion: 'success' },
      { name: 'Playwright (1/2)', status: 'completed', conclusion: 'success' },
      { name: 'Vercel Preview Comments', status: 'completed', conclusion: 'success' },
      { name: 'Schema & Cross-Reference Validation', status: 'completed', conclusion: 'success' },
      { name: 'Build and Parity', status: 'completed', conclusion: 'success' },
    ],
  },
};

// A scan pull request opened on 14 November whose first browser test shard failed.
const STUCK_SCAN_PULL = { number: 287, created_at: '2026-11-14T14:06:43Z', head: { repo: { full_name: REPO }, ref: 'ledger/auto-scan/2026-11-14', sha: 'a'.repeat(40) } };
const STUCK_CHECK_RUNS = {
  total_count: 2,
  check_runs: [
    { name: 'Playwright (1/2)', status: 'completed', conclusion: 'failure' },
    { name: 'Build and Parity', status: 'completed', conclusion: 'success' },
  ],
};
// A fork's pull request whose branch has the scan's name, open for two days.
const FORK_PULL = { number: 290, created_at: '2026-11-13T12:00:00Z', head: { repo: { full_name: 'someone/the-ledger' }, ref: 'ledger/auto-scan/2026-11-13', sha: 'c'.repeat(40) } };
// Today's scan pull request, still within its first day.
const FRESH_SCAN_PULL = { number: 292, created_at: '2026-11-15T14:06:00Z', head: { repo: { full_name: REPO }, ref: 'ledger/auto-scan/2026-11-15-b', sha: 'b'.repeat(40) } };

const SAME_DAY = new Date('2026-11-15T16:00:00Z');
const EIGHT_DAYS_LATER = new Date('2026-11-23T16:00:00Z');

function trackingIssue(body) {
  return { number: 300, title: ISSUE_TITLE, body, labels: [{ name: ISSUE_LABEL }] };
}

// Runs the script against canned GET responses and records every write it sends.
async function watch({ openPulls = [], mergedSearch = RECORDED.mergedSearch, issues = [], checkRuns = {}, now, dryRun = false }) {
  const responses = {
    [`/repos/${REPO}/pulls?state=open&per_page=100`]: [...RECORDED.openPulls, ...openPulls],
    [`/search/issues?q=${encodeURIComponent(`repo:${REPO} is:pr is:merged head:ledger/auto-scan`)}&sort=updated&order=desc&per_page=100`]: mergedSearch,
    [`/repos/${REPO}/issues?state=open&labels=maintenance&per_page=100`]: [...RECORDED.maintenanceIssues, ...issues],
  };
  for (const [sha, runs] of Object.entries(checkRuns)) {
    responses[`/repos/${REPO}/commits/${sha}/check-runs?per_page=100`] = runs;
  }
  const writes = [];
  const lines = [];
  const request = async (method, path, body) => {
    if (method !== 'GET') {
      writes.push({ method, path, body });
      return {};
    }
    assert.ok(path in responses, `unexpected request: GET ${path}`);
    return responses[path];
  };
  await run({ request, repo: REPO, now, dryRun, log: (line) => lines.push(line) });
  return { writes, output: lines.join('\n') };
}

test('does nothing when the scan merged recently and no scan pull request is stuck', async () => {
  const { writes, output } = await watch({ now: SAME_DAY });
  assert.deepEqual(writes, []);
  assert.match(output, /Nothing to do\./);
});

test('ignores a scan pull request opened less than 24 hours ago', async () => {
  const { writes } = await watch({
    openPulls: [FRESH_SCAN_PULL],
    checkRuns: { [FRESH_SCAN_PULL.head.sha]: RECORDED.checkRuns },
    now: SAME_DAY,
  });
  assert.deepEqual(writes, []);
});

test('ignores a pull request from a fork whose branch has the scan prefix', async () => {
  const { writes, output } = await watch({ openPulls: [FORK_PULL], now: SAME_DAY });
  assert.deepEqual(writes, []);
  assert.match(output, /Open scan pull requests: none\./);
});

test('opens an issue for a scan pull request open more than 24 hours, with its failing checks', async () => {
  const { writes } = await watch({
    openPulls: [STUCK_SCAN_PULL, FRESH_SCAN_PULL],
    checkRuns: { [STUCK_SCAN_PULL.head.sha]: STUCK_CHECK_RUNS, [FRESH_SCAN_PULL.head.sha]: RECORDED.checkRuns },
    now: SAME_DAY,
  });
  assert.equal(writes.length, 1);
  const [{ method, path, body }] = writes;
  assert.equal(method, 'POST');
  assert.equal(path, `/repos/${REPO}/issues`);
  assert.equal(body.title, ISSUE_TITLE);
  assert.deepEqual(body.labels, [ISSUE_LABEL]);
  assert.match(body.body, /^- #287, opened on 2026-11-14\. Failing checks: Playwright \(1\/2\)\.$/m);
  assert.doesNotMatch(body.body, /#292/);
  assert.doesNotMatch(body.body, /in the last 7 days/);
  assert.match(body.body, /#286, merged on 2026-11-15/);
});

test('opens an issue when no scan pull request has merged for 8 days', async () => {
  const { writes } = await watch({ now: EIGHT_DAYS_LATER });
  assert.equal(writes.length, 1);
  const [{ method, body }] = writes;
  assert.equal(method, 'POST');
  assert.equal(body.title, ISSUE_TITLE);
  assert.match(body.body, /No scan pull request has merged in the last 7 days\./);
  assert.match(body.body, /#286, merged on 2026-11-15/);
  // The older dependabot pull requests are not scan pull requests.
  assert.doesNotMatch(body.body, /#247|#279|#291/);
});

test('reports the newest merge even when search ranks another pull request above it', async () => {
  const mergedSearch = { ...RECORDED.mergedSearch, items: RECORDED.mergedSearch.items.slice(1) };
  const { writes } = await watch({ mergedSearch, now: new Date('2026-11-21T16:00:00Z') });
  assert.equal(writes.length, 1);
  assert.match(writes[0].body.body, /#185, merged on 2026-11-14/);
});

test('updates the open issue instead of opening a second one', async () => {
  const { writes } = await watch({ issues: [trackingIssue('An older report.')], now: EIGHT_DAYS_LATER });
  assert.deepEqual(
    writes.map(({ method, path }) => `${method} ${path}`),
    [`PATCH /repos/${REPO}/issues/300`],
  );
  assert.match(writes[0].body.body, /No scan pull request has merged in the last 7 days\./);
  assert.equal(writes[0].body.state, undefined);
});

test('leaves the open issue alone when its report has not changed', async () => {
  const first = await watch({ now: EIGHT_DAYS_LATER });
  const { writes } = await watch({ issues: [trackingIssue(first.writes[0].body.body)], now: EIGHT_DAYS_LATER });
  assert.deepEqual(writes, []);
});

test('comments on and closes the open issue once the scan recovers', async () => {
  const { writes } = await watch({ issues: [trackingIssue('An older report.')], now: SAME_DAY });
  assert.deepEqual(
    writes.map(({ method, path }) => `${method} ${path}`),
    [`POST /repos/${REPO}/issues/300/comments`, `PATCH /repos/${REPO}/issues/300`],
  );
  assert.match(writes[0].body.body, /#286, merged on 2026-11-15/);
  assert.equal(writes[1].body.state, 'closed');
});

test('a dry run reports the action and writes nothing', async () => {
  const { writes, output } = await watch({ now: EIGHT_DAYS_LATER, dryRun: true });
  assert.deepEqual(writes, []);
  assert.match(output, /Dry run, not applied: Create issue "Daily scan needs attention"/);
});
