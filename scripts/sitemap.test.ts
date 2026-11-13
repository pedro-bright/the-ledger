import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { test } from 'node:test';
import { loadSitemapDates } from '../site/scripts/sitemap.mts';

test('sitemap dates prefer review, then creation, then event date, and use thread updates', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'ledger-sitemap-'));
  try {
    const fixtures = {
      'events/2026/reviewed.md': 'id: reviewed\ndate: 2026-01-01\nrevision:\n  created: 2026-02-01\n  last_reviewed: 2026-03-01',
      'events/2026/created.md': 'id: created\ndate: 2026-01-01\nrevision:\n  created: "2026-02-01"',
      'events/2026/dated.md': 'id: dated\ndate: 2026-01-01',
      'threads/thread.md': 'id: thread\nlast_updated: 2026-04-01',
      'threads/undated.md': 'id: undated',
    };
    for (const [file, frontmatter] of Object.entries(fixtures)) {
      const target = path.join(root, file);
      mkdirSync(path.dirname(target), { recursive: true });
      writeFileSync(target, `---\n${frontmatter}\n---\n`);
    }
    assert.deepEqual([...loadSitemapDates(root)].sort(), [
      ['/events/created/', '2026-02-01'],
      ['/events/dated/', '2026-01-01'],
      ['/events/reviewed/', '2026-03-01'],
      ['/threads/thread/', '2026-04-01'],
    ]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('published robots.txt uses the resolved Astro site URL', async () => {
  const { default: config } = await import('../site/astro.config.mjs');
  const integration = config.integrations.find((item) => item.name === 'ledger-robots');
  const root = mkdtempSync(path.join(tmpdir(), 'ledger-robots-'));
  try {
    await integration.hooks['astro:config:done']({ config: { site: 'https://archive.example/' } });
    await integration.hooks['astro:build:done']({ dir: pathToFileURL(`${root}/`) });
    assert.equal(readFileSync(path.join(root, 'robots.txt'), 'utf8'),
      'User-agent: *\nAllow: /\n\nSitemap: https://archive.example/sitemap-index.xml\n');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
