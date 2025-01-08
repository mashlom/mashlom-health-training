import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Check if we're in production mode
const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  base: isProduction ? "/er/" : "/",
  plugins: [react()],
});
