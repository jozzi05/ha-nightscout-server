/// <reference types="vitest/config" />
import { playwright } from "@vitest/browser-playwright";
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
    minify: "oxc",
  },
  plugins: [
    {
      name: "copy-to-parent",
      closeBundle() {
        const built = resolve(__dirname, "dist/nightscout-card.js");
        copyFileSync(built, resolve(__dirname, "../nightscout-card.js"));
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
            provider: playwright(),
            headless: true,
            instances: [{ browser: "chromium" }],
          },
          include: ["src/**/*.browser.test.ts"],
        },
      },
    ],
  },
});
