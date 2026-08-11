/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          dark: '#0a0d14',
          card: '#121722',
          cardHover: '#1a2130',
          border: '#232d42',
          gold: '#e5a638',
          goldLight: '#f3c66d',
          cyan: '#00d2ff',
          red: '#ff3b5c',
          green: '#00e676'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
