import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const legendListRoot = path.resolve(
  import.meta.dirname,
  "vendor/legend-list",
);
const legendListSource = path.resolve(legendListRoot, "src");

// https://vite.dev/config/
export default defineConfig({
  define: {
    __DEV__: JSON.stringify(true),
  },
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: "~",
        replacement: path.resolve(import.meta.dirname, "src"),
      },
      {
        find: "@legendapp/list/react",
        replacement: path.resolve(legendListSource, "react.ts"),
      },
      {
        find: /^@\//,
        replacement: `${legendListSource}/`,
      },
    ],
    dedupe: ["react", "react-dom"],
  },
});
