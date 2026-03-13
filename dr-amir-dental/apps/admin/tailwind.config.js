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
    },
  },
  plugins: [],
};
