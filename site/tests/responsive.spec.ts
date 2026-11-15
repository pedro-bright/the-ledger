import { test, expect } from '@playwright/test';
import { SLUGS } from './_slugs';

/**
 * Responsive tests: visit representative pages at 3 viewports and assert
 *  - no horizontal scroll,
 *  - masthead is visible,
 *  - right-rail / floated-infobox behaviour matches the 1024px and 780px breakpoints
 *    defined in src/styles/global.css.
 *
 * Runs on the `chromium` project only — this spec manipulates viewport itself so
 * the mobile project would just repeat work.
 */

const LONG_THREAD = '/threads/frontier-safety-policies';

const ROUTES = ['/', `/events/${SLUGS.event}`, `/actors/${SLUGS.actor}`, LONG_THREAD, '/explore', '/search', '/graph', '/corrections', '/data'];

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

  const MARKERS = [
    { route: '/events/anthropic-dod-debate-2026', expected: ['Landmark', 'Medium confidence'] },
    { route: '/events/deepseek-r1-distill-impact', expected: ['Major', 'Low confidence', 'Corrected'] },
    { route: `/events/${SLUGS.event}`, expected: ['Landmark'] },
    { route: `/threads/${SLUGS.thread}`, expected: ['Active', 'Contested'] },
    { route: '/threads/ai-and-labor', expected: ['Active'] },
  ];
  for (const { route, expected } of MARKERS) {
    test(`${route} shows its markers at 390x844 with the metadata closed`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route);
      await expect(page.locator('details.wiki-article__metadata')).not.toHaveAttribute('open', '');
      const markers = page.locator('.wiki-article__header .wiki-article__markers > *');
      await expect(markers).toHaveText(expected, { ignoreCase: true });
      for (const marker of await markers.all()) await expect(marker).toBeVisible();
    });
  }

  for (const { width, collapsed } of [
    { width: 780, collapsed: true },
    { width: 781, collapsed: false },
    { width: 1440, collapsed: false },
  ]) {
    test(`article markers follow the metadata panel at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/events/anthropic-dod-debate-2026');
      const metadata = page.locator('.wiki-article__metadata');
      const markers = page.locator('.wiki-article__markers');
      if (collapsed) {
        await expect(metadata).not.toHaveAttribute('open', '');
        await expect(markers).toBeVisible();
      } else {
        await expect(metadata).toHaveAttribute('open', '');
        await expect(markers).toBeHidden();
      }
    });
  }

  test('controversy metadata stays visible at 390x844 without a disclosure', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/controversies/${SLUGS.controversy}`);
    await expect(page.locator('.wiki-article__metadata')).toHaveCount(0);
    await expect(page.locator('.wiki-infobox')).toBeVisible();
    await expect(page.locator('.wiki-infobox dt').filter({ hasText: 'Status' })).toBeVisible();
  });

  test('the open desktop panel keeps a contested thread\'s contestation', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/threads/${SLUGS.thread}`);
    await expect(page.locator('.wiki-article__metadata')).toHaveAttribute('open', '');
    await expect(page.locator('.wiki-infobox dd').filter({ hasText: 'Contested' })).toBeVisible();
  });

  for (const route of ['/events/anthropic-dod-debate-2026', `/threads/${SLUGS.thread}`]) {
    for (const width of [390, 1440]) {
      test(`${route} prints its full metadata from a ${width}px window`, async ({ page }) => {
        await page.setViewportSize({ width, height: 844 });
        await page.goto(route);
        await page.emulateMedia({ media: 'print' });
        await page.setViewportSize({ width: 624, height: 844 });
        await expect(page.locator('.wiki-article__metadata .wiki-infobox')).toBeVisible();
        await expect(page.locator('.wiki-article__metadata > summary')).toBeHidden();
      });
    }
  }

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('desktop articles show their markers while the metadata stays collapsed', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/events/anthropic-dod-debate-2026');
      await expect(page.locator('.wiki-article__metadata')).not.toHaveAttribute('open', '');
      await expect(page.locator('.wiki-article__markers')).toBeVisible();
    });

    test('articles print their full metadata', async ({ page }) => {
      await page.setViewportSize({ width: 624, height: 844 });
      await page.goto('/events/anthropic-dod-debate-2026');
      await page.emulateMedia({ media: 'print' });
      await expect(page.locator('.wiki-article__metadata .wiki-infobox')).toBeVisible();
      await expect(page.locator('.wiki-article__metadata > summary')).toBeHidden();
    });
  });

  for (const route of ['/events/anthropic-dod-debate-2026', '/threads/scaling-laws-debate']) {
    for (const width of [1024, 1200, 1440]) {
      test(`${route} keeps section spacing after the lead at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(route);
        const gap = await page.locator('.wiki-article__lead').evaluate((lead) => {
          const heading = document.querySelector('.wiki-article__prose > h2')!;
          return heading.getBoundingClientRect().top - lead.getBoundingClientRect().bottom;
        });
        expect(Math.round(gap)).toBeGreaterThanOrEqual(32);
      });
    }
  }

  for (const width of [320, 344, 360, 375, 390]) {
    for (const route of ['/', '/about', '/explore']) {
      test(`utility links on ${route} stay on one line inside the viewport at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 844 });
        await page.goto(route);
        await page.evaluate(() => document.fonts.ready);
        const links = await page.locator('.wiki-utilbar a').evaluateAll((anchors) => anchors.map((el) => {
          const range = document.createRange();
          range.selectNodeContents(el);
          const box = el.getBoundingClientRect();
          return { text: el.textContent, left: box.left, right: box.right, lines: range.getClientRects().length };
        }));
        expect(links.length).toBe(6);
        for (const link of links) {
          expect(link.left, `${link.text} left edge`).toBeGreaterThanOrEqual(0);
          expect(link.right, `${link.text} right edge`).toBeLessThanOrEqual(width);
          expect(link.lines, `${link.text} line count`).toBe(1);
        }
      });
    }
  }

  for (const width of [390, 1024, 1200, 1440]) {
    test(`article prose respects its measure at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/events/${SLUGS.event}`);
      await page.evaluate(() => document.fonts.ready);
      const blocks = await page.locator('.wiki-article__lead, .wiki-article__prose').evaluateAll((els) => els.map((el) => {
        const style = getComputedStyle(el);
        return { width: el.getBoundingClientRect().width, max: parseFloat(style.maxWidth) };
      }));
      expect(blocks.length).toBe(2);
      for (const block of blocks) {
        expect(block.width).toBeLessThanOrEqual(block.max + 1);
        expect(block.max).toBeLessThan(600);
      }
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

test.describe('aids that live in a rail on wide screens', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'viewport-own');
  });

  const entryCount = (count: number) => `${count} ${count === 1 ? 'entry' : 'entries'}`;

  // The right rail is hidden at 1024px and below.
  for (const width of [375, 900, 1024, 1025, 1280]) {
    test(`an entry page shows one epistemic key at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/events/${SLUGS.event}`);
      const inArticle = page.locator('.wiki-article details').filter({ hasText: 'How to read the metadata' });
      const inRail = page.locator('.wiki-rail[data-side="right"]').getByRole('heading', { name: 'Epistemic key' });
      if (width > 1024) {
        await expect(inRail).toBeVisible();
        await expect(inArticle).toBeHidden();
        return;
      }
      await expect(inRail).toBeHidden();
      await expect(inArticle).toBeVisible();
      await inArticle.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(inArticle.getByText('Fundamentally alters the trajectory')).toBeVisible();
    });

    test(`the home page lists Recently added and Active controversies once at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      for (const name of ['Recently added', 'Active controversies']) {
        // Role queries leave out what a screen reader does not announce.
        await expect(page.getByRole('heading', { name, exact: true })).toHaveCount(1);
        const inMain = page.locator(`.wiki-main section:has(> h2:text-is("${name}"))`);
        const inRail = page.locator(`.wiki-rail .rail-block:has(> h4:text-is("${name}"))`);
        const [exposed, absent] = width > 1024 ? [inRail, inMain] : [inMain, inRail];
        await expect(exposed).toBeVisible();
        await expect(absent).toBeHidden();
        const hrefs = await absent.locator('a').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
        expect(hrefs.length).toBeGreaterThan(0);
        await expect(exposed.getByRole('heading', { name, exact: true })).toHaveCount(1);
        await expect(absent.getByRole('heading')).toHaveCount(0);
        await expect(absent.getByRole('link')).toHaveCount(0);
        const exposedLinks = exposed.getByRole('link');
        await expect(exposedLinks).toHaveCount(hrefs.length);
        expect(await exposedLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual(hrefs);
      }
      if (width > 1024) return;
      const sections = await page.locator('.wiki-main h2:visible').allTextContents();
      expect(sections.slice(sections.indexOf('Recent entries')).slice(0, 3))
        .toEqual(['Recent entries', 'Recently added', 'Active controversies']);
      const added = await page.locator('.wiki-rail .rail-block:has(> h4:text-is("Recently added")) time').allTextContents();
      await expect(page.locator('.wiki-main section:has(> h2:text-is("Recently added")) time'))
        .toHaveText(added.map((day) => `added ${day}`));
    });
  }

  // The left rail, which lists an actor's years, is hidden at 780px and below.
  for (const width of [375, 780, 781, 1280]) {
    test(`an actor page links to each year once at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(`/actors/${SLUGS.actor}`);
      const inArticle = page.locator('.wiki-article').getByRole('navigation', { name: 'Years' });
      const inRail = page.locator('.wiki-rail .rail-block:has(> h4:text-is("Years"))');
      if (width > 780) {
        await expect(inRail).toBeVisible();
        await expect(inArticle).toHaveCount(0);
        return;
      }
      await expect(inRail).toBeHidden();
      await expect(inArticle).toBeVisible();
      const years = await page.locator('.actor-year').evaluateAll((sections) => sections.map((section) => ({
        year: section.querySelector('h2')!.textContent!,
        entries: section.querySelectorAll('li').length,
      })));
      expect(years.length).toBeGreaterThan(1);
      await expect(inArticle.getByRole('listitem')).toHaveText(years.map(({ year, entries }) => `${year} ${entryCount(entries)}`));
      for (const { year } of years) {
        await inArticle.getByRole('link', { name: year, exact: true }).focus();
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(new RegExp(`#y-${year}$`));
        await expect(page.locator(`#y-${year}`).getByRole('heading', { name: year, exact: true })).toBeInViewport();
      }
    });
  }

  for (const width of [375, 1280]) {
    test(`a long thread timeline has year subheadings and year links at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(LONG_THREAD);
      const timeline = page.locator('section:has(> h2:text-is("Event timeline"))');
      const years = await timeline.locator('.thread-year').evaluateAll((groups) => groups.map((group) => ({
        year: group.querySelector('h3')!.textContent!,
        dates: [...group.querySelectorAll('time')].map((time) => time.dateTime),
      })));
      expect(years.length).toBeGreaterThan(1);
      for (const { year, dates } of years) {
        expect(dates.length).toBeGreaterThan(0);
        expect(dates.every((date) => date.startsWith(`${year}-`)), `entries under ${year}`).toBe(true);
      }
      const dates = years.flatMap((group) => group.dates);
      expect(dates).toEqual([...dates].sort());

      const links = timeline.getByRole('navigation', { name: 'Years' });
      await expect(links).toBeVisible();
      await expect(links.getByRole('listitem')).toHaveText(years.map(({ year, dates }) => `${year} ${entryCount(dates.length)}`));
      for (const { year } of years) {
        await links.getByRole('link', { name: year, exact: true }).focus();
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(new RegExp(`#y-${year}$`));
        await expect(timeline.getByRole('heading', { name: year, exact: true })).toBeInViewport();
      }
    });
  }

  test('only timelines of more than 20 entries in more than one year have year links', async ({ page, request }) => {
    const { threads } = await (await request.get('/data/threads.json')).json() as { threads: { id: string; event_count: number }[] };
    expect(threads.some((thread) => thread.event_count > 20)).toBe(true);
    for (const { id, event_count } of threads) {
      await page.goto(`/threads/${id}`);
      const years = await page.locator('.thread-year').count();
      expect(years, `year subheadings on ${id}`).toBeGreaterThan(0);
      await expect(page.getByRole('navigation', { name: 'Years' }), `year links on ${id}`)
        .toHaveCount(event_count > 20 && years > 1 ? 1 : 0);
    }
  });

  test('year links are left out of print', async ({ page }) => {
    for (const route of [`/actors/${SLUGS.actor}`, LONG_THREAD]) {
      await page.goto(route);
      await page.emulateMedia({ media: 'print' });
      // Letter with one-inch margins, narrower than the width at which the actor's row appears on screen.
      await page.setViewportSize({ width: 624, height: 864 });
      const links = page.locator('nav[aria-label="Years"]');
      await expect(links).toHaveCount(1);
      await expect(links).toBeHidden();
      await expect(page.locator('.actor-year h2, .thread-year h3').first()).toBeVisible();
    }
  });
});
