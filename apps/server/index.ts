import { createServer, type Server } from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { CodexAppServerClient } from '@lightcode/codex-protocol';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { ThreadService } from './ThreadService.ts';
import { createAppRouter } from './appRouter.ts';

const DEFAULT_PORT = 2024;
const DEFAULT_HOST = '127.0.0.1';
const ALLOWED_ORIGINS = new Set([
  // Packaged Electron renderers loaded from file:// have an opaque origin,
  // which Chromium serializes as "null" for CORS requests.
  'null',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
]);

export type StartServerOptions = {
  codexPathOverride?: string;
  host?: string;
  port?: number;
};

let activeServer: Server | undefined;
let activeThreadService: ThreadService | undefined;
let pendingStart: Promise<void> | undefined;

function applyCorsHeaders(
  req: Parameters<ReturnType<typeof createHTTPHandler>>[0],
  res: Parameters<ReturnType<typeof createHTTPHandler>>[1],
) {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'content-type,trpc-accept');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
}

async function startServerOnce(options: StartServerOptions) {
  const host = options.host ?? DEFAULT_HOST;
  const port = options.port ?? DEFAULT_PORT;
  const threadService = new ThreadService(
    new CodexAppServerClient({
      clientInfo: {
        name: 'lightcode-ide',
        title: 'Lightcode',
        version: '0.0.1',
      },
      codexPathOverride:
        options.codexPathOverride ?? process.env.LIGHTCODE_CODEX_PATH,
    }),
  );

  await threadService.start();

  const trpcHandler = createHTTPHandler({
    router: createAppRouter(threadService),
    createContext() {
      return {};
    },
  });
  const server = createServer((req, res) => {
    applyCorsHeaders(req, res);

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    trpcHandler(req, res);
  });

  try {
    await new Promise<void>((resolve, reject) => {
      const onError = (error: Error) => reject(error);
      server.once('error', onError);
      server.listen(port, host, () => {
        server.off('error', onError);
        resolve();
      });
    });
  } catch (error) {
    await threadService.close();
    throw error;
  }

  activeServer = server;
  activeThreadService = threadService;
}

export function startServer(options: StartServerOptions = {}) {
  if (activeServer?.listening) {
    return Promise.resolve();
  }
  if (pendingStart) {
    return pendingStart;
  }

  pendingStart = startServerOnce(options).finally(() => {
    pendingStart = undefined;
  });
  return pendingStart;
}

export async function stopServer() {
  if (pendingStart) {
    await pendingStart.catch(() => undefined);
  }

  const server = activeServer;
  const threadService = activeThreadService;
  activeServer = undefined;
  activeThreadService = undefined;

  if (server?.listening) {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  await threadService?.close();
}

const entryPoint = process.argv[1];
if (
  entryPoint &&
  import.meta.url === pathToFileURL(path.resolve(entryPoint)).href
) {
  startServer()
    .then(() => {
      console.log(`Lightcode server listening on http://${DEFAULT_HOST}:${DEFAULT_PORT}`);
    })
    .catch((error: unknown) => {
      console.error('Unable to start Lightcode server:', error);
      process.exitCode = 1;
    });
}
