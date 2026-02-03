/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '.theme-dark'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: 'var(--color-base)',
        surface: 'var(--color-surface)',
        muted: 'var(--color-muted)',
        accent: 'var(--color-accent)',
        border: 'var(--color-border)',
        content: 'var(--color-content)'
      },
      fontFamily: {
        sans: ['\"DM Sans\"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 20px 50px rgba(6, 182, 212, 0.15)'
      }
    }
  },
  plugins: []
};
