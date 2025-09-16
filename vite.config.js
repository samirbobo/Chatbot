import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

function copyRedirects() {
  return {
    name: "copy-redirects",
    closeBundle() {
      fs.copyFileSync("public/_redirects", "dist/_redirects");
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyRedirects()],
});
