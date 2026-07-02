import { createServer } from 'node:http';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { appRouter } from './appRouter.ts';

const PORT = 2024;
const ALLOWED_ORIGINS = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

const trpcHandler = createHTTPHandler({
  router: appRouter,
  createContext() {
    console.log("Context 3")
    return {};
  }
});

function applyCorsHeaders(req: Parameters<typeof trpcHandler>[0], res: Parameters<typeof trpcHandler>[1]) {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'content-type,trpc-accept');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
}

createServer((req, res) => {
  applyCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  trpcHandler(req, res);
}).listen(PORT);
