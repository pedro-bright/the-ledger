import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import { SLUGS } from './_slugs';

const DIST = path.join(process.cwd(), 'dist');
const SITE_FEEDS = ['/feed.xml', '/rss.xml'];

const THREAD_LINK = 'thread feed (Atom)';

function timeline(page: Page) {
  return page.locator('section', { has: page.getByRole('heading', { level: 2, name: 'Event timeline', exact: true }) });
}

const PAGES = [
  { url: `/threads/${SLUGS.thread}`, feed: `/threads/${SLUGS.thread}/feed.xml`, link: THREAD_LINK },
  { url: '/corrections', feed: '/corrections/feed.xml', link: 'corrections feed (Atom)' },
];

for (const { url, feed, link } of PAGES) {
  test(`${url} announces its feed before the site feeds and links it on the page`, async ({ page, request }) => {
    await page.goto(url);
    const alternates = await page.locator('head link[rel="alternate"]').evaluateAll((links) => links.map((l) => l.getAttribute('href')));
    expect(alternates).toEqual([feed, ...SITE_FEEDS]);
    const visible = page.getByRole('link', { name: link, exact: true });
    await expect(visible).toBeVisible();
    await expect(visible).toHaveAttribute('href', feed);

    const response = await request.get(feed);
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain(`<link href="https://the-ledger.net${feed}" rel="self" type="application/atom+xml"/>`);
  });
}

test('every thread page announces a feed the build publishes and links it in the event timeline', async ({ page }) => {
  const threads = fs
    .readdirSync(path.join(DIST, 'threads'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  expect(threads.length).toBeGreaterThan(10);
  for (const thread of threads) {
    const html = fs.readFileSync(path.join(DIST, 'threads', thread, 'index.html'), 'utf8');
    const feed = `/threads/${thread}/feed.xml`;
    expect(html, thread).toMatch(new RegExp(`<link rel="alternate" type="application/atom\\+xml" title="[^"]+" href="${feed}">`));
    expect(fs.readFileSync(path.join(DIST, 'threads', thread, 'feed.xml'), 'utf8'), thread).toContain(`<id>https://the-ledger.net${feed}</id>`);
    await page.goto(`/threads/${thread}`);
    await expect(page.getByRole('link', { name: THREAD_LINK, exact: true }), thread).toHaveCount(1);
    await expect(timeline(page).getByRole('link', { name: THREAD_LINK, exact: true }), thread).toHaveAttribute('href', feed);
  }
});

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

const EMPTY_THREAD = `---
id: zz-empty-thread
title: Empty thread
status: active
started: 2026-10-01
core_question: Does a thread with no entries still offer its feed?
curator: Curator
events: []
---

## Open Questions

- What will the first entry be?
`;

test.describe('a thread with no entries', () => {
  test.describe.configure({ mode: 'default' });

  let tempDir = '';
  let server: http.Server | undefined;
  let origin = '';

  test.beforeAll(async ({}, testInfo) => {
    if (testInfo.project.name === 'mobile') return;
    testInfo.setTimeout(300_000);

    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ledger-empty-thread-'));
    const contentDir = path.join(tempDir, 'content');
    fs.mkdirSync(path.join(contentDir, 'threads'), { recursive: true });
    fs.writeFileSync(path.join(contentDir, 'threads', 'zz-empty-thread.md'), EMPTY_THREAD);

    const distDir = path.join(tempDir, 'dist');
    execFileSync('npx', ['astro', 'build', '--outDir', distDir], {
      cwd: process.cwd(),
      env: { ...process.env, CONTENT_DIR: contentDir },
      stdio: 'pipe',
    });

    server = http.createServer((req, res) => {
      const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
      const extension = path.extname(pathname);
      const file = path.join(distDir, pathname, extension ? '' : 'index.html');
      if (!file.startsWith(distDir) || !fs.existsSync(file)) {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, { 'content-type': CONTENT_TYPES[extension] ?? CONTENT_TYPES['.html'] }).end(fs.readFileSync(file));
    });
    await new Promise<void>((resolve) => server!.listen(0, '127.0.0.1', resolve));
    origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  test.afterAll(async () => {
    server?.closeAllConnections();
    await new Promise((resolve) => (server ? server.close(resolve) : resolve(undefined)));
    if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'desktop only');
  });

  test('shows the event timeline with an empty-state line and the feed link', async ({ page }) => {
    await page.goto(`${origin}/threads/zz-empty-thread`);
    const section = timeline(page);
    await expect(section.locator('p.thread-notice')).toHaveText([
      'No entries have been added to this thread yet.',
      `To follow new entries, subscribe to the ${THREAD_LINK}.`,
    ]);
    await expect(section.getByRole('link', { name: THREAD_LINK, exact: true })).toHaveAttribute('href', '/threads/zz-empty-thread/feed.xml');
    await expect(page.getByRole('link', { name: THREAD_LINK, exact: true })).toHaveCount(1);
    await expect(section.locator('ul')).toHaveCount(0);
    await expect(page.locator('article h2')).toHaveText(['Thread metadata', 'Open Questions', 'Event timeline']);
  });
});
