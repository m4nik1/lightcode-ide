import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './appRouter.ts';

createHTTPServer({
  router: appRouter,
  createContext() {
    console.log("Context 3")
    return {};
  }
}).listen(2022)
