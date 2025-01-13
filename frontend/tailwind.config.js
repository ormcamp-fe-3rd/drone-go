/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        title: "#353740",
        hover: "#F4F4F9",
        click: "#242222",
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".title": {
          fontSize: "30px",
          fontWeight: "700",
          color: "#353740",
          lineHeight: "36px",
        },
        ".subtitle": {
          fontSize: "18px",
          fontWeight: "500",
          color: "#353740",
          lineHeight: "20px",
        },
      });
    }),
  ],
};
