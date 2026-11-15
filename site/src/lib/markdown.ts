import { Marked } from 'marked';
import { parseFragment, serialize, type DefaultTreeAdapterTypes } from 'parse5';

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

const text = (node: DefaultTreeAdapterTypes.Node): string => {
  if ('value' in node) return node.value;
  return 'childNodes' in node ? node.childNodes.map(text).join('') : '';
};

/** Plain text of each top-level paragraph, or of those under the `## section` heading when one is named. */
export function plainParagraphs(markdown: string, section?: string): string[] {
  const paragraphs: string[] = [];
  let heading: string | undefined;
  for (const node of parseFragment(renderMarkdown(markdown)).childNodes) {
    if (!('tagName' in node)) continue;
    if (node.tagName === 'h2') heading = text(node).trim();
    else if (node.tagName === 'p' && (section === undefined || heading === section)) {
      paragraphs.push(text(node).replace(/\s+/g, ' ').trim());
    }
  }
  return paragraphs;
}

// A sentence ends at ., ! or ? (and any closing quote or bracket) before a space. A
// period after a single letter ("U.S.", "J. Smith") or a common abbreviation does not end one.
const SENTENCE_END =
  /(?:(?<!(?:^|[\s.(])(?:\p{L}|Inc|Corp|Co|Ltd|Jr|Sr|Dr|Mr|Mrs|Ms|St|vs|No|pp|Sen|Rep|Gov|Gen))\.|[!?])["'”’)\]]*(?=\s)/gu;

/** The first sentence of a text, or all of it when it has no sentence break. */
export function firstSentence(value: string): string {
  const end = [...value.matchAll(SENTENCE_END)][0];
  return end ? value.slice(0, end.index + end[0].length) : value;
}

/**
 * Shortens text for a meta description: whole when it fits, otherwise cut after the
 * last sentence that fits, or at the last word that fits with an ellipsis.
 */
export function metaDescription(value: string, limit = 160): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= limit) return clean;
  const sentences = [...clean.matchAll(SENTENCE_END)].filter((end) => end.index + end[0].length <= limit);
  const last = sentences[sentences.length - 1];
  if (last) return clean.slice(0, last.index + last[0].length);
  const cut = clean.slice(0, limit);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:—–-]+$/, '')}…`;
}

/** Anchor actual heading nodes; markup-like text in attributes must remain inert. */
export function anchorSections(html: string, used: Set<string>) {
  const fragment = parseFragment(html);
  const sections: Array<{ id: string; title: string; level: number }> = [];
  const visit = (node: DefaultTreeAdapterTypes.Node) => {
    if ('tagName' in node && (node.tagName === 'h2' || node.tagName === 'h3')) {
      const title = text(node).trim();
      const base = `section-${title.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'heading'}`;
      let id = base;
      let suffix = 2;
      while (used.has(id)) id = `${base}-${suffix++}`;
      used.add(id);
      node.attrs = [...node.attrs.filter((attr) => attr.name !== 'id'), { name: 'id', value: id }];
      sections.push({ id, title, level: Number(node.tagName[1]) });
    }
    if ('childNodes' in node) node.childNodes.forEach(visit);
  };
  visit(fragment);
  return { content: serialize(fragment), sections };
}
