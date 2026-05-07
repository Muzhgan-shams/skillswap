import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // any server starting with /api should be forwarded to http://localhost:5000
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true, // to accept the proxied request
      },
    },
  },
});
