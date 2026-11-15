import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { SLUGS } from './_slugs';

/**
 * Axe-core accessibility smoke. On each representative page, run the default WCAG
 * 2.x rule set and fail on serious/critical violations.
 *
 * Exclusions:
 *  - The /graph page's force-graph canvas uses color as the sole distinguisher for
 *    node type, but the page ships a visible text legend above. Axe can't see into
 *    the canvas, so no canvas-specific exclusions are needed today.
 *  - No rules are disabled. If this becomes flaky on `color-contrast` after a
 *    visual design change, narrow the exclusion and document it here.
 *
 * Routes marked `mobile` also run in the 375px `mobile` project, where pages show
 * different elements (the closed metadata disclosure, the in-article key).
 */

const ROUTES: Array<{ path: string; label: string; mobile?: boolean }> = [
  { path: '/', label: 'home', mobile: true },
  { path: `/events/${SLUGS.event}`, label: 'event', mobile: true },
  { path: '/events/openai-gpt-5-release', label: 'revised-event' },
  { path: '/events/coe-ai-convention-in-force', label: 'challenged-event' },
  { path: '/events/claude-2-release', label: 'threaded-event' },
  { path: '/events/anthropic-rsp-v3', label: 'cited-event' },
  { path: '/threads', label: 'threads-index' },
  { path: `/threads/${SLUGS.thread}`, label: 'thread-detail', mobile: true },
  { path: '/controversies', label: 'controversies-index' },
  { path: '/actors', label: 'actors-index' },
  { path: `/actors/${SLUGS.actor}`, label: 'actor-detail' },
  { path: `/controversies/${SLUGS.controversy}`, label: 'controversy-detail' },
  { path: '/explore', label: 'explore', mobile: true },
  { path: '/search', label: 'search', mobile: true },
  { path: '/search?q=OpenAI&cat=policy&year=2025', label: 'search-filtered', mobile: true },
  { path: '/graph', label: 'graph' },
  { path: '/about', label: 'about' },
  { path: '/privacy', label: 'privacy' },
  { path: '/data', label: 'data' },
  { path: '/corrections', label: 'corrections' },
  { path: '/no-such-page', label: 'not-found' },
];

test.describe('a11y (axe)', () => {
  for (const { path, label, mobile } of ROUTES) {
    test(`${label} — no serious/critical violations`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name === 'mobile' && !mobile, 'desktop only');
      await page.goto(path);
      // Wait a tick for hydration on routes with client components (Explorer, Graph).
      if (path === '/graph') {
        await page.locator('canvas').first().waitFor({ state: 'visible', timeout: 10_000 });
      }
      if (path.startsWith('/search?')) {
        await page.getByRole('button', { name: /^Policy\b/, pressed: true }).waitFor();
        await page.locator('.search-result').first().waitFor();
      }
      if (path === '/explore') {
        await page.locator('#explorer-search').waitFor({ state: 'visible' });
      }

      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      const serious = result.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      );

      if (serious.length > 0) {
        // Print a compact, test-output-friendly summary before the assertion fires.
        for (const v of serious) {
          console.error(
            `[axe ${label}] ${v.impact} ${v.id}: ${v.help} (${v.nodes.length} node${
              v.nodes.length === 1 ? '' : 's'
            })\n    ${v.helpUrl}`,
          );
          for (const n of v.nodes.slice(0, 3)) {
            console.error(`      target=${JSON.stringify(n.target)}`);
          }
        }
      }

      expect(serious, `serious/critical axe violations on ${label}`).toEqual([]);
    });
  }
});


for (const route of ['/explore', '/search']) test(`editable search boundaries on ${route} have 3:1 contrast and mobile text is 16px`, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route);
  const controls = await page.locator('input[type="search"]').evaluateAll((inputs) => {
    const luminance = (color: string) => {
      const channels = color.match(/\d+(?:\.\d+)?/g)!.slice(0, 3).map(Number).map((value) => {
        const v = value / 255;
        return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    return inputs.map((input) => {
      const style = getComputedStyle(input);
      let parent = input.parentElement!;
      while (getComputedStyle(parent).backgroundColor === 'rgba(0, 0, 0, 0)') parent = parent.parentElement!;
      const contrast = (background: string) => {
        const values = [luminance(style.borderTopColor), luminance(background)].sort((a, b) => b - a);
        return (values[0] + 0.05) / (values[1] + 0.05);
      };
      return {
        id: input.id,
        inner: contrast(style.backgroundColor),
        outer: contrast(getComputedStyle(parent).backgroundColor),
        fontSize: parseFloat(style.fontSize),
      };
    });
  });
  expect(controls).toHaveLength(2);
  for (const control of controls) {
    expect(control.inner, control.id).toBeGreaterThanOrEqual(3);
    expect(control.outer, control.id).toBeGreaterThanOrEqual(3);
    expect(control.fontSize, control.id).toBeGreaterThanOrEqual(16);
  }
});
