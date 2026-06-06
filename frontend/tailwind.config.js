/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000", // SatyamStudio uses deep black for accents
        secondary: "#ffffff",
        accent: "#ff0000", // Bright red for small details
        dark: "#111111",
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'premium': '0 20px 50px -12px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
