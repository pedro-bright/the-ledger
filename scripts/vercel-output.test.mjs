import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { buildEnvironment, filesIn, writeBuildOutput } from './vercel-output.mjs';
import { CSP_HEADER, scriptHash } from '../site/scripts/generate-security-headers.cjs';

const ANALYTICS = { PUBLIC_POSTHOG_PROJECT_TOKEN: 'production-project', PUBLIC_POSTHOG_HOST: 'https://us.i.posthog.com' };

function withBuild(files, check) {
  const root = mkdtempSync(path.join(tmpdir(), 'ledger-vercel-'));
  try {
    const dist = path.join(root, 'dist');
    for (const [file, contents] of Object.entries(files)) {
      mkdirSync(path.dirname(path.join(dist, file)), { recursive: true });
      writeFileSync(path.join(dist, file), contents);
    }
    const output = path.join(root, 'output');
    writeBuildOutput(dist, output);
    check({
      dist,
      output,
      routes: JSON.parse(readFileSync(path.join(output, 'config.json'), 'utf8')).routes,
    });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// Follows the routes in order, as Vercel does. This filesystem phase only finds exact
// file paths, so a directory URL resolves only if the emitted routes handle it.
function request({ output, routes }, url) {
  const published = new Set(filesIn(path.join(output, 'static')).map((file) => `/${file}`));
  const headers = {};
  for (const route of routes) {
    if (route.handle === 'filesystem') {
      if (published.has(url)) return { status: 200, file: url, headers };
      continue;
    }
    const match = new RegExp(route.src, route.caseSensitive ? '' : 'i').exec(url);
    if (!match) continue;
    Object.assign(headers, route.headers);
    if (route.continue) continue;
    const file = route.dest.replace(/\$(\d)/g, (_, group) => match[group]);
    if (route.check && !published.has(file)) continue;
    return { status: route.status ?? 200, file, headers };
  }
  throw new Error(`No route answered ${url}`);
}

const SHARED = '<script>shared()</script>';
const SITE = {
  'index.html': `${SHARED}<script>home()</script>`,
  'events/example/index.html': SHARED,
  'events/other/index.html': SHARED,
  'explore/index.html': `${SHARED}<script>explore()</script>`,
  'explore/extra.html': '<script>extra()</script>',
  '404.html': `${SHARED}<script>missing()</script>`,
  'graph.json': '{"nodes":[]}',
  'feed.xml': '<feed/>',
  'rss.xml': '<rss/>',
  'asset.js': 'console.log(1)',
};

test('only production builds receive analytics settings', () => {
  const warnings = [];
  const warn = console.warn;
  console.warn = (message) => warnings.push(message);
  try {
    for (const VERCEL_ENV of ['preview', 'development', undefined]) {
      const env = buildEnvironment({ ...ANALYTICS, VERCEL_ENV, PATH: '/bin' });
      assert.equal(env.PUBLIC_POSTHOG_PROJECT_TOKEN, undefined);
      assert.equal(env.PUBLIC_POSTHOG_HOST, undefined);
      assert.equal(env.PATH, '/bin');
    }
    assert.deepEqual(buildEnvironment({ ...ANALYTICS, VERCEL_ENV: 'production' }), { ...ANALYTICS, VERCEL_ENV: 'production' });
    assert.deepEqual(warnings, []);
  } finally {
    console.warn = warn;
  }
});

test('a production build missing an analytics setting warns and continues', () => {
  const warnings = [];
  const warn = console.warn;
  console.warn = (message) => warnings.push(message);
  try {
    assert.deepEqual(buildEnvironment({ VERCEL_ENV: 'production' }), { VERCEL_ENV: 'production' });
    assert.equal(warnings.length, 2);
    assert.match(warnings[0], /PUBLIC_POSTHOG_PROJECT_TOKEN/);
    assert.match(warnings[1], /PUBLIC_POSTHOG_HOST/);

    warnings.length = 0;
    buildEnvironment({ VERCEL_ENV: 'production', PUBLIC_POSTHOG_PROJECT_TOKEN: 'production-project', PUBLIC_POSTHOG_HOST: '  ' });
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /PUBLIC_POSTHOG_HOST/);
  } finally {
    console.warn = warn;
  }
});

const PAGE_ONLY_HASHES = [scriptHash('home()'), scriptHash('explore()')];

function assertSitePolicyOnly(response, url) {
  assert.equal(response.headers['X-Frame-Options'], 'DENY', url);
  for (const script of ['shared()', 'missing()', 'extra()']) {
    assert.ok(response.headers[CSP_HEADER].includes(scriptHash(script)), `${url} ${script}`);
  }
  for (const hash of PAGE_ONLY_HASHES) assert.ok(!response.headers[CSP_HEADER].includes(hash), `${url} ${hash}`);
}

test('pages answer on every URL form with their own policy', () => {
  withBuild(SITE, (build) => {
    const expectedPages = [
      { file: '/index.html', urls: ['/', '/index.html'], hash: scriptHash('home()') },
      { file: '/events/example/index.html', urls: ['/events/example', '/events/example/', '/events/example/index.html'] },
      { file: '/explore/index.html', urls: ['/explore', '/explore/', '/explore/index.html'], hash: scriptHash('explore()') },
    ];
    for (const { file, urls, hash } of expectedPages) {
      for (const url of urls) {
        const response = request(build, url);
        assert.equal(response.status, 200, url);
        assert.equal(response.file, file, url);
        assert.equal(response.headers['X-Frame-Options'], 'DENY', url);
        assert.ok(response.headers[CSP_HEADER].includes(scriptHash('shared()')), url);
        for (const pageOnly of PAGE_ONLY_HASHES) {
          assert.equal(response.headers[CSP_HEADER].includes(pageOnly), pageOnly === hash, `${url} ${pageOnly}`);
        }
      }
    }
  });
});

test('a home page with no policy of its own still answers on both URLs', () => {
  withBuild({ ...SITE, 'index.html': SHARED }, (build) => {
    for (const url of ['/', '/index.html']) {
      const response = request(build, url);
      assert.equal(response.status, 200, url);
      assert.equal(response.file, '/index.html', url);
      assert.ok(response.headers[CSP_HEADER].includes(scriptHash('shared()')), url);
    }
  });
});

test('missing paths and the 404 page itself answer 404 with the site policy', () => {
  withBuild(SITE, (build) => {
    for (const url of ['/404.html', '/no-such-page', '/no-such-page/', '/explore-2', '/events/missing/index.html', '/events', '/vercel.json', '/EXPLORE', '/Events/Example']) {
      const response = request(build, url);
      assert.equal(response.status, 404, url);
      assert.equal(response.file, '/404.html', url);
      assertSitePolicyOnly(response, url);
    }
  });
});

test('an HTML file not named index.html does not take its directory page policy', () => {
  withBuild(SITE, (build) => {
    const response = request(build, '/explore/extra.html');
    assert.equal(response.status, 200);
    assert.equal(response.file, '/explore/extra.html');
    assertSitePolicyOnly(response, '/explore/extra.html');
  });
});

test('feeds, graph, assets and security.txt are published with the site headers', () => {
  withBuild(SITE, (build) => {
    for (const file of ['graph.json', 'feed.xml', 'rss.xml', 'asset.js']) {
      const response = request(build, `/${file}`);
      assert.equal(response.status, 200, file);
      assert.equal(response.headers['X-Frame-Options'], 'DENY', file);
      assert.equal(readFileSync(path.join(build.output, 'static', file), 'utf8'), readFileSync(path.join(build.dist, file), 'utf8'));
    }
    assert.equal(request(build, '/.well-known/security.txt').status, 200);
    assert.match(readFileSync(path.join(build.output, 'static', '.well-known', 'security.txt'), 'utf8'), /Contact: https:\/\/github.com\/pedro-bright\/the-ledger\/security\/advisories\/new/);
  });
});

test('the route count does not grow with the page count', () => {
  const siteWith = (count) => {
    const files = { ...SITE };
    for (let page = 0; page < count; page += 1) files[`events/page-${page}/index.html`] = SHARED;
    return files;
  };
  let small;
  withBuild(siteWith(5), ({ routes }) => { small = routes.length; });
  withBuild(siteWith(500), (build) => {
    assert.equal(build.routes.length, small);
    assert.equal(request(build, '/events/page-499/').file, '/events/page-499/index.html');
  });
});

test('only a root vercel.json is refused', () => {
  assert.throws(() => withBuild({ ...SITE, 'vercel.json': '{}' }, () => {}), /Vercel config/);
  withBuild({ ...SITE, 'vercel.js': 'inert()', 'examples/vercel.json': '{}' }, (build) => {
    assert.equal(request(build, '/vercel.js').status, 200);
    assert.equal(request(build, '/examples/vercel.json').status, 200);
  });
});
