import { test, expect } from '@playwright/test';

type AnalyticsEvent = { event: string; properties: Record<string, unknown> };
type AnalyticsOptions = Record<string, unknown> & {
  before_send?: (event: AnalyticsEvent) => AnalyticsEvent | null;
};
type AnalyticsWindow = Window & {
  __analytics: { options: AnalyticsOptions; events: AnalyticsEvent[] };
};

test('analytics options and product events preserve reader privacy', async ({ page, context }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.addInitScript(() => {
    const state: AnalyticsWindow['__analytics'] = { options: {}, events: [] };
    Object.assign(window, {
      __analytics: state,
      posthog: {
        __SV: 1,
        init(_token: string, options: AnalyticsOptions) { state.options = options; },
        capture(event: string, properties: Record<string, unknown> = {}) {
          state.events.push({ event, properties });
        },
      },
    });
  });

  await page.goto('/explore?q=private-initial-canary#private-fragment-canary');
  await expect(page.locator('#explorer-search')).toHaveValue('private-initial-canary');
  const options = await page.evaluate(() => (window as AnalyticsWindow).__analytics.options);
  expect(options).toMatchObject({
    persistence: 'memory',
    disable_persistence: true,
    person_profiles: 'never',
    autocapture: false,
    capture_pageview: true,
    disable_session_recording: true,
    capture_heatmaps: false,
    enable_heatmaps: false,
    capture_dead_clicks: false,
    capture_performance: false,
    capture_exceptions: false,
    disable_surveys: true,
    save_referrer: false,
    save_campaign_params: false,
  });

  // Exercise the actual before_send hook with the SDK's nested attribution shape.
  const sanitized = await page.evaluate(() => {
    const options = (window as AnalyticsWindow).__analytics.options;
    if (!options.before_send) return null;
    return options.before_send({
      event: '$pageview',
      properties: {
        $current_url: location.href,
        $referrer: 'https://example.org/?q=private-referrer-canary',
        $set_once: {
          $initial_current_url: location.href,
          $initial_referrer: 'https://example.org/?q=private-referrer-canary',
          $initial_search_keyword: 'private-referrer-canary',
        },
        $search_keyword: 'private-initial-canary',
        query: 'private-typed-canary',
      },
    });
  });
  expect(sanitized?.event).toBe('$pageview');
  expect(sanitized?.properties.$current_url).toBe(new URL('/explore', page.url()).href);
  expect(sanitized?.properties.$referrer).toBe('https://example.org/');
  expect(JSON.stringify(sanitized)).not.toContain('private-');

  await page.locator('#explorer-search').fill('private-typed-canary');
  await expect.poll(() => page.evaluate(() =>
    (window as AnalyticsWindow).__analytics.events.some(event => event.event === 'explorer_searched'),
  )).toBe(true);
  await page.getByRole('button', { name: /^research$/i }).first().click();
  const events = await page.evaluate(() => (window as AnalyticsWindow).__analytics.events);
  expect(events.some(event => event.event === 'explorer_filter_applied')).toBe(true);
  expect(events.filter(event => event.event === 'explorer_searched').every(event =>
    typeof event.properties.result_count === 'number' && !('query' in event.properties),
  )).toBe(true);
  expect(JSON.stringify(events)).not.toContain('private-');
  expect(requests.some(url => /posthog|\/static\/array\.js|recorder|\/s\//i.test(url))).toBe(false);
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) })))
    .toEqual({ local: [], session: [] });
});

test('footer links to the privacy note', async ({ page }) => {
  await page.goto('/about');
  await page.getByRole('navigation', { name: 'Secondary' }).getByRole('link', { name: 'Privacy' }).click();
  await expect(page).toHaveURL(/\/privacy\/?$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy' })).toBeVisible();
  await expect(page.locator('main')).toContainText('PostHog');
  await expect(page.locator('main')).toContainText('cookies');
});
