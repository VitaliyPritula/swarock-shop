/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D1D24',
        secondary: '#DADFE2',
        // accent: '#1d1d24',
      },
      screens: {
        // Custom breakpoints
        'xs': '400px',        // very small phones
        'sm': '640px',        // small (default Tailwind sm)
        'md': '992px',        // medium
        'lg': '1024px',       // large
        'xl': '1280px',       // extra large
        '2xl': '1536px',      // 2x
        // Add your own named points
        'tablet': '900px',    // example custom name
        'desktop': '1200px',  // example custom name
      },
    },
  },
  plugins: [],
}
