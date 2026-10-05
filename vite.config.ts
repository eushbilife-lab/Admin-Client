import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const src = path.join(root, "src");

/**
 * CRA used `baseUrl: "src"` but resolved node_modules first.
 * `src/redux` must not shadow the `redux` package.
 */
const shadowedPackages = new Set(["redux"]);

const srcAliases = readdirSync(src, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !shadowedPackages.has(entry.name))
  .map((entry) => ({
    find: entry.name,
    replacement: path.join(src, entry.name),
  }));

export default defineConfig({
  plugins: [react()],
  envPrefix: ["VITE_", "REACT_APP_"],
  resolve: {
    tsconfigPaths: true,
    alias: [
      {
        find: /^@mui\/icons-material\/(.*)$/,
        replacement: path.join(
          root,
          "node_modules/@mui/icons-material/esm/$1.js",
        ),
      },
      {
        find: /^redux\//,
        replacement: `${path.join(src, "redux")}/`,
      },
      ...srcAliases,
    ],
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: [
      "@emotion/react",
      "@emotion/styled",
      "@mui/icons-material",
      "@mui/material",
      "redux-form",
    ],
  },
  server: {
    port: 3000,
    host: true,
    strictPort: false,
  },
  preview: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: "build",
    emptyOutDir: true,
    sourcemap: false,
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    globals: true,
  },
});
