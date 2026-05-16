import { defineConfig } from "vite";
import { resolve } from "path";
import { copyFileSync } from "fs";

export default defineConfig({
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
});
