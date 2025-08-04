export default {
  content: [
    './**/*.php',               // Scan all PHP files in theme
    './src/*.css', // Your Tailwind input files
  ],
  theme: {
    extend: {
      colors: {
        gold: '#916922',
      }
    }
  },
  plugins: [],
};