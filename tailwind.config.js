/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary_yellow: '#0053A0',
        secondary_blue:'#E2EBF4',
        primary_gray: '#1c1c1c',
        secondary_gray: '#F6F6FA',
        secondary_white: '#f5f5f5',
        blue: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      fontFamily: {
        barlow: ['"Barlow Condensed"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        kanit: ['Kanit', 'sans-serif'],
        smooch: ['"Smooch Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
