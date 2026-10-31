import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

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
  // Consume the header lane's post-build artifact, so CSP hashes always describe
  // this build's actual HTML, including its environment-specific analytics script.
  const { headers } = JSON.parse(readFileSync(path.join(dist, 'vercel.json'), 'utf8'));
  if (!Array.isArray(headers) || !headers.length) throw new Error('Missing generated security headers.');
  const rules = headers.map(({ source, headers }) => ({
    pattern: new RegExp(`^${source}$`),
    headers: Object.fromEntries(headers.map(({ key, value }) => [key, value])),
  }));
  const files = filesIn(dist);
  for (const file of files) {
    if (file !== 'vercel.json' && /(^|\/)vercel\.(?:json|[cm]?[jt]s)$/.test(file)) {
      throw new Error(`Refusing to publish Vercel config in static output: ${file}`);
    }
  }
  const headersFor = (url) => Object.assign({}, ...rules.filter(({ pattern }) => pattern.test(url)).map(({ headers }) => headers));
  const routes = files.filter((file) => file.endsWith('.html')).sort().map((file) => {
    const url = file === 'index.html' ? '/' : file.endsWith('/index.html') ? `/${file.slice(0, -11)}` : `/${file}`;
    const src = file === 'index.html' ? '^/(?:index\\.html)?$'
      : file.endsWith('/index.html') ? `^${escapePattern(url)}(?:/|/index\\.html)?$` : `^${escapePattern(url)}$`;
    // Each page is a terminal route with all matching headers merged. This avoids
    // depending on precedence between overlapping global and page CSP routes.
    return { src, dest: `/${file}`, headers: headersFor(url), ...(file === '404.html' ? { status: 404 } : {}) };
  });
  routes.push(
    { src: '/.*', headers: headersFor('/__static_asset__'), continue: true },
    { handle: 'filesystem' },
    { src: '/.*', dest: '/404.html', status: 404 },
  );
  rmSync(output, { recursive: true, force: true });
  mkdirSync(path.join(output, 'static'), { recursive: true });
  cpSync(dist, path.join(output, 'static'), { recursive: true, filter: (file) => file !== path.join(dist, 'vercel.json') });
  writeFileSync(path.join(output, 'config.json'), `${JSON.stringify({ version: 3, routes }, null, 2)}\n`);
  console.log(`Vercel Build Output: ${routes.length - 3} pages with generated security headers.`);
}
