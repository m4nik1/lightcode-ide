import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      // Keep native Node modules out of the JavaScript bundle. Forge packages
      // these dependencies alongside the app and loads them at runtime.
      external: ['node:sqlite', '@ff-labs/fff-node', 'ffi-rs'],
    },
  },
});
