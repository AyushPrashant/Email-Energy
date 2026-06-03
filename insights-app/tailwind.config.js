/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        navy: {
          900: '#0a0e1a',
          800: '#0f1628',
          700: '#141d35',
          600: '#1a2442',
          500: '#202c50',
        },
        energy: {
          blue: '#3B82F6',
          green: '#22C55E',
          yellow: '#EAB308',
          red: '#EF4444',
        }
      },
      backgroundImage: {
        'mesh': 'radial-gradient(at 40% 20%, hsla(228,100%,15%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(210,100%,10%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(220,100%,8%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(240,80%,12%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(230,100%,8%,1) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
}
