export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Bebas Neue"', 'Oswald', 'Inter', 'sans-serif'],
        heading: ['Tektur', 'sans-serif'],
        press: ['"Press Start 2P"', 'cursive'],
        body: ['Oxanium', 'sans-serif'],
        orbitron: ['"Orbitron"', 'sans-serif'],
      },
      colors: {
        'overlay': 'rgba(29, 7, 7, 0.6)',
      }
    },
  },
  plugins: [],
};
