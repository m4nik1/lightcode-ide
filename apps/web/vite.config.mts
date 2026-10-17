import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const appDir = path.dirname(fileURLToPath(import.meta.url));
const proxy = {
  '/trpc': {
    target: 'http://127.0.0.1:2024',
    rewrite: (url: string) => url.replace(/^\/trpc/, ''),
  },
};

export default defineConfig({
  root: path.join(appDir, 'src'),
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.join(appDir, 'src') } },
  server: { port: 5175, strictPort: true, proxy },
  preview: { port: 5175, strictPort: true, proxy },
  build: { outDir: path.join(appDir, 'dist'), emptyOutDir: true },
});
