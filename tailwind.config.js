/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",   // ✅ Includes all React JSX/TSX files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
