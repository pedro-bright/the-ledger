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

type Result = { url: string; excerpt: string; content: string; filters: Record<string, string[]>; meta: Record<string, string> };

const ISO_DATE = /\d{4}-\d{2}-\d{2}/;

/** Lowercase words only, so text compares across Pagefind's added sentence breaks. */
const words = (text: string) => (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).join(' ');

// Strings are not transpiled, so the dynamic import reaches the browser as written.
async function loadPagefind(page: Page) {
  await page.goto('/about');
  await page.evaluate("import('/pagefind/pagefind.js').then((pagefind) => { window.pagefind = pagefind; })");
}

/** Each result with its excerpt as plain text and its indexed text. A null term lists every record the filters match. */
function search(page: Page, term: string | null, filters: Record<string, string> = {}): Promise<Result[]> {
  return page.evaluate(async ({ term, filters }) => {
    const { results } = await (window as any).pagefind.search(term, { filters });
    return Promise.all(results.map(async (result: any) => {
      const { url, excerpt, content, filters, meta } = await result.data();
      return { url, excerpt: new DOMParser().parseFromString(excerpt, 'text/html').body.textContent, content, filters, meta };
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

  test('every entry keeps its category and year filters and its date', async ({ page }) => {
    const entries = filesIn(path.join(DIST, 'events')).filter((file: string) => /^[^/]+\/index\.html$/.test(file)).length;
    const filters = await page.evaluate(() => (window as any).pagefind.filters());
    const total = (counts: Record<string, number>) => Object.values(counts).reduce((sum, count) => sum + count, 0);
    expect(total(filters.category)).toBe(entries);
    expect(total(filters.year)).toBe(entries);

    const results = await search(page, null, { type: 'event' });
    expect(results).toHaveLength(entries);
    for (const { url, filters, meta } of results) {
      expect(meta.date, url).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(filters.year, url).toEqual([meta.date.slice(0, 4)]);
    }
  });

  test('entry excerpts leave out the subtitle line and keep tags apart from their label', async ({ page }) => {
    const entries = (await search(page, 'frontier model')).filter(({ url }) => url.startsWith('/events/'));
    expect(entries.length).toBeGreaterThan(0);
    for (const { url, excerpt } of entries) {
      expect(excerpt, url).not.toContain('A ledger entry in the');
      expect(excerpt, url).not.toMatch(/Tags[\w-]/);
    }
  });

  test('entry tags stay searchable', async ({ page }) => {
    const { events } = JSON.parse(fs.readFileSync(path.join(DIST, 'data', 'events.json'), 'utf8'));
    const tagged = events
      .filter(({ tags }: { tags?: string[] }) => tags?.includes('mixture-of-experts'))
      .map(({ id }: { id: string }) => `/events/${id}/`);
    expect(tagged.length).toBeGreaterThan(0);
    expect((await search(page, 'mixture-of-experts')).map(({ url }) => url)).toEqual(expect.arrayContaining(tagged));

    // The board crisis entry carries power-dynamics as a tag and uses neither word in its text.
    expect((await search(page, 'power dynamics')).map(({ url }) => url)).toContain('/events/openai-board-crisis/');
  });

  test('a thread excerpt comes from its synthesis, not its entry timeline', async ({ page }) => {
    const thread = (await search(page, 'frontier safety')).find(({ url }) => url === '/threads/frontier-safety-policies/');
    expect(thread).toBeDefined();
    expect(thread!.excerpt).not.toMatch(ISO_DATE);

    // The excerpt may open with the title, which the record indexes just before the synthesis.
    // The index skips the synthesis's opening author and date line.
    await page.goto('/threads/frontier-safety-policies');
    const synthesis = await page.locator('.wiki-article__title, .wiki-article__lead, .wiki-article__prose').evaluateAll((parts) =>
      parts.map((part) => {
        const copy = part.cloneNode(true) as HTMLElement;
        copy.querySelectorAll('.thread-section').forEach((section) => section.remove());
        copy.querySelectorAll('p').forEach((line) => line.textContent!.startsWith('Author:') && line.remove());
        return copy.textContent;
      }).join(' '),
    );
    expect(words(synthesis)).toContain(words(thread!.excerpt));
  });

  test('an actor record and its excerpt leave out its entry list', async ({ page }) => {
    const actor = (await search(page, 'OpenAI', { type: 'actor' })).find(({ url }) => url === `/actors/${SLUGS.actor}/`);
    expect(actor).toBeDefined();
    for (const text of [actor!.excerpt, actor!.content]) {
      expect(text).not.toMatch(ISO_DATE);
      expect(text).not.toMatch(/\b(Landmark|Major|Notable)\b/);
    }

    await page.goto(`/actors/${SLUGS.actor}`);
    const yearLinks = words((await page.locator('nav[aria-label="Years"]').textContent())!);
    expect(yearLinks).toMatch(/^\d{4} \d+ entr/);
    expect(words(actor!.content)).not.toContain(yearLinks);
  });

  test('an actor alias finds the actor', async ({ page }) => {
    const results = await search(page, 'DeepMind Technologies');
    expect(results.map(({ url }) => url)).toContain('/actors/google-deepmind/');
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
