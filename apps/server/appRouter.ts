import { publicProcedure, router } from "./trpc.ts";
import { runCodex, runCodexStream } from "./codexDriver.ts";
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
        model: z.string()
      }),
    )
    .mutation(({ input }) => runCodex(input.message, input.user)),
  queryAI: publicProcedure
    .input(z.object({ message: z.string() }))
    .query(async function* ({ input }) {
      for await (const event of runCodexStream(input.message)) {
        yield event;
      }
    })

});

export type AppRouter = typeof appRouter;
