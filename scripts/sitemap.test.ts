import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { test } from 'node:test';
import { XMLParser } from 'fast-xml-parser';
import { loadSitemapDates, sitemapDates } from '../site/scripts/sitemap.mts';

const SITE_DIR = fileURLToPath(new URL('../site/', import.meta.url));
const PAGE = '<html><body>Page</body></html>';

function withFiles(files: Record<string, string>, run: (root: string) => void) {
  const root = realpathSync(mkdtempSync(path.join(tmpdir(), 'ledger-sitemap-')));
  try {
    for (const [file, text] of Object.entries(files)) {
      const target = path.join(root, file);
      mkdirSync(path.dirname(target), { recursive: true });
      writeFileSync(target, file.endsWith('.md') ? `---\n${text}\n---\n` : text);
    }
    run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function buildSite(root: string) {
  writeFileSync(path.join(root, 'astro.config.mjs'), `
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { sitemapDates } from ${JSON.stringify(pathToFileURL(path.join(SITE_DIR, 'scripts/sitemap.mts')).href)};

const dates = sitemapDates(${JSON.stringify(path.join(root, 'content'))});

export default defineConfig({
  site: 'https://archive.example',
  cacheDir: './cache',
  integrations: [dates.integration, sitemap({ serialize: dates.serialize })],
});
`);
  symlinkSync(path.join(SITE_DIR, 'node_modules'), path.join(root, 'node_modules'), 'dir');
  return spawnSync(
    process.execPath,
    [path.join(SITE_DIR, 'node_modules/astro/bin/astro.mjs'), 'build'],
    { cwd: root, encoding: 'utf8', env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' } },
  );
}

test('sitemap dates prefer review, then creation, then event date, and use thread updates', () => {
  withFiles({
    'events/2026/reviewed.md': 'id: reviewed\ndate: 2026-01-01\nrevision:\n  created: 2026-02-01\n  last_reviewed: 2026-03-01',
    'events/2026/created.md': 'id: created\ndate: 2026-01-01\nrevision:\n  created: "2026-02-01"',
    'events/2026/dated.md': 'id: dated\ndate: 2026-01-01',
    'threads/thread.md': 'id: thread\nlast_updated: 2026-04-01',
    'threads/undated.md': 'id: undated',
  }, (root) => {
    assert.deepEqual([...loadSitemapDates(root)].sort(), [
      ['/events/created/', '2026-02-01'],
      ['/events/dated/', '2026-01-01'],
      ['/events/reviewed/', '2026-03-01'],
      ['/threads/thread/', '2026-04-01'],
    ]);
  });
});

test('content is read when a build starts, and a file that cannot be dated is named', () => {
  const fixtures = {
    'events/2026/bad-date.md': 'id: bad-date\ndate: soon',
    'threads/bad-yaml.md': 'id: [bad-yaml\nlast_updated: 2026-04-01',
  };
  for (const [file, frontmatter] of Object.entries(fixtures)) {
    withFiles({ 'events/2026/dated.md': 'id: dated\ndate: 2026-01-01', 'threads/thread.md': 'id: thread', [file]: frontmatter }, (root) => {
      const { integration } = sitemapDates(root);
      assert.throws(
        () => integration.hooks['astro:build:start'](),
        (error: Error) => error.message.includes(path.join(root, file)),
      );
    });
  }
});

test('a build writes lastmod for dated pages and leaves other pages undated', () => {
  withFiles({
    'content/events/2026/dated.md': 'id: dated\ndate: 2026-01-01',
    'content/threads/undated.md': 'id: undated',
    'src/pages/index.astro': PAGE,
    'src/pages/events/dated.astro': PAGE,
    'src/pages/threads/undated.astro': PAGE,
  }, (root) => {
    const build = buildSite(root);
    assert.equal(build.status, 0, build.stdout + build.stderr);
    const parser = new XMLParser({ parseTagValue: false, isArray: (name) => name === 'url' });
    const { urlset } = parser.parse(readFileSync(path.join(root, 'dist/sitemap-0.xml'), 'utf8'));
    const dates = urlset.url.map((entry: { loc: string; lastmod?: string }) => [
      entry.loc,
      entry.lastmod && new Date(entry.lastmod).toISOString().slice(0, 10),
    ]);
    assert.deepEqual(dates.sort(), [
      ['https://archive.example/', undefined],
      ['https://archive.example/events/dated/', '2026-01-01'],
      ['https://archive.example/threads/undated/', undefined],
    ]);
  });
});

test('a build fails and names the file when an event date is invalid', () => {
  withFiles({
    'content/events/2026/bad-date.md': 'id: bad-date\ndate: soon',
    'content/threads/thread.md': 'id: thread',
    'src/pages/index.astro': PAGE,
  }, (root) => {
    const build = buildSite(root);
    assert.notEqual(build.status, 0, build.stdout + build.stderr);
    assert.ok(
      (build.stdout + build.stderr).includes(path.join(root, 'content/events/2026/bad-date.md')),
      build.stdout + build.stderr,
    );
    assert.equal(existsSync(path.join(root, 'dist/sitemap-index.xml')), false);
  });
});
