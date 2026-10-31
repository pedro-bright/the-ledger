import { test, expect, type Page } from '@playwright/test';

async function recordDrawing(page: Page) {
  await page.addInitScript(() => {
    const arcs: number[][] = [];
    const drawn = { frame: [] as number[][] };
    Object.assign(window, { graphArcs: arcs, graphDrawn: drawn });
    const { arc, clearRect } = CanvasRenderingContext2D.prototype;
    CanvasRenderingContext2D.prototype.clearRect = function(...args) {
      if (this.canvas.isConnected) drawn.frame = [];
      return clearRect.apply(this, args);
    };
    CanvasRenderingContext2D.prototype.arc = function(x, y, radius, ...rest) {
      if (this.canvas.isConnected && Number.isFinite(x) && Number.isFinite(y) && radius >= 3) {
        drawn.frame.push([x, y]);
        if (arcs.length < 4000) arcs.push([x, y]);
      }
      return arc.call(this, x, y, radius, ...rest);
    };
  });
}

const drawnFrame = (page: Page) => page.evaluate(() => (window as any).graphDrawn.frame as number[][]);

async function settledFrame(page: Page) {
  let previous = '';
  await expect.poll(async () => {
    const current = await drawnFrame(page);
    const stable = current.length > 0 && JSON.stringify(current) === previous;
    previous = JSON.stringify(current);
    return stable;
  }, { intervals: [1000], timeout: 30000 }).toBe(true);
  return drawnFrame(page);
}

// Scrolls a drawn node into the viewport and returns its viewport position.
async function visibleNode(page: Page) {
  return page.locator('canvas').first().evaluate((canvas: HTMLCanvasElement, frame) => {
    const { a, d, e, f } = canvas.getContext('2d')!.getTransform();
    const inset = 40;
    const node = frame
      .map(([x, y]) => ({ x: (x * a + e) / devicePixelRatio, y: (y * d + f) / devicePixelRatio }))
      .find(({ x, y }) => x > inset && x < canvas.clientWidth - inset && y > inset && y < canvas.clientHeight - inset)!;
    window.scrollBy(0, canvas.getBoundingClientRect().top + node.y - 300);
    const box = canvas.getBoundingClientRect();
    return { x: box.left + node.x, y: box.top + node.y };
  }, await drawnFrame(page));
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
  const canvas = page.locator('canvas').first();
  const transform = () => canvas.evaluate((el: HTMLCanvasElement) => {
    const { a, d, e, f } = el.getContext('2d')!.getTransform();
    return { a, d, e, f };
  });
  const before = await transform();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(transform).toEqual(before);
});

for (const reducedMotion of ['reduce', 'no-preference'] as const) {
  test(`filters hide nodes in place under ${reducedMotion} motion`, async ({ page }) => {
    test.slow();
    await page.emulateMedia({ reducedMotion });
    await recordDrawing(page);
    await page.goto('/graph');
    const all = await settledFrame(page);
    const allPositions = new Set(all.map(String));
    await page.getByRole('button', { name: 'Hide actors', exact: true }).click();
    await expect.poll(async () => (await drawnFrame(page)).length).toBeLessThan(all.length);
    const filtered = await settledFrame(page);
    expect(filtered.filter((position) => !allPositions.has(String(position)))).toEqual([]);
    await page.getByRole('button', { name: 'Show actors', exact: true }).click();
    await expect.poll(() => drawnFrame(page)).toEqual(all);
    await page.waitForTimeout(1000);
    expect(await drawnFrame(page)).toEqual(all);
  });
}

const firstDrawnFrame = (page: Page, count: number) => page.evaluate((length) => (window as any).graphArcs.slice(0, length) as number[][], count);

const staticOverviews = {
  'a phone': { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  'a touch tablet': { viewport: { width: 1024, height: 768 }, isMobile: true, hasTouch: true },
  'a narrow mouse window': { viewport: { width: 500, height: 800 } },
};

for (const [device, options] of Object.entries(staticOverviews)) {
  test(`${device} opens on a static overview of every record`, async ({ browser }) => {
    const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, ...options });
    const page = await context.newPage();
    await recordDrawing(page);
    await page.goto('/graph');
    const frame = await settledFrame(page);
    expect(await firstDrawnFrame(page, frame.length)).toEqual(frame);
    const camera = () => page.locator('canvas').first().evaluate((canvas: HTMLCanvasElement, points) => {
      const { a, d, e, f } = canvas.getContext('2d')!.getTransform();
      const outside = points.filter(([x, y]) => {
        const left = (x * a + e) / devicePixelRatio;
        const top = (y * d + f) / devicePixelRatio;
        return left < 0 || left > canvas.clientWidth || top < 0 || top > canvas.clientHeight;
      });
      return { scale: a / devicePixelRatio, outside: outside.length };
    }, frame);
    const opening = await camera();
    expect(opening.scale).toBeGreaterThan(0.239);
    // Records may only start past the edge once the camera has stopped at its minimum scale.
    if (opening.outside > 0) expect(opening.scale).toBeCloseTo(0.24);
    await page.getByRole('button', { name: 'Fit graph', exact: true }).click();
    expect((await camera()).outside).toBe(0);
    await context.close();
  });
}

test('a desktop mouse keeps the settling animation', async ({ page }) => {
  test.skip(test.info().project.name === 'mobile', 'Narrow viewports open on the static overview');
  await recordDrawing(page);
  await page.goto('/graph');
  const frame = await settledFrame(page);
  expect(await firstDrawnFrame(page, frame.length)).not.toEqual(frame);
});

test('fit graph frames only the records left visible by a filter', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await recordDrawing(page);
  await page.goto('/graph');
  await settledFrame(page);
  const canvas = page.locator('canvas').first();
  const scale = () => canvas.evaluate((el: HTMLCanvasElement) => el.getContext('2d')!.getTransform().a);
  const fit = page.getByRole('button', { name: 'Fit graph', exact: true });
  await fit.click();
  const everything = await scale();
  await page.getByRole('button', { name: 'Hide events', exact: true }).click();
  await page.getByRole('button', { name: 'Hide actors', exact: true }).click();
  await fit.click();
  await expect.poll(scale).toBeGreaterThan(everything);
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
  expect(shifts.reduce((total: number, entry: { value: number }) => total + entry.value, 0)).toBeLessThanOrEqual(0.1);
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

const statusScreens = {
  'a phone': { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  'a laptop': { viewport: { width: 1366, height: 768 } },
};

for (const [device, options] of Object.entries(statusScreens)) {
  test(`${device} shows the loading and failure messages on the first screen`, async ({ browser }) => {
    const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, ...options });
    const page = await context.newPage();
    await page.route('**/_astro/Graph.*.js', (route) => route.abort());
    await page.goto('/graph', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Loading relationship graph.')).toBeInViewport({ ratio: 1 });
    await expect(page.getByText('The graph could not load.')).toBeInViewport({ ratio: 1, timeout: 20000 });
    await expect(page.getByRole('link', { name: 'Retry graph' })).toBeInViewport({ ratio: 1 });
    await context.close();
  });
}

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
});

test('a mouse pans the map and drags nodes without enabling anything', async ({ page }) => {
  test.slow();
  await recordDrawing(page);
  await page.goto('/graph');
  const canvas = page.locator('canvas').first();
  await canvas.scrollIntoViewIfNeeded();
  await settledFrame(page);
  await expect(page.getByRole('button', { name: 'Enable touch gestures' })).toBeHidden();

  const nodeBefore = await drawnFrame(page);
  const node = await visibleNode(page);
  await page.mouse.move(node.x, node.y);
  await page.waitForTimeout(300);
  await page.mouse.down();
  await page.mouse.move(node.x + 30, node.y + 30, { steps: 5 });
  await page.mouse.up();
  await expect.poll(async () => JSON.stringify(await drawnFrame(page))).not.toBe(JSON.stringify(nodeBefore));
  await settledFrame(page);

  const transform = () => canvas.evaluate((el: HTMLCanvasElement) => {
    const { e, f } = el.getContext('2d')!.getTransform();
    return { e, f };
  });
  const panBefore = await transform();
  const frame = await drawnFrame(page);
  const empty = await canvas.evaluate((el: HTMLCanvasElement, points) => {
    const { a, d, e, f } = el.getContext('2d')!.getTransform();
    const { left, top, width } = el.getBoundingClientRect();
    const drawn = points.map(([x, y]) => [left + (x * a + e) / devicePixelRatio, top + (y * d + f) / devicePixelRatio]);
    for (let y = Math.max(top, 0) + 40; y < Math.min(top + el.clientHeight, innerHeight) - 40; y += 20) {
      for (let x = left + 20; x < left + width - 20; x += 20) {
        if (drawn.every(([px, py]) => Math.hypot(px - x, py - y) > 12)) return { x, y };
      }
    }
    return null;
  }, frame);
  await page.mouse.move(empty!.x, empty!.y);
  await page.waitForTimeout(300);
  await page.mouse.down();
  await page.mouse.move(empty!.x + 40, empty!.y + 25, { steps: 5 });
  await page.mouse.up();
  await expect.poll(transform).not.toEqual(panBefore);
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
  test.slow();
  for (const reducedMotion of ['reduce', 'no-preference'] as const) {
    const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion });
    const page = await context.newPage();
    await recordDrawing(page);
    await page.goto('/graph');
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
    await canvas.scrollIntoViewIfNeeded();
    await settledFrame(page);
    expect(await canvas.evaluate((el) => getComputedStyle(el).touchAction)).toBe('auto');
    const session = await context.newCDPSession(page);
    const swipe = async ({ x, y }: { x: number; y: number }) => {
      await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
      for (let i = 1; i <= 6; i++) {
        await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - i * 25 }] });
      }
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    };

    const transform = () => canvas.evaluate((el: HTMLCanvasElement) => {
      const { a, e, f } = el.getContext('2d')!.getTransform();
      return { a, e, f };
    });
    const mapBefore = await transform();
    const framesBefore = await drawnFrame(page);
    const node = await visibleNode(page);
    const start = await page.evaluate(() => scrollY);
    await swipe(node);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(start + 40);
    expect(await transform()).toEqual(mapBefore);
    expect(await drawnFrame(page)).toEqual(framesBefore);

    const toggle = page.getByRole('button', { name: 'Enable touch gestures' });
    await toggle.focus();
    await page.keyboard.press('Enter');
    const disable = page.getByRole('button', { name: 'Disable touch gestures' });
    await expect(disable).toHaveAttribute('aria-pressed', 'true');
    expect(await canvas.evaluate((el) => getComputedStyle(el).touchAction)).toBe('none');
    const activeNode = await visibleNode(page);
    const pageBefore = await page.evaluate(() => scrollY);
    const image = () => canvas.evaluate((el: HTMLCanvasElement) => el.toDataURL());
    const imageBefore = await image();
    await swipe(activeNode);
    await expect.poll(image).not.toBe(imageBefore);
    expect(await page.evaluate(() => scrollY)).toBe(pageBefore);
    await settledFrame(page);

    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Enable touch gestures' })).toHaveAttribute('aria-pressed', 'false');
    expect(await canvas.evaluate((el) => getComputedStyle(el).touchAction)).toBe('auto');

    const tapped = await visibleNode(page);
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [tapped] });
    await page.waitForTimeout(100);
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect(page).toHaveURL(/\/(events|threads|controversies|actors)\//);
    await context.close();
  }
});

test('a pinch over the inactive map zooms the page', async ({ browser, browserName }) => {
  test.skip(browserName !== 'chromium', 'CDP pinch synthesis requires Chromium');
  const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/graph');
  const canvas = page.locator('canvas').first();
  await expect(canvas).toBeVisible();
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  const session = await context.newCDPSession(page);
  await session.send('Input.synthesizePinchGesture', { x: box!.x + box!.width / 2, y: Math.min(box!.y + 200, 600), scaleFactor: 2, gestureSourceType: 'touch' });
  await expect.poll(() => page.evaluate(() => visualViewport!.scale)).toBeGreaterThan(1.2);
  await context.close();
});

test('larger text pushes the layout down instead of overlapping', async ({ page }) => {
  await page.goto('/graph');
  await expect(page.locator('canvas').first()).toBeVisible();
  await page.addStyleTag({ content: '.graph-client, .graph-client * { font-size: 28px !important; }' });
  const bounds = (selector: string) => page.locator(selector).evaluate((el) => {
    const { top, bottom } = el.getBoundingClientRect();
    return { top, bottom };
  });
  await expect.poll(async () => (await bounds('.graph-navigation')).bottom <= (await bounds('canvas')).top).toBe(true);
  expect((await bounds('#graph-help a')).bottom).toBeLessThanOrEqual((await bounds('#graph-relationships')).top);
});

test('the help link underlines only its words', async ({ page }) => {
  await page.goto('/graph');
  await expect(page.locator('#graph-help').getByRole('link')).toBeVisible();
  const text = await page.locator('#graph-help').getByRole('link').evaluate((el) => el.textContent);
  expect(text).toBe(text!.trim());
});

test('relationships remain usable with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/graph');
  const placeholder = page.locator('.graph-placeholder');
  expect(await placeholder.innerText()).toContain('JavaScript is required for the canvas.');
  expect(await placeholder.innerText()).not.toContain('Loading');
  expect((await page.locator('.graph-wrap').boundingBox())!.height).toBeLessThan(200);
  await page.locator('#graph-relationships > summary').click();
  const record = page.locator('details[data-record="gpt-4-release"]');
  await record.locator('summary').click();
  await expect(record.getByRole('link', { name: 'OpenAI', exact: true })).toBeVisible();
  await expect(record).toContainText('involves actor');
  await context.close();
});

test('the grouped directory lists direct links with dates, newest events first', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/graph');
  const directory = page.locator('#graph-directory');
  await directory.locator('> summary').click();
  for (const heading of ['Events', 'Threads', 'Controversies', 'Actors']) {
    await expect(directory.getByRole('heading', { name: new RegExp(`^${heading}`) })).toBeVisible();
  }
  const events = directory.locator('section').filter({ has: page.getByRole('heading', { name: /^Events/ }) });
  const dates = await events.locator('time').evaluateAll((times) => times.map((time) => time.getAttribute('datetime')!));
  expect(dates.length).toBeGreaterThan(100);
  expect(dates).toEqual([...dates].sort().reverse());
  await expect(events.locator('time').first()).toBeVisible();
  const first = events.locator('li a').first();
  await expect(first).toBeVisible();
  await expect(first).toHaveAttribute('href', /^\/events\/[a-z0-9-]+$/);
  await expect(directory.getByRole('link', { name: 'OpenAI', exact: true })).toHaveAttribute('href', '/actors/openai');
  await context.close();
});
