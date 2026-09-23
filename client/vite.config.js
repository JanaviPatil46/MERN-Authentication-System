import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The proxy makes /api calls same-origin in development, so the auth cookie just works
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
});
