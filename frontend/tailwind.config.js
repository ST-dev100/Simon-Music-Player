/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero': "url('/public/music.jpg')",
        'pre':"url('/public/preloader.jpg')"
      }
    },
  },
  plugins: [],
  darkMode: 'class',
};