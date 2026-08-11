import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// BASE_URL defaults to '/' for Vercel / GitHub Pages deployments.
// Set BASE_PATH env var if you deploy to a sub-path (e.g. /schoolo-web/).
const basePath = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: Number(process.env.PORT ?? 5173),
    host: '0.0.0.0',
  },
  preview: {
    port: Number(process.env.PORT ?? 4173),
    host: '0.0.0.0',
  },
});
