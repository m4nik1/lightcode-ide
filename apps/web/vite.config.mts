import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';

const appDir = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.join(appDir, '../server');
const proxy = {
  '/trpc': {
    target: 'http://127.0.0.1:2024',
    rewrite: (url: string) => url.replace(/^\/trpc/, ''),
  },
};

// Starts the local Novus server alongside Vite so `npm run web` is enough.
// Set NOVUS_WEB_NO_SERVER=1 to use a server that is already running.
function novusServer(): Plugin {
  let child: ChildProcess | undefined;

  const start = (watch: boolean) => {
    if (child || process.env.NOVUS_WEB_NO_SERVER) return;

    const args = ['--experimental-strip-types', 'index.ts'];
    child = spawn(process.execPath, watch ? ['--watch', ...args] : args, {
      cwd: serverDir,
      stdio: 'inherit',
    });
    child.on('exit', () => {
      child = undefined;
    });
  };
  const stop = () => {
    // On Windows, kill() only ends the `--watch` parent and orphans the server
    // it spawned, so kill the whole tree. Sync, since this also runs on exit.
    if (process.platform === 'win32' && child?.pid) {
      spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    } else {
      child?.kill();
    }
    child = undefined;
  };

  process.once('exit', stop);
  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.once(signal, () => {
      stop();
      process.exit();
    });
  }

  return {
    name: 'novus-server',
    configureServer(server) {
      start(true);
      server.httpServer?.once('close', stop);
    },
    configurePreviewServer(server) {
      start(false);
      server.httpServer.once('close', stop);
    },
  };
}

export default defineConfig({
  root: path.join(appDir, 'src'),
  plugins: [react(), tailwindcss(), novusServer()],
  resolve: { alias: { '@': path.join(appDir, 'src') } },
  server: { port: 5175, strictPort: true, proxy },
  preview: { port: 5175, strictPort: true, proxy },
  build: { outDir: path.join(appDir, 'dist'), emptyOutDir: true },
});
