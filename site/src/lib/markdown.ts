import matter from 'gray-matter';
import { Marked } from 'marked';

const rejectFrontmatterLanguage = () => {
  throw new Error('Only YAML frontmatter is allowed.');
};

// A content file can name its frontmatter language on the opening delimiter, and
// gray-matter runs `---js` through eval. Replace that engine so the code never
// runs, then refuse every other language the file asked for.
export function parseFrontmatter(raw: string) {
  const file = matter(raw, {
    engines: { javascript: rejectFrontmatterLanguage },
  });
  if (file.language && !/^ya?ml$/i.test(file.language)) rejectFrontmatterLanguage();
  return file;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function isSafeHref(href: string): boolean {
  // Browsers decode character references in an href, but new URL() does not, so
  // it reads `javascript&colon;alert(1)` as a harmless relative path. Links have
  // no reason to use a character reference before the first path, query or
  // fragment delimiter, which is where a scheme would be spelled.
  if (/^[^/?#]*&/.test(href)) return false;
  try {
    const { protocol } = new URL(href, 'https://the-ledger.net');
    return protocol === 'https:' || protocol === 'http:' || protocol === 'mailto:';
  } catch {
    return false;
  }
}

// Bodies come from automated PRs, so nothing in them may reach readers as markup
// beyond what Markdown itself produces. Turning off the HTML tokenizers makes raw
// HTML ordinary text that gets escaped. Escaping html tokens in the renderer would
// not be enough: marked stops escaping text after an inline <code>, <kbd> or <pre>
// tag. Links with unsafe schemes and all images render as their text.
const contentMarked = new Marked({
  tokenizer: {
    html() {
      return undefined;
    },
    tag() {
      return undefined;
    },
  },
  renderer: {
    link({ href, tokens }) {
      return isSafeHref(href) ? false : this.parser.parseInline(tokens);
    },
    image({ text }) {
      return escapeHtml(text);
    },
  },
});

export function renderMarkdown(markdown: string): string {
  return contentMarked.parse(markdown, { async: false }) as string;
}

/** Anchor rendered article sections, including headings supplied by Astro slots. */
export function anchorSections(html: string, used = new Set<string>()) {
  const sections: Array<{ id: string; title: string; level: number }> = [];
  const entities: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  const content = html.replace(/<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/g, (heading, level, attrs = '', inner) => {
    const title = inner.replace(/<[^>]*>/g, '').replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (entity: string, name: string) => {
      if (!name.startsWith('#')) return entities[name.toLowerCase()] ?? entity;
      const point = name[1].toLowerCase() === 'x' ? parseInt(name.slice(2), 16) : Number(name.slice(1));
      return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : entity;
    }).trim();
    const existing = attrs.match(/\bid=["']([^"']+)["']/)?.[1];
    const base = `section-${title.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'heading'}`;
    let id = existing || base;
    let suffix = 2;
    while (used.has(id)) id = `${base}-${suffix++}`;
    used.add(id);
    sections.push({ id, title, level: Number(level) });
    return existing === id ? heading : `<h${level}${attrs.replace(/\s+id=["'][^"']*["']/, '')} id="${id}">${inner}</h${level}>`;
  });
  return { content, sections };
}
