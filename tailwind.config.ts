import type { Config } from 'tailwindcss'

/**
 * Design tokens derived from Canva exports (1366px desktop).
 * Approximations are noted in docs/DESIGN_ANALYSIS.md and docs/ENGINEERING.md.
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        nexus: {
          'purple-900': '#2D0B5A',
          'purple-800': '#4C1D95',
          'purple-700': '#6B21A8',
          'purple-500': '#A855F7',
          'indigo-950': '#0A041A',
          'cyan-400': '#22D3EE',
          'pink-100': '#FCE7F3',
          'pink-200': '#FBCFE8',
          burgundy: 'rgba(128, 0, 32, 0.8)',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        hero: ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        section: ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'card-title': ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        tagline: [
          '0.8125rem',
          { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.12em' },
        ],
      },
      borderRadius: {
        card: '1rem',
        glass: '1rem',
        collage: '1.5rem',
        window: '2rem',
      },
      boxShadow: {
        collage: '0 8px 32px rgba(0, 0, 0, 0.25)',
        card: '0 4px 16px rgba(0, 0, 0, 0.15)',
      },
      backgroundImage: {
        'gradient-category':
          'linear-gradient(to right, #A855F7, #4C1D95, #0A041A)',
        'gradient-feature':
          'linear-gradient(to bottom, #6B21A8, #2D0B5A)',
        'gradient-hero-panel':
          'linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)',
      },
      maxWidth: {
        design: '85.375rem',
      },
      screens: {
        design: '85.375rem',
      },
    },
  },
  plugins: [],
} satisfies Config
