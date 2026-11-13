import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { loadSitemapDates, sitemapSerializer } from '../site/scripts/sitemap.mts';

function withContent(fixtures: Record<string, string>, run: (root: string) => void) {
  const root = mkdtempSync(path.join(tmpdir(), 'ledger-sitemap-'));
  try {
    for (const [file, frontmatter] of Object.entries(fixtures)) {
      const target = path.join(root, file);
      mkdirSync(path.dirname(target), { recursive: true });
      writeFileSync(target, `---\n${frontmatter}\n---\n`);
    }
    run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('sitemap dates prefer review, then creation, then event date, and use thread updates', () => {
  withContent({
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

test('the sitemap serializer adds lastmod to dated pages and leaves other pages unchanged', () => {
  withContent({
    'events/2026/dated.md': 'id: dated\ndate: 2026-01-01',
    'threads/undated.md': 'id: undated',
  }, (root) => {
    const serialize = sitemapSerializer(root);
    assert.deepEqual(serialize({ url: 'https://the-ledger.net/events/dated/' }), {
      url: 'https://the-ledger.net/events/dated/',
      lastmod: '2026-01-01',
    });
    for (const url of ['https://the-ledger.net/threads/undated/', 'https://the-ledger.net/about/']) {
      assert.deepEqual(serialize({ url }), { url });
    }
  });
});

test('content is read on the first serialized page, and a file that cannot be dated is named', () => {
  const fixtures = {
    'events/2026/bad-date.md': 'id: bad-date\ndate: soon',
    'threads/bad-yaml.md': 'id: [bad-yaml\nlast_updated: 2026-04-01',
  };
  for (const [file, frontmatter] of Object.entries(fixtures)) {
    withContent({ 'events/2026/dated.md': 'id: dated\ndate: 2026-01-01', 'threads/thread.md': 'id: thread', [file]: frontmatter }, (root) => {
      const serialize = sitemapSerializer(root);
      assert.throws(
        () => serialize({ url: 'https://the-ledger.net/' }),
        (error: Error) => error.message.includes(path.join(root, file)),
      );
    });
  }
});
