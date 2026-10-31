import { test, expect } from '@playwright/test';

/**
 * URL round-trip tests for the Explorer.
 *
 * Note: the Explorer URL schema uses `cat=` (not `category=`) and `sig=`.
 * Rail links in explore.astro use the same names. Search = `q`.
 */

test.describe('explorer filters', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'desktop only');
  });

  test('pre-seeded URL hydrates the UI', async ({ page }) => {
    await page.goto('/explore?cat=research&sig=landmark&q=gpt');

    // Search input shows the query after hydration.
    const search = page.locator('#explorer-search');
    await expect(search).toHaveValue('gpt');

    // The category chip for "research" should report aria-pressed=true.
    const researchChip = page.getByRole('button', { name: /^research$/i }).first();
    await expect(researchChip).toHaveAttribute('aria-pressed', 'true');

    // The landmark significance chip should likewise be pressed.
    // Match the aria-label "Filter by Landmark significance".
    const landmarkChip = page.getByRole('button', { name: /landmark significance/i }).first();
    await expect(landmarkChip).toHaveAttribute('aria-pressed', 'true');
  });

  test('toggling a pressed category chip drops it from the URL', async ({ page }) => {
    await page.goto('/explore?cat=research&sig=landmark&q=gpt');
    // Wait for hydration.
    await expect(page.locator('#explorer-search')).toHaveValue('gpt');

    const researchChip = page.getByRole('button', { name: /^research$/i }).first();
    await researchChip.click();

    // `cat=` should drop within the 180ms debounce window; give it a budget.
    await page.waitForFunction(
      () => !new URL(location.href).searchParams.get('cat'),
      null,
      { timeout: 2000 },
    );

    const url = new URL(page.url());
    expect(url.searchParams.get('cat')).toBeNull();
    // Other filters survive the toggle.
    expect(url.searchParams.get('sig')).toBe('landmark');
    expect(url.searchParams.get('q')).toBe('gpt');
  });

  test('back-button navigation restores the prior filter state', async ({ page }) => {
    await page.goto('/explore?cat=research&sig=landmark&q=gpt');
    await expect(page.locator('#explorer-search')).toHaveValue('gpt');

    const researchChip = page.getByRole('button', { name: /^research$/i }).first();
    await expect(researchChip).toHaveAttribute('aria-pressed', 'true');

    // Drop the category — writeToUrl uses history.replaceState, so pure "back" may
    // not step. To guarantee a history entry, navigate to the new URL explicitly.
    await page.goto('/explore?sig=landmark&q=gpt');
    await expect(page.locator('#explorer-search')).toHaveValue('gpt');
    await expect(researchChip).toHaveAttribute('aria-pressed', 'false');

    // Go back — the popstate listener re-hydrates state from the URL.
    await page.goBack();
    await expect(researchChip).toHaveAttribute('aria-pressed', 'true');
  });
});


test.describe('search navigation regressions', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'desktop only');
  });

  for (const route of ['/', '/events/anthropic-dod-debate-2026']) {
    test(`category links from ${route} select and filter policy`, async ({ page }) => {
      await page.goto('/');
      const policy = page.locator('a[href="/explore?cat=policy"]').first();
      const expectedCount = Number(await policy.locator('..').locator('.count').textContent());
      if (route !== '/') await page.goto(route);
      const link = page.locator('a[href^="/explore?"]').filter({ hasText: /^\s*Policy\s*$/ }).first();
      await link.click();
      await expect(page.getByRole('button', { name: /^policy$/i })).toHaveAttribute('aria-pressed', 'true');
      const categories = page.locator('.explorer-row__category');
      await expect(categories).toHaveCount(expectedCount);
      expect((await categories.allTextContents()).every((text) => text.trim() === 'policy')).toBe(true);
      await expect(page).toHaveURL(/cat=policy/);
    });
  }

  test('actor category links use the canonical parameter and filter', async ({ page }) => {
    await page.goto('/actors/openai');
    const link = page.locator('.wiki-rail[data-side="right"] a[href^="/explore?"]').first();
    await expect(link).toHaveAttribute('href', /^\/explore\?cat=[a-z-]+$/);
    const href = await link.getAttribute('href');
    const category = new URLSearchParams(href!.split('?')[1]).get('cat')!;
    await link.click();
    await expect(page.getByRole('button', { name: new RegExp(`^${category}$`, 'i') })).toHaveAttribute('aria-pressed', 'true');
    expect(new URL(page.url()).searchParams.get('cat')).toBe(category);
  });

  test('legacy category links retain their category and normalize the URL', async ({ page }) => {
    await page.goto('/explore?category=policy');
    await expect(page.getByRole('button', { name: /^policy$/i })).toHaveAttribute('aria-pressed', 'true');
    await expect(page).toHaveURL(/cat=policy/);
    expect(new URL(page.url()).searchParams.has('category')).toBe(false);
  });

  test('masthead search accurately names its event scope and offers other indexes', async ({ page }) => {
    await page.goto('/');
    const search = page.locator('#search-q');
    await expect(search).toHaveAttribute('placeholder', 'Search events…');
    await expect(search).toHaveAccessibleName('Search events');
    await search.fill('The Scaling Laws Debate: Will Bigger Always Mean Better?');
    await search.press('Enter');
    await expect(page.locator('#explorer-search')).toHaveValue('The Scaling Laws Debate: Will Bigger Always Mean Better?');
    const recovery = page.getByRole('navigation', { name: 'Other indexes' });
    for (const label of ['Threads', 'Controversies', 'Actors']) {
      await expect(recovery.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
    await recovery.getByRole('link', { name: 'Threads', exact: true }).click();
    await expect(page.locator('.threads-table')).toBeVisible();
  });
});
