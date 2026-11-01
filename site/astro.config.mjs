import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  site: 'https://the-ledger.net',
  // Keep the HTML whitespace behavior from before Astro 7.
  compressHTML: true,
  integrations: [
    react(),
  ],
  vite: {
    css: {
      postcss: { plugins: [tailwind(), autoprefixer()] },
    },
    ssr: {
      noExternal: ['@fontsource/inter', '@fontsource/jetbrains-mono'],
    },
  },
});
