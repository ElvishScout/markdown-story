import path from "node:path";
import fs from "fs/promises";

import { defineConfig, PluginOption } from "vite";
import tailwindcss from "@tailwindcss/vite";

const fixBrotliWasm = (): PluginOption => {
  return {
    name: "vite-plugin-fix-wasm",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.endsWith("brotli_wasm_bg.wasm")) {
          const filePath = path.resolve(__dirname, "node_modules/brotli-wasm/pkg.web/brotli_wasm_bg.wasm");
          const fileContent = await fs.readFile(filePath);
          res.setHeader("Content-Type", "application/wasm");
          res.statusCode = 200;
          res.end(fileContent);
        } else {
          next();
        }
      });
    },
  };
};

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
  plugins: [tailwindcss(), fixBrotliWasm()],
  build: {
    outDir: "./dist",
  },
});
