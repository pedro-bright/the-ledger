import { test, expect, type Page, type Route } from '@playwright/test';
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
const count = async (page: Page, label: string) =>
  Number(await group(page, label).getByRole('heading').locator('span').textContent());

/** Holds Pagefind's result fragment requests until `release` lets them and every later one through. */
async function holdFragments(page: Page) {
  const held: Route[] = [];
  let holding = true;
  await page.route('**/pagefind/fragment/**', (route) => (holding ? held.push(route) : route.continue()));
  return {
    count: () => held.length,
    release: async () => {
      holding = false;
      await Promise.all(held.splice(0).map((route) => route.continue()));
    },
  };
}

/** The status line, and each visible group's heading and result links in order. */
async function shown(page: Page) {
  return {
    status: await status(page).textContent(),
    groups: await page.getByRole('region').evaluateAll((sections) =>
      sections.map((section) => ({
        heading: section.querySelector('h2')!.textContent!.replace(/\s+/g, ' ').trim(),
        links: [...section.querySelectorAll('li a')].map((link) => link.getAttribute('href')),
      })),
    ),
  };
}

/** What a fresh page shows for the query, to compare a page that searched something else first against. */
async function shownFor(page: Page, term: string) {
  const fresh = await page.context().newPage();
  await fresh.goto(`/search?q=${encodeURIComponent(term)}`);
  await expect(status(fresh)).toHaveText(new RegExp(`results for “${term}”$`));
  const result = await shown(fresh);
  await fresh.close();
  return result;
}

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
  const threads = group(page, 'Threads');
  await expect(threads.getByRole('listitem').first()).toBeVisible();
  await expect(threads.locator('time, .category-tag')).toHaveCount(0);
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
  const total = await count(page, 'Events');
  expect(total).toBeGreaterThan(20);

  await events.getByRole('button', { name: 'Show 10 more events' }).focus();
  await page.keyboard.press('Enter');
  await expect(rows).toHaveCount(20);
  await expect(rows.nth(10).getByRole('link')).toBeFocused();
  // The button names the size of the next batch, which is the rest when fewer than ten remain.
  await expect(events.getByRole('button')).toHaveText(`Show ${Math.min(10, total - 20)} more events`);
});

test('a failed Show more can be retried, and the result count returns', async ({ page }) => {
  await page.goto('/search?q=OpenAI');
  const events = group(page, 'Events');
  const rows = events.getByRole('listitem');
  await expect(rows).toHaveCount(10);
  const counted = await status(page).textContent();

  await page.route('**/pagefind/fragment/**', (route) => route.abort());
  await events.getByRole('button', { name: 'Show 10 more events' }).click();
  await expect(status(page)).toHaveText('Search could not load. Reload the page, or browse the timeline.');
  await expect(rows).toHaveCount(10);

  await page.unroute('**/pagefind/fragment/**');
  await events.getByRole('button', { name: 'Show 10 more events' }).click();
  await expect(rows).toHaveCount(20);
  await expect(status(page)).toHaveText(counted!);
});

test('the button for a single remaining result names one result', async ({ page }) => {
  // A stand-in for the Pagefind module that answers every search with eleven events.
  await page.route('**/pagefind/pagefind.js', (route) => route.fulfill({
    contentType: 'text/javascript',
    body: `
      const result = (n) => ({ data: async () => ({
        url: '/events/stand-in-' + n + '/',
        excerpt: 'A <mark>stand-in</mark> result.',
        meta: { title: 'Stand-in event ' + n, date: '2024-01-01' },
        filters: { category: ['models'] },
      }) });
      export const options = async () => {};
      export const init = async () => {};
      export const search = async (term, { filters }) => ({
        results: filters.type === 'event' ? Array.from({ length: 11 }, (_, n) => result(n)) : [],
      });
    `,
  }));
  await page.goto('/search?q=stand-in');
  const events = group(page, 'Events');
  await expect(events.getByRole('listitem')).toHaveCount(10);

  await events.getByRole('button', { name: 'Show 1 more event', exact: true }).click();
  await expect(events.getByRole('listitem')).toHaveCount(11);
  await expect(events.getByRole('link', { name: 'Stand-in event 10' })).toBeFocused();
  await expect(events.getByRole('button')).toBeHidden();
});

test('activating Show more again while its rows load adds each result once', async ({ page }) => {
  await page.goto('/search?q=OpenAI');
  const events = group(page, 'Events');
  const rows = events.getByRole('listitem');
  await expect(rows).toHaveCount(10);
  const total = await count(page, 'Events');

  const fragments = await holdFragments(page);
  const more = events.getByRole('button', { name: 'Show 10 more events' });
  await more.click();
  await expect.poll(fragments.count).toBeGreaterThan(0);
  await more.click();
  await fragments.release();

  await expect(rows.nth(10).getByRole('link')).toBeFocused();
  await expect(events.getByRole('button')).toHaveText(`Show ${Math.min(10, total - 20)} more events`);
  await expect(rows).toHaveCount(20);
  const links = await rows.getByRole('link').evaluateAll((all) => all.map((link) => link.getAttribute('href')));
  expect(new Set(links).size).toBe(20);
});

test('a search typed while the previous one loads shows only the new results', async ({ page }) => {
  const expected = await shownFor(page, 'scaling laws');
  await page.goto('/search');
  const fragments = await holdFragments(page);
  await field(page).fill('bletchley');
  await expect.poll(fragments.count).toBeGreaterThan(0);
  await field(page).fill('scaling laws');
  await expect(page).toHaveURL(/\?q=scaling\+laws$/);
  await fragments.release();

  await expect(status(page)).toHaveText(expected.status!);
  expect(await shown(page)).toEqual(expected);
});

test('a search typed while Show more loads shows only the new results', async ({ page }) => {
  const expected = await shownFor(page, 'bletchley');
  await page.goto('/search?q=OpenAI');
  const events = group(page, 'Events');
  await expect(events.getByRole('listitem')).toHaveCount(10);

  const fragments = await holdFragments(page);
  await events.getByRole('button', { name: 'Show 10 more events' }).click();
  await expect.poll(fragments.count).toBeGreaterThan(0);
  await field(page).fill('bletchley');
  await expect(page).toHaveURL(/\?q=bletchley$/);
  await fragments.release();

  await expect(status(page)).toHaveText(expected.status!);
  expect(await shown(page)).toEqual(expected);
});

test('a search index that does not load is reported with a way on', async ({ page }) => {
  await page.route('**/pagefind/**', (route) => route.abort());
  await page.goto('/search?q=bletchley');
  await expect(status(page)).toHaveText('Search could not load. Reload the page, or browse the timeline.');
  await expect(status(page).getByRole('link', { name: 'timeline' })).toHaveAttribute('href', '/explore');
});

test('a search that fails removes the results of the previous one', async ({ page }) => {
  await page.goto('/search?q=bletchley');
  await expect(group(page, 'Events').getByRole('listitem').first()).toBeVisible();

  await page.route('**/pagefind/fragment/**', (route) => route.abort());
  await field(page).fill('scaling laws');
  await expect(status(page)).toHaveText('Search could not load. Reload the page, or browse the timeline.');
  await expect(page.getByRole('region')).toHaveCount(0);
  await expect(page.locator('.search-result')).toHaveCount(0);
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
  await page.goto('/search?q=AI');
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
