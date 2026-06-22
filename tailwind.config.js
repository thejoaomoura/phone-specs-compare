/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"Space Mono"', 'monospace'],
        body: ['"EB Garamond"', 'Georgia', 'serif'],
      },
      colors: {
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        paper: {
          50:  '#FDFAF5',
          100: '#F5EDD5',
          200: '#EAE4D0',
          300: '#D9CFBA',
          400: '#C4B59A',
          500: '#A89378',
        },
        ink: {
          50:  '#8C7162',
          100: '#5C4232',
          200: '#2D1B0E',
          900: '#1A0E05',
        },
        rust: {
          50:  '#FDF0EB',
          200: '#F0B89A',
          300: '#E07050',
          400: '#C1440E',
          500: '#962E07',
          600: '#721E03',
        },
        sage: {
          400: '#7A9461',
          500: '#5A7C44',
        },
      },
      backgroundImage: {
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
