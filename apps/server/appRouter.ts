import { publicProcedure, router } from "./trpc.ts";
import { Codex } from "@openai/codex-sdk";
import { z } from "zod";
import { ThreadService } from "./ThreadService.ts";
import { createProject, getProjects } from "./lightQueries.ts";

// const lightProjects = new lightProject()
const threadService = new ThreadService(
  new Codex({ config: { show_raw_agent_reasoning: true } }),
);

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
    .input(z.object({ message: z.string(), model: z.object({ model: z.string(), thinking: z.string() }), path: z.string() }))
    .query(async function*({ input }) {
      for await (const event of threadService.sendMessage(input)) {
        yield event;
      }
    }),
  addProject: publicProcedure
    .input(z.object({ projectName: z.string(), path: z.string() }))
    .mutation(({ input }) => {
      return createProject({
        id: crypto.randomUUID(),
        name: input.projectName,
        path: input.path
      })
    }),
  getProjects: publicProcedure
    .query(() => {
      console.log("projects: ", getProjects.get())
      return [getProjects.get()]
    })
});

export type AppRouter = typeof appRouter;
