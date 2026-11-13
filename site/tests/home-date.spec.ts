import { test, expect, type APIRequestContext, type Page } from '@playwright/test';

const DAY_MS = 86_400_000;
const featured = '.wiki-box--featured h3 a';
const anniversaries = 'section:has(> h2:text-is("On this day"))';
const dateLabel = '.intro__stats time';

type HomeIndex = {
  featuredPool: { slug: string }[];
  eventsByMonthDay: Record<string, { slug: string; date: string }[]>;
};

const homeIndex = async (request: APIRequestContext): Promise<HomeIndex> => (await request.get('/home-index.json')).json();

const longDate = (iso: string) => new Date(`${iso}T12:00:00Z`)
  .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/** The days whose selections the build put in the page: the day before the build, the build day, then seven more. */
const embeddedDays = (page: Page): Promise<string[]> => page.locator('#home-window')
  .evaluate((el) => Object.keys(JSON.parse((el as HTMLElement).dataset.days!)));

/** Checks the page against the rotation and anniversary rules applied to the published index. */
async function expectDay(page: Page, index: HomeIndex, iso: string) {
  const pick = index.featuredPool[(Date.parse(iso) / DAY_MS) % index.featuredPool.length];
  const rows = (index.eventsByMonthDay[iso.slice(5)] ?? [])
    .filter((event) => !event.date.startsWith(iso.slice(0, 4)))
    .slice(0, 5)
    .map((event) => `/events/${event.slug}`);
  await expect(page.locator(dateLabel)).toHaveText(longDate(iso));
  await expect(page.locator(dateLabel)).toHaveAttribute('datetime', iso);
  await expect(page.locator(featured)).toHaveAttribute('href', `/events/${pick.slug}`);
  const links = page.locator(anniversaries).locator('li a');
  await expect(links).toHaveCount(rows.length);
  expect(await links.evaluateAll((all) => all.map((link) => link.getAttribute('href')))).toEqual(rows);
  if (rows.length > 0) await expect(page.locator(anniversaries)).toBeVisible();
  else await expect(page.locator(anniversaries)).toBeHidden();
}

test('home uses the viewing date and finds historical anniversaries', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-03-14T12:00:00'));
  await page.goto('/');
  await expect(page.locator(dateLabel)).toHaveText('March 14, 2027');
  await expect(page.locator(dateLabel)).toHaveAttribute('datetime', '2027-03-14');
  await expect(page.locator('.intro__stats > span').last()).toHaveText('March 14, 2027');
  await expect(page.locator(anniversaries).locator('a[href="/events/gpt-4-release"]')).toBeVisible();
});

test('home hides anniversaries on an empty day', async ({ page, request }) => {
  const index = await homeIndex(request);
  const emptyDay = Array.from({ length: 365 }, (_, day) => new Date(Date.UTC(2027, 0, 1 + day)).toISOString().slice(0, 10))
    .find((iso) => !index.eventsByMonthDay[iso.slice(5)])!;
  expect(emptyDay).toBeDefined();
  await page.clock.setFixedTime(new Date(`${emptyDay}T12:00:00`));
  const loaded = page.waitForResponse('**/home-index.json');
  await page.goto('/');
  await loaded;
  await expectDay(page, index, emptyDay);
  await expect(page.locator(anniversaries)).toBeHidden();
});

test('featured entry rotates with the local calendar date', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-03-14T12:00:00'));
  await page.goto('/');
  await expect(page.locator(dateLabel)).toHaveText('March 14, 2027');
  await page.waitForLoadState('networkidle');
  const first = await page.locator(featured).getAttribute('href');
  await page.clock.setFixedTime(new Date('2027-03-15T12:00:00'));
  await page.reload();
  await expect(page.locator(dateLabel)).toHaveText('March 15, 2027');
  await expect(page.locator(featured)).not.toHaveAttribute('href', first!);
});

test('days around the build are shown without a later change or the index', async ({ page, browser, request }) => {
  await page.goto('/');
  const days = await embeddedDays(page);
  expect(days).toHaveLength(9);
  const index = await homeIndex(request);
  const height = 12_000;
  for (const [iso, timezoneId] of [[days[1], 'UTC'], [days[4], 'Asia/Tokyo'], [days[0], 'America/Los_Angeles']]) {
    // Shifts are reported only inside the viewport, so it is made tall enough for the whole page.
    const context = await browser.newContext({ timezoneId, viewport: { width: page.viewportSize()!.width, height } });
    try {
      const view = await context.newPage();
      const indexRequests: string[] = [];
      view.on('request', (sent) => { if (sent.url().endsWith('/home-index.json')) indexRequests.push(sent.url()); });
      // Web fonts arrive at their own time; without them only the page's own changes can move content.
      await view.route(/\.woff2?$/, (route) => route.abort());
      await view.addInitScript(() => {
        const shifts: number[] = [];
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) shifts.push((entry as any).value);
        });
        observer.observe({ type: 'layout-shift', buffered: true });
        (window as any).homeShifts = () => [...shifts, ...observer.takeRecords().map((entry) => (entry as any).value)];
      });
      await view.clock.setFixedTime(new Date(`${iso}T12:00:00Z`));
      await view.goto('/');
      await expectDay(view, index, iso);
      expect(await view.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(height);
      await view.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      expect(await view.evaluate(() => (window as any).homeShifts())).toEqual([]);
      expect(indexRequests).toEqual([]);
    } finally { await context.close(); }
  }
});

test('a day outside the embedded days is filled from the index', async ({ page, request }) => {
  await page.goto('/');
  const buildDay = (await embeddedDays(page))[1];
  const index = await homeIndex(request);
  const iso = new Date(Date.parse(buildDay) + 30 * DAY_MS).toISOString().slice(0, 10);
  await page.clock.setFixedTime(new Date(`${iso}T12:00:00`));
  const loaded = page.waitForResponse('**/home-index.json');
  await page.reload();
  await loaded;
  await expectDay(page, index, iso);
});

test('JavaScript disabled keeps the build-time home content', async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const html = await (await request.get('/')).text();
    await page.goto('/');
    const date = page.locator(dateLabel);
    const iso = (await date.getAttribute('datetime'))!;
    expect(html).toContain(`datetime="${iso}"`);
    await expect(date).toHaveText(longDate(iso));
    await expect(page.locator(featured)).toBeVisible();
    await expect(page.locator('.wiki-box--featured .read-more')).toHaveAttribute('href', (await page.locator(featured).getAttribute('href'))!);
    expect(errors).toEqual([]);
  } finally { await context.close(); }
});

test('failed home index keeps the fallback usable without an unhandled error', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.clock.setFixedTime(new Date('2027-03-14T12:00:00'));
  await page.route('**/home-index.json', (route) => route.abort());
  const failed = page.waitForEvent('requestfailed', (sent) => sent.url().endsWith('/home-index.json'));
  await page.goto('/');
  await failed;
  await expect(page.locator(dateLabel)).toHaveText('March 14, 2027');
  await expect(page.locator(featured)).toBeVisible();
  await expect(page.locator('[data-home-random]')).toHaveAttribute('href', /^\/events\//);
  expect(errors).toEqual([]);
});

test('local calendar date determines the rotation across UTC midnight', async ({ browser, request }) => {
  const index = await homeIndex(request);
  expect(index.featuredPool.length).toBeGreaterThan(1);
  for (const [timezoneId, iso, label] of [
    ['America/Los_Angeles', '2027-03-13', 'March 13, 2027'],
    ['Pacific/Kiritimati', '2027-03-14', 'March 14, 2027'],
  ]) {
    const context = await browser.newContext({ timezoneId });
    try {
      const page = await context.newPage();
      await page.clock.setFixedTime(new Date('2027-03-14T00:30:00Z'));
      await page.goto('/');
      await expect(page.locator(dateLabel)).toHaveText(label);
      const days = Math.floor(Date.parse(`${iso}T00:00:00Z`) / DAY_MS);
      await expect(page.locator(featured)).toHaveAttribute('href', `/events/${index.featuredPool[days % index.featuredPool.length].slug}`);
    } finally { await context.close(); }
  }
});

test('Random entry chooses a destination on each click', async ({ page }) => {
  test.skip(test.info().project.name === 'mobile', 'Random entry is in the desktop navigation rail');
  await page.goto('/');
  const link = page.getByRole('link', { name: 'Random entry', exact: true });
  // The index is fetched when the reader reaches for the link.
  const loaded = page.waitForResponse('**/home-index.json');
  await link.hover();
  const index: HomeIndex = await (await loaded).json();
  const slugs = Object.values(index.eventsByMonthDay).flat().map((event) => event.slug);
  // Keep the home document open to click twice.
  await page.evaluate(() => {
    document.addEventListener('click', (event) => event.preventDefault());
  });
  for (const value of [0, 0.999999]) {
    await page.evaluate((value) => { Math.random = () => value; }, value);
    // The page may still be reading the response on the first click.
    await expect(async () => {
      await link.click();
      await expect(link).toHaveAttribute('href', `/events/${slugs[Math.floor(value * slugs.length)]}`, { timeout: 250 });
    }).toPass();
  }
});

test('a shorter entry from the index leaves the featured box its height', async ({ page }) => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => { release = resolve; });
  await page.clock.setFixedTime(new Date('2027-03-14T12:00:00'));
  await page.route('**/home-index.json', async (route) => {
    const response = await route.fetch();
    const index: HomeIndex = await response.json();
    await held;
    await route.fulfill({
      response,
      json: { ...index, featuredPool: [{ ...index.featuredPool[0], title: 'Short', excerpt: 'Short.' }] },
    });
  });
  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    const geometry = () => page.locator('.wiki-box--featured').evaluate((el) => {
      const box = el.getBoundingClientRect();
      return {
        top: box.top,
        height: box.height,
        titleTop: el.querySelector('h3')!.getBoundingClientRect().top,
        spaceBelow: box.bottom - el.querySelector('.read-more')!.getBoundingClientRect().bottom,
      };
    });
    const before = await geometry();
    release();
    await expect(page.locator(featured)).toHaveText('Short');
    const after = await geometry();
    expect(after.top).toBe(before.top);
    expect(after.titleTop).toBe(before.titleTop);
    expect(after.height).toBeCloseTo(before.height, 1);
    expect(after.spaceBelow).toBeGreaterThan(before.spaceBelow);
  } finally { release(); }
});

test('featured click tracking follows the displayed entry', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-03-14T12:00:00'));
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const title = page.locator(featured);
  const slug = (await title.getAttribute('href'))!.split('/').pop();
  const text = await title.textContent();
  await page.evaluate(() => {
    (window as any).__captures = [];
    window.posthog = { capture: (...args: unknown[]) => (window as any).__captures.push(args) } as any;
    document.addEventListener('click', (event) => event.preventDefault());
  });
  await title.click();
  expect(await page.evaluate(() => (window as any).__captures)).toEqual([
    ['featured_entry_clicked', { event_slug: slug, event_title: text }],
  ]);
});
