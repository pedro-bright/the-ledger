import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import sitemap from '@astrojs/sitemap';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadSitemapDates } from './scripts/sitemap.mts';

const site = 'https://the-ledger.net';
let robotsSitemapURL = new URL('sitemap-index.xml', site);
const sitemapDates = loadSitemapDates(fileURLToPath(new URL('../content/', import.meta.url)));

export default defineConfig({
  site,
  // Keep the HTML whitespace behavior from before Astro 7.
  compressHTML: true,
  integrations: [
    react(),
    sitemap({
      serialize(item) {
        const lastmod = sitemapDates.get(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
    {
      name: 'ledger-robots',
      hooks: {
        'astro:config:done': ({ config }) => {
          robotsSitemapURL = new URL('sitemap-index.xml', config.site);
        },
        'astro:build:done': ({ dir }) => {
          // Keep the published discovery URL in sync with the configured host.
          const robots = readFileSync(new URL('./public/robots.txt', import.meta.url), 'utf8');
          writeFileSync(new URL('robots.txt', dir), robots.replace(
            /^Sitemap:.*$/m,
            `Sitemap: ${robotsSitemapURL.href}`,
          ));
        },
      },
    },
  ],
  vite: {
    build: {
      cssTarget: ['chrome87', 'edge88', 'firefox78', 'safari14'],
    },
    css: {
      postcss: { plugins: [tailwind(), autoprefixer()] },
    },
    ssr: {
      noExternal: ['@fontsource/inter', '@fontsource/jetbrains-mono'],
    },
  },
});
