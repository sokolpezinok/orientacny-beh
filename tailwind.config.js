/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // from src/styles/theme.css
        primary: "var(--theme-primary)",
        "primary-shade": "var(--theme-primary-shade)",
        "primary-tint": "var(--theme-primary-tint)",
        background: "var(--theme-background)",
        border: "var(--theme-border)",
        typography: "var(--theme-typography)",
        "typography-tint": "var(--theme-typography-tint)",
        "typography-shade": "var(--theme-typography-shade)",
        bright: "var(--theme-bright)",
      },
      screens: {
        xs: "350px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
