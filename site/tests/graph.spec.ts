import { test, expect, type Page } from '@playwright/test';

async function recordDrawing(page: Page) {
  await page.addInitScript(() => {
    const arcs: number[][] = [];
    Object.assign(window, { graphArcs: arcs });
    const arc = CanvasRenderingContext2D.prototype.arc;
    CanvasRenderingContext2D.prototype.arc = function(x, y, radius, ...rest) {
      if (this.canvas.isConnected && Number.isFinite(x) && Number.isFinite(y) && radius >= 3 && arcs.length < 4000) arcs.push([x, y]);
      return arc.call(this, x, y, radius, ...rest);
    };
  });
}

test('reduced motion draws a settled network before its first frame', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await recordDrawing(page);
  await page.goto('/graph');
  await expect(page.locator('canvas').first()).toBeVisible();
  await expect.poll(() => page.evaluate(() => (window as any).graphArcs.length)).toBeGreaterThan(500);
  const first = await page.evaluate(() => (window as any).graphArcs[0]);
  expect(Math.hypot(first[0] - Math.sqrt(50), first[1])).toBeGreaterThan(30);
  const canvasImage = () => page.locator('canvas').first().evaluate((el: HTMLCanvasElement) => el.toDataURL());
  const settled = await canvasImage();
  // Observe the same static frame over the audit's three-second sampling window.
  await page.waitForTimeout(3000);
  expect(await canvasImage()).toBe(settled);
  await page.screenshot({ path: `${process.env.GRAPH_PROOF_DIR || '/tmp'}/graph-reduced-${test.info().project.name}.png` });
  await page.getByRole('button', { name: 'Hide actors', exact: true }).click();
  await expect.poll(canvasImage).not.toBe(settled);
  const canvas = page.locator('canvas').first();
  await expect(canvas).toBeVisible();
  const transform = () => canvas.evaluate((el: HTMLCanvasElement) => {
    const { a, d, e, f } = el.getContext('2d')!.getTransform();
    return { a, d, e, f };
  });
  const before = await transform();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(transform).toEqual(before);
});

test('cold hydration reserves the graph and leaves relationships available on failure', async ({ page }) => {
  await page.addInitScript(() => {
    Object.assign(window, { graphShifts: [] });
    new PerformanceObserver((entries) => {
      for (const entry of entries.getEntries()) {
        if (!(entry as any).hadRecentInput) (window as any).graphShifts.push(entry.toJSON());
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  let release!: () => void;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  await page.route('**/_astro/Graph.*.js', async (route) => { await pending; await route.continue(); });
  await page.goto('/graph', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Loading relationship graph.')).toBeVisible();
  const before = await page.locator('.graph-wrap').boundingBox();
  expect(before!.height).toBeGreaterThan(650);
  await expect(page.locator('#graph-relationships')).toBeAttached();
  release();
  await expect(page.locator('canvas').first()).toBeVisible();
  const after = await page.locator('.graph-wrap').boundingBox();
  expect(Math.abs(after!.height - before!.height)).toBeLessThan(2);
  const shifts = await page.evaluate(() => (window as any).graphShifts);
  expect(shifts.reduce((total, entry) => total + entry.value, 0)).toBeLessThanOrEqual(0.1);
});

test('a failed island offers retry and server-rendered typed connections', async ({ page }) => {
  await page.route('**/_astro/Graph.*.js', (route) => route.abort());
  await page.goto('/graph');
  await expect(page.getByText('The graph could not load.')).toBeVisible({ timeout: 20000 });
  await expect(page.getByRole('link', { name: 'Retry graph' })).toHaveAttribute('href', '/graph');
  await page.locator('#graph-relationships > summary').focus();
  await page.keyboard.press('Enter');
  const record = page.locator('details[data-record="gpt-4-release"]');
  await record.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(record.getByRole('link', { name: 'OpenAI', exact: true })).toBeVisible();
  await expect(record).toContainText('involves actor');
  await expect(record.getByRole('link', { name: /scaling laws/i }).first()).toBeVisible();
});

test('map controls work from the keyboard and wheel scrolling stays native', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/graph');
  await expect(page.locator('canvas').first()).toBeVisible();
  const canvas = page.locator('canvas').first();
  const transform = () => canvas.evaluate((el: HTMLCanvasElement) => {
    const { a, e, f } = el.getContext('2d')!.getTransform();
    return { a, e, f };
  });
  for (const name of ['Zoom in', 'Zoom out', 'Pan left', 'Pan right', 'Pan up', 'Pan down', 'Fit graph']) {
    const control = page.getByRole('button', { name, exact: true });
    await control.focus();
    const before = await transform();
    await page.keyboard.press('Enter');
    await expect(control).toBeFocused();
    if (name !== 'Fit graph') await expect.poll(transform).not.toEqual(before);
  }
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + 100);
  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 180);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before);
  const toggle = page.getByRole('button', { name: 'Enable graph gestures' });
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Disable graph gestures' })).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Enable graph gestures' })).toHaveAttribute('aria-pressed', 'false');
});

test('repeated native year navigation reaches the final fragment', async ({ page }) => {
  await page.goto('/actors/openai');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  const older = page.locator('a[href="#y-2023"]').first();
  const newer = page.locator('a[href="#y-2026"]').first();
  if (await older.isVisible()) {
    await older.click();
    await newer.click();
    await older.focus();
    await page.keyboard.press('Enter');
    await newer.focus();
    await page.keyboard.press('Enter');
  } else {
    // The mobile layout hides the year rail; exercise its native fragments as in the audit.
    await page.evaluate(() => {
      document.querySelector<HTMLAnchorElement>('a[href="#y-2023"]')!.click();
      document.querySelector<HTMLAnchorElement>('a[href="#y-2026"]')!.click();
    });
  }
  await expect(page).toHaveURL(/#y-2026$/);
  await expect.poll(() => page.locator('#y-2026').evaluate((el) => Math.abs(el.getBoundingClientRect().top - 20))).toBeLessThan(2);
  await page.goBack();
  await page.goForward();
  await expect.poll(() => page.locator('#y-2026').evaluate((el) => Math.abs(el.getBoundingClientRect().top - 20))).toBeLessThan(2);
});

test('touch gestures scroll the page until explicitly enabled, also with reduced motion', async ({ browser, browserName }) => {
  test.skip(browserName !== 'chromium', 'CDP touch dispatch requires Chromium');
  for (const reducedMotion of ['reduce', 'no-preference'] as const) {
    const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion });
    const page = await context.newPage();
    await page.goto('/graph');
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
    await canvas.scrollIntoViewIfNeeded();
    expect(await canvas.evaluate((el) => getComputedStyle(el).touchAction)).toBe('pan-y');
    const session = await context.newCDPSession(page);
    const box = await canvas.boundingBox();
    const start = await page.evaluate(() => scrollY);
    const x = box!.x + box!.width / 2;
    const y = Math.min(box!.y + 250, 650);
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let i = 1; i <= 6; i++) {
      await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - i * 25 }] });
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(start + 40);
    await page.getByRole('button', { name: 'Enable graph gestures' }).click();
    expect(await canvas.evaluate((el) => getComputedStyle(el).touchAction)).toBe('none');
    await page.getByRole('button', { name: 'Disable graph gestures' }).click();
    expect(await canvas.evaluate((el) => getComputedStyle(el).touchAction)).toBe('pan-y');
    await context.close();
  }
});


test('relationships remain usable with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/graph');
  await page.locator('#graph-relationships > summary').click();
  const record = page.locator('details[data-record="gpt-4-release"]');
  await record.locator('summary').click();
  await expect(record.getByRole('link', { name: 'OpenAI', exact: true })).toBeVisible();
  await expect(record).toContainText('involves actor');
  await context.close();
});
