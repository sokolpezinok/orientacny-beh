/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  trailingComma: "es5",
  printWidth: 200,
  singleQuote: false,
  useTabs: false,
  tabWidth: 2,
};
export default config;
