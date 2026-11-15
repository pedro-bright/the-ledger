// Watches the daily scan through its pull requests. It keeps one open maintenance issue
// while a scan pull request has been open for more than a day or no scan pull request has
// merged for a week, and closes that issue once both conditions clear.
//
// Usage: node scripts/scan-watch.mjs [--dry-run]
// Reads GITHUB_TOKEN when set, and GITHUB_REPOSITORY (default pedro-bright/the-ledger).
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const BRANCH_PREFIX = 'ledger/auto-scan/';
export const ISSUE_TITLE = 'Daily scan needs attention';
export const ISSUE_LABEL = 'maintenance';
export const OPEN_LIMIT_HOURS = 24;
export const MERGE_LIMIT_DAYS = 7;

const HOUR_MS = 60 * 60 * 1000;
// Check run conclusions that block a pull request from merging.
const FAILING = new Set(['failure', 'timed_out', 'cancelled', 'action_required', 'startup_failure']);

const day = (timestamp) => timestamp.slice(0, 10);

function lastMergedLine(lastMerged) {
  return lastMerged
    ? `The last merged scan pull request is #${lastMerged.number}, merged on ${day(lastMerged.mergedAt)}.`
    : 'No merged scan pull request was found.';
}

/**
 * Decides what to do with the tracking issue. Pure: the same observations and time give
 * the same action.
 * @param {{
 *   openPulls: { number: number, createdAt: string, failingChecks: string[] }[],
 *   lastMerged: { number: number, mergedAt: string } | null,
 *   issue: { number: number, body: string } | null,
 * }} observed
 * @param {Date} now
 */
export function decide({ openPulls, lastMerged, issue }, now) {
  const stale = openPulls
    .filter((pull) => now.getTime() - Date.parse(pull.createdAt) > OPEN_LIMIT_HOURS * HOUR_MS)
    .sort((a, b) => a.number - b.number);
  const overdue = !lastMerged || now.getTime() - Date.parse(lastMerged.mergedAt) > MERGE_LIMIT_DAYS * 24 * HOUR_MS;

  if (stale.length === 0 && !overdue) {
    if (!issue) return { type: 'none' };
    return {
      type: 'close',
      number: issue.number,
      comment: [
        `No scan pull request has been open for more than ${OPEN_LIMIT_HOURS} hours, and a scan pull request merged within the last ${MERGE_LIMIT_DAYS} days.`,
        lastMergedLine(lastMerged),
        'Closing this issue.',
      ].join(' '),
    };
  }

  const lines = [];
  if (stale.length > 0) {
    lines.push(`Scan pull requests open for more than ${OPEN_LIMIT_HOURS} hours:`, '');
    for (const pull of stale) {
      const checks = pull.failingChecks.length > 0 ? pull.failingChecks.join(', ') : 'none';
      lines.push(`- #${pull.number}, opened on ${day(pull.createdAt)}. Failing checks: ${checks}.`);
    }
    lines.push('');
  }
  if (overdue) lines.push(`No scan pull request has merged in the last ${MERGE_LIMIT_DAYS} days.`);
  lines.push(lastMergedLine(lastMerged), '');
  lines.push('The scan watch workflow updates this issue daily and closes it when both conditions clear.');
  const body = lines.join('\n');

  if (!issue) return { type: 'create', title: ISSUE_TITLE, body };
  if (issue.body === body) return { type: 'none', number: issue.number };
  return { type: 'update', number: issue.number, body };
}

/**
 * Returns a GitHub REST request function: request(method, path, body?) resolves to the
 * parsed JSON response.
 */
export function githubRequest(token) {
  return async (method, apiPath, body) => {
    const response = await fetch(`https://api.github.com${apiPath}`, {
      method,
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'the-ledger-scan-watch',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw new Error(`GitHub ${method} ${apiPath} failed with ${response.status}: ${await response.text()}`);
    }
    return response.json();
  };
}

/** Reads the scan pull requests and the tracking issue. */
export async function observe(request, repo) {
  const mergedQuery = `repo:${repo} is:pr is:merged head:${BRANCH_PREFIX.replace(/\/$/, '')}`;
  const [pulls, merged, issues] = await Promise.all([
    request('GET', `/repos/${repo}/pulls?state=open&per_page=100`),
    // A pull request's update time is never before its merge time, so sorting by update
    // time keeps the newest merge on the first page.
    request('GET', `/search/issues?q=${encodeURIComponent(mergedQuery)}&sort=updated&order=desc&per_page=100`),
    request('GET', `/repos/${repo}/issues?state=open&labels=${ISSUE_LABEL}&per_page=100`),
  ]);

  const openPulls = await Promise.all(
    pulls
      // A fork can name a branch like the scan's, so only this repository's branches count.
      .filter((pull) => pull.head.repo?.full_name === repo && pull.head.ref.startsWith(BRANCH_PREFIX))
      .map(async (pull) => {
        const { check_runs: runs } = await request('GET', `/repos/${repo}/commits/${pull.head.sha}/check-runs?per_page=100`);
        return {
          number: pull.number,
          createdAt: pull.created_at,
          failingChecks: runs.filter((run) => FAILING.has(run.conclusion)).map((run) => run.name).sort(),
        };
      }),
  );

  const lastMerged =
    merged.items
      .map((item) => ({ number: item.number, mergedAt: item.pull_request.merged_at }))
      .sort((a, b) => b.mergedAt.localeCompare(a.mergedAt))[0] ?? null;

  const issue = issues.find((item) => item.title === ISSUE_TITLE && !item.pull_request);
  return { openPulls, lastMerged, issue: issue ? { number: issue.number, body: issue.body ?? '' } : null };
}

function describe(action) {
  switch (action.type) {
    case 'none':
      return action.number ? `Issue #${action.number} is already up to date.` : 'Nothing to do.';
    case 'create':
      return `Create issue "${action.title}" with this body:\n\n${action.body}`;
    case 'update':
      return `Update issue #${action.number} with this body:\n\n${action.body}`;
    case 'close':
      return `Comment on issue #${action.number} and close it:\n\n${action.comment}`;
  }
}

/** Observes, decides and, unless dryRun is set, applies the action. Returns the action. */
export async function run({ request, repo, now, dryRun, log }) {
  const observed = await observe(request, repo);
  const open = observed.openPulls.map((pull) => `#${pull.number} (opened ${pull.createdAt})`).join(', ') || 'none';
  log(`Open scan pull requests: ${open}.`);
  log(lastMergedLine(observed.lastMerged));
  log(`Open "${ISSUE_TITLE}" issue: ${observed.issue ? `#${observed.issue.number}` : 'none'}.`);

  const action = decide(observed, now);
  log(`${dryRun ? 'Dry run, not applied: ' : ''}${describe(action)}`);
  if (dryRun) return action;

  const issues = `/repos/${repo}/issues`;
  if (action.type === 'create') {
    await request('POST', issues, { title: action.title, body: action.body, labels: [ISSUE_LABEL] });
  } else if (action.type === 'update') {
    await request('PATCH', `${issues}/${action.number}`, { body: action.body });
  } else if (action.type === 'close') {
    await request('POST', `${issues}/${action.number}/comments`, { body: action.comment });
    await request('PATCH', `${issues}/${action.number}`, { state: 'closed', state_reason: 'completed' });
  }
  return action;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await run({
    request: githubRequest(process.env.GITHUB_TOKEN),
    repo: process.env.GITHUB_REPOSITORY || 'pedro-bright/the-ledger',
    now: new Date(),
    dryRun: process.argv.includes('--dry-run'),
    log: (line) => console.log(line),
  });
}
