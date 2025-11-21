import daisyui from 'daisyui'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation:{
        'boarder':'boarder 4s linear infinite',

      },
      keyframes:{
        'boarder':{
          to:{'--boarder-angle':'360'},
        }
      }
    },
  },
  plugins: [daisyui],
}