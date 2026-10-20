import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    port: 3000,
    proxy: {
      "/v1/api": {
        target: "http://localhost:9000",
        changeOrigin: true
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          "ag-grid": ["ag-grid-community", "ag-grid-react"],
          "lucide-icons": ["lucide-react"],
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "query-vendor": ["@tanstack/react-query"]
        }
      }
    }
  },
  preview: {
    port: 3000,
    proxy: {
      "/v1/api": {
        target: "http://localhost:9000",
        changeOrigin: true
      }
    }
  }
});
