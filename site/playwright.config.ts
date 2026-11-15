import { execFileSync } from 'node:child_process';
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for the-ledger site.
 *
 * Tests run against the STATIC BUILD (npm run build && npm run preview), not the dev
 * server — the rewrite is a static-output change, and preview is closer to production.
 * In CI an earlier job builds the site, so the run only serves it.
 * Each run starts its own server on a free port, so it never tests a server another checkout
 * left running. Workers load this file again and read the port from the environment.
 */
process.env.PLAYWRIGHT_PORT ??= execFileSync(
  process.execPath,
  ['-e', "const s = require('node:net').createServer().listen(0, () => { console.log(s.address().port); s.close(); })"],
  { encoding: 'utf8' },
).trim();
const baseURL = `http://localhost:${process.env.PLAYWRIGHT_PORT}`;
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Locally Playwright uses half the CPU cores as workers; CI sets --workers in e2e.yml.
  reporter: [['list']],

  use: {
    baseURL,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 800 },
      },
    },
  ],

  webServer: {
    // Astro 7 can otherwise background the server when invoked by an agent.
    command: `${process.env.CI ? '' : 'npm run build && '}npm run preview -- --ignore-lock --port ${process.env.PLAYWRIGHT_PORT}`,
    url: baseURL,
    reuseExistingServer: false,
    // The initial build is slow (content collection + graph + 100+ static pages).
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
