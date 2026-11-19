/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          light: '#FFFDF7',
          DEFAULT: '#FAF3E0',
          dark: '#EFE5CC',
          card: '#F5EBD7',
        },
        retro: {
          charcoal: '#1E293B',
          darkest: '#0F172A',
          border: '#1E293B',
        },
        sakura: {
          light: '#FFAAB9',
          DEFAULT: '#FF758F',
          dark: '#E04868',
        },
        matcha: {
          light: '#72D2A4',
          DEFAULT: '#52B788',
          dark: '#3A9468',
        },
        coin: {
          light: '#FFCA3A',
          DEFAULT: '#FFB703',
          dark: '#E09800',
        },
        wood: {
          light: '#DEB887',
          DEFAULT: '#C18C5D',
          dark: '#8C5835',
        }
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        retro: ['"VT323"', 'monospace'],
        jp: ['"Noto Sans JP"', 'sans-serif'],
        vi: ['"Be Vietnam Pro"', 'sans-serif'],
      },
      boxShadow: {
        'pixel': '3px 3px 0 0 #1E293B',
        'pixel-sm': '2px 2px 0 0 #1E293B',
        'pixel-lg': '5px 5px 0 0 #1E293B',
        'pixel-inset': 'inset 2px 2px 0 0 rgba(255,255,255,0.4), inset -2px -2px 0 0 rgba(0,0,0,0.2)',
        'pixel-btn': '0 4px 0 0 #1E293B',
        'pixel-btn-active': '0 1px 0 0 #1E293B',
      }
    },
  },
  plugins: [],
}
