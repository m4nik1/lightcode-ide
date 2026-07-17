import { publicProcedure, router } from "./trpc.ts";
import { Codex } from "@openai/codex-sdk";
import { z } from "zod";
import { ThreadService } from "./ThreadService.ts";
import {
  createProject,
  getProjects,
  createThread,
  type ProjectRecord,
  type ThreadRecord,
  getThreads,
  getMessagesFromThread,
} from "./lightQueries.ts";

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
    .input(
      z.object({
        threadID: z.string(),
        message: z.string(),
        model: z.object({ model: z.string(), thinking: z.string() }),
      }),
    )
    .query(async function* ({ input }) {
      for await (const event of threadService.sendMessage(input)) {
        yield event;
      }
    }),

  loadMessages: publicProcedure
    .input(
      z.object({
        threadID: z.string(),
      }),
    )
    .query(({ input }) => {
      console.log("Querying messages with: ", input.threadID)
      const messagesFound = getMessagesFromThread.get(input.threadID);

      return messagesFound
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

  addThread: publicProcedure
    .input(z.object({ threadName: z.string(), projectId: z.string() }))
    .mutation(({ input }) => {
      const timestamp = Date.now();

      return createThread.get(
        crypto.randomUUID(),
        input.projectId,
        input.threadName,
        timestamp,
        timestamp,
      ) as Pick<ThreadRecord, "id" | "name">;
    }),

  getThreads: publicProcedure
    .input(z.object({ projectID: z.string() }))
    .query(({ input }) => {
      const threads = getThreads.all(input.projectID) as ThreadRecord[];

      return threads
    }),

  getProjects: publicProcedure
    .query(() => {
      const projects = getProjects.all() as ProjectRecord[];
      console.log("projects: ", projects);
      return projects;
    })
});

export type AppRouter = typeof appRouter;
