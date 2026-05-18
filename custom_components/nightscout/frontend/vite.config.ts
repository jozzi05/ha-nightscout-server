/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { resolve } from "path";
import { copyFileSync } from "fs";

export default defineConfig({
  optimizeDeps: {
    include: ["lit", "lit/decorators.js"],
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/nightscout-card.ts"),
      formats: ["es"],
      fileName: () => "nightscout-card.js",
    },
    outDir: "dist",
    emptyOutDir: true,
    minify: "terser",
    terserOptions: {
      format: { comments: false },
    },
  },
  plugins: [
    {
      name: "copy-to-parent",
      closeBundle() {
        copyFileSync(
          resolve(__dirname, "dist/nightscout-card.js"),
          resolve(__dirname, "../nightscout-card.js"),
        );
      },
    },
  ],
  test: {
    projects: [
      {
        test: {
          name: "unit",
          environment: "node",
          include: ["src/**/*.test.ts"],
          exclude: ["src/**/*.browser.test.ts"],
        },
      },
      {
        test: {
          name: "browser",
          browser: {
            enabled: true,
            provider: "playwright",
            headless: true,
            instances: [{ browser: "chromium" }],
          },
          include: ["src/**/*.browser.test.ts"],
        },
      },
    ],
  },
});
