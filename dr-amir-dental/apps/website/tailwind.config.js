/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: 'var(--color-primary)',
        'bg-main': 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'nav-bg': 'var(--color-nav-bg)',
        border: 'var(--color-border)',
        'status-open': 'var(--color-status-open)',
        'status-closed': 'var(--color-status-closed)',
        'button-hover': 'var(--color-button-hover)',
        'footer-bg': 'var(--color-footer-bg)',
        'star-gold': 'var(--color-star-gold)',
        'whatsapp-green': 'var(--color-whatsapp-green)',
      },
      boxShadow: {
        card: '0 2px 12px var(--color-card-shadow)',
        'card-hover': '0 8px 24px var(--color-card-shadow)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(5px) rotate(-1deg)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(8px) rotate(-1deg)' },
          '66%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        'float-slow': 'float 12s ease-in-out infinite',
        'float-reverse': 'float-reverse 10s ease-in-out infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
