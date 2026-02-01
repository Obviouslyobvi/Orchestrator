/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#111113',
        surface: '#17171b',
        muted: '#9ca3af',
        accent: '#06b6d4',
        border: '#27272e'
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
