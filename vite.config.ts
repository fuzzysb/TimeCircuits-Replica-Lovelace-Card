import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/time-circuits-card.ts",
      formats: ["es"],
      fileName: () => "time-circuits-card.js",
    },
    outDir: ".",
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      external: /^lit/,
    },
  },
});