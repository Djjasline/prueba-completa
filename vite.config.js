import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // 👇 Esto evita que Rollup intente empaquetar jspdf-autotable
      external: ['jspdf-autotable']
    }
  },
  server: {
    port: 3000, // opcional: puerto local de desarrollo
    open: true  // abre el navegador automáticamente
  }
});
