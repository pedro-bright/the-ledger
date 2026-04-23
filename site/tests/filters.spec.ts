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
