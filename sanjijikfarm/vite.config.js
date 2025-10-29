// vite.config.js
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    svgr({
      exportAsDefault: true,
      include: '**/*.svg',
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/ocr': {
        target: 'https://tqs0vow7qk.apigw.ntruss.com/custom/v1/ocr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ocr/, ''),
      },
    },
  },
});
