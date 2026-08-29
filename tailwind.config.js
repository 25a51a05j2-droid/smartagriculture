/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ag: {
          50: '#f3faf3',
          100: '#e3f5e3',
          200: '#c7ebc7',
          300: '#9bd99b',
          400: '#6bbf6b',
          500: '#43a043',
          600: '#2f8a2f',
          700: '#266d26',
          800: '#205620',
          900: '#1b471b',
          950: '#0d260d',
        },
        leaf: {
          400: '#7cc47c',
          500: '#52b352',
        },
        clay: {
          100: '#f5ecd9',
          300: '#d9b97a',
          500: '#b8862a',
          700: '#8a6315',
        },
        cream: '#fbfdf8',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(13,38,13,0.06), 0 8px 24px -12px rgba(13,38,13,0.18)',
        soft: '0 1px 2px rgba(13,38,13,0.05), 0 4px 12px -4px rgba(13,38,13,0.1)',
        glow: '0 0 0 6px rgba(67,160,67,0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'float': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'pop': 'pop 0.3s ease-out both',
        'float': 'float 5s ease-in-out infinite',
        'shimmer': 'shimmer 1.4s infinite',
      },
    },
  },
  plugins: [],
};
