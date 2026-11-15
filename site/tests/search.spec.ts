import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { SLUGS } from './_slugs';

/**
 * The archive-wide search page at /search and the masthead form that submits to it.
 * The page reads the Pagefind index that the site build writes (see search-index.spec.ts).
 */
const HELP = 'Search every entry, thread, controversy and actor in the ledger.';
const THREAD_TITLE = 'The Scaling Laws Debate: Will Bigger Always Mean Better?';

const field = (page: Page) => page.getByRole('searchbox', { name: 'Search the ledger' });
const status = (page: Page) => page.getByRole('status');
const group = (page: Page, label: string) => page.getByRole('region', { name: new RegExp(`^${label}\\b`) });

test('typing a query lists matches under their groups and keeps the query in the URL', async ({ page }) => {
  await page.goto('/search');
  await expect(status(page)).toHaveText(HELP);
  const entries = await page.evaluate(() => history.length);

  await field(page).pressSequentially('scaling laws');

  await expect(group(page, 'Threads').getByRole('link', { name: THREAD_TITLE }))
    .toHaveAttribute('href', `/threads/${SLUGS.thread}`);
  await expect(group(page, 'Events').getByRole('listitem').first()).toBeVisible();
  await expect(group(page, 'Events').locator('mark').first()).toHaveText(/scal|law/i);

  // The announced total is the sum of the counts beside the group headings.
  const counts = await page.getByRole('region').getByRole('heading', { level: 2 }).locator('span').allTextContents();
  const total = counts.reduce((sum, count) => sum + Number(count), 0);
  expect(total).toBeGreaterThan(1);
  await expect(status(page)).toHaveText(`${total} results for “scaling laws”`);

  await expect(page).toHaveURL(/\/search\/?\?q=scaling\+laws$/);
  expect(await page.evaluate(() => history.length)).toBe(entries);
});

test('opening a search link shows its results, with the date and category on events', async ({ page }) => {
  await page.goto('/search?q=bletchley');
  await expect(field(page)).toHaveValue('bletchley');
  await expect(status(page)).toHaveText(/^\d+ results for “bletchley”$/);

  const summit = group(page, 'Events').getByRole('listitem').filter({ hasText: 'AI Safety Summit at Bletchley Park' });
  await expect(summit.getByRole('link')).toHaveAttribute('href', '/events/ai-safety-summit-bletchley');
  await expect(summit.locator('time')).toHaveText('2023-11-01');
  await expect(summit.locator('time')).toHaveAttribute('datetime', '2023-11-01');
  await expect(summit.locator('time')).toHaveCSS('font-family', /JetBrains Mono/);
  await expect(summit.locator('.category-tag')).toHaveText('safety');
  await expect(summit.locator('mark').first()).toHaveText(/bletchley/i);

  // Only events carry a date and a category.
  const actors = group(page, 'Actors');
  await expect(actors.getByRole('listitem').first()).toBeVisible();
  await expect(actors.locator('time, .category-tag')).toHaveCount(0);
});

test('the masthead field searches every record type from any page', async ({ page }) => {
  await page.goto('/about');
  const masthead = page.locator('#search-q');
  await expect(masthead).toHaveAttribute('placeholder', 'Search the ledger…');
  await expect(masthead).toHaveAccessibleName('Search events, threads, controversies and actors');
  await masthead.fill(THREAD_TITLE);
  await masthead.press('Enter');

  await expect(page).toHaveURL(/\/search\/?\?q=/);
  await expect(field(page)).toHaveValue(THREAD_TITLE);
  await expect(group(page, 'Threads').getByRole('link').first()).toHaveText(THREAD_TITLE);
});

for (const route of ['/', '/search?q=bletchley']) {
  test(`the / and Ctrl+K shortcuts focus the masthead field on ${route}`, async ({ page }) => {
    await page.goto(route);
    const masthead = page.locator('#search-q');
    await page.keyboard.press('/');
    await expect(masthead).toBeFocused();
    await expect(masthead).toHaveValue('');

    await page.getByRole('link', { name: 'Skip to main content' }).focus();
    await page.keyboard.press('Control+k');
    await expect(masthead).toBeFocused();
  });
}

test('Ctrl+K leaves the search page field for the masthead field', async ({ page }) => {
  await page.goto('/search');
  await field(page).focus();
  await page.keyboard.press('Control+k');
  await expect(page.locator('#search-q')).toBeFocused();
});

test('a query with no matches points to the timeline, threads and actors', async ({ page }) => {
  // Quoted, because Pagefind matches a word it does not know by its longest known prefix.
  await page.goto(`/search?q=${encodeURIComponent('"zzqxv"')}`);
  await expect(status(page)).toHaveText('No results for “"zzqxv"”. Try fewer words, or browse the timeline, threads or actors.');
  for (const [name, href] of [['timeline', '/explore'], ['threads', '/threads'], ['actors', '/actors']]) {
    await expect(status(page).getByRole('link', { name, exact: true })).toHaveAttribute('href', href);
  }
  await expect(page.getByRole('region')).toHaveCount(0);

  await field(page).fill('');
  await expect(status(page)).toHaveText(HELP);
  await expect(page).toHaveURL(/\/search\/?$/);
});

test('clearing the field removes the results', async ({ page }) => {
  await page.goto('/search?q=bletchley');
  await expect(group(page, 'Events')).toBeVisible();
  await field(page).fill('');
  await expect(status(page)).toHaveText(HELP);
  await expect(page.getByRole('region')).toHaveCount(0);
});

test('Show more adds the next results and moves focus to the first of them', async ({ page }) => {
  await page.goto('/search?q=OpenAI');
  const events = group(page, 'Events');
  const rows = events.getByRole('listitem');
  await expect(rows).toHaveCount(10);
  expect(Number(await events.getByRole('heading').locator('span').textContent())).toBeGreaterThan(20);

  await events.getByRole('button', { name: 'Show more events' }).focus();
  await page.keyboard.press('Enter');
  await expect(rows).toHaveCount(20);
  await expect(rows.nth(10).getByRole('link')).toBeFocused();
});

test('a search index that does not load is reported with a way on', async ({ page }) => {
  await page.route('**/pagefind/**', (route) => route.abort());
  await page.goto('/search?q=bletchley');
  await expect(status(page)).toHaveText('Search could not load. Reload the page, or browse the timeline.');
  await expect(status(page).getByRole('link', { name: 'timeline' })).toHaveAttribute('href', '/explore');
});

test('without JavaScript the page says search needs it and links to the timeline', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('/search?q=bletchley');
    const notice = page.locator('main p', { hasText: 'Search needs JavaScript.' });
    await expect(notice).toBeVisible();
    await expect(notice.getByRole('link', { name: 'timeline' })).toHaveAttribute('href', '/explore');
    await expect(page.locator('#search-page-q')).toBeHidden();
    await expect(page.getByText(HELP)).toBeHidden();
  } finally {
    await context.close();
  }
});

test('results pass axe and fit a 375px screen', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/search?q=OpenAI');
  await expect(group(page, 'Events').getByRole('listitem')).toHaveCount(10);
  await expect(group(page, 'Actors').getByRole('listitem')).toHaveCount(10);

  const overflow = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));
  expect(overflow.scrollW).toBeLessThanOrEqual(overflow.clientW);

  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const serious = result.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
});
