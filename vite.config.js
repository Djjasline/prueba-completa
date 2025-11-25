// vite.config.js (o .mjs)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tagger from "@dhiwise/component-tagger";

// 👇 OJO: quitamos esta línea
// import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    outDir: "dist",          // sigue bien para Netlify
    chunkSizeWarningLimit: 2000,
  },
    plugins: [react(), tagger()],
  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: [".amazonaws.com", ".builtwithrocket.new"],
  },
});
