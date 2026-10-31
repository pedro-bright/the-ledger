import fs from 'node:fs';
import path from 'node:path';
import { test, expect, type Page } from '@playwright/test';

type SentEvent = { event: string; properties: Record<string, unknown> };

const CANARY = 'private-canary';
const SDK_DIST = path.join(__dirname, '../node_modules/posthog-js/dist');

// Every collection feature the project could switch on remotely is on here, so
// recording, heatmaps, surveys, and flag requests stay off only if the page's own
// options win.
const REMOTE_CONFIG = {
  autocapture_opt_out: false,
  capturePerformance: { network_timing: true, web_vitals: true, web_vitals_allowed_metrics: null },
  captureDeadClicks: true,
  sessionRecording: { endpoint: '/s/' },
  heatmaps: true,
  surveys: true,
  analytics: { endpoint: '/i/v0/e/' },
  defaultIdentifiedOnly: true,
  hasFeatureFlags: true,
  siteApps: [],
};

const nonEventPosts = (posts: string[]) => posts.filter(pathname => !/^\/(i\/v0\/)?e\/?$/.test(pathname));

function decodeEvents(body: string): SentEvent[] {
  const json = body.startsWith('data=')
    ? Buffer.from(decodeURIComponent(body.slice('data='.length)), 'base64').toString()
    : body;
  const parsed = JSON.parse(json);
  const sent = parsed.batch ?? parsed;
  return Array.isArray(sent) ? sent : [sent];
}

// The test build has no project token, so the snippet would not start the SDK.
// This stands in for the snippet's queue: the page's own options reach the real
// SDK bundle, and only the settings needed to observe it from a test are added.
async function loadRealAnalytics(page: Page) {
  const events: SentEvent[] = [];
  const scripts: string[] = [];
  const posts: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST') posts.push(new URL(request.url()).pathname);
  });
  await page.route(/\/static\/[^/]+\.js/, route => {
    const name = path.basename(new URL(route.request().url()).pathname);
    scripts.push(name);
    const file = path.join(SDK_DIST, name);
    return fs.existsSync(file)
      ? route.fulfill({ path: file, contentType: 'text/javascript' })
      : route.fulfill({ status: 404, body: '' });
  });
  await page.route(/\/array\/phc_test\/config/, route =>
    route.request().url().includes('config.js')
      ? route.fulfill({
          contentType: 'text/javascript',
          body: `window._POSTHOG_REMOTE_CONFIG = { phc_test: { config: ${JSON.stringify(REMOTE_CONFIG)}, siteApps: [] } };`,
        })
      : route.fulfill({ json: REMOTE_CONFIG }),
  );
  await page.route(/\/(i\/v0\/)?e\/(\?|$)/, route => {
    events.push(...decodeEvents(route.request().postData() ?? ''));
    return route.fulfill({ json: { status: 1 } });
  });
  await page.addInitScript(() => {
    const queue: unknown[] = [];
    const inits: unknown[] = [];
    Object.assign(window, {
      posthog: Object.assign(queue, {
        __SV: 1,
        _i: inits,
        people: [],
        capture: (...args: unknown[]) => queue.push(['capture', ...args]),
        init(_token: string, options: Record<string, unknown>, name?: string) {
          inits.push(['phc_test', {
            ...options,
            api_host: location.origin,
            disable_compression: true,
            request_batching: false,
            opt_out_useragent_filter: true,
            internal_or_test_user_hostname: null,
          }, name]);
          const script = document.createElement('script');
          script.src = '/static/array.js';
          document.head.appendChild(script);
        },
      }),
    });
  });
  return { events, scripts, posts };
}

test('the real analytics SDK keeps search terms in the browser and honors the privacy note', async ({ page, context }) => {
  test.setTimeout(60_000);
  const { events, scripts, posts } = await loadRealAnalytics(page);
  const named = (name: string) => events.filter(event => event.event === name);

  await page.goto(
    `/explore?q=${CANARY}-landing&utm_source=newsletter&utm_term=${CANARY}-utm&gclid=click-id#${CANARY}-fragment`,
    { referer: `https://www.bing.com/search?q=${CANARY}-engine` },
  );
  const origin = new URL(page.url()).origin;
  const explorerSearch = page.locator('#explorer-search');
  await expect(explorerSearch).toHaveValue(`${CANARY}-landing`);
  await expect.poll(() => named('$web_vitals').length, { timeout: 20_000 }).toBeGreaterThan(0);

  await explorerSearch.click();
  await explorerSearch.fill(`${CANARY}-typed`);
  await expect.poll(() => named('explorer_searched').length).toBeGreaterThan(0);
  await page.locator('span.font-mono', { hasText: `${CANARY}-typed` }).click();
  await page.getByRole('button', { name: `Remove "${CANARY}-typed" filter` }).click();
  await expect(explorerSearch).toHaveValue('');

  await page.getByRole('button', { name: /^research$/i }).first().click();
  await expect.poll(() => named('explorer_filter_applied').length).toBeGreaterThan(0);

  const mastheadSearch = page.locator('#search-q');
  await mastheadSearch.click();
  await mastheadSearch.fill(`${CANARY}-masthead`);
  await mastheadSearch.press('Enter');
  await expect(page).toHaveURL(new RegExp(`q=${CANARY}-masthead`));
  await expect.poll(() => named('$pageview').length).toBeGreaterThan(1);

  await page.getByRole('navigation', { name: 'Secondary' }).getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL(/\/about\/?$/);
  await expect.poll(() => named('$pageview').some(event => event.properties.$pathname === '/about')).toBe(true);

  expect(JSON.stringify(events)).not.toContain(CANARY);

  const landingView = named('$pageview')[0].properties;
  expect(landingView).toMatchObject({
    $current_url: `${origin}/explore`,
    $referrer: 'https://www.bing.com/search',
    $referring_domain: 'www.bing.com',
    $session_entry_url: `${origin}/explore`,
    $session_entry_referrer: 'https://www.bing.com/search',
    $session_entry_search_engine: 'bing',
    $session_entry_utm_source: 'newsletter',
    $session_entry_gclid: 'click-id',
    utm_source: 'newsletter',
    gclid: 'click-id',
    $process_person_profile: false,
  });
  for (const key of ['ph_keyword', 'utm_term', '$session_entry_ph_keyword', '$session_entry_utm_term']) {
    expect(landingView).not.toHaveProperty(key);
  }
  expect(named('$pageview').at(-1)?.properties.$referrer).toBe(`${origin}/explore`);

  const webVitals = Object.keys(named('$web_vitals')[0].properties);
  expect(webVitals.some(key => /^\$web_vitals_.+_value$/.test(key))).toBe(true);
  expect(webVitals.filter(key => /^\$web_vitals_.+_event$/.test(key))).toEqual([]);

  const autocaptured = JSON.stringify(named('$autocapture'));
  expect(autocaptured.toLowerCase()).toContain('research');
  expect(autocaptured).not.toContain('explorer-search');
  expect(autocaptured).not.toContain('search-q');

  expect(scripts.filter(name => /recorder|survey/i.test(name))).toEqual([]);
  expect(nonEventPosts(posts)).toEqual([]);
  expect(events.filter(event => event.event === '$snapshot' || event.event === '$$heatmap')).toEqual([]);

  const identifiers = named('$pageview').map(event => event.properties.distinct_id);
  expect(new Set(identifiers).size).toBe(identifiers.length);
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) })))
    .toEqual({ local: [], session: [] });
});

test('a failed remote config fetch does not send search terms in a feature flag request', async ({ page }) => {
  const { events, posts } = await loadRealAnalytics(page);
  await page.route(/\/array\/phc_test\/config/, route => route.abort());

  await page.goto(`/explore?q=${CANARY}-landing&utm_term=${CANARY}-utm`, {
    referer: `https://www.bing.com/search?q=${CANARY}-engine`,
  });
  await expect(page.locator('#explorer-search')).toHaveValue(`${CANARY}-landing`);
  await page.getByRole('button', { name: /^research$/i }).first().click();
  await expect
    .poll(() => events.map(event => event.event))
    .toEqual(expect.arrayContaining(['$pageview', 'explorer_filter_applied']));

  expect(nonEventPosts(posts)).toEqual([]);
  expect(JSON.stringify(events)).not.toContain(CANARY);
});

test('a dead click on the echoed search term does not send it', async ({ page }) => {
  test.setTimeout(60_000);
  const { events } = await loadRealAnalytics(page);
  const deadClicks = () => events.filter(event => event.event === '$dead_click');
  const clickSentenceUntilReported = async () => {
    const reported = deadClicks().length;
    await expect(async () => {
      await page.locator('p', { hasText: 'Nothing contains' }).click({ position: { x: 6, y: 6 } });
      await expect.poll(() => deadClicks().length, { timeout: 5_000 }).toBeGreaterThan(reported);
    }).toPass({ timeout: 30_000 });
  };

  await page.goto(`/explore?q=${CANARY}-nomatch`);
  // The first report proves the lazily loaded detector is running. The detector
  // reports clicks oldest first, so the echoed term would arrive before the second.
  await clickSentenceUntilReported();
  await page.locator('span.font-mono', { hasText: `${CANARY}-nomatch` }).click();
  await clickSentenceUntilReported();

  expect(JSON.stringify(events)).not.toContain(CANARY);
});

test('footer links to the privacy note', async ({ page }) => {
  await page.goto('/about');
  await page.getByRole('navigation', { name: 'Secondary' }).getByRole('link', { name: 'Privacy' }).click();
  await expect(page).toHaveURL(/\/privacy\/?$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy' })).toBeVisible();
  await expect(page.locator('main')).toContainText('PostHog receives your IP address with each request and is set to discard it instead of storing it with the event.');
  await expect(page.locator('main')).toContainText('cookies');
});
