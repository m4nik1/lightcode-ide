import { QueryClient } from '@tanstack/react-query'
import { createTRPCClient, httpBatchStreamLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import type { AppRouter } from '../../../../server/appRouter'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ...
    }
  }
});

export const trpcClient = createTRPCClient<AppRouter>({
  links: [httpBatchStreamLink({ url: 'http://localhost:2024' })]
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient
})
