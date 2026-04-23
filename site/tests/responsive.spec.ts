import { test, expect } from '@playwright/test';
import { SLUGS } from './_slugs';

/**
 * Responsive tests: visit 4 representative pages at 3 viewports and assert
 *  - no horizontal scroll,
 *  - masthead is visible,
 *  - right-rail / floated-infobox behaviour matches the 1100px and 780px breakpoints
 *    defined in src/styles/global.css.
 *
 * Runs on the `chromium` project only — this spec manipulates viewport itself so
 * the mobile project would just repeat work.
 */

const ROUTES = ['/', `/events/${SLUGS.event}`, '/explore', '/graph'];

const VIEWPORTS = [
  { label: 'mobile', width: 375, height: 667 },
  { label: 'tablet', width: 768, height: 1024 },
  { label: 'desktop', width: 1280, height: 800 },
] as const;

test.describe('responsive', () => {
  // Runs on chromium only — this spec manipulates viewport itself, so the mobile
  // project would just repeat every case.
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'viewport-own');
  });

  for (const vp of VIEWPORTS) {
    for (const route of ROUTES) {
      test(`${vp.label} (${vp.width}x${vp.height}) — ${route}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(route);

        // Masthead always visible (the wiki chrome holds across breakpoints).
        await expect(page.locator('header.wiki-masthead')).toBeVisible();

        // No horizontal scroll — even 1px of overflow ships as a mobile bug.
        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          return { scrollW: doc.scrollWidth, clientW: doc.clientWidth };
        });
        expect(overflow.scrollW, `${route} at ${vp.label} overflowed horizontally`).toBeLessThanOrEqual(
          overflow.clientW,
        );

        // Event-page–specific rail / infobox rules.
        if (route.startsWith('/events/')) {
          // Right rail: hidden ≤ 1100px, visible > 1100px.
          const rightRail = page.locator('aside.wiki-rail[data-side="right"]');
          if (vp.width > 1100) {
            await expect(rightRail).toBeVisible();
          } else {
            await expect(rightRail).toBeHidden();
          }

          // Mobile Infobox: full-width, unfloated (the 780px media query).
          if (vp.width <= 780) {
            const float = await page
              .locator('aside.wiki-infobox')
              .evaluate((el) => getComputedStyle(el).float);
            expect(float).toBe('none');
          }
        }
      });
    }
  }
});
