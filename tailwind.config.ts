import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        calm: {
          50: "#f6faf8",
          100: "#eaf3ef",
          200: "#d7e9e0",
          300: "#bad8ca",
          400: "#8bbba5",
          500: "#5f9b84",
          600: "#477a68",
          700: "#365f52",
          800: "#2f4e45",
          900: "#2a413a"
        },
        warm: {
          50: "#fff9ef",
          100: "#fef1d8",
          200: "#fde0aa",
          300: "#f8c870",
          400: "#f2ad3d"
        }
      },
      boxShadow: {
        soft: "0 16px 50px -24px rgba(31, 41, 55, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
