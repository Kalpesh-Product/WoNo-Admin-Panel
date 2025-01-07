/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pregular: ['Poppins-Regular', 'sans-serif'],
        pmedium:['Popins-SemiBold', 'serif']
      }
    },
  },
  plugins: [],
}