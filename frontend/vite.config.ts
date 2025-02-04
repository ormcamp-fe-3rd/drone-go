import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import cesium from "vite-plugin-cesium";

export default defineConfig({
  plugins: [react(), cesium()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  define: {
    CESIUM_BASE_URL: JSON.stringify("/cesium"),
  },
  build: {
    chunkSizeWarningLimit: 1000, // 번들 크기 경고 제한 증가
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("cesium")) {
              return "cesium"; // Cesium 별도 번들링
            }
            return "vendor"; // 기타 라이브러리 번들
          }
        },
      },
    },
  },
});
