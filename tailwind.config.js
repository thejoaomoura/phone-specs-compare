/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber': {
          50: '#f0f7ff',
          100: '#e0f2fe',
          200: '#b9e6fe',
          300: '#7cd4fd',
          400: '#36bffa',
          500: '#0ca6eb',
          600: '#0083c9',
          700: '#0069a3',
          800: '#005886',
          900: '#00456e',
          950: '#002a47',
        },
        'neon': {
          400: '#00ff9d',
          500: '#00ff8c',
          600: '#00e07d',
        },
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #002a47 0%, #004a7c 100%)',
        'neon-glow': 'linear-gradient(90deg, #00ff9d 0%, #00ff8c 100%)',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 255, 140, 0.5)',
        'cyber': '0 4px 20px rgba(0, 166, 235, 0.2)',
      },
    },
  },
  plugins: [],
}