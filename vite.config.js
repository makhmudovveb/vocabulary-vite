import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@context": path.resolve(__dirname, "./src/Context"),
      "@components": path.resolve(__dirname, "./src/Components"),
    },
  },
});