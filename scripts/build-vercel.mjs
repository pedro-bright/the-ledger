import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildEnvironment, writeBuildOutput } from './vercel-output.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const site = path.join(root, 'site');
const env = buildEnvironment(process.env);

function run(script, cwd = root) {
  const result = spawnSync('npm', ['run', script], { cwd, env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run('build-graph');
run('generate-feed');
mkdirSync(path.join(site, 'public'), { recursive: true });
for (const file of ['graph.json', 'feed.xml', 'rss.xml']) {
  copyFileSync(path.join(root, file), path.join(site, 'public', file));
}
run('build', site);
writeBuildOutput(path.join(site, 'dist'), path.join(root, '.vercel', 'output'));
