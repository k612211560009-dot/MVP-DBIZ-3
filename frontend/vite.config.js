import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: process.env.VITE_BACKEND_URL || "http://localhost:5000", // Backend on port 5000
        changeOrigin: true,
        secure: false, // Allow self-signed certs for ngrok
      },
    },
    allowedHosts: [".ngrok-free.app", ".ngrok-free.dev", ".ngrok.io"], // Support ngrok domains
    host: true, // Allow external access
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
