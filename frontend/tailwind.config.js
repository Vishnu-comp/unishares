/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {colors: {
      darkGreen: '#022d26', // Adjust this to match the design
      green: {
        600: '#027a5f', // Custom green color for buttons
      },
    },},
  },
  plugins: [],
}
