import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["android/**", "dist/**"]),
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    extends: [tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/jsx-no-target-blank": "off",
      // "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "react/display-name": "off",
      // TypeScript's own type checking replaces PropTypes entirely.
      "react/prop-types": "off",
      // the base rule can't see type-only parameter names (e.g. `(value: T) => void`
      // in a type annotation) and flags them as unused; the TS-aware rule understands them.
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }],
      // `condition && doSomething()` is used throughout as a shorthand conditional call.
      "@typescript-eslint/no-unused-expressions": ["error", { allowShortCircuit: true, allowTernary: true }],
      // JSON.parse falling back to a default on invalid stored data is intentional.
      "no-empty": ["error", { allowEmptyCatch: true }],
      // `any` is used deliberately as an escape hatch for known typing gaps
      // (Ionic custom-element event targets, native form elements, etc.).
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["src/**/*.test.{js,ts}"],
    languageOptions: {
      globals: globals.jest,
    },
  },
]);
