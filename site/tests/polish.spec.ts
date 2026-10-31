import { test, expect, type Locator } from '@playwright/test';
import { SLUGS } from './_slugs';

const article = `/events/${SLUGS.event}`;

test('article contents links work with and without JavaScript', async ({ browser }) => {
  for (const javaScriptEnabled of [true, false]) {
    const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, viewport: { width: 390, height: 844 }, javaScriptEnabled });
    const page = await context.newPage();
    await page.goto(`/threads/${SLUGS.thread}`);
    const contents = page.getByRole('navigation', { name: 'On this page' });
    await expect(contents).toBeVisible();
    await contents.getByText('Contents', { exact: true }).click();
    const links = contents.locator('a');
    expect(await links.count()).toBeGreaterThan(3);
    const hrefs = await links.evaluateAll((els) => els.map((el) => el.getAttribute('href')!));
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const href of hrefs) await expect(page.locator(href)).toHaveCount(1);
    const timeline = contents.getByRole('link', { name: 'Event timeline', exact: true });
    await timeline.click();
    await expect(page).toHaveURL(/#section-event-timeline$/);
    await expect(page.locator('#section-event-timeline')).toBeInViewport();
    await page.goto(article);
    await page.getByRole('link', { name: 'References', exact: true }).first().click();
    await expect(page.locator('#refs-head')).toBeInViewport();
    await context.close();
  }
});

test('desktop contents occupy the navigation rail', async ({ page }) => {
  test.skip(test.info().project.name === 'mobile');
  await page.goto(`/threads/${SLUGS.thread}`);
  await expect(page.locator('.wiki-rail[data-side="left"]').getByRole('navigation', { name: 'On this page' })).toBeVisible();
});

test('desktop contents links show a whole focus ring clear of their text', async ({ page }) => {
  test.skip(test.info().project.name === 'mobile', 'The contents list scrolls only in the desktop rail');
  await page.goto(`/threads/${SLUGS.thread}`);
  const contents = page.locator('.wiki-rail #article-contents');
  const links = contents.locator('a');
  await expect(links.first()).toBeVisible();
  const count = await links.count();
  for (const contrast of ['no-preference', 'more'] as const) {
    await page.emulateMedia({ contrast });
    await contents.locator('summary').focus();
    for (let index = 0; index < count; index++) {
      await page.keyboard.press('Tab');
      await expect(links.nth(index)).toBeFocused();
      const ring = await links.nth(index).evaluate((link) => {
        const box = link.getBoundingClientRect();
        const clip = link.closest('ol')!.getBoundingClientRect();
        const style = getComputedStyle(link);
        const offset = parseFloat(style.outlineOffset);
        const spread = parseFloat(style.outlineWidth) + offset;
        const text = document.createRange();
        text.selectNodeContents(link);
        return {
          focusVisible: link.matches(':focus-visible'),
          clipped: Math.max(clip.left - box.left + spread, box.right + spread - clip.right, clip.top - box.top + spread, box.bottom + spread - clip.bottom),
          textGap: text.getBoundingClientRect().left - (box.left - offset),
        };
      });
      expect(ring.focusVisible).toBe(true);
      expect(ring.clipped).toBeLessThanOrEqual(0);
      expect(ring.textGap).toBeGreaterThan(0);
    }
  }
});

test('contents appear only on long articles and list only their h2 sections', async ({ page }) => {
  await page.goto(`/threads/${SLUGS.thread}`);
  const contents = page.locator('#article-contents');
  const hrefs = await contents.locator('a').evaluateAll((els) => els.map((el) => el.getAttribute('href')!));
  expect(hrefs.length).toBeGreaterThanOrEqual(3);
  for (const href of hrefs) expect(await page.locator(href).evaluate((el) => el.tagName)).toBe('H2');
  await expect(page.getByRole('heading', { level: 3, name: 'Continued-scaling reading' })).toHaveId('section-continued-scaling-reading');
  await expect(contents.getByText('Continued-scaling reading')).toHaveCount(0);

  await page.goto('/events/openai-misalignment-reporting-framework-six-reports');
  await expect(contents).toHaveCount(1);
  for (const shortOrIndexPage of ['/events/reflection-beam-open-weights', `/controversies/${SLUGS.controversy}`, `/actors/${SLUGS.actor}`]) {
    await page.goto(shortOrIndexPage);
    await expect(page.locator('#article-contents')).toHaveCount(0);
  }
});

test('repeated section headings get distinct generated anchors', async ({ page }) => {
  await page.goto(`/controversies/${SLUGS.controversy}`);
  const ids = await page.getByRole('heading', { level: 3, name: 'Sources', exact: true }).evaluateAll((els) => els.map((el) => el.id));
  expect(ids.length).toBeGreaterThan(1);
  expect(ids[0]).toBe('section-sources');
  expect(ids[1]).toBe('section-sources-2');
  expect(new Set(ids).size).toBe(ids.length);
});

test('filter removal is a usable target and retains keyboard focus', async ({ page }) => {
  await page.goto('/explore?category=models&sig=major');
  const remove = page.getByRole('button', { name: 'Remove Models filter', exact: true });
  await expect(remove).toBeVisible();
  const box = (await remove.boundingBox())!;
  expect(box.width).toBeGreaterThanOrEqual(24);
  expect(box.height).toBeGreaterThanOrEqual(24);
  await remove.focus();
  await page.keyboard.press('Enter');
  await expect(remove).toHaveCount(0);
  await expect(page).not.toHaveURL(/category=models/);
  await expect(page.getByRole('button', { name: 'Remove Major filter' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#explorer-search')).toBeFocused();
});

test('metadata labels and values use consistent readable sizes', async ({ page }) => {
  await page.goto(article);
  if (test.info().project.name === 'mobile') await page.locator('.wiki-article__metadata summary').click();
  await expect(page.locator('.wiki-infobox dt').first()).toHaveCSS('font-size', '12px');
  await expect(page.locator('.wiki-infobox dd').first()).toHaveCSS('font-size', '13px');
  await expect(page.locator('.wiki-infobox .mono').first()).toHaveCSS('font-size', '13px');
  await expect(page.locator('.flag-chip').first()).toHaveCSS('font-size', '12px');
  await page.goto('/explore');
  await expect(page.locator('.explorer-row__date').first()).toHaveCSS('font-size', '13px');
  await page.goto('/actors');
  await expect(page.locator('.actors-row__alias').first()).toHaveCSS('font-size', '13px');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('metadata values, dates, and citations render their type roles', async ({ page }) => {
  const value = async (locator: Locator) => {
    await expect(locator).toHaveCSS('font-family', /^Inter/);
    await expect(locator).toHaveCSS('font-size', '13px');
    await expect(locator).toHaveCSS('line-height', '18.85px');
    await expect(locator).toHaveCSS('font-weight', '400');
  };
  const code = async (locator: Locator) => {
    await expect(locator).toHaveCSS('font-family', /^"JetBrains Mono"/);
    await expect(locator).toHaveCSS('font-size', '13px');
    await expect(locator).toHaveCSS('line-height', '18.85px');
    await expect(locator).toHaveCSS('font-weight', '400');
  };
  const citation = async (locator: Locator) => {
    await expect(locator).toHaveCSS('font-family', /^"Source Serif 4/);
    await expect(locator).toHaveCSS('font-size', '14px');
    await expect(locator).toHaveCSS('line-height', '21.7px');
  };

  await page.goto(article);
  await value(page.locator('.wiki-infobox .category-tag'));
  await citation(page.locator('.wiki-article__references ol'));
  await code(page.locator('.wiki-footer__rev'));

  for (const record of ['/events/anthropic-dod-debate-2026', '/threads/ai-copyright-wars']) {
    await page.goto(record);
    await value(page.locator('.wiki-article__lastmod'));
    await code(page.locator('.wiki-article__lastmod time'));
  }

  await page.goto('/');
  await value(page.locator('.featured-meta .category-tag'));
  await value(page.locator('.wiki-thread-list__meta').first());
  await value(page.locator('.rail-controversy__meta').first());
  await code(page.locator('.intro__stats time'));

  await page.goto('/explore');
  await value(page.locator('.explorer-row__category').first());

  await page.goto('/controversies');
  await value(page.locator('.cx-card__meta a').first());

  await page.goto(`/controversies/${SLUGS.controversy}`);
  await value(page.locator('.position__proponent').first());
  await citation(page.locator('.position__sources li').first());

  await page.goto(`/threads/${SLUGS.thread}`);
  await value(page.locator('.snapshot dd').first());
  await value(page.locator('.rail-block__body p').first());

  await page.goto('/threads');
  await value(page.locator('.threads-table__curator').first());
  await code(page.locator('.threads-table__count').first());

  await page.goto('/actors/liang-wenfeng');
  await value(page.locator('.wiki-infobox dt:has-text("Aliases") + dd'));
  await expect(page.locator('.wiki-infobox dt:has-text("Aliases") + dd')).toContainText('梁文锋');
});

test('phone titles use reading-sized optical detail and desktop keeps its display role', async ({ browser }) => {
  test.slow();
  for (const width of [412, 1440]) {
    const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, viewport: { width, height: 900 }, deviceScaleFactor: 2.625 });
    const page = await context.newPage();
    for (const route of ['/', '/graph', '/explore', '/threads', '/controversies', '/actors', '/about', '/missing-page', article, '/events/openai-misalignment-reporting-framework-six-reports', `/threads/${SLUGS.thread}`, `/actors/${SLUGS.actor}`, `/controversies/${SLUGS.controversy}`]) {
      await page.goto(route);
      const title = page.locator('h1').first();
      await expect(title).toHaveCSS('font-variation-settings', new RegExp(`"opsz" ${width === 412 ? 32 : 144}`));
      if (width === 412 && route.startsWith('/events/')) {
        await expect(title).toHaveCSS('font-size', '32px');
        await expect(title).toHaveCSS('line-height', '36.8px');
      }
    }
    await context.close();
  }
});

for (const [path, selector] of [['/about', '.wiki-layout'], [article, '.wiki-article__prose']]) {
  test(`cold body font swap keeps ${selector} fixed on ${path}`, async ({ browser }) => {
    const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, viewport: { width: 1440, height: 900 } });
    let release!: () => void;
    const held = new Promise<void>((resolve) => { release = resolve; });
    try {
      const page = await context.newPage();
      await page.route(/source-serif-4-latin-wght-normal.*\.woff2/, async (route) => { await held; await route.continue(); });
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      const geometry = () => page.locator(selector).evaluate((el) => ({ width: el.getBoundingClientRect().width, x: el.getBoundingClientRect().x }));
      const before = await geometry();
      const preload = page.locator('link[rel="preload"][as="font"]');
      release();
      await page.evaluate(() => document.fonts.ready);
      const after = await geometry();
      await test.info().attach('cold-font-geometry', { body: JSON.stringify({ before, after }), contentType: 'application/json' });
      expect(after).toEqual(before);
      await expect(preload).toHaveAttribute('fetchpriority', 'high');
      await expect(preload).toHaveAttribute('crossorigin', 'anonymous');
    } finally { release(); await context.close(); }
  });
}

test('removing the last chip by keyboard keeps the other filter and its focus', async ({ page }) => {
  await page.goto('/explore?cat=models&sig=major');
  await page.getByRole('button', { name: 'Remove Major filter', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Remove Models filter', exact: true })).toBeFocused();
  await expect(page).toHaveURL(/cat=models/);
  await expect(page).not.toHaveURL(/sig=major/);
});

test('Reset all has a usable target and returns keyboard focus to search', async ({ page }) => {
  await page.goto('/explore?cat=models');
  const reset = page.getByRole('button', { name: 'Reset all', exact: true });
  const box = (await reset.boundingBox())!;
  expect(box.height).toBeGreaterThanOrEqual(24);
  await reset.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#explorer-search')).toBeFocused();
});

for (const touch of [false, true]) {
  test(`${touch ? 'touch' : 'mouse'} removal does not focus search or move the reader away`, async ({ browser }) => {
    const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, viewport: { width: 390, height: 844 }, hasTouch: touch, isMobile: touch });
    try {
      const page = await context.newPage();
      await page.goto('/explore?cat=models');
      const remove = page.getByRole('button', { name: 'Remove Models filter', exact: true });
      await remove.scrollIntoViewIfNeeded();
      if (touch) await remove.tap();
      else await remove.click();
      await expect(remove).toHaveCount(0);
      await expect(page.locator('#explorer-search')).not.toBeFocused();
      expect(await page.evaluate(() => scrollY)).toBeGreaterThan(100);
    } finally { await context.close(); }
  });
}

test('desktop contents enhancement keeps the reading body in place on a cold fragment load', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, viewport: { width: 1440, height: 900 } });
  let release!: () => void;
  const held = new Promise<void>((resolve) => { release = resolve; });
  try {
    const page = await context.newPage();
    let enhancement = '';
    await page.route(`**/threads/${SLUGS.thread}`, async (route) => {
      const response = await route.fetch();
      const html = (await response.text()).replace(/<script type="module">([^<]*#article-contents[^<]*)<\/script>/, (_match, script: string) => {
        enhancement = script;
        return '<script type="module" src="/__held-article-shell.js"></script>';
      });
      await route.fulfill({ response, body: html });
    });
    await page.route('**/__held-article-shell.js', async (route) => {
      await held;
      await route.fulfill({ contentType: 'text/javascript', body: enhancement });
    });
    await page.goto(`/threads/${SLUGS.thread}#section-open-questions`, { waitUntil: 'commit' });
    await expect(page.locator('#article-contents')).toBeAttached();
    expect(enhancement).not.toBe('');
    await expect(page.locator('.wiki-rail #article-contents')).toHaveCount(0);
    await page.evaluate(async () => { await document.fonts.ready; });
    const top = () => page.locator('.wiki-article__body').evaluate((el) => el.getBoundingClientRect().top + scrollY);
    const before = await top();
    release();
    await expect(page.locator('.wiki-rail #article-contents')).toBeVisible();
    expect(await top()).toBeCloseTo(before, 1);
    await expect(page.locator('#section-open-questions')).toBeInViewport();
  } finally { release(); await context.close(); }
});

test('fallback font matching loads real emphasis faces while the web fonts are held', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: test.info().project.use.baseURL });
  let release!: () => void;
  const held = new Promise<void>((resolve) => { release = resolve; });
  try {
    const page = await context.newPage();
    await page.route(/source-serif-4-latin-wght-(normal|italic).*\.woff2/, async (route) => { await held; await route.continue(); });
    await page.goto(article, { waitUntil: 'domcontentloaded' });
    const hasGeorgia = await page.evaluate(async () => {
      try {
        await new FontFace('Georgia availability probe', 'local("Georgia")').load();
        return true;
      } catch { return false; }
    });
    test.skip(!hasGeorgia, 'Georgia is not installed in this browser environment');
    const faces = await page.evaluate(async () => {
      const styles = ['600 16px', 'italic 16px', 'italic 600 16px'];
      return Promise.all(styles.map(async (style) => (await document.fonts.load(`${style} "Source Serif Fallback"`, 'Archival evidence')).map((face) => ({ style: face.style, weight: face.weight, status: face.status }))));
    });
    expect(faces[0]).toEqual([expect.objectContaining({ style: 'normal', weight: '600 900', status: 'loaded' })]);
    expect(faces[1]).toEqual([expect.objectContaining({ style: 'italic', weight: '400', status: 'loaded' })]);
    expect(faces[2]).toEqual([expect.objectContaining({ style: 'italic', weight: '600 900', status: 'loaded' })]);
  } finally { release(); await context.close(); }
});

test('a linked uncontested thread keeps its badge inside the infobox at 820px', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 900 });
  await page.goto('/threads/creative-industries-ai');
  await page.evaluate(() => document.fonts.ready);
  const overflow = await page.locator('.wiki-infobox').evaluate((box) => {
    const right = box.getBoundingClientRect().right;
    return [...box.querySelectorAll('dd, dd span')].filter((el) => el.getBoundingClientRect().right > right).map((el) => el.textContent);
  });
  expect(overflow).toEqual([]);
});
