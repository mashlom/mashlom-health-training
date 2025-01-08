import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Check if we're running in production
const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  base: isProduction ? "/er/" : "/",
  plugins: [react()],
  build: {
    outDir: "dist",
  },
});
