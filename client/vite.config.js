import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/users": "http://localhost:3000",
      "/cards": "http://localhost:3000",
      "/contact": "http://localhost:3000",
      "/search": "http://localhost:3000",
    },
  },
});
