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
        // پالت اصلی برند حول سه رنگ: #3f1212 (شرابی تیره) و #d52a2a (قرمز تیتر) و #343434 (ذغالی)

        // قرمز تیتر/برند — رنگ پایه #d52a2a
        brand: {
          50: "#fdeaea",
          100: "#fbcaca",
          200: "#f59a9a",
          300: "#ee6a6a",
          400: "#e64545",
          500: "#d52a2a", // رنگ پایه (تیترها)
          600: "#b81f1f",
          700: "#971919",
          800: "#7a1717",
          900: "#5f1414",
          950: "#3a0c0c",
        },

        // شرابی تیره — حول #3f1212 (دکمه‌ها، حاشیه‌ها، پس‌زمینهٔ تیره)
        wine: {
          50: "#fceeee",
          100: "#f7d8d8",
          200: "#f0b3b3",
          300: "#e58484",
          400: "#d65151",
          500: "#c62f2f",
          600: "#a02626",
          700: "#7a2020",
          800: "#571a1a",
          900: "#3f1212", // رنگ پایه
          950: "#260a0a",
        },

        // ذغالی — حول #343434 (سطوح و متن تیره)
        charcoal: {
          50: "#f3f3f3",
          100: "#e2e2e2",
          200: "#c4c4c4",
          300: "#9d9d9d",
          400: "#6e6e6e",
          500: "#4f4f4f",
          600: "#414141",
          700: "#343434", // رنگ پایه
          800: "#262626",
          900: "#1c1c1c",
          950: "#121212",
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
