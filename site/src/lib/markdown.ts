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
  if (!/^ya?ml$/i.test(file.language)) rejectFrontmatterLanguage();
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
