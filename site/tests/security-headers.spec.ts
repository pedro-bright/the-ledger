import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import { getTransformedRoutes } from '@vercel/routing-utils';
import { writeBuildOutput } from '../../scripts/vercel-output.mjs';
import {
  CSP_HEADER,
  buildConfig,
  findHtmlFiles,
  inlineScripts,
  pageSource,
  scriptHash,
  securityTxt,
} from '../scripts/generate-security-headers.cjs';
import { SLUGS } from './_slugs';

/**
 * Packages the actual static build with the Git deployment's Build Output API
 * mechanism. Astro preview does not apply Vercel routes, so browser tests apply
 * the emitted document policy to exercise CSP in Chromium.
 * Desktop only because the policy does not vary by viewport.
 */
const DIST = path.join(process.cwd(), 'dist');
type HeaderRule = { source: string; headers: { key: string; value: string }[] };
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

// Compiled by Vercel's routing library, so URLs match the way they do on a deployment.
function compileRoutes(rules: HeaderRule[]): HeaderRoute[] {
  const { routes, error } = getTransformedRoutes({ headers: rules });
  if (error) throw new Error(error.message);
  return routes as HeaderRoute[];
}

function policyFor(routes: HeaderRoute[], urlPath: string): string {
  return routes.find(({ src, headers }) => new RegExp(src).test(urlPath) && CSP_HEADER in headers)!.headers[CSP_HEADER];
}

test.describe('security headers', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'desktop only');
  });

  test.afterAll(() => {
    if (outputRoot) fs.rmSync(outputRoot, { recursive: true, force: true });
  });

  async function loadWithPolicy(page: import('@playwright/test').Page, urlPath: string) {
    const policy = policyFor(outputRoutes(), urlPath);
    await page.route('**/*', async (route) => {
      if (!route.request().isNavigationRequest()) return route.continue();
      const response = await route.fetch();
      await route.fulfill({ response, headers: { ...response.headers(), [CSP_HEADER]: policy } });
    });
    await page.addInitScript(() => {
      (window as any).__cspViolations = [];
      document.addEventListener('securitypolicyviolation', (event) => {
        (window as any).__cspViolations.push(`${event.effectiveDirective}: ${event.blockedURI}`);
      });
    });
    await page.goto(urlPath, { waitUntil: 'load' });
  }

  const violations = (page: import('@playwright/test').Page) =>
    page.evaluate(() => (window as any).__cspViolations as string[]);

  const PAGES = [
    '/',
    '/about',
    '/explore',
    '/graph',
    '/threads',
    `/threads/${SLUGS.thread}`,
    '/controversies',
    `/controversies/${SLUGS.controversy}`,
    `/events/${SLUGS.event}`,
    '/actors',
    `/actors/${SLUGS.actor}`,
    '/no-such-page',
  ];

  for (const urlPath of PAGES) {
    test(`${urlPath} logs no policy violations`, async ({ page }) => {
      await loadWithPolicy(page, urlPath);
      await page.waitForLoadState('networkidle');
      expect(await violations(page)).toEqual([]);
    });
  }

  test('the policy reports an injected inline script', async ({ page }) => {
    await loadWithPolicy(page, '/about');
    await page.evaluate(() => {
      const script = document.createElement('script');
      script.textContent = 'window.__injected = 1';
      document.body.append(script);
    });
    await expect.poll(() => violations(page)).toContainEqual(expect.stringContaining('script-src'));
  });

  test('X-Frame-Options is enforced and each rule sends one policy with frame-ancestors', () => {
    const routes = outputRoutes();
    for (const { src, headers } of routes) {
      expect(headers['X-Frame-Options'], src).toBe('DENY');
      const policies = Object.keys(headers).filter((key) => key.toLowerCase().startsWith('content-security-policy'));
      expect(policies, src).toEqual([CSP_HEADER]);
      expect(headers[CSP_HEADER], src).toContain("frame-ancestors 'none'");
    }
  });

  test('every built page has a policy allowing its inline scripts', () => {
    const routes = outputRoutes();
    for (const file of findHtmlFiles(DIST)) {
      // 404.html answers for any path that has no page.
      const urlPath = file.endsWith('index.html')
        ? `/${file.slice(0, -'index.html'.length).replace(/\/$/, '')}`
        : '/no-such-page';
      const policy = policyFor(routes, urlPath);
      for (const text of inlineScripts(fs.readFileSync(path.join(DIST, file), 'utf8'))) {
        expect(policy, `${file} inline script`).toContain(scriptHash(text));
      }
    }
  });

  test('the built site uses far fewer routes than it has pages', () => {
    const pageCount = findHtmlFiles(DIST).length;
    expect(pageCount).toBeGreaterThan(100);
    expect(outputRoutes().length).toBeLessThan(25);
  });

  test('page rules match the URLs a page answers on', () => {
    const matches = (source: string, url: string) => {
      const [route] = compileRoutes([{ source, headers: [{ key: CSP_HEADER, value: 'policy' }] }]);
      return new RegExp(route.src).test(url);
    };
    const home = pageSource('index.html');
    expect(['/', '/index.html'].every((url) => matches(home, url))).toBe(true);
    expect(matches(home, '/about')).toBe(false);

    const event = pageSource('events/gpt-4-release/index.html');
    for (const url of ['/events/gpt-4-release', '/events/gpt-4-release/', '/events/gpt-4-release/index.html']) {
      expect(matches(event, url)).toBe(true);
    }
    expect(matches(event, '/events/gpt-4-release-2')).toBe(false);
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
    const { headers } = buildConfig(
      new Map([
        ['index.html', new Set(['shared'])],
        ['about/index.html', new Set(['shared', 'about-only'])],
        ['404.html', new Set(['missing-only'])],
      ]),
    );
    const [site, ...pages] = headers;
    const value = (rule: HeaderRule) => rule.headers.find(({ key }) => key === CSP_HEADER)!.value;
    expect(site.source).toBe('/(.*)');
    expect(value(site)).toContain('shared');
    expect(value(site)).toContain('missing-only');
    expect(value(site)).not.toContain('about-only');
    expect(pages.map(({ source }) => source)).toEqual([pageSource('about/index.html')]);
    expect(value(pages[0])).toContain('about-only');
    expect(value(pages[0])).toContain('missing-only');
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
