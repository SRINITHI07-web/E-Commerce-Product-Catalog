import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.GITHUB_PAGES ? "/E-Commerce-Product-Catalog/" : "/",
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/index.js",
        assetFileNames: (asset) =>
          asset.name?.endsWith(".css")
            ? "assets/index.css"
            : asset.name === "logo.svg"
              ? "assets/logo.svg"
            : "assets/[name]-[hash][extname]",
      },
    },
  },
});
