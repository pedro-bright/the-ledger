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
