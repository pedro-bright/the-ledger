import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { buildEnvironment, writeBuildOutput } from './vercel-output.mjs';
import { CSP_HEADER, scriptHash } from '../site/scripts/generate-security-headers.cjs';

test('only production builds receive analytics settings', () => {
  const settings = { PUBLIC_POSTHOG_PROJECT_TOKEN: 'production-project', PUBLIC_POSTHOG_HOST: 'https://us.i.posthog.com', PATH: '/bin' };
  for (const VERCEL_ENV of ['preview', 'development', undefined]) {
    const env = buildEnvironment({ ...settings, VERCEL_ENV });
    assert.equal(env.PUBLIC_POSTHOG_PROJECT_TOKEN, undefined);
    assert.equal(env.PUBLIC_POSTHOG_HOST, undefined);
    assert.equal(env.PATH, '/bin');
  }
  assert.equal(buildEnvironment({ ...settings, VERCEL_ENV: 'production' }).PUBLIC_POSTHOG_PROJECT_TOKEN, 'production-project');
  assert.throws(() => buildEnvironment({ VERCEL_ENV: 'production' }), /PUBLIC_POSTHOG/);
});

test('packages static pages with their generated policies, feeds, assets and a real 404', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'ledger-vercel-'));
  try {
    const dist = path.join(root, 'dist');
    const output = path.join(root, 'output');
    mkdirSync(path.join(dist, 'events', 'example'), { recursive: true });
    for (const [file, contents] of Object.entries({ 'index.html': '<h1>Ledger</h1>', 'events/example/index.html': '<script>event()</script>', '404.html': '<h1>Missing</h1>', 'graph.json': '{"nodes":[]}', 'feed.xml': '<feed/>', 'rss.xml': '<rss/>', 'asset.js': 'console.log(1)' })) {
      writeFileSync(path.join(dist, file), contents);
    }
    writeBuildOutput(dist, output);
    const config = JSON.parse(readFileSync(path.join(output, 'config.json'), 'utf8'));
    assert.equal(config.version, 3);
    for (const url of ['/events/example', '/events/example/', '/events/example/index.html']) {
      const route = config.routes.find(({ src }) => src && new RegExp(src).test(url));
      assert.equal(route.dest, '/events/example/index.html');
      assert.equal(route.headers['X-Frame-Options'], 'DENY');
      assert.ok(route.headers[CSP_HEADER].includes(scriptHash('event()')));
    }
    const home = config.routes.find(({ src }) => src && new RegExp(src).test('/'));
    assert.equal(home.dest, '/index.html');
    assert.ok(!home.headers[CSP_HEADER].includes(scriptHash('event()')));
    assert.deepEqual(config.routes.at(-1), { src: '/.*', dest: '/404.html', status: 404 });
    for (const file of ['graph.json', 'feed.xml', 'rss.xml', 'asset.js']) {
      assert.equal(readFileSync(path.join(output, 'static', file), 'utf8'), readFileSync(path.join(dist, file), 'utf8'));
    }
    assert.equal(existsSync(path.join(output, 'static', 'vercel.json')), false);
    assert.match(readFileSync(path.join(output, 'static', '.well-known', 'security.txt'), 'utf8'), /Contact: https:\/\/github.com\/pedro-bright\/the-ledger\/security\/advisories\/new/);
    writeFileSync(path.join(dist, 'vercel.js'), 'throw new Error("untrusted config")');
    assert.throws(() => writeBuildOutput(dist, output), /Vercel config/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
