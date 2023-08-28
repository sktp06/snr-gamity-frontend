/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors")

module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}","./node_modules/vue-tailwind-datepicker/**/*.js"],
  theme: {
    extend: {
      colors: {
        "vtd-primary": colors.sky, // Light mode Datepicker color
        "vtd-secondary": colors.gray, // Dark mode Datepicker color
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ]
};
