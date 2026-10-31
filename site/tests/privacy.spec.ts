import fs from 'node:fs';
import path from 'node:path';
import { test, expect, type Page } from '@playwright/test';

type SentEvent = { event: string; properties: Record<string, unknown> };

const CANARY = 'private-canary';
const SDK_DIST = path.join(__dirname, '../node_modules/posthog-js/dist');

// Every collection feature the project could switch on remotely is on here, so
// recording, heatmaps, and surveys stay off only if the page's own options win.
const REMOTE_CONFIG = {
  autocapture_opt_out: false,
  capturePerformance: { network_timing: true, web_vitals: true, web_vitals_allowed_metrics: null },
  sessionRecording: { endpoint: '/s/' },
  heatmaps: true,
  surveys: true,
  analytics: { endpoint: '/i/v0/e/' },
  defaultIdentifiedOnly: true,
  hasFeatureFlags: false,
  siteApps: [],
};

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
  await page.route(/\/flags\//, route =>
    route.fulfill({ json: { flags: {}, featureFlags: {}, featureFlagPayloads: {} } }),
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
    utm_source: 'newsletter',
    gclid: 'click-id',
    $process_person_profile: false,
  });
  expect(Object.keys(landingView).filter(key => key.startsWith('$session_entry_')).sort()).toEqual([
    '$session_entry_host',
    '$session_entry_pathname',
    '$session_entry_referrer',
    '$session_entry_referring_domain',
    '$session_entry_search_engine',
    '$session_entry_url',
  ]);
  expect(named('$pageview').at(-1)?.properties.$referrer).toBe(`${origin}/explore`);

  const webVitals = Object.keys(named('$web_vitals')[0].properties);
  expect(webVitals.some(key => /^\$web_vitals_.+_value$/.test(key))).toBe(true);
  expect(webVitals.filter(key => /^\$web_vitals_.+_event$/.test(key))).toEqual([]);

  const autocaptured = JSON.stringify(named('$autocapture'));
  expect(autocaptured.toLowerCase()).toContain('research');
  expect(autocaptured).not.toContain('explorer-search');
  expect(autocaptured).not.toContain('search-q');

  expect(scripts.filter(name => /recorder|survey/i.test(name))).toEqual([]);
  expect(posts.filter(pathname => !/^\/((i\/v0\/)?e|flags)\/?$/.test(pathname))).toEqual([]);
  expect(events.filter(event => event.event === '$snapshot' || event.event === '$$heatmap')).toEqual([]);

  const identifiers = named('$pageview').map(event => event.properties.distinct_id);
  expect(new Set(identifiers).size).toBe(identifiers.length);
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) })))
    .toEqual({ local: [], session: [] });
});

test('footer links to the privacy note', async ({ page }) => {
  await page.goto('/about');
  await page.getByRole('navigation', { name: 'Secondary' }).getByRole('link', { name: 'Privacy' }).click();
  await expect(page).toHaveURL(/\/privacy\/?$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy' })).toBeVisible();
  await expect(page.locator('main')).toContainText('PostHog receives your IP address with each request');
  await expect(page.locator('main')).toContainText('cookies');
});
