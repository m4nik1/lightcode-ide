import { publicProcedure, router } from "./trpc.ts";
import { z } from "zod";

export const appRouter = router({
  greeting: publicProcedure
   .input(
    z
     .object({
        name: z.string().nullish(),
      })
      .nullish(),
  )
  .query(({ input }) => {
      return {
        text:`hello ${input?.name ?? 'world'}`, 
      }
    }),
});

export type AppRouter = typeof appRouter;
