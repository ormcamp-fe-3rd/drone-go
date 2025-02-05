import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      external: ["cesium"],
    },
  },
  resolve: {
    alias: {
      cesium: path.resolve(__dirname, "node_modules/cesium/Build/Cesium"),
    },
  },
  define: {
    CESIUM_BASE_URL: JSON.stringify("/cesium/"),
  },
});
