import path from "node:path";

import { defineConfig, PluginOption } from "vite";
import tailwindcss from "@tailwindcss/vite";

const vitePluginNormalizeNewlines = (): PluginOption => {
  return {
    name: "vite-plugin-normalize-newlines",
    transform(code, id) {
      if (id.endsWith("?raw")) {
        code = code.replace(/\r\n|\r/g, "\n");
        return { code };
      }
      return null;
    },
  };
};

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
  plugins: [tailwindcss(), vitePluginNormalizeNewlines()],
  build: {
    outDir: "./dist",
  },
});
