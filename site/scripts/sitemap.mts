import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from '../../scripts/frontmatter.ts';

export function loadSitemapDates(contentDir: string): Map<string, string> {
  const dates = new Map<string, string>();
  for (const section of ['events', 'threads']) {
    const directory = path.join(contentDir, section);
    for (const entry of readdirSync(directory, { recursive: true, withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
      const file = path.join(entry.parentPath, entry.name);
      try {
        const { data } = parseFrontmatter(readFileSync(file, 'utf8'));
        const date = section === 'events'
          ? data.revision?.last_reviewed ?? data.revision?.created ?? data.date
          : data.last_updated;
        if (date != null) {
          dates.set(`/${section}/${data.id}/`, new Date(date).toISOString().slice(0, 10));
        }
      } catch (cause) {
        throw new Error(`Cannot read the sitemap date from ${file}: ${(cause as Error).message}`, { cause });
      }
    }
  }
  return dates;
}

export function sitemapSerializer(contentDir: string) {
  let dates: Map<string, string> | undefined;
  return <Item extends { url: string }>(item: Item): Item & { lastmod?: string } => {
    dates ??= loadSitemapDates(contentDir);
    const lastmod = dates.get(new URL(item.url).pathname);
    return lastmod ? { ...item, lastmod } : item;
  };
}
