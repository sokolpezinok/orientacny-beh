import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { UserConfig } from "vite";
import capacitorConfig from "./capacitor.config.json";

process.env.VITE_APP_TITLE = capacitorConfig.appName;

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
};

export default config;
