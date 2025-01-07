import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";

// Conditional plugin setup
const conditionalPlugins = [];

if (process.env.TEMPO) {
  conditionalPlugins.push(['tempo-devtools/swc', {}]);
}

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  server: {
    port: 5173,
    host: true,
    hmr: {
      overlay: false,
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    exclude: ["tempo-devtools"],
  },
  plugins: [
    react({
      plugins: [...conditionalPlugins]
    }),
    tempo()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
