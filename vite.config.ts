import path from "node:path";
import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import babel from "@rolldown/plugin-babel";

// https://vite.dev/config/
export default defineConfig({
  define: {
    __DEV__: JSON.stringify(true),
  },
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    alias: [
      {
        find: "~",
        replacement: path.resolve(import.meta.dirname, "src"),
      },
    ],
    dedupe: ["react", "react-dom"],
  },
});
