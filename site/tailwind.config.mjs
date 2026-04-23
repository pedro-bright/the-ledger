/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Core wiki-native palette. Light-first, warm, archival.
        'page-bg': '#FAFAF7',
        ink: {
          DEFAULT: '#14130F',
          dim: '#0F0E0C',
          mid: '#3C3731',
          muted: '#5C564D',
          faint: '#7A7368',
          soft: '#B8B2A7',
        },
        rule: {
          DEFAULT: '#E8E4DA',
          strong: '#D9D3C5',
          double: '#C9C0AE',
          utility: '#E3DECF',
        },
        wiki: {
          link: '#0645AD',
          'link-visited': '#0B0080',
          'link-hover': '#3366BB',
          surface: '#F0EDE4',
          'surface-strong': '#E8E2D0',
        },
        flag: {
          'landmark-bg': '#FDF2C5',
          'landmark-text': '#7A5A00',
          'major-bg': '#DBECF9',
          'major-text': '#0A4D82',
          'notable-bg': '#EDEAE3',
          'notable-text': '#5C564D',
        },
        status: {
          active: '#0A7C32',
          'active-bg': '#E5F3E9',
          dormant: '#7A7368',
          'dormant-bg': '#EDEAE3',
        },
        // Legacy aliases — kept remapped to light values so existing pages
        // compile during the wave-by-wave rewrite. Remove once nothing uses them.
        ledger: {
          bg: '#FAFAF7',
          surface: '#F0EDE4',
          border: '#E8E4DA',
          'border-light': '#D9D3C5',
          text: '#14130F',
          'text-muted': '#5C564D',
          'text-dim': '#7A7368',
        },
        // Category colors — AA-contrast variants for text on page-bg.
        category: {
          policy: '#4338CA',
          models: '#B45309',
          research: '#047857',
          industry: '#6D28D9',
          safety: '#B91C1C',
          culture: '#BE185D',
          'open-source': '#0E7490',
        },
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Fraunces', 'Iowan Old Style', 'Apple Garamond', 'Georgia', 'serif'],
        serif: ['"Source Serif 4 Variable"', '"Source Serif 4"', 'Iowan Old Style', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Wiki-native: restrained, fixed sizes for predictable long-form rhythm.
        'display-xl': ['2.5rem', { lineHeight: '1.05', letterSpacing: '-0.018em' }],
        'display-lg': ['2.25rem', { lineHeight: '1.08', letterSpacing: '-0.014em' }],
        'display':    ['1.875rem', { lineHeight: '1.12', letterSpacing: '-0.01em' }],
        'display-sm': ['1.625rem', { lineHeight: '1.18', letterSpacing: '-0.006em' }],
        'display-xs': ['1.375rem', { lineHeight: '1.22', letterSpacing: '-0.003em' }],
      },
      letterSpacing: {
        'wiki-label': '0.06em',
        'wiki-meta': '0.04em',
        'wiki-caps': '0.08em',
      },
      lineHeight: {
        'prose': '1.7',
        'display': '1.1',
      },
      maxWidth: {
        prose: '68ch',
        article: '72ch',
        reading: '65ch',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
