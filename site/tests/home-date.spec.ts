import { test, expect } from '@playwright/test';

const featured = '.wiki-box--featured h3 a';
const anniversaries = 'section:has(> h2:text-is("On this day"))';

test('home uses the viewing date and finds historical anniversaries', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-03-14T12:00:00'));
  await page.goto('/');
  await expect(page.locator('.intro__stats time')).toHaveText('March 14, 2027');
  await expect(page.locator('.intro__stats time')).toHaveAttribute('datetime', '2027-03-14');
  await expect(page.locator(anniversaries).locator('a[href="/events/gpt-4-release"]')).toBeVisible();
});

test('home hides anniversaries on an empty day', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-01T12:00:00'));
  await page.goto('/');
  await expect(page.locator('.intro__stats time')).toHaveText('January 1, 2027');
  await expect(page.locator(anniversaries)).toBeHidden();
});

test('featured entry rotates with the local calendar date', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-03-14T12:00:00'));
  await page.goto('/');
  await expect(page.locator('.intro__stats time')).toHaveText('March 14, 2027');
  await page.waitForLoadState('networkidle');
  const first = await page.locator(featured).getAttribute('href');
  await page.clock.setFixedTime(new Date('2027-03-15T12:00:00'));
  await page.reload();
  await expect(page.locator('.intro__stats time')).toHaveText('March 15, 2027');
  await expect(page.locator(featured)).not.toHaveAttribute('href', first!);
});

test('JavaScript disabled keeps the build-time home content', async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const html = await (await request.get('/')).text();
    await page.goto('/');
    const date = page.locator('.intro__stats time');
    const iso = (await date.getAttribute('datetime'))!;
    expect(html).toContain(`datetime="${iso}"`);
    const [year, month, day] = iso.split('-').map(Number);
    await expect(date).toHaveText(new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    await expect(page.locator(featured)).toBeVisible();
    await expect(page.locator('.wiki-box--featured .read-more')).toHaveAttribute('href', (await page.locator(featured).getAttribute('href'))!);
    expect(errors).toEqual([]);
  } finally { await context.close(); }
});

test('failed home index keeps the fallback usable without an unhandled error', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/home-index.json', (route) => route.abort());
  await page.goto('/');
  await expect(page.locator(featured)).toBeVisible();
  await expect(page.locator('[data-home-random]')).toHaveAttribute('href', /^\/events\//);
  expect(errors).toEqual([]);
});

test('local calendar date determines the rotation across UTC midnight', async ({ browser, request }) => {
  const index = await (await request.get('/home-index.json')).json();
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
      await expect(page.locator('.intro__stats time')).toHaveText(label);
      const days = Math.floor(Date.parse(`${iso}T00:00:00Z`) / 86_400_000);
      await expect(page.locator(featured)).toHaveAttribute('href', `/events/${index.featuredPool[days % index.featuredPool.length].slug}`);
    } finally { await context.close(); }
  }
});

test('Random entry chooses a destination on each click', async ({ page }) => {
  test.skip(test.info().project.name === 'mobile', 'Random entry is in the desktop navigation rail');
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const index = await (await page.request.get('/home-index.json')).json();
  // Wait for enhancement, then keep the home document open to click twice.
  const link = page.getByRole('link', { name: 'Random entry', exact: true });
  await page.evaluate(() => {
    document.addEventListener('click', (event) => event.preventDefault());
  });
  for (const value of [0, 0.999999]) {
    await page.evaluate((value) => { Math.random = () => value; }, value);
    await link.click({ force: true });
    await expect(link).toHaveAttribute('href', `/events/${index.eventSlugs[Math.floor(value * index.eventSlugs.length)]}`);
  }
});

test('a delayed featured update keeps its box in place', async ({ page }) => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => { release = resolve; });
  await page.clock.setFixedTime(new Date('2027-01-01T12:00:00'));
  await page.route('**/home-index.json', async (route) => { await held; await route.continue(); });
  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    const geometry = () => page.locator('.wiki-box--featured').evaluate((el) => ({ height: el.getBoundingClientRect().height, top: el.getBoundingClientRect().top }));
    const before = await geometry();
    const loaded = page.waitForResponse('**/home-index.json');
    release();
    const index = await (await loaded).json();
    const days = Math.floor(Date.UTC(2027, 0, 1) / 86_400_000);
    await expect(page.locator(featured)).toHaveAttribute('href', `/events/${index.featuredPool[days % index.featuredPool.length].slug}`);
    expect(await geometry()).toEqual(before);
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
