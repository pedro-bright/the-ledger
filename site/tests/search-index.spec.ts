import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import { filesIn, writeBuildOutput } from '../../scripts/vercel-output.mjs';
import { SLUGS } from './_slugs';

/**
 * The Pagefind index that the site build writes after Astro, queried in the page through
 * Pagefind's own browser API. Desktop only because the index does not vary by viewport.
 */
const DIST = path.join(process.cwd(), 'dist');

type Result = { url: string; filters: Record<string, string[]>; meta: Record<string, string> };

// Strings are not transpiled, so the dynamic import reaches the browser as written.
async function loadPagefind(page: Page) {
  await page.goto('/about');
  await page.evaluate("import('/pagefind/pagefind.js').then((pagefind) => { window.pagefind = pagefind; })");
}

function search(page: Page, term: string, filters: Record<string, string> = {}): Promise<Result[]> {
  return page.evaluate(async ({ term, filters }) => {
    const { results } = await (window as any).pagefind.search(term, { filters });
    return Promise.all(results.map(async (result: any) => {
      const { url, filters, meta } = await result.data();
      return { url, filters, meta };
    }));
  }, { term, filters });
}

test.describe('search index', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'desktop only');
    await loadPagefind(page);
  });

  test('the build publishes the Pagefind script and index in the Vercel output', () => {
    const indexFiles = filesIn(path.join(DIST, 'pagefind'));
    expect(indexFiles).toContain('pagefind.js');
    expect(indexFiles).toContain('pagefind-entry.json');
    expect(indexFiles.filter((file: string) => file.startsWith('index/')).length).toBeGreaterThan(0);
    expect(indexFiles.filter((file: string) => file.startsWith('fragment/')).length).toBeGreaterThan(0);

    const output = fs.mkdtempSync(path.join(os.tmpdir(), 'ledger-search-output-'));
    try {
      writeBuildOutput(DIST, output);
      for (const file of indexFiles) {
        expect(fs.existsSync(path.join(output, 'static', 'pagefind', file)), file).toBe(true);
      }
    } finally {
      fs.rmSync(output, { recursive: true, force: true });
    }
  });

  test('only event, thread, controversy and actor pages are indexed, each with its type', async ({ page }) => {
    const pagesIn = (dir: string) =>
      filesIn(path.join(DIST, dir)).filter((file: string) => /^[^/]+\/index\.html$/.test(file)).length;
    const expected = {
      event: pagesIn('events'),
      thread: pagesIn('threads'),
      controversy: pagesIn('controversies'),
      actor: pagesIn('actors'),
    };
    const filters = await page.evaluate(() => (window as any).pagefind.filters());
    expect(filters.type).toEqual(expected);

    const entry = JSON.parse(fs.readFileSync(path.join(DIST, 'pagefind', 'pagefind-entry.json'), 'utf8'));
    const total = Object.values(expected).reduce((sum, count) => sum + count, 0);
    expect(entry.languages.en.page_count).toBe(total);
  });

  test('an exact thread title finds the thread page first', async ({ page }) => {
    const [first] = await search(page, 'The Scaling Laws Debate');
    expect(first.url).toBe(`/threads/${SLUGS.thread}/`);
    expect(first.filters.type).toEqual(['thread']);
  });

  test('a phrase from an event body finds that event with its category, year and date', async ({ page }) => {
    // The phrase appears only in the What Happened section of the GPT-4 release event.
    const results = await search(page, '"Biology Olympiad"');
    expect(results.map(({ url }) => url)).toEqual([`/events/${SLUGS.event}/`]);
    expect(results[0].filters).toEqual({ type: ['event'], category: ['models'], year: ['2023'] });
    expect(results[0].meta.date).toBe('2023-03-14');
  });

  test('the actor filter limits results to actor pages', async ({ page }) => {
    const results = await search(page, 'OpenAI', { type: 'actor' });
    expect(results.map(({ url }) => url)).toContain(`/actors/${SLUGS.actor}/`);
    for (const result of results) expect(result.filters.type, result.url).toEqual(['actor']);
  });
});
