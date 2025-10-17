import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import electron from "vite-plugin-electron";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
  },
  plugins: [
    react(),
    tailwindcss(),
    electron([
      {
        entry: "electron/main.ts", // main process
      },
      {
        entry: "electron/preload.ts", // preload script
        onstart: (options) => {
          // automatically reload the renderer when preload updates
          options.reload();
        },
      },
    ]),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
