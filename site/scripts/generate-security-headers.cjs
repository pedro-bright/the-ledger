#!/usr/bin/env node
/**
 * generate-security-headers.cjs - Runs after `astro build`. Writes dist/vercel.json
 * (response headers) and dist/.well-known/security.txt.
 *
 * deploy.yml and preview.yml run `vercel deploy dist/`, so Vercel reads its config from
 * dist/. The script hashes are generated because they change whenever an inline script
 * or the PostHog token changes.
 *
 * The policy is report-only for now. To enforce it, rename CSP_HEADER to
 * Content-Security-Policy and move frame-ancestors into buildPolicy.
 */

const { createHash } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const CSP_HEADER = 'Content-Security-Policy-Report-Only';

const POSTHOG_ORIGINS = 'https://us.i.posthog.com https://us-assets.i.posthog.com';
const REPO_URL = 'https://github.com/pedro-bright/the-ledger';

// Limits from Vercel's vercel.json schema (https://openapi.vercel.sh/vercel.json).
const MAX_HEADER_VALUE_LENGTH = 32768;
const MAX_HEADER_RULES = 2048;

const JS_TYPES = new Set(['', 'module', 'text/javascript', 'application/javascript']);

/** Returns the text of each inline script in the page that a browser would execute. */
function inlineScripts(html) {
  // Comments are matched so a commented-out script is skipped. Attribute values are
  // matched whole because they can contain ">".
  const tokens = /<!--[\s\S]*?-->|<script\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script\b[^>]*>/gi;
  const scripts = [];
  for (const [token, attrs, text] of html.matchAll(tokens)) {
    if (token.startsWith('<!--') || !text) continue;
    if (/\ssrc\s*=/i.test(attrs)) continue;
    const type = attrs.match(/\stype\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"']+))/i);
    const typeValue = (type?.[1] ?? type?.[2] ?? type?.[3] ?? '').trim().toLowerCase();
    if (JS_TYPES.has(typeValue)) scripts.push(text);
  }
  return scripts;
}

/** Returns the CSP source for a script. HTML parsers normalize newlines before hashing. */
function scriptHash(text) {
  const normalized = text.replace(/\r\n?/g, '\n');
  return `'sha256-${createHash('sha256').update(normalized, 'utf8').digest('base64')}'`;
}

function buildPolicy(hashes) {
  return [
    "default-src 'self'",
    `script-src 'self' ${[...hashes].sort().join(' ')} ${POSTHOG_ORIGINS}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    `connect-src 'self' ${POSTHOG_ORIGINS}`,
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
  ].join('; ');
}

/** Returns the Vercel `source` matching a page's URLs, for a dist-relative index.html path. */
function pageSource(file) {
  const dir = path.posix.dirname(file);
  if (dir === '.') return '/(index\\.html)?';
  const escaped = dir.replace(/[.*+?^${}()|[\]\\:]/g, '\\$&');
  return `/${escaped}(/|/index\\.html)?`;
}

function findHtmlFiles(dir, base = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return findHtmlFiles(full, base);
    return entry.name.endsWith('.html') ? [path.relative(base, full).split(path.sep).join('/')] : [];
  });
}

/**
 * Builds the vercel.json config from each page's inline script hashes.
 *
 * Hashes used on several pages go in one site-wide policy. A hash used on one page goes
 * in a policy for that page only, so scripts that embed per-page data don't add their
 * hashes to every response. Vercel applies matching rules in order and the later value
 * of a header replaces the earlier one.
 *
 * Files not named index.html can't be matched by URL (404.html answers for any missing
 * path), so their hashes are always site-wide.
 */
function buildConfig(pages) {
  const useCount = new Map();
  for (const hashes of pages.values()) {
    for (const hash of hashes) useCount.set(hash, (useCount.get(hash) ?? 0) + 1);
  }

  const shared = new Set();
  for (const [file, hashes] of pages) {
    for (const hash of hashes) {
      if (useCount.get(hash) > 1 || path.posix.basename(file) !== 'index.html') shared.add(hash);
    }
  }

  const pageRules = [...pages]
    .filter(([, hashes]) => [...hashes].some((hash) => !shared.has(hash)))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([file, hashes]) => ({
      source: pageSource(file),
      headers: [{ key: CSP_HEADER, value: buildPolicy(new Set([...shared, ...hashes])) }],
    }));

  const siteRule = {
    source: '/(.*)',
    headers: [
      { key: CSP_HEADER, value: buildPolicy(shared) },
      // Browsers ignore frame-ancestors in a report-only policy, so it is enforced on its own.
      { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
    ],
  };

  const rules = [siteRule, ...pageRules];
  if (rules.length > MAX_HEADER_RULES) {
    throw new Error(`${rules.length} header rules; Vercel allows ${MAX_HEADER_RULES}.`);
  }
  for (const { source, headers } of rules) {
    for (const { key, value } of headers) {
      if (value.length > MAX_HEADER_VALUE_LENGTH) {
        throw new Error(`${key} for ${source} is ${value.length} characters; Vercel allows ${MAX_HEADER_VALUE_LENGTH}.`);
      }
    }
  }
  return { headers: rules };
}

/** The expiry is a year past the build, so the regular content deploys keep it current. */
function securityTxt(now = new Date()) {
  const expires = new Date(now);
  expires.setUTCFullYear(expires.getUTCFullYear() + 1);
  return [
    '# Please report vulnerabilities privately through the first contact.',
    '# If it is unavailable, open an issue asking for a private channel, without any details.',
    `Contact: ${REPO_URL}/security/advisories/new`,
    `Contact: ${REPO_URL}/issues/new?title=Request%20for%20a%20private%20security%20contact`,
    `Expires: ${expires.toISOString().replace(/\.\d+Z$/, 'Z')}`,
    'Canonical: https://www.the-ledger.net/.well-known/security.txt',
    'Preferred-Languages: en',
    '',
  ].join('\n');
}

function main() {
  const dist = path.join(__dirname, '..', 'dist');
  const pages = new Map(
    findHtmlFiles(dist).map((file) => {
      const html = fs.readFileSync(path.join(dist, file), 'utf8');
      return [file, new Set(inlineScripts(html).map(scriptHash))];
    }),
  );

  const config = buildConfig(pages);
  fs.writeFileSync(path.join(dist, 'vercel.json'), `${JSON.stringify(config, null, 2)}\n`);
  fs.mkdirSync(path.join(dist, '.well-known'), { recursive: true });
  fs.writeFileSync(path.join(dist, '.well-known', 'security.txt'), securityTxt());

  console.log(`Security headers: ${pages.size} pages, ${config.headers.length} header rules.`);
}

module.exports = { CSP_HEADER, buildConfig, inlineScripts, pageSource, scriptHash, securityTxt };

if (require.main === module) main();
