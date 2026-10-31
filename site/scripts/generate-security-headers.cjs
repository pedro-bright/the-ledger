#!/usr/bin/env node
/**
 * generate-security-headers.cjs - Runs after `astro build`. Writes dist/vercel.json
 * (response headers) and dist/.well-known/security.txt.
 *
 * deploy.yml and preview.yml run `vercel deploy dist/`, so Vercel reads its config from
 * dist/. The script hashes are generated because they change whenever an inline script
 * or the PostHog token changes.
 *
 * The policy is report-only for now. To enforce it, change CSP_HEADER to
 * Content-Security-Policy.
 */

const { createHash } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const CSP_HEADER = 'Content-Security-Policy-Report-Only';

const POSTHOG_ORIGINS = 'https://us.i.posthog.com https://us-assets.i.posthog.com';
const REPO_URL = 'https://github.com/pedro-bright/the-ledger';

/** Returns the text of each script element in the page that has any. */
function inlineScripts(html) {
  // Attribute values are matched whole because they can contain ">".
  const scripts = /<script\b(?:[^>"']|"[^"]*"|'[^']*')*>([\s\S]*?)<\/script\b[^>]*>/gi;
  return [...html.matchAll(scripts)].map(([, text]) => text).filter(Boolean);
}

/** Returns the CSP source for a script. */
function scriptHash(text) {
  return `'sha256-${createHash('sha256').update(text, 'utf8').digest('base64')}'`;
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
    "frame-ancestors 'none'",
  ].join('; ');
}

/** Returns the Vercel `source` matching a page's URLs, for a dist-relative index.html path. */
function pageSource(file) {
  const dir = path.posix.dirname(file);
  if (dir === '.') return '/{index\\.html}?';
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
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
    ],
  };

  return { headers: [siteRule, ...pageRules] };
}

/** The expiry is a year past the build, so the regular content deploys keep it current. */
function securityTxt(now = new Date()) {
  const expires = new Date(now);
  expires.setUTCFullYear(expires.getUTCFullYear() + 1);
  return [
    '# To report a vulnerability, open an issue through the first contact to ask for a private channel.',
    '# Issues are public, so leave out any details of the problem.',
    '# The second contact, GitHub private vulnerability reporting, is coming and is not available yet.',
    `Contact: ${REPO_URL}/issues/new?title=Request%20for%20a%20private%20security%20contact`,
    `Contact: ${REPO_URL}/security/advisories/new`,
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

module.exports = { CSP_HEADER, buildConfig, findHtmlFiles, inlineScripts, pageSource, scriptHash, securityTxt };

if (require.main === module) main();
