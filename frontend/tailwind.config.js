/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core RRE Vantage-inspired Dark Glass Palette
        rre: {
          black: "#000000",
          card: "#050708",
          dark: "#080C0E",
          surface: "#0D1113",
          hover: "#101719",
          border: "rgba(255, 255, 255, 0.13)",
          "border-strong": "rgba(255, 255, 255, 0.21)",
          text: "#FFFFFF",
          secondary: "rgba(226, 229, 228, 0.84)",
          muted: "rgba(226, 229, 228, 0.60)",
          dim: "rgba(226, 229, 228, 0.42)",
          accent: "#00E5FF", // Teal subtle accent
        },
        primary: "#000000",
        secondary: "#080C0E",
        accent: "#00E5FF",
        dark: "#050708",
      },
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 20px 50px -12px rgba(0, 0, 0, 0.5)',
        'cinematic': '0 25px 80px -15px rgba(0, 0, 0, 0.9)',
        'glass': '0 2px 10px rgba(0, 0, 0, 0.44), 0 0 0 3px rgba(255, 255, 255, 0.035) inset, 0 0 0 1px rgba(0, 0, 0, 0.9)',
        'glass-strong': '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.15) inset',
      },
      backdropBlur: {
        'glass': '14px',
        'glass-heavy': '24px',
      },
      letterSpacing: {
        'tightest': '-0.04em',
        'tighter': '-0.03em',
        'cinematic': '0.3em',
        'widest-hero': '0.5em',
      }
    },
  },
  plugins: [],
}

