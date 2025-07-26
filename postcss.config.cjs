// postcss.config.cjs
module.exports = {
  plugins: {
    // Change this line:
    '@tailwindcss/postcss': {}, // <--- This is the correct plugin entry
    autoprefixer: {},
  },
};