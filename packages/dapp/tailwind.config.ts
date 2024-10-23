/** @type {import('tailwindcss').Config} */
module.exports = {
   theme: {
      extend: {
         colors: {
            primary: {
               50: '#F6F3F2',
               100: '#746D6A',
               400: '#794228',
               600: '#352218',
               700: '#352218',
               900: '#1A0D08',
               '900-75': 'rgba(26, 13, 8, 0.75)',
               '900-5': 'rgba(26, 13, 8, 0.05)',
            },
            re: {
               100: '#F7DEDE',
               500: '#8B2020',
            },
            ge: {
               100: '#D7F5E2',
               500: '#207F42',
            },
         },
      },
   },
   darkMode: ['class'],
   content: [
      './pages/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
      './app/**/*.{ts,tsx}',
      './src/**/*.{ts,tsx}',
   ],

   plugins: [require('tailwindcss-animate')],
};
