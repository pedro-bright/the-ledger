import { test, expect } from '@playwright/test';

/**
 * Keyboard navigation tests. These enforce the "keyboard + focus" commitment in
 * CLAUDE.md: visible focus rings, logical tab order, no keyboard traps, skip-link
 * lands on #main.
 */

test.describe('keyboard', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'desktop only');
  });

  test('home — first Tab focuses the skip-link, Enter jumps to #main', async ({ page }) => {
    await page.goto('/');
    // Explicitly focus the body so the first Tab reaches the first tabbable node.
    await page.evaluate(() => document.body.focus());
    await page.keyboard.press('Tab');

    const firstFocusIsSkip = await page.evaluate(() =>
      document.activeElement?.classList?.contains('skip-link'),
    );
    expect(firstFocusIsSkip, 'first Tab should land on .skip-link').toBe(true);

    // Visible-focus contract: global CSS applies a 2px outline on :focus-visible.
    const outline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return null;
      const s = getComputedStyle(el);
      return { outline: s.outline, outlineStyle: s.outlineStyle, outlineWidth: s.outlineWidth };
    });
    expect(outline?.outlineStyle).not.toBe('none');

    // Follow the skip link. Astro renders <main id="main" tabindex="-1">; pressing
    // Enter should navigate to the hash and move focus there.
    await page.keyboard.press('Enter');
    const onMain = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return el?.id === 'main' || !!el?.closest('#main');
    });
    expect(onMain, 'Enter on skip-link should move focus into #main').toBe(true);
  });

  test('home — tabbing through UtilBar/Nav/rail never traps focus', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.body.focus());

    const visited = new Set<string>();
    const seenMain = { done: false };
    // 50 tabs is well past the chrome; if we're still there we'd flag a trap.
    for (let i = 0; i < 50; i += 1) {
      await page.keyboard.press('Tab');
      const activeSig = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el) return null;
        const anchor = el.closest('[data-active], a, button, input, select, textarea') as HTMLElement | null;
        const tag = (el.tagName || '').toLowerCase();
        const id = el.id || '';
        const cls = (el.className as unknown as string) || '';
        return `${tag}#${id}.${cls}`.slice(0, 160);
      });
      if (activeSig) visited.add(activeSig);
      const inMain = await page.evaluate(() => !!document.activeElement?.closest('#main'));
      if (inMain) seenMain.done = true;
    }
    // Two cheap trap-proxies: (a) we reached #main at some point, and
    // (b) tabbing produced multiple distinct focus targets.
    expect(seenMain.done, 'tabbing should eventually reach main content').toBe(true);
    expect(visited.size, 'tab should move focus through multiple targets').toBeGreaterThan(5);
  });

  test('explore — typing in search writes to ?q= after debounce', async ({ page }) => {
    await page.goto('/explore');
    const input = page.locator('#explorer-search');
    await input.waitFor({ state: 'visible' });
    await input.click();
    await input.fill('gpt');

    // Explorer debounces writes at 180ms; give it a generous wait.
    await page.waitForFunction(() => new URL(location.href).searchParams.get('q') === 'gpt', null, {
      timeout: 2000,
    });
    expect(page.url()).toContain('q=gpt');
  });

  test('explore — toggling a category chip updates the URL', async ({ page }) => {
    await page.goto('/explore');
    const chip = page.getByRole('button', { name: /^research$/i }).first();
    await chip.waitFor({ state: 'visible' });
    await chip.focus();
    // Keyboard activation (Space is the canonical button trigger).
    await page.keyboard.press('Space');
    await page.waitForFunction(
      () => new URL(location.href).searchParams.get('cat')?.includes('research') === true,
      null,
      { timeout: 2000 },
    );
    expect(page.url()).toContain('cat=research');
  });

  test('explore — "Reset all" clears filter query params', async ({ page }) => {
    await page.goto('/explore?cat=research&sig=landmark&q=gpt');
    // Wait for hydration (input should reflect URL state).
    await expect(page.locator('#explorer-search')).toHaveValue('gpt');

    const reset = page.getByRole('button', { name: /reset all/i }).first();
    await reset.waitFor({ state: 'visible' });
    await reset.click();

    await page.waitForFunction(() => {
      const p = new URL(location.href).searchParams;
      return !p.get('q') && !p.get('cat') && !p.get('sig');
    }, null, { timeout: 2000 });

    const finalUrl = new URL(page.url());
    expect(finalUrl.searchParams.get('q')).toBeNull();
    expect(finalUrl.searchParams.get('cat')).toBeNull();
    expect(finalUrl.searchParams.get('sig')).toBeNull();
  });
});
