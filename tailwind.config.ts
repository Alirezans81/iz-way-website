import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // رنگ شرابی (Wine) به‌عنوان رنگ اصلی برند
        wine: {
          50: "#fbf3f5",
          100: "#f7e4e9",
          200: "#eec3cf",
          300: "#e29bb0",
          400: "#d06487",
          500: "#b73f64",
          600: "#9c2a4f",
          700: "#7b1e3b", // رنگ پایه
          800: "#641830",
          900: "#54172b",
          950: "#2f0a16",
        },
      },
      fontFamily: {
        sans: ["Vazirmatn", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
