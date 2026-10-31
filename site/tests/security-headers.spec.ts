import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import {
  CSP_HEADER,
  buildConfig,
  inlineScripts,
  pageSource,
  scriptHash,
  securityTxt,
} from '../scripts/generate-security-headers.cjs';
import { SLUGS } from './_slugs';

/**
 * Checks the headers generated into dist/vercel.json. `astro preview` doesn't read that
 * file, so the browser tests add the policy to each document response themselves.
 *
 * Desktop-chromium only: the policy doesn't vary by viewport.
 */

const DIST = path.join(process.cwd(), 'dist');

type HeaderRule = { source: string; headers: { key: string; value: string }[] };

function headerRules(): HeaderRule[] {
  return JSON.parse(fs.readFileSync(path.join(DIST, 'vercel.json'), 'utf8')).headers;
}

// Generated sources are also valid regular expressions.
function policyFor(rules: HeaderRule[], urlPath: string): string {
  const matching = rules.flatMap(({ source, headers }) =>
    new RegExp(`^${source}$`).test(urlPath) ? headers.filter(({ key }) => key === CSP_HEADER) : [],
  );
  return matching[matching.length - 1].value;
}

function htmlFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });
}

test.describe('security headers', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'desktop only');
  });

  async function loadWithPolicy(page: import('@playwright/test').Page, urlPath: string) {
    const policy = policyFor(headerRules(), urlPath);
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

  test('frame protection is enforced while the rest of the policy reports', () => {
    const [site] = headerRules();
    const value = (name: string) => site.headers.find(({ key }) => key === name)?.value;
    expect(value('Content-Security-Policy')).toBe("frame-ancestors 'none'");
    expect(value('X-Frame-Options')).toBe('DENY');
    expect(value(CSP_HEADER)).toContain("default-src 'self'");
  });

  test('every built page has a policy allowing its inline scripts', () => {
    const rules = headerRules();
    for (const file of htmlFiles(DIST)) {
      const relative = path.relative(DIST, file).split(path.sep).join('/');
      // 404.html answers for any path that has no page.
      const urlPath = relative.endsWith('index.html')
        ? `/${relative.slice(0, -'index.html'.length).replace(/\/$/, '')}`
        : '/no-such-page';
      const policy = policyFor(rules, urlPath);
      for (const text of inlineScripts(fs.readFileSync(file, 'utf8'))) {
        expect(policy, `${relative} inline script`).toContain(scriptHash(text));
      }
    }
  });

  test('page rules match the URLs a page answers on', () => {
    const matches = (source: string, url: string) => new RegExp(`^${source}$`).test(url);
    const home = pageSource('index.html');
    expect(['/', '/index.html'].every((url) => matches(home, url))).toBe(true);
    expect(matches(home, '/about')).toBe(false);

    const event = pageSource('events/gpt-4-release/index.html');
    for (const url of ['/events/gpt-4-release', '/events/gpt-4-release/', '/events/gpt-4-release/index.html']) {
      expect(matches(event, url)).toBe(true);
    }
    expect(matches(event, '/events/gpt-4-release-2')).toBe(false);
  });

  test('inlineScripts returns only what a browser would execute', () => {
    const html = [
      '<!-- <script>commented()</script> -->',
      '<script src="/a.js"></script>',
      '<script type="application/ld+json">{"data":1}</script>',
      '<script data-title="a > b">attribute()</script>',
      '<SCRIPT>upper()</SCRIPT>',
      '<script type="module">mod()</script>',
      '<script></script>',
    ].join('');
    expect(inlineScripts(html)).toEqual(['attribute()', 'upper()', 'mod()']);
  });

  test('scriptHash matches the hash a browser computes after normalizing newlines', () => {
    expect(scriptHash('a\r\nb')).toBe(scriptHash('a\nb'));
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

  test('security.txt has the fields RFC 9116 requires, and an expiry a year out', () => {
    const generated = securityTxt(new Date('2026-10-30T12:00:00.000Z'));
    expect(generated).toMatch(/^Contact: https:\/\//m);
    expect(generated).toMatch(/^Expires: 2027-10-30T12:00:00Z$/m);
    expect(fs.existsSync(path.join(DIST, '.well-known', 'security.txt'))).toBe(true);
  });
});
