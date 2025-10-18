import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import electron from "vite-plugin-electron/simple";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
  },
  plugins: [
    react(),
    tailwindcss(),
    electron({
      main: {
        entry: "electron/main.ts",
        vite: {
          build: {
            rollupOptions: {
              external: ["discord-rpc"],
            },
          },
        },
      },
      preload: {
        input: path.join(__dirname, "electron/preload.ts"),
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
