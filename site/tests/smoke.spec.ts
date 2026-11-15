import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import { parse, type DefaultTreeAdapterTypes } from 'parse5';
import { filesIn } from '../../scripts/vercel-output.mjs';
import { parseFrontmatter } from '../src/lib/frontmatter.mts';
import { SLUGS } from './_slugs';

/**
 * Smoke tests: one representative per page-type. Each route should
 *  - respond 200,
 *  - render a meaningful h1,
 *  - render the wiki chrome (masthead/nav/footer),
 *  - paint a light background (no dark-mode leak from the prior design).
 *
 * Run on the desktop (chromium) project only — the mobile project covers viewport
 * concerns in responsive.spec.ts and doesn't need to retread these assertions.
 */

const PAGE_BG = 'rgb(250, 250, 247)'; // --color-page-bg = #FAFAF7

test.describe('smoke', () => {
  // Desktop-chromium only — mobile project covers viewport concerns in responsive.spec.ts.
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'desktop only');
  });

  async function expectChrome(page: import('@playwright/test').Page) {
    await expect(page.locator('header.wiki-masthead')).toBeVisible();
    await expect(page.locator('nav.wiki-nav')).toBeVisible();
    await expect(page.locator('footer.wiki-footer')).toBeVisible();
    await expect(page.locator('footer.wiki-footer').getByRole('link', { name: 'Corrections', exact: true }))
      .toHaveAttribute('href', '/corrections');
  }

  async function expectLightBg(page: import('@playwright/test').Page) {
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe(PAGE_BG);
  }

  test('home: renders hero h1, chrome, and light bg', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    // index h1: "A durable historical record of AI." (trailing period in source)
    await expect(page.locator('h1')).toContainText('A durable historical record of AI');
    await expectChrome(page);
    await expectLightBg(page);
  });

  test('event: renders title, Infobox, and prose body', async ({ page }) => {
    const response = await page.goto(`/events/${SLUGS.event}`);
    expect(response?.status()).toBe(200);
    // The event h1 is the title from frontmatter ("OpenAI Releases GPT-4").
    const h1 = page.locator('article.wiki-article h1.wiki-article__title');
    await expect(h1).toBeVisible();
    await expect(h1).not.toBeEmpty();
    // Floated infobox with "Entry metadata" title.
    await expect(page.locator('aside.wiki-infobox')).toBeVisible();
    await expect(page.locator('.wiki-infobox__title')).toContainText('Entry metadata');
    // Prose body rendered markdown.
    await expect(page.locator('.wiki-article__prose')).toBeVisible();
    await expectChrome(page);
  });

  test('threads index: renders title and table', async ({ page }) => {
    const response = await page.goto('/threads');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Narrative threads');
    // Expect at least one thread row.
    await expect(page.locator('table.threads-table tbody tr').first()).toBeVisible();
    await expectChrome(page);
  });

  test('thread detail: renders title and Event timeline', async ({ page }) => {
    const response = await page.goto(`/threads/${SLUGS.thread}`);
    expect(response?.status()).toBe(200);
    const h1 = page.locator('article.wiki-article h1.wiki-article__title');
    await expect(h1).toBeVisible();
    await expect(h1).not.toBeEmpty();
    // Event timeline heading within article body.
    await expect(page.getByRole('heading', { name: 'Event timeline' })).toBeVisible();
    await expectChrome(page);
  });

  test('controversies index: renders title', async ({ page }) => {
    const response = await page.goto('/controversies');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Controversies');
    await expectChrome(page);
  });

  test('controversy detail: 200 and title', async ({ page }) => {
    const response = await page.goto(`/controversies/${SLUGS.controversy}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('article.wiki-article h1.wiki-article__title')).toBeVisible();
    await expectChrome(page);
  });

  test('controversy references show archived copies next to dead originals', async ({ page }) => {
    const response = await page.goto('/controversies/militarization-vs-safety');
    expect(response?.status()).toBe(200);
    const reference = page
      .locator('.wiki-article__references li')
      .filter({ has: page.locator('a[href="https://www.nscai.gov/2021-final-report/"]') });
    await expect(reference).toHaveCount(1);
    const archive = reference.getByRole('link', { name: 'archived copy', exact: true });
    await expect(archive).toBeVisible();
    await expect(archive).toHaveAttribute(
      'href',
      'https://web.archive.org/web/20211223222301/https://www.nscai.gov/2021-final-report/',
    );
  });

  test('actors index: renders title', async ({ page }) => {
    const response = await page.goto('/actors');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Actors in the ledger');
    await expectChrome(page);
  });

  test('actor detail: 200 and title', async ({ page }) => {
    const response = await page.goto(`/actors/${SLUGS.actor}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await expectChrome(page);
  });

  test('explore: renders title and mounts Explorer', async ({ page }) => {
    const response = await page.goto('/explore');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Every entry in the ledger');
    // Explorer component mount marker: the search input or results list.
    await expect(page.locator('#explorer-search')).toBeVisible();
    await expectChrome(page);
  });

  test('graph: renders title and a canvas', async ({ page }) => {
    const response = await page.goto('/graph');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('How everything connects');
    // react-force-graph-2d paints a canvas once hydrated.
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 10_000 });
    await expectChrome(page);
  });

  test('about: renders title', async ({ page }) => {
    const response = await page.goto('/about');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('About');
    await expect(page.locator('.about-prose').getByRole('link', { name: 'corrections page' }))
      .toHaveAttribute('href', '/corrections');
    await expectChrome(page);
  });

  test('corrections: lists every revision, challenge and resolution, newest first', async ({ page, request }) => {
    const contentDir = path.join(__dirname, '..', '..', 'content');
    const count = (dir: string) => fs.readdirSync(path.join(contentDir, dir)).filter((f) => f.endsWith('.md')).length;
    const revisions = count('revisions');
    const challenges = count('challenges');
    const resolutions = count('resolutions');

    const response = await page.goto('/corrections');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText('Corrections and challenges');
    const stats = page.locator('.corrections-stats');
    await expect(stats).toContainText(new RegExp(`\\b${revisions} summary revisions?\\b`));
    await expect(stats).toContainText(new RegExp(`\\b${challenges - resolutions} open challenges?\\b`));
    await expect(stats).toContainText(new RegExp(`\\b${resolutions} resolved challenges?\\b`));

    const rows = page.locator('.corrections-list > li');
    await expect(rows).toHaveCount(revisions + challenges + resolutions);
    await expect(rows.filter({ hasText: 'Summary revision' })).toHaveCount(revisions);
    await expect(rows.filter({ hasText: 'Challenge opened' })).toHaveCount(challenges);
    await expect(rows.filter({ hasText: 'Challenge resolved' })).toHaveCount(resolutions);

    const dates = await rows.locator('time').evaluateAll((els) => els.map((el) => el.getAttribute('datetime') ?? ''));
    expect(dates).toEqual([...dates].sort().reverse());

    const hrefs = await rows.locator('a').evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''));
    expect(hrefs).toHaveLength(revisions + challenges + resolutions);
    for (const href of new Set(hrefs)) {
      expect(href).toMatch(/^\/events\/[^#]+#revision-history$/);
      const target = await request.get(href.split('#')[0]);
      expect(target.status(), href).toBe(200);
      expect(await target.text(), href).toContain('id="revision-history"');
    }
    await expectChrome(page);
  });

  test('404: unknown route shows not-found copy', async ({ page }) => {
    // Astro serves the static /404.html; the status may be 200 or 404 depending on
    // the preview server, so we only assert page contents.
    await page.goto('/definitely-not-a-real-page-xyz');
    await expect(page.locator('h1')).toContainText('This entry does not exist');
  });
});


test('event provenance distinguishes review dates from event dates', async ({ page }) => {
  await page.goto('/events/anthropic-dod-debate-2026');
  const footer = page.locator('.wiki-article__lastmod');
  await expect(footer).toContainText('This record last reviewed 2026-10-26.');
  await expect(footer.locator('time')).toHaveAttribute('datetime', '2026-10-26');
  await expect(page.locator('a[href*="content/revisions/sr-anthropic-dod-debate-2026-20261026.md"]')).toBeVisible();
  await page.goto(`/events/${SLUGS.event}`);
  await expect(page.locator('.wiki-article__lastmod')).not.toContainText('last modified');
});

test('automatic scan entries do not claim a human review', async ({ page }) => {
  const footer = page.locator('.wiki-article__lastmod');
  for (const slug of ['cohere-qwen38-flash-next-beijing-upload-attempt', 'openai-trusted-access-cyber']) {
    await page.goto(`/events/${slug}`);
    await expect(footer.getByRole('link', { name: 'View source on GitHub' })).toBeVisible();
    await expect(footer).not.toContainText(/review/i);
    await expect(page.locator('body')).not.toContainText(/last reviewed/i);
  }

  await page.goto('/events/openai-gpt-5-5-release');
  await expect(footer).toContainText('This record last reviewed 2026-10-26.');

  await page.goto('/events/anthropic-dod-debate-2026');
  await expect(footer).toContainText('This record last reviewed 2026-10-26.');
});

test('thread footers report the thread modification date instead of a linked event date', async ({ page }) => {
  await page.goto('/threads/ai-copyright-wars');
  const footer = page.locator('.wiki-article__lastmod');
  await expect(footer).toContainText('This record last modified 2026-03-08.');
  await expect(footer.locator('time')).toHaveAttribute('datetime', '2026-03-08');
});

test('utility links describe their destinations', async ({ page }) => {
  await page.goto(`/events/${SLUGS.event}`);
  const utility = page.locator('.wiki-utilbar__tabs');
  await expect(utility.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('href', '/');
  await expect(utility.getByRole('link', { name: 'About', exact: true })).toHaveAttribute('href', '/about');
  await expect(utility.getByRole('link', { name: 'Repository history', exact: true })).toHaveAttribute('href', 'https://github.com/pedro-bright/the-ledger/commits/main');
});

test.describe('page metadata', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'desktop only');
  });

  const meta = (page: import('@playwright/test').Page, attribute: string, value: string) =>
    page.locator(`head meta[${attribute}="${value}"]`);

  test('event pages describe the entry with its summary and an Article', async ({ page }) => {
    const contentDir = path.join(__dirname, '..', '..', 'content', 'events');
    const file = filesIn(contentDir).find((f: string) => f.endsWith(`-${SLUGS.event}.md`))!;
    const { data, content } = parseFrontmatter(fs.readFileSync(path.join(contentDir, file), 'utf8'));
    const summary = content.split('## Summary')[1].split('\n## ')[0].replace(/\s+/g, ' ').trim();

    await page.goto(`/events/${SLUGS.event}/`);
    const description = await meta(page, 'name', 'description').getAttribute('content');
    expect(description!.length).toBeGreaterThan(60);
    expect(description!.length).toBeLessThanOrEqual(160);
    expect(summary.startsWith(description!.replace(/…$/, ''))).toBe(true);
    await expect(meta(page, 'property', 'og:description')).toHaveAttribute('content', description!);
    await expect(meta(page, 'name', 'twitter:description')).toHaveAttribute('content', description!);
    await expect(meta(page, 'name', 'twitter:card')).toHaveAttribute('content', 'summary_large_image');
    await expect(meta(page, 'property', 'og:type')).toHaveAttribute('content', 'article');
    await expect(meta(page, 'property', 'article:published_time')).toHaveAttribute('content', '2023-03-14');

    const blocks = await page.locator('head script[type="application/ld+json"]').allTextContents();
    const [article, breadcrumbs] = blocks.map((text) => JSON.parse(text));
    expect(blocks).toHaveLength(2);
    expect(article).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.title,
      description,
      datePublished: '2023-03-14',
      temporalCoverage: '2023-03-14',
      isPartOf: [{ '@type': 'CreativeWork', url: 'https://the-ledger.net/threads/scaling-laws-debate/' }],
      publisher: { '@type': 'Organization', name: 'The Ledger' },
      license: 'https://creativecommons.org/licenses/by-sa/4.0/',
    });
    expect(article.citation).toEqual(data.sources.map((source: { title: string; url: string }) => ({
      '@type': 'CreativeWork', name: source.title, url: source.url,
    })));

    const crumbs = await page.locator('.wiki-article__breadcrumb > :not(.wiki-article__crumb-sep)').evaluateAll(
      (els) => els.map((el) => ({ name: el.textContent, href: (el as HTMLAnchorElement).href || undefined })),
    );
    expect(breadcrumbs['@type']).toBe('BreadcrumbList');
    expect(breadcrumbs.itemListElement).toEqual(crumbs.map(({ name, href }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      ...(href && { item: href.replace('http://localhost:4321', 'https://the-ledger.net') }),
    })));
  });

  test('every page has one description, canonical link and image, and valid structured data', () => {
    const dist = path.join(__dirname, '..', 'dist');
    const pages = filesIn(dist).filter((f: string) => f.endsWith('.html'));
    expect(pages.length).toBeGreaterThan(300);

    type Element = DefaultTreeAdapterTypes.Element;
    const elements = (node: DefaultTreeAdapterTypes.Node): Element[] => {
      const children = 'childNodes' in node ? node.childNodes.flatMap(elements) : [];
      return 'tagName' in node ? [node as Element, ...children] : children;
    };
    const attr = (el: Element, name: string) => el.attrs.find((a) => a.name === name)?.value;
    const text = (el: Element) => el.childNodes.map((n) => ('value' in n ? n.value : '')).join('');

    for (const file of pages) {
      const all = elements(parse(fs.readFileSync(path.join(dist, file), 'utf8')));
      const count = (tag: string, name: string, value: string) =>
        all.filter((el) => el.tagName === tag && attr(el, name) === value).length;
      expect(count('meta', 'name', 'description'), file).toBe(1);
      expect(count('link', 'rel', 'canonical'), file).toBe(1);
      expect(count('meta', 'property', 'og:image'), file).toBe(1);
      expect(count('meta', 'name', 'title'), file).toBe(0);
      expect(all.filter((el) => /^twitter:/.test(attr(el, 'property') ?? '')), file).toHaveLength(0);
      const description = attr(all.find((el) => el.tagName === 'meta' && attr(el, 'name') === 'description')!, 'content')!;
      if (/^(events|threads|controversies)\/.+\/index\.html$/.test(file)) expect(description.length, file).toBeLessThanOrEqual(160);

      const blocks = all
        .filter((el) => el.tagName === 'script' && attr(el, 'type') === 'application/ld+json')
        .map((el) => JSON.parse(text(el)));
      const types = blocks.map((block) => block['@type']).sort();
      const expected = file.startsWith('events/') ? ['Article', 'BreadcrumbList']
        : file.startsWith('threads/') && file !== 'threads/index.html' ? ['BreadcrumbList'] : [];
      expect(types, file).toEqual(expected);

      for (const block of blocks) {
        expect(block['@context'], file).toBe('https://schema.org');
        if (block['@type'] === 'BreadcrumbList') {
          const items = block.itemListElement;
          expect(items.length, file).toBeGreaterThan(1);
          items.forEach((item: { position: number; name: string; item?: string }, i: number) => {
            expect(item.position, file).toBe(i + 1);
            expect(item.name, file).toBeTruthy();
            if (i < items.length - 1) expect(item.item, file).toMatch(/^https:\/\/the-ledger\.net\//);
          });
        } else {
          for (const field of ['headline', 'description', 'datePublished', 'temporalCoverage', 'license']) {
            expect(block[field], `${file} ${field}`).toBeTruthy();
          }
          expect(block.description, file).toBe(description);
          expect(block.publisher?.name, file).toBe('The Ledger');
          const references = all.find((el) => el.tagName === 'section' && attr(el, 'class')?.includes('wiki-article__references'));
          expect(block.citation.length, file).toBe(references ? elements(references).filter((el) => el.tagName === 'li').length : 0);
          for (const citation of block.citation) {
            expect(citation.name, file).toBeTruthy();
            expect(citation.url, file).toMatch(/^https?:\/\//);
          }
        }
      }
    }
  });
});
