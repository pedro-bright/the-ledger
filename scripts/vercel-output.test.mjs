import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { buildEnvironment, writeBuildOutput } from './vercel-output.mjs';
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
  const published = new Set(readdirSync(path.join(output, 'static'), { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => `/${path.relative(path.join(output, 'static'), path.join(entry.parentPath, entry.name)).split(path.sep).join('/')}`));
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
  'index.html': SHARED,
  'events/example/index.html': SHARED,
  'events/other/index.html': SHARED,
  'explore/index.html': `${SHARED}<script>explore()</script>`,
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

test('pages answer on every URL form with their own policy', () => {
  withBuild(SITE, (build) => {
    const sharedHash = scriptHash('shared()');
    const exploreHash = scriptHash('explore()');
    const expectedPages = {
      '/index.html': ['/', '/index.html'],
      '/events/example/index.html': ['/events/example', '/events/example/', '/events/example/index.html'],
      '/explore/index.html': ['/explore', '/explore/', '/explore/index.html'],
    };
    for (const [file, urls] of Object.entries(expectedPages)) {
      for (const url of urls) {
        const response = request(build, url);
        assert.equal(response.status, 200, url);
        assert.equal(response.file, file, url);
        assert.equal(response.headers['X-Frame-Options'], 'DENY', url);
        assert.ok(response.headers[CSP_HEADER].includes(sharedHash), url);
        assert.equal(response.headers[CSP_HEADER].includes(exploreHash), file === '/explore/index.html', url);
      }
    }
  });
});

test('missing paths and the 404 page itself answer 404 with the site policy', () => {
  withBuild(SITE, (build) => {
    for (const url of ['/404.html', '/no-such-page', '/no-such-page/', '/events/missing/index.html', '/events', '/vercel.json', '/EXPLORE', '/Events/Example']) {
      const response = request(build, url);
      assert.equal(response.status, 404, url);
      assert.equal(response.file, '/404.html', url);
      assert.equal(response.headers['X-Frame-Options'], 'DENY', url);
      assert.ok(response.headers[CSP_HEADER].includes(scriptHash('missing()')), url);
      assert.ok(!response.headers[CSP_HEADER].includes(scriptHash('explore()')), url);
    }
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
