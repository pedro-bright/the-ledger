/**
 * Security policy helpers used by scripts/vercel-output.mjs after Astro builds.
 * The packager carries these headers into Build Output API routes and publishes
 * security.txt, keeping configuration outside the static files.
 * This module uses only Node built-ins.
 * The script hashes are generated because they change whenever an inline script or the
 * PostHog token changes.
 *
 * The policy is report-only for now. To enforce it, change CSP_HEADER to
 * Content-Security-Policy.
 */

const { createHash } = require('node:crypto');
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

/**
 * Builds the response headers from each page's inline script hashes.
 *
 * Hashes used on several pages go in one site-wide policy. A hash used on one page goes
 * in a policy for that page only, so scripts that embed per-page data don't add their
 * hashes to every response. Returns the site-wide headers, plus the headers to override
 * for each dist-relative file that has its own policy.
 *
 * Files not named index.html can't be matched by URL (404.html answers for any missing
 * path), so their hashes are always site-wide.
 */
function buildHeaders(pages) {
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

  const pageHeaders = new Map(
    [...pages]
      .filter(([, hashes]) => [...hashes].some((hash) => !shared.has(hash)))
      .map(([file, hashes]) => [file, { [CSP_HEADER]: buildPolicy(new Set([...shared, ...hashes])) }]),
  );

  const siteHeaders = {
    [CSP_HEADER]: buildPolicy(shared),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
  };

  return { siteHeaders, pageHeaders };
}

/** The expiry is a year past the build, so the regular content deploys keep it current. */
function securityTxt(now = new Date()) {
  const expires = new Date(now);
  expires.setUTCFullYear(expires.getUTCFullYear() + 1);
  return [
    `Contact: ${REPO_URL}/security/advisories/new`,
    `Expires: ${expires.toISOString().replace(/\.\d+Z$/, 'Z')}`,
    'Canonical: https://www.the-ledger.net/.well-known/security.txt',
    'Preferred-Languages: en',
    '',
  ].join('\n');
}

module.exports = { CSP_HEADER, buildHeaders, inlineScripts, scriptHash, securityTxt };
