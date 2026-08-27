import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { UserConfig } from "vite";
import capacitorConfig from "./capacitor.config.json";

process.env.VITE_APP_TITLE = capacitorConfig.appName;
process.env.VITE_APP_VERSION ??= "0.0.0";

// https://vite.dev/config/
const config: UserConfig = {
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ["@ionic/react", "@ionic/react-router", "@ionic/core"],
  },
  resolve: {
    alias: {
      "@": `${import.meta.dirname}/src`,
    },
  },
  base: "/",
  build: {
    // Some Android devices still ship an outdated, non-updated system
    // WebView (e.g. Chromium 83 on Android 11), which predates ES2021
    // logical assignment operators (??=, ||=, &&=). Target an older
    // baseline so the bundle doesn't hard-crash with a SyntaxError there.
    target: "es2020",
  },
};

export default config;
