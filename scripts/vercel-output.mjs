import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { buildConfig, inlineScripts, pageSource, scriptHash, securityTxt } from '../site/scripts/generate-security-headers.cjs';

export function buildEnvironment(env) {
  const result = { ...env };
  const analytics = ['PUBLIC_POSTHOG_PROJECT_TOKEN', 'PUBLIC_POSTHOG_HOST'];
  if (env.VERCEL_ENV === 'production') {
    for (const key of analytics) {
      if (!result[key]?.trim()) throw new Error(`Production build requires ${key} in Vercel's Production environment.`);
    }
  } else {
    for (const key of analytics) delete result[key];
  }
  return result;
}

function filesIn(dir, base = dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? filesIn(file, base) : [path.relative(base, file).split(path.sep).join('/')];
  });
}

const escapePattern = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function writeBuildOutput(dist, output) {
  const files = filesIn(dist);
  for (const file of files) {
    if (/(^|\/)vercel\.(?:json|[cm]?[jt]s)$/.test(file)) {
      throw new Error(`Refusing to publish Vercel config in static output: ${file}`);
    }
  }
  // Reuse the policy generator on the actual HTML after Astro has baked in its
  // environment. No intermediate Vercel config is written into the static tree.
  const pages = new Map(files.filter((file) => file.endsWith('.html')).map((file) => [
    file, new Set(inlineScripts(readFileSync(path.join(dist, file), 'utf8')).map(scriptHash)),
  ]));
  const { headers: [siteRule, ...pageRules] } = buildConfig(pages);
  const headerValues = (rule) => Object.fromEntries(rule.headers.map(({ key, value }) => [key, value]));
  const globalHeaders = headerValues(siteRule);
  const pageHeaders = new Map(pageRules.map((rule) => [rule.source, headerValues(rule)]));
  const routes = files.filter((file) => file.endsWith('.html')).sort().map((file) => {
    const url = file === 'index.html' ? '/' : file.endsWith('/index.html') ? `/${file.slice(0, -11)}` : `/${file}`;
    const src = file === 'index.html' ? '^/(?:index\\.html)?$'
      : file.endsWith('/index.html') ? `^${escapePattern(url)}(?:/|/index\\.html)?$` : `^${escapePattern(url)}$`;
    // Each page is a terminal route with all matching headers merged. This avoids
    // depending on precedence between overlapping global and page CSP routes.
    return { src, dest: `/${file}`, headers: { ...globalHeaders, ...pageHeaders.get(pageSource(file)) }, ...(file === '404.html' ? { status: 404 } : {}) };
  });
  routes.push(
    { src: '/.*', headers: globalHeaders, continue: true },
    { handle: 'filesystem' },
    { src: '/.*', dest: '/404.html', status: 404 },
  );
  rmSync(output, { recursive: true, force: true });
  mkdirSync(path.join(output, 'static'), { recursive: true });
  cpSync(dist, path.join(output, 'static'), { recursive: true });
  mkdirSync(path.join(output, 'static', '.well-known'), { recursive: true });
  writeFileSync(path.join(output, 'static', '.well-known', 'security.txt'), securityTxt());
  writeFileSync(path.join(output, 'config.json'), `${JSON.stringify({ version: 3, routes }, null, 2)}\n`);
  console.log(`Vercel Build Output: ${routes.length - 3} pages with generated security headers.`);
}
