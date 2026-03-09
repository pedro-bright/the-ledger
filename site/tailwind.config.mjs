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
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
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
