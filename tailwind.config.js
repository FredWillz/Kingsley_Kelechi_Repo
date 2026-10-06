/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-on-primary': 'var(--color-text-on-primary)',
      },
      fontFamily: {
      heading: ['var(--font-heading)'],
      body: ['var(--font-body)'],
      mono: ['var(--font-mono)'],
    },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-in': 'slideInRight 0.2s ease-out',
        'scroll-in': 'scrollIn 0.7s ease-out both',
      },
    },
  },
  plugins: [],
}
