import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';
import { sitemapSerializer } from './scripts/sitemap.mts';

export default defineConfig({
  site: 'https://the-ledger.net',
  // Keep the HTML whitespace behavior from before Astro 7.
  compressHTML: true,
  integrations: [
    react(),
    sitemap({
      serialize: sitemapSerializer(fileURLToPath(new URL('../content/', import.meta.url))),
    }),
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
