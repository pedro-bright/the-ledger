import { test, expect } from '@playwright/test';
import { SLUGS } from './_slugs';

/**
 * Smoke tests: one representative per page-type. Each route should
 *  - respond 200,
 *  - render a meaningful h1,
 *  - render the wiki chrome (masthead/nav/footer),
 *  - paint a light background (no dark-mode leak from the prior design).
 *
 * Run on the desktop (chromium) project only — the mobile project covers viewport
 * concerns in responsive.spec.ts and doesn't need to retread these assertions.
 */

const PAGE_BG = 'rgb(250, 250, 247)'; // --color-page-bg = #FAFAF7

test.describe('smoke', () => {
  // Desktop-chromium only — mobile project covers viewport concerns in responsive.spec.ts.
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'desktop only');
  });

  async function expectChrome(page: import('@playwright/test').Page) {
    await expect(page.locator('header.wiki-masthead')).toBeVisible();
    await expect(page.locator('nav.wiki-nav')).toBeVisible();
    await expect(page.locator('footer.wiki-footer')).toBeVisible();
  }

  async function expectLightBg(page: import('@playwright/test').Page) {
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe(PAGE_BG);
  }

  test('home: renders hero h1, chrome, and light bg', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    // index h1: "A durable historical record of AI." (trailing period in source)
    await expect(page.locator('h1')).toContainText('A durable historical record of AI');
    await expectChrome(page);
    await expectLightBg(page);
  });

  test('event: renders title, Infobox, and prose body', async ({ page }) => {
    const response = await page.goto(`/events/${SLUGS.event}`);
    expect(response?.status()).toBe(200);
    // The event h1 is the title from frontmatter ("OpenAI Releases GPT-4").
    const h1 = page.locator('article.wiki-article h1.wiki-article__title');
    await expect(h1).toBeVisible();
    await expect(h1).not.toBeEmpty();
    // Floated infobox with "Entry metadata" title.
    await expect(page.locator('aside.wiki-infobox')).toBeVisible();
    await expect(page.locator('.wiki-infobox__title')).toContainText('Entry metadata');
    // Prose body rendered markdown.
    await expect(page.locator('.wiki-article__prose')).toBeVisible();
    await expectChrome(page);
  });

  test('threads index: renders title and table', async ({ page }) => {
    const response = await page.goto('/threads');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Narrative threads');
    // Expect at least one thread row.
    await expect(page.locator('table.threads-table tbody tr').first()).toBeVisible();
    await expectChrome(page);
  });

  test('thread detail: renders title and Event timeline', async ({ page }) => {
    const response = await page.goto(`/threads/${SLUGS.thread}`);
    expect(response?.status()).toBe(200);
    const h1 = page.locator('article.wiki-article h1.wiki-article__title');
    await expect(h1).toBeVisible();
    await expect(h1).not.toBeEmpty();
    // Event timeline heading within article body.
    await expect(page.getByRole('heading', { name: 'Event timeline' })).toBeVisible();
    await expectChrome(page);
  });

  test('controversies index: renders title', async ({ page }) => {
    const response = await page.goto('/controversies');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Controversies');
    await expectChrome(page);
  });

  test('controversy detail: 200 and title', async ({ page }) => {
    const response = await page.goto(`/controversies/${SLUGS.controversy}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('article.wiki-article h1.wiki-article__title')).toBeVisible();
    await expectChrome(page);
  });

  test('actors index: renders title', async ({ page }) => {
    const response = await page.goto('/actors');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Actors in the ledger');
    await expectChrome(page);
  });

  test('actor detail: 200 and title', async ({ page }) => {
    const response = await page.goto(`/actors/${SLUGS.actor}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await expectChrome(page);
  });

  test('explore: renders title and mounts Explorer', async ({ page }) => {
    const response = await page.goto('/explore');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Every entry in the ledger');
    // Explorer component mount marker: the search input or results list.
    await expect(page.locator('#explorer-search')).toBeVisible();
    await expectChrome(page);
  });

  test('graph: renders title and a canvas', async ({ page }) => {
    const response = await page.goto('/graph');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('How everything connects');
    // react-force-graph-2d paints a canvas once hydrated.
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 10_000 });
    await expectChrome(page);
  });

  test('about: renders title', async ({ page }) => {
    const response = await page.goto('/about');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('About');
    await expectChrome(page);
  });

  test('404: unknown route shows not-found copy', async ({ page }) => {
    // Astro serves the static /404.html; the status may be 200 or 404 depending on
    // the preview server, so we only assert page contents.
    await page.goto('/definitely-not-a-real-page-xyz');
    await expect(page.locator('h1')).toContainText('This entry does not exist');
  });
});
