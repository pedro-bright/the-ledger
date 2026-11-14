import { test, expect, type Locator } from '@playwright/test';
import { SLUGS } from './_slugs';

// Claude 2 sits mid-way through two threads; GPT-4 opens the scaling-laws thread.
const TWO_THREADS = '/events/claude-2-release/';
const OPEN_WEIGHTS = 'Open vs. Closed Weights: The Battle for AI\'s Architecture thread';
const SCALING = 'The Scaling Laws Debate: Will Bigger Always Mean Better? thread';

const step = (nav: Locator, label: string) => nav.locator('.thread-nav__step').filter({ hasText: label });

test('an event in two threads shows one row per thread with both neighbours', async ({ page }) => {
  await page.goto(TWO_THREADS);
  const rows = page.locator('nav.thread-nav');
  await expect(rows).toHaveCount(2);
  const eventDate = await page.locator('.wiki-infobox time').first().getAttribute('datetime');

  for (const name of [OPEN_WEIGHTS, SCALING]) {
    const nav = page.getByRole('navigation', { name, exact: true });
    await expect(nav.locator('.thread-nav__thread')).toHaveAttribute('href', /^\/threads\/[a-z0-9-]+$/);
    const earlierDate = await step(nav, 'Earlier in this thread').locator('time').getAttribute('datetime');
    const laterDate = await step(nav, 'Later in this thread').locator('time').getAttribute('datetime');
    expect(earlierDate! <= eventDate!).toBe(true);
    expect(laterDate! >= eventDate!).toBe(true);
  }
});

test('following Later then Earlier in a thread returns to the same entry', async ({ page }) => {
  await page.goto(TWO_THREADS);
  const later = step(page.getByRole('navigation', { name: OPEN_WEIGHTS, exact: true }), 'Later in this thread').getByRole('link');
  const laterHref = await later.getAttribute('href');
  await later.click();
  await expect(page).toHaveURL(new RegExp(`${laterHref}/?$`));

  await step(page.getByRole('navigation', { name: OPEN_WEIGHTS, exact: true }), 'Earlier in this thread').getByRole('link').click();
  await expect(page).toHaveURL(/\/events\/claude-2-release\/?$/);
});

test('the first entry of a thread shows only the later neighbour', async ({ page }) => {
  await page.goto(`/events/${SLUGS.event}/`);
  const nav = page.getByRole('navigation', { name: SCALING, exact: true });
  await expect(step(nav, 'Later in this thread')).toHaveCount(1);
  await expect(step(nav, 'Earlier in this thread')).toHaveCount(0);
});

test('an event cited by later entries lists them under Referenced by', async ({ page }) => {
  await page.goto('/events/anthropic-rsp-v3/');
  const eventDate = await page.locator('.wiki-infobox time').first().getAttribute('datetime');
  const list = page.getByRole('list', { name: 'Referenced by' });
  const dates = await list.locator('time').evaluateAll((els) => els.map((el) => el.getAttribute('datetime')!));
  expect(dates.length).toBeGreaterThan(0);
  expect(dates.some((date) => date > eventDate!)).toBe(true);
  expect(await page.locator('.wiki-article__see-also li').count()).toBeLessThanOrEqual(8);
});

test('an event with no related entries and no citations has no See also section', async ({ page }) => {
  await page.goto(TWO_THREADS);
  await expect(page.locator('nav.thread-nav').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'See also' })).toHaveCount(0);
});

test('the thread rows fit the viewport without horizontal scroll', async ({ page }) => {
  await page.goto(TWO_THREADS);
  const width = page.viewportSize()!.width;
  for (const box of await page.locator('nav.thread-nav').evaluateAll((els) => els.map((el) => el.getBoundingClientRect().right))) {
    expect(box).toBeLessThanOrEqual(width);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
});

test('the thread rows are hidden in print', async ({ page }) => {
  await page.goto(TWO_THREADS);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('nav.thread-nav').first()).toBeHidden();
});
