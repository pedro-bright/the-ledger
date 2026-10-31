import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { buildHeaders, inlineScripts, scriptHash, securityTxt } from '../site/scripts/generate-security-headers.cjs';

export function buildEnvironment(env) {
  const result = { ...env };
  for (const key of ['PUBLIC_POSTHOG_PROJECT_TOKEN', 'PUBLIC_POSTHOG_HOST']) {
    if (env.VERCEL_ENV !== 'production') delete result[key];
    else if (!env[key]?.trim()) console.warn(`Warning: ${key} is not set in Vercel's Production environment, so this build publishes without working analytics.`);
  }
  return result;
}

export function filesIn(dir, base = dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? filesIn(file, base) : [path.relative(base, file).split(path.sep).join('/')];
  });
}

const escapePattern = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const indexPattern = (file) => (file === 'index.html'
  ? '^/(?:index\\.html)?$'
  : `^/${escapePattern(file.slice(0, -'/index.html'.length))}(?:/|/index\\.html)?$`);

export function writeBuildOutput(dist, output) {
  const files = filesIn(dist);
  if (files.includes('vercel.json')) {
    throw new Error('Refusing to publish Vercel config in static output: vercel.json');
  }
  // Reuse the policy generator on the actual HTML after Astro has baked in its
  // environment. No intermediate Vercel config is written into the static tree.
  const pages = new Map(files.filter((file) => file.endsWith('.html')).map((file) => [
    file, new Set(inlineScripts(readFileSync(path.join(dist, file), 'utf8')).map(scriptHash)),
  ]));
  const { siteHeaders, pageHeaders } = buildHeaders(pages);
  // Pages with their own policy are terminal routes with all matching headers merged,
  // which avoids depending on precedence between overlapping global and page CSP routes.
  // Every other page shares the directory-index route, so publishing adds no routes.
  const terminalPages = [...pages.keys()].filter((file) => file === 'index.html' || pageHeaders.has(file)).sort();
  const routes = [
    ...terminalPages.map((file) => ({
      src: indexPattern(file),
      dest: `/${file}`,
      headers: { ...siteHeaders, ...pageHeaders.get(file) },
      caseSensitive: true,
    })),
    { src: '^/404\\.html$', dest: '/404.html', headers: siteHeaders, status: 404 },
    { src: '/.*', headers: siteHeaders, continue: true },
    { handle: 'filesystem' },
    { src: '^/(.*[^/])/?$', dest: '/$1/index.html', check: true },
    { src: '/.*', dest: '/404.html', status: 404 },
  ];
  rmSync(output, { recursive: true, force: true });
  mkdirSync(path.join(output, 'static'), { recursive: true });
  cpSync(dist, path.join(output, 'static'), { recursive: true });
  mkdirSync(path.join(output, 'static', '.well-known'), { recursive: true });
  writeFileSync(path.join(output, 'static', '.well-known', 'security.txt'), securityTxt());
  writeFileSync(path.join(output, 'config.json'), `${JSON.stringify({ version: 3, routes }, null, 2)}\n`);
  console.log(`Vercel Build Output: ${pages.size} pages with generated security headers, ${routes.length} routes.`);
}
