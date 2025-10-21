/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
       fontFamily: {
        heading: ['Roboto', 'sans-serif'],
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
}