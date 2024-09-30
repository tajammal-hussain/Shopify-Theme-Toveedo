/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './assets/*.liquid',
    './layout/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
    './template/*.liquid',
    './template/customers/*.liquid',
  ],
  theme: {
    extend: {
      animation: {
        move: 'move 500s linear infinite',
        fontFamily: {
          caveat: ['Caveat', 'cursive'],
        },
      },
      keyframes: {
        move: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
};
