import { publicProcedure, router } from "./trpc.ts";
import { runCodexStream } from "./codexDriver.ts";
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
  queryAI: publicProcedure
    .input(z.object({ message: z.string(), model: z.object({ model: z.string(), thinking: z.string() }) }))
    .query(async function* ({ input }) {
      for await (const event of runCodexStream(input.message, input.model)) {
        yield event;
      }
    })

});

export type AppRouter = typeof appRouter;
