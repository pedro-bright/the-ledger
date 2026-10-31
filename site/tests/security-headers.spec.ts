import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import { getTransformedRoutes } from '@vercel/routing-utils';
import yaml from 'js-yaml';
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
 * Checks the headers the deploy job in deploy.yml generates, by running the job's own
 * steps on the built site. `astro preview` doesn't read the resulting vercel.json, so the
 * browser tests add the policy to each document response themselves.
 *
 * Desktop-chromium only: the policy doesn't vary by viewport.
 */

const DIST = path.join(process.cwd(), 'dist');
const REPO = path.join(process.cwd(), '..');

type HeaderRule = { source: string; headers: { key: string; value: string }[] };
type HeaderRoute = { src: string; headers: Record<string, string> };

type DeployStep = { name: string; run: string; 'working-directory'?: string };

let runnerTemp: string | undefined;

/**
 * Runs the deploy job's steps between downloading the build and deploying it, on a copy of
 * dist/, once per worker. Returns the deploy root.
 */
function deployRoot(): string {
  if (!runnerTemp) {
    runnerTemp = fs.mkdtempSync(path.join(os.tmpdir(), 'ledger-deploy-'));
    // upload-artifact leaves hidden files out of the artifact by default.
    fs.cpSync(DIST, path.join(runnerTemp, 'deploy', 'public'), {
      recursive: true,
      filter: (source) => !path.basename(source).startsWith('.'),
    });
    const workflow = yaml.load(fs.readFileSync(path.join(REPO, '.github/workflows/deploy.yml'), 'utf8')) as {
      jobs: { deploy: { steps: DeployStep[] } };
    };
    const { steps } = workflow.jobs.deploy;
    const names = steps.map(({ name }) => name);
    for (const step of steps.slice(names.indexOf('Download built site') + 1, names.indexOf('Deploy to Vercel'))) {
      execFileSync('bash', ['-e', '-c', step.run], {
        cwd: step['working-directory']?.replace('${{ runner.temp }}', runnerTemp) ?? REPO,
        env: { ...process.env, RUNNER_TEMP: runnerTemp },
        stdio: 'pipe',
      });
    }
  }
  return path.join(runnerTemp, 'deploy');
}

function headerRules(): HeaderRule[] {
  return JSON.parse(fs.readFileSync(path.join(deployRoot(), 'vercel.json'), 'utf8')).headers;
}

// Compiled by Vercel's routing library, so URLs match the way they do on a deployment.
function compileRoutes(rules: HeaderRule[]): HeaderRoute[] {
  const { routes, error } = getTransformedRoutes({ headers: rules });
  if (error) throw new Error(error.message);
  return routes as HeaderRoute[];
}

function policyFor(routes: HeaderRoute[], urlPath: string): string {
  const matching = routes.filter(({ src, headers }) => new RegExp(src).test(urlPath) && CSP_HEADER in headers);
  return matching[matching.length - 1].headers[CSP_HEADER];
}

test.describe('security headers', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'desktop only');
  });

  test.afterAll(() => {
    if (runnerTemp) fs.rmSync(runnerTemp, { recursive: true, force: true });
  });

  async function loadWithPolicy(page: import('@playwright/test').Page, urlPath: string) {
    const policy = policyFor(compileRoutes(headerRules()), urlPath);
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
    const rules = headerRules();
    expect(rules[0].headers.find(({ key }) => key === 'X-Frame-Options')?.value).toBe('DENY');
    for (const { source, headers } of rules) {
      const policies = headers.filter(({ key }) => key.toLowerCase().startsWith('content-security-policy'));
      expect(policies.map(({ key }) => key), source).toEqual([CSP_HEADER]);
      expect(policies[0].value, source).toContain("frame-ancestors 'none'");
    }
  });

  test('every built page has a policy allowing its inline scripts', () => {
    const routes = compileRoutes(headerRules());
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

  test("the deploy job's steps accept the build and write the CLI's config and security.txt", () => {
    expect(headerRules()[0].source).toBe('/(.*)');
    const published = fs.readFileSync(path.join(deployRoot(), 'public', '.well-known', 'security.txt'), 'utf8');
    expect(published.split('\n')[0]).toBe(securityTxt().split('\n')[0]);
    expect(fs.existsSync(path.join(deployRoot(), 'public', 'vercel.json'))).toBe(false);
  });
});
