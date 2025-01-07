/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pregular: ['Poppins-Regular', 'sans-serif'],
        pmedium: ['Poppins-SemiBold', 'serif'],
      },
      colors: {
        primary: '#1E3D73',
      },
      fontSize: {
        title: '1.5rem', // Equivalent to text-2xl
        subtitle: '1.125rem', // Equivalent to text-lg
        widgetTitle : '1.25rem',
        content: '0.875rem', // Equivalent to text-sm
      },
    },
  },
  plugins: [],
};
