/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D0A0B',
        cardBg: 'rgba(25, 20, 24, 0.75)',
        primary: '#FF4F81',
        secondary: '#FF8FAB',
        accent: '#FFD6E0',
        textLight: '#FFF7F9',
        subtlePink: '#FFE5EC',
        darkSurface: '#191418',
        glassBorder: 'rgba(255, 143, 171, 0.25)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        romantic: ['"Playfair Display"', 'Georgia', 'serif'],
        cute: ['"Comfortaa"', 'cursive', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(255, 79, 129, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(255, 79, 129, 0.7)' },
        },
      },
      boxShadow: {
        'romantic': '0 8px 32px 0 rgba(255, 79, 129, 0.25)',
        'romantic-lg': '0 12px 40px 0 rgba(255, 79, 129, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
