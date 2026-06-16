import { QueryClient } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/tanstack-react-query'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import type { AppRouter } from '../../../../server/appRouter'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ...
    }
  }
});

const trpcClient = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: 'http://localhost:2024' })]
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient
})
