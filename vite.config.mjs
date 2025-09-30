import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ["jspdf-autotable"], // 👈 Evita que Netlify lo rompa
    },
  },
});
