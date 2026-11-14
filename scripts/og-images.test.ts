import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const DIST = path.join(import.meta.dirname, '..', 'site', 'dist');

const htmlFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });

const meta = (html: string, property: string) =>
  html.match(new RegExp(`<meta property="${property}" content="([^"]*)"`))?.[1];

function pngSize(file: string) {
  const bytes = fs.readFileSync(file);
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${file} is not a PNG`);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

const pages = htmlFiles(DIST).map((file) => {
  const html = fs.readFileSync(file, 'utf8');
  return { page: path.relative(DIST, file), html, image: meta(html, 'og:image') };
});

test('every page with an og:image points at an existing 1200x630 PNG', () => {
  const withImage = pages.filter((p) => p.image);
  assert.ok(withImage.length > 300, `expected the event pages, found ${withImage.length} pages`);
  for (const { page, html, image } of withImage) {
    const file = path.join(DIST, decodeURIComponent(new URL(image!).pathname));
    assert.ok(fs.existsSync(file), `${page}: og:image ${image} is missing from site/dist`);
    assert.deepEqual(pngSize(file), { width: 1200, height: 630 }, `${page}: ${image}`);
    assert.equal(meta(html, 'twitter:image'), image, `${page}: twitter:image differs from og:image`);
  }
});

test('each event and thread page uses its own card', () => {
  for (const section of ['events', 'threads']) {
    const sectionPages = pages.filter((p) => p.page.startsWith(`${section}${path.sep}`) && p.page !== path.join(section, 'index.html'));
    assert.ok(sectionPages.length > 0, `no ${section} pages in site/dist`);
    for (const { page, image } of sectionPages) {
      const slug = path.dirname(page).split(path.sep).pop();
      assert.equal(image && new URL(image).pathname, `/og/${section}/${slug}.png`, page);
    }
  }
});
