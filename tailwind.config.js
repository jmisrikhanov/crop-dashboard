/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // <--- IMPORTANT: Add this line
  theme: {
    extend: {},
  },
  plugins: [],
};
