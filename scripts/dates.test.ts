import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { getISOYear } from '../site/src/lib/dates';

const SITE = path.join(import.meta.dirname, '..', 'site');
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

test('ISO years keep January 1 in its calendar year regardless of local time', () => {
  assert.equal(getISOYear('2027-01-01'), 2027);
  assert.equal(getISOYear('2026-12-31'), 2026);
});

test('the loader returns every source, contestation and significance date as YYYY-MM-DD', async () => {
  // The loader finds content relative to the working directory, as it does in an Astro build.
  process.chdir(SITE);
  const { loadEvents, loadControversies } = await import('../site/src/lib/content');
  const dates: Array<[string, unknown]> = [];
  const sourceDates = (where: string, sources: object[] = []) => {
    for (const source of sources) {
      for (const field of ['date', 'published_at', 'accessed', 'accessed_at']) {
        if (field in source) dates.push([`${where} source ${field}`, source[field as keyof typeof source]]);
      }
    }
  };

  const events = loadEvents();
  for (const event of events) {
    sourceDates(event.id, event.sources);
    if (event.contestation && 'last_challenged' in event.contestation) {
      dates.push([`${event.id} last_challenged`, event.contestation.last_challenged]);
    }
    for (const entry of event.significance_history ?? []) dates.push([`${event.id} significance_history`, entry.date]);
  }
  for (const controversy of loadControversies()) {
    for (const position of controversy.positions ?? []) sourceDates(controversy.id, position.sources);
  }

  assert.ok(dates.length > 0, 'no dates found in content');
  for (const [where, value] of dates) {
    assert.ok(typeof value === 'string' && ISO_DATE.test(value), `${where}: ${String(value)}`);
  }
  // This test runs in a time zone behind UTC, where reading a date in local time gives the day before.
  const event = events.find((e) => e.id === 'character-ai-minor-chat-ban');
  assert.equal(event?.sources?.[0].date, '2025-10-29');
});

test('built entry pages show each source date as <time datetime="YYYY-MM-DD">YYYY-MM-DD</time>', () => {
  const eventsDir = path.join(SITE, 'dist', 'events');
  const pages = fs.readdirSync(eventsDir, { recursive: true, encoding: 'utf8' }).filter((f) => f.endsWith('index.html'));
  assert.ok(pages.length > 0, 'no event pages in site/dist; build the site first');
  let count = 0;
  for (const page of pages) {
    const html = fs.readFileSync(path.join(eventsDir, page), 'utf8');
    for (const [, inner] of html.matchAll(/<span class="ref-date[^"]*"[^>]*>([\s\S]*?)<\/span>/g)) {
      const match = inner.match(/^ \(<time datetime="([^"]*)"[^>]*>([^<]*)<\/time>\)$/);
      assert.ok(match && ISO_DATE.test(match[1]) && match[2] === match[1], `${page}: ${inner}`);
      count++;
    }
  }
  assert.ok(count > 0, 'no source dates found on built entry pages');

  const html = fs.readFileSync(path.join(eventsDir, 'character-ai-minor-chat-ban', 'index.html'), 'utf8');
  assert.match(html, /\(<time datetime="2025-10-29"[^>]*>2025-10-29<\/time>\)/);
});
