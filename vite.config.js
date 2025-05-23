import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [react(), tailwindcss()];

  if (mode === "visualize") {
    plugins.push(visualizer({ open: true }));
  }

  return {
    plugins,
    optimizeDeps: {
      include: ["@ionic/react", "@ionic/react-router", "@ionic/core"],
    },
    esbuild: {
      supported: {
        "top-level-await": true,
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    base: "/",
  };
});
