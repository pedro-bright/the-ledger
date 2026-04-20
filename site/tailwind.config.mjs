/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ledger: {
          bg: '#0A0A0F',
          surface: '#111118',
          border: '#1A1A2E',
          'border-light': '#2A2A3E',
          text: '#E8E4DF',
          'text-muted': '#9B97A0',
          'text-dim': '#6B6770',
        },
        category: {
          policy: '#6366F1',
          models: '#F59E0B',
          research: '#10B981',
          industry: '#8B5CF6',
          safety: '#EF4444',
          culture: '#EC4899',
          'open-source': '#06B6D4',
        },
      },
      fontFamily: {
        // Editorial display — serif for hero, titles, section heads. Fraunces variable with opsz axis.
        display: ['"Fraunces Variable"', 'Fraunces', 'Iowan Old Style', 'Apple Garamond', 'Georgia', 'Times New Roman', 'serif'],
        // UI chrome and body — Inter retained for readability in long form.
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        // Metadata, dates, identifiers — the ledger's "data layer" voice.
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Fluid display sizes for marketing surfaces (hero, page titles).
        'display-xs': ['clamp(1.75rem, 1.5rem + 1.2vw, 2.5rem)', { lineHeight: '1.12', letterSpacing: '-0.012em' }],
        'display-sm': ['clamp(2.25rem, 1.8rem + 2vw, 3.25rem)', { lineHeight: '1.08', letterSpacing: '-0.016em' }],
        'display': ['clamp(2.75rem, 2rem + 3.5vw, 4.5rem)', { lineHeight: '1.04', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(3.25rem, 2.25rem + 4.5vw, 5.5rem)', { lineHeight: '1.0', letterSpacing: '-0.024em' }],
      },
      letterSpacing: {
        'display-tight': '-0.024em',
        'mono-wide': '0.08em',
      },
      lineHeight: {
        'prose': '1.75',
        'display': '1.04',
      },
      maxWidth: {
        'prose': '65ch',
        'reading': '68ch',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
