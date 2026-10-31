import { test, expect } from '@playwright/test';
import { SLUGS } from './_slugs';

const article = `/events/${SLUGS.event}`;

test('article contents links work with and without JavaScript', async ({ browser }) => {
  for (const javaScriptEnabled of [true, false]) {
    const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, viewport: { width: 390, height: 844 }, javaScriptEnabled });
    const page = await context.newPage();
    await page.goto(`/threads/${SLUGS.thread}`);
    const contents = page.getByRole('navigation', { name: 'On this page' });
    await expect(contents).toBeVisible();
    await contents.getByText('Contents', { exact: true }).click();
    const links = contents.locator('a');
    expect(await links.count()).toBeGreaterThan(3);
    const hrefs = await links.evaluateAll((els) => els.map((el) => el.getAttribute('href')!));
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const href of hrefs) await expect(page.locator(href)).toHaveCount(1);
    const timeline = contents.getByRole('link', { name: 'Event timeline', exact: true });
    await timeline.click();
    await expect(page).toHaveURL(/#section-event-timeline$/);
    await expect(page.locator('#section-event-timeline')).toBeInViewport();
    await page.goto(article);
    await page.getByRole('link', { name: 'References', exact: true }).first().click();
    await expect(page.locator('#refs-head')).toBeInViewport();
    await context.close();
  }
});

test('desktop contents occupy the navigation rail', async ({ page }) => {
  test.skip(test.info().project.name === 'mobile');
  await page.goto(`/threads/${SLUGS.thread}`);
  await expect(page.locator('.wiki-rail[data-side="left"]').getByRole('navigation', { name: 'On this page' })).toBeVisible();
});

test('filter removal is a usable target and retains keyboard focus', async ({ page }) => {
  await page.goto('/explore?category=models&sig=major');
  const remove = page.getByRole('button', { name: 'Remove Models filter', exact: true });
  await expect(remove).toBeVisible();
  const box = (await remove.boundingBox())!;
  expect(box.width).toBeGreaterThanOrEqual(24);
  expect(box.height).toBeGreaterThanOrEqual(24);
  await remove.focus();
  await page.keyboard.press('Enter');
  await expect(remove).toHaveCount(0);
  await expect(page).not.toHaveURL(/category=models/);
  await expect(page.getByRole('button', { name: 'Remove Major filter' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#explorer-search')).toBeFocused();
});

test('metadata labels and values use consistent readable sizes', async ({ page }) => {
  await page.goto(article);
  if (test.info().project.name === 'mobile') await page.locator('.wiki-article__metadata summary').click();
  await expect(page.locator('.wiki-infobox dt').first()).toHaveCSS('font-size', '12px');
  await expect(page.locator('.wiki-infobox dd').first()).toHaveCSS('font-size', '13px');
  await expect(page.locator('.wiki-infobox .mono').first()).toHaveCSS('font-size', '13px');
  await expect(page.locator('.flag-chip').first()).toHaveCSS('font-size', '12px');
  await page.goto('/explore');
  await expect(page.locator('.explorer-row__date').first()).toHaveCSS('font-size', '13px');
  await page.goto('/actors');
  await expect(page.locator('.actors-row__alias').first()).toHaveCSS('font-size', '13px');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('phone titles use reading-sized optical detail and desktop keeps its display role', async ({ browser }) => {
  test.slow();
  for (const width of [412, 1440]) {
    const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, viewport: { width, height: 900 }, deviceScaleFactor: 2.625 });
    const page = await context.newPage();
    for (const route of ['/', '/graph', '/explore', '/threads', '/controversies', '/actors', '/about', '/missing-page', article, '/events/openai-misalignment-reporting-framework-six-reports', `/threads/${SLUGS.thread}`, `/actors/${SLUGS.actor}`, `/controversies/${SLUGS.controversy}`]) {
      await page.goto(route);
      const title = page.locator('h1').first();
      await expect(title).toHaveCSS('font-variation-settings', new RegExp(`"opsz" ${width === 412 ? 32 : 144}`));
      if (width === 412 && route.startsWith('/events/')) {
        await expect(title).toHaveCSS('font-size', '32px');
        await expect(title).toHaveCSS('line-height', '36.8px');
      }
    }
    await context.close();
  }
});

test('cold body font swap keeps the outer reading column fixed', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  let release!: () => void;
  const held = new Promise<void>((resolve) => { release = resolve; });
  await page.route(/source-serif-4-latin-wght-normal.*\.woff2/, async (route) => { await held; await route.continue(); });
  await page.goto('/about', { waitUntil: 'domcontentloaded' });
  const geometry = () => page.locator('.wiki-layout').evaluate((el) => ({ width: el.getBoundingClientRect().width, x: el.getBoundingClientRect().x }));
  const before = await geometry();
  const preload = page.locator('link[rel="preload"][as="font"]');
  release();
  await page.evaluate(() => document.fonts.ready);
  const after = await geometry();
  await test.info().attach('cold-font-geometry', { body: JSON.stringify({ before, after }), contentType: 'application/json' });
  expect(after).toEqual(before);
  await expect(preload).toHaveAttribute('fetchpriority', 'high');
  await expect(preload).toHaveAttribute('crossorigin', 'anonymous');
  await context.close();
});
