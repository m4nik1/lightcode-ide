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
        text: `hello ${input?.name ?? "world"}`,
      };
    }),
  sendChat: publicProcedure
    .input(
      z.object({
        message: z.string(),
        user: z.string(),
      }),
    )
    .mutation(({ input }) => runCodex(input.message, input.user)),
});

export type AppRouter = typeof appRouter;
