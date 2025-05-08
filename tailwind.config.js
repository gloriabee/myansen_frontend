/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary_1: "#0D9488",
        primary_2: "#96CAC3",
        positive: "#008000",
        neutral: "#FFA500",
        negative: "#FF0000",
        secondary_dark: "#212529",
        secondary_gray: "#D3D3D3",
      },
    },
  },
  plugins: [],
};
