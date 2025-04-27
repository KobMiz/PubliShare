import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "^/users.*": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "^/cards.*": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "^/contact.*": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "^/search.*": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
