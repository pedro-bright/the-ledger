import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for the-ledger site.
 *
 * Tests run against the STATIC BUILD (npm run build && npm run preview), not the dev
 * server — the rewrite is a static-output change, and preview is closer to production.
 * In CI an earlier job builds the site, so the run only serves it.
 * The preview port comes from astro preview defaults (4321). A run always starts its own
 * server, so it stops with an error when another server already holds the port.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Keep worker count modest — the test pages mount a force-graph canvas which
  // likes to consume CPU. Playwright defaults to (cores/2) which is fine locally.
  reporter: [['list']],

  use: {
    baseURL: 'http://localhost:4321',
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
    command: process.env.CI
      ? 'npm run preview -- --ignore-lock'
      : 'npm run build && npm run preview -- --ignore-lock',
    url: 'http://localhost:4321',
    reuseExistingServer: false,
    // The initial build is slow (content collection + graph + 100+ static pages).
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
