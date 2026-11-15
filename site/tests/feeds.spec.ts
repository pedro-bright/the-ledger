import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import { SLUGS } from './_slugs';

const DIST = path.join(process.cwd(), 'dist');
const SITE_FEEDS = ['/feed.xml', '/rss.xml'];

const PAGES = [
  { url: `/threads/${SLUGS.thread}`, feed: `/threads/${SLUGS.thread}/feed.xml`, link: 'thread feed (Atom)' },
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

test('every thread page announces and links a feed the build publishes', () => {
  const threads = fs
    .readdirSync(path.join(DIST, 'threads'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  expect(threads.length).toBeGreaterThan(10);
  for (const thread of threads) {
    const html = fs.readFileSync(path.join(DIST, 'threads', thread, 'index.html'), 'utf8');
    const feed = `/threads/${thread}/feed.xml`;
    expect(html, thread).toMatch(new RegExp(`<link rel="alternate" type="application/atom\\+xml" title="[^"]+" href="${feed}">`));
    expect(html, thread).toMatch(new RegExp(`<a href="${feed}"[ >]`));
    expect(fs.readFileSync(path.join(DIST, 'threads', thread, 'feed.xml'), 'utf8'), thread).toContain(`<id>https://the-ledger.net${feed}</id>`);
  }
});
