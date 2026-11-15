import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import { filesIn, writeBuildOutput } from '../../scripts/vercel-output.mjs';
import {
  CSP_HEADER,
  buildHeaders,
  inlineScripts,
  scriptHash,
  securityTxt,
} from '../scripts/generate-security-headers.cjs';
import { SLUGS } from './_slugs';
import { recordDrawing, settledFrame, visibleNode } from './_graph';

/**
 * Packages the actual static build with the Git deployment's Build Output API
 * mechanism. Astro preview does not apply Vercel routes, so browser tests apply
 * the emitted document policy to exercise CSP in Chromium.
 * Desktop only because the policy does not vary by viewport.
 */
const DIST = path.join(process.cwd(), 'dist');
const POSTHOG_SDK = path.join(process.cwd(), 'node_modules/posthog-js/dist');
type HeaderRoute = { src: string; headers: Record<string, string> };
let outputRoot: string | undefined;

function buildOutput(): string {
  if (!outputRoot) {
    outputRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ledger-build-output-'));
    writeBuildOutput(DIST, outputRoot);
  }
  return outputRoot;
}

function outputRoutes(): HeaderRoute[] {
  return JSON.parse(fs.readFileSync(path.join(buildOutput(), 'config.json'), 'utf8')).routes
    .filter((route: HeaderRoute) => route.headers);
}

const htmlFiles = () => filesIn(DIST).filter((file: string) => file.endsWith('.html'));

function policyFor(routes: HeaderRoute[], urlPath: string): string {
  return routes.find(({ src, headers }) => new RegExp(src).test(urlPath) && CSP_HEADER in headers)!.headers[CSP_HEADER];
}

test.describe('security headers', () => {
  // Packaging the whole build takes longer under load, so it runs once with its own limit.
  test.beforeAll(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'desktop only');
    test.setTimeout(60_000);
    buildOutput();
  });

  test.afterAll(() => {
    if (outputRoot) fs.rmSync(outputRoot, { recursive: true, force: true });
    outputRoot = undefined;
  });

  /**
   * Serves each response with the policy the build output gives its path, as Vercel does,
   * and returns the violations the browser reports in any document or worker, across
   * navigations. A worker script runs under the policy sent with it.
   */
  async function enforcePolicy(page: Page) {
    const routes = outputRoutes();
    const origin = new URL(test.info().project.use.baseURL!).origin;
    const violations: string[] = [];
    await page.route(`${origin}/**`, async (route) => {
      const response = await route.fetch();
      const policy = policyFor(routes, new URL(route.request().url()).pathname);
      await route.fulfill({ response, headers: { ...response.headers(), [CSP_HEADER]: policy } });
    });
    await page.exposeFunction('reportPolicyViolation', (violation: string) => violations.push(violation));
    await page.addInitScript(() => {
      document.addEventListener('securitypolicyviolation', (event) => {
        (window as any).reportPolicyViolation(`${event.effectiveDirective}: ${event.blockedURI} on ${event.documentURI}`);
      });
    });
    page.on('console', (message) => {
      if (message.text().includes('Content Security Policy')) violations.push(message.text());
    });
    return violations;
  }

  const PAGES = [
    '/',
    '/about',
    '/privacy',
    '/corrections',
    '/data',
    '/explore',
    '/search?q=OpenAI',
    '/graph',
    '/threads',
    `/threads/${SLUGS.thread}`,
    '/controversies',
    `/controversies/${SLUGS.controversy}`,
    `/events/${SLUGS.event}`,
    '/actors',
    `/actors/${SLUGS.actor}`,
    '/feed.xml',
    '/rss.xml',
    '/no-such-page',
  ];

  for (const urlPath of PAGES) {
    test(`${urlPath} logs no policy violations`, async ({ page }) => {
      const violations = await enforcePolicy(page);
      await page.goto(urlPath);
      await page.waitForLoadState('networkidle');
      expect(violations).toEqual([]);
    });
  }

  test('the timeline filters work with the policy enforced', async ({ page }) => {
    const violations = await enforcePolicy(page);
    await page.goto('/explore');
    const research = page.getByRole('button', { name: /^research$/i }).first();
    await research.click();
    await expect(research).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#explorer-search').fill('gpt');
    await expect.poll(() => Object.fromEntries(new URL(page.url()).searchParams)).toMatchObject({ cat: 'research', q: 'gpt' });
    await page.waitForLoadState('networkidle');
    expect(violations).toEqual([]);
  });

  test('the masthead search form submits and the search page answers with the policy enforced', async ({ page }) => {
    const violations = await enforcePolicy(page);
    await page.goto('/');
    const field = page.getByRole('search').getByRole('searchbox');
    await field.fill('OpenAI');
    await field.press('Enter');
    await expect(page).toHaveURL(/\/search\?q=OpenAI$/);
    await expect(page.getByRole('status')).toHaveText(/^\d+ results for “OpenAI”$/);
    await expect(page.getByRole('region').first().getByRole('link').first()).toBeVisible();
    expect(violations).toEqual([]);
  });

  test('the article contents navigation and the print view work with the policy enforced', async ({ page }) => {
    const violations = await enforcePolicy(page);
    // Only long articles have a contents list; this one is also used by article-print.spec.ts.
    await page.goto('/events/openai-misalignment-reporting-framework-six-reports');
    const contents = page.locator('.wiki-rail #article-contents');
    await expect(contents.locator('details')).toHaveAttribute('open', '');
    await contents.getByRole('link', { name: 'References', exact: true }).click();
    await expect(page.locator('#refs-head')).toBeInViewport();
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('#article-contents')).toBeHidden();
    await expect(page.locator('.wiki-article__title')).toBeVisible();
    await page.waitForLoadState('networkidle');
    expect(violations).toEqual([]);
  });

  test('a graph node opens its page with the policy enforced', async ({ page }) => {
    test.slow();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const violations = await enforcePolicy(page);
    await recordDrawing(page);
    await page.goto('/graph');
    await settledFrame(page);
    const node = await visibleNode(page);
    await page.mouse.move(node.x, node.y);
    await expect(page.locator('.float-tooltip-kap')).toHaveText(node.label);
    await page.mouse.click(node.x, node.y);
    await expect(page).toHaveURL(new URL(node.route, page.url()).href);
    await page.waitForLoadState('networkidle');
    expect(violations).toEqual([]);
  });

  test('every data download opens with the policy enforced', async ({ page }) => {
    const violations = await enforcePolicy(page);
    await page.goto('/data');
    const hrefs = await page.locator('a.data-file__name').evaluateAll((links) => links.map((link) => link.getAttribute('href')!));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      await page.goto('/data');
      const link = page.locator(`a.data-file__name[href="${href}"]`);
      if (href.endsWith('.csv')) {
        const download = page.waitForEvent('download');
        await link.click();
        expect(await (await download).failure()).toBeNull();
      } else {
        await link.click();
        await expect(page).toHaveURL(new RegExp(`${href.replace(/[.]/g, '\\.')}$`));
        expect(await page.evaluate(() => JSON.parse(document.body.innerText))).toBeTruthy();
      }
    }
    expect(violations).toEqual([]);
  });

  // CI builds have no analytics token, so this runs only on a build that has one.
  test('the analytics script loads with the policy enforced', async ({ page }) => {
    test.skip(!/apiKey = "/.test(fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')), 'the build has no analytics token');
    const violations = await enforcePolicy(page);
    // Serve the SDK from the installed package so the test sends nothing to the analytics service.
    await page.route(/^https:\/\/[^/]+\.posthog\.com\//, (route) => {
      const { pathname } = new URL(route.request().url());
      const file = path.join(POSTHOG_SDK, path.basename(pathname));
      if (pathname.startsWith('/static/') && fs.existsSync(file)) return route.fulfill({ path: file, contentType: 'text/javascript' });
      return pathname.endsWith('.js')
        ? route.fulfill({ contentType: 'text/javascript', body: '' })
        : route.fulfill({ json: {} });
    });
    const sdk = page.waitForResponse((response) => new URL(response.url()).pathname === '/static/array.js');
    await page.goto('/');
    expect((await sdk).ok()).toBe(true);
    await expect.poll(() => page.evaluate(() => (window as any).posthog?.__loaded)).toBe(true);
    expect(violations).toEqual([]);
  });

  test('the search index loads and answers a query with the policy enforced', async ({ page }) => {
    const violations = await enforcePolicy(page);
    await page.goto(`/events/${SLUGS.event}`);
    // A string, so the dynamic import reaches the browser untranspiled.
    const firstUrl = await page.evaluate(`import('/pagefind/pagefind.js')
      .then((pagefind) => pagefind.search('OpenAI'))
      .then(({ results }) => results[0].data())
      .then((data) => data.url)`);
    expect(firstUrl).toMatch(/^\//);
    expect(violations).toEqual([]);
  });

  test('the policy blocks and reports an injected inline script', async ({ page }) => {
    const violations = await enforcePolicy(page);
    await page.goto('/about');
    await page.evaluate(() => {
      const script = document.createElement('script');
      script.textContent = 'window.__injected = 1';
      document.body.append(script);
    });
    await expect.poll(() => violations).toContainEqual(expect.stringContaining('script-src'));
    expect(await page.evaluate(() => (window as any).__injected)).toBeUndefined();
  });

  test('X-Frame-Options is set and each rule sends one enforced policy with frame-ancestors', () => {
    const routes = outputRoutes();
    for (const { src, headers } of routes) {
      expect(headers['X-Frame-Options'], src).toBe('DENY');
      const policies = Object.keys(headers).filter((key) => key.toLowerCase().startsWith('content-security-policy'));
      expect(policies, src).toEqual(['Content-Security-Policy']);
      expect(headers[CSP_HEADER], src).toContain("frame-ancestors 'none'");
    }
  });

  test('every built page has a policy allowing its inline scripts', () => {
    const routes = outputRoutes();
    for (const file of htmlFiles()) {
      const dir = path.posix.dirname(file);
      // 404.html answers directly and for any path that has no page.
      const urlPaths = path.posix.basename(file) !== 'index.html'
        ? [`/${file}`, '/no-such-page']
        : dir === '.'
          ? ['/', `/${file}`]
          : [`/${dir}`, `/${dir}/`, `/${file}`];
      const hashes = inlineScripts(fs.readFileSync(path.join(DIST, file), 'utf8')).map(scriptHash);
      for (const urlPath of urlPaths) {
        const policy = policyFor(routes, urlPath);
        for (const hash of hashes) expect(policy, `${file} inline script at ${urlPath}`).toContain(hash);
      }
    }
  });

  test('the built site uses far fewer routes than it has pages', () => {
    expect(htmlFiles().length).toBeGreaterThan(100);
    expect(outputRoutes().length).toBeLessThan(25);
  });

  test('inlineScripts returns the text of script elements that have any', () => {
    const html = [
      '<script src="/a.js"></script>',
      '<script data-title="a > b">attribute()</script>',
      '<SCRIPT>upper()</SCRIPT>',
      '<script type="module">mod()</script>',
      '<script></script>',
    ].join('');
    expect(inlineScripts(html)).toEqual(['attribute()', 'upper()', 'mod()']);
  });

  test('scriptHash matches the hash a browser computes', () => {
    expect(scriptHash('alert(1)')).toBe("'sha256-bhHHL3z2vDgxUt0W3dWQOrprscmda2Y5pLsLg4GF+pI='");
  });

  test('a hash on one page stays out of the site-wide policy', () => {
    const { siteHeaders, pageHeaders } = buildHeaders(
      new Map([
        ['index.html', new Set(['shared'])],
        ['about/index.html', new Set(['shared', 'about-only'])],
        ['404.html', new Set(['missing-only'])],
      ]),
    );
    expect(siteHeaders[CSP_HEADER]).toContain('shared');
    expect(siteHeaders[CSP_HEADER]).toContain('missing-only');
    expect(siteHeaders[CSP_HEADER]).not.toContain('about-only');
    expect([...pageHeaders.keys()]).toEqual(['about/index.html']);
    const aboutPolicy = pageHeaders.get('about/index.html')![CSP_HEADER];
    expect(aboutPolicy).toContain('about-only');
    expect(aboutPolicy).toContain('missing-only');
  });

  test('security.txt gives the private advisory contact and an expiry a year out', () => {
    expect(securityTxt(new Date('2026-10-30T12:00:00.000Z')).split('\n')).toEqual([
      'Contact: https://github.com/pedro-bright/the-ledger/security/advisories/new',
      'Expires: 2027-10-30T12:00:00Z',
      'Canonical: https://www.the-ledger.net/.well-known/security.txt',
      'Preferred-Languages: en',
      '',
    ]);
  });

  test('Git build output publishes security.txt and keeps Vercel config outside static files', () => {
    const output = buildOutput();
    expect(JSON.parse(fs.readFileSync(path.join(output, 'config.json'), 'utf8')).version).toBe(3);
    const published = fs.readFileSync(path.join(output, 'static', '.well-known', 'security.txt'), 'utf8');
    expect(published.split('\n')[0]).toBe(securityTxt().split('\n')[0]);
    expect(fs.existsSync(path.join(output, 'static', 'vercel.json'))).toBe(false);
  });
});
