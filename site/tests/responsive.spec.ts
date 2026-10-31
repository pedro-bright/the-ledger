import { test, expect } from '@playwright/test';
import { SLUGS } from './_slugs';

/**
 * Responsive tests: visit 4 representative pages at 3 viewports and assert
 *  - no horizontal scroll,
 *  - masthead is visible,
 *  - right-rail / floated-infobox behaviour matches the 1024px and 780px breakpoints
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
          // Right rail: hidden ≤ 1024px, visible > 1024px.
          const rightRail = page.locator('aside.wiki-rail[data-side="right"]');
          if (vp.width > 1024) {
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


test.describe('reading layout regressions', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'viewport-own');
  });

  for (const width of [320, 390, 780, 781, 1440]) {
    for (const route of ['/explore', '/threads', '/controversies', '/actors']) {
      test(`${route} uses the available column at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
        await page.goto(route);
        const geometry = await page.locator('.wiki-layout').evaluate((el) => {
          const style = getComputedStyle(el);
          const main = el.querySelector('.wiki-main')!;
          return {
            available: el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
            main: main.getBoundingClientRect().width,
            tracks: style.gridTemplateColumns.split(' ').length,
          };
        });
        if (width <= 780) {
          expect(geometry.main).toBeCloseTo(geometry.available, 0);
          expect(geometry.tracks).toBe(1);
        } else {
          expect(geometry.tracks).toBe(2);
          await expect(page.locator('.wiki-rail[data-side="left"]')).toBeVisible();
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      });
    }
  }

  for (const route of ['/events/anthropic-dod-debate-2026', '/threads/scaling-laws-debate']) {
    test(`${route} leads with the canonical answer on mobile`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route);
      const lead = page.locator('.wiki-article__lead');
      await expect(lead).toBeVisible();
      const metadata = page.locator('details.wiki-article__metadata');
      await expect(metadata).not.toHaveAttribute('open', '');
      expect(await lead.evaluate((el) => el.getBoundingClientRect().top)).toBeLessThan(844);
      expect(await lead.evaluate((el) => !!(el.compareDocumentPosition(document.querySelector('.wiki-article__metadata')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
      await metadata.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(metadata.locator('.wiki-infobox')).toBeVisible();
    });
  }

  test('article metadata retains the desktop float and follows the lead after resizing to mobile', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/events/anthropic-dod-debate-2026');
    const metadata = page.locator('.wiki-article__metadata');
    await expect(metadata).toHaveAttribute('open', '');
    const geometry = await metadata.evaluate((el) => {
      const box = el.getBoundingClientRect();
      const lead = document.querySelector('.wiki-article__lead')!.getBoundingClientRect();
      return { top: box.top, leadTop: lead.top, float: getComputedStyle(el).float };
    });
    expect(geometry.float).toBe('right');
    expect(Math.abs(geometry.top - geometry.leadTop)).toBeLessThan(10);
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(metadata).not.toHaveAttribute('open', '');
    expect(await page.locator('.wiki-article__lead').evaluate((el) => !!(el.compareDocumentPosition(document.querySelector('.wiki-article__metadata')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
    await metadata.locator('summary').click();
    await expect(metadata.locator('.wiki-infobox')).toBeVisible();
  });

  for (const width of [390, 1024, 1200, 1440]) {
    test(`article prose respects its measure at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/events/${SLUGS.event}`);
      await page.evaluate(() => document.fonts.ready);
      const prose = await page.locator('.wiki-article__prose').evaluate((el) => {
        const style = getComputedStyle(el);
        return { width: el.getBoundingClientRect().width, max: parseFloat(style.maxWidth) };
      });
      expect(prose.width).toBeLessThanOrEqual(prose.max + 1);
      expect(prose.max).toBeLessThan(600);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    });
  }

  test('desktop thread dates stay on one line', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/threads');
    await page.evaluate(() => document.fonts.ready);
    const lines = await page.locator('.threads-table__date time').evaluateAll((dates) => dates.map((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return range.getClientRects().length;
    }));
    expect(lines.length).toBeGreaterThan(0);
    expect(lines.every((count) => count === 1)).toBe(true);
  });
});
