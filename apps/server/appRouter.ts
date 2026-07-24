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
  loadMessagesFromThread,
  renameThread,
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
  
  stopTurn: publicProcedure
    .input(
      z.object({ threadID: z.string() })
    )
    .query(function ({input}) {
      threadService.stopTurn(input.threadID)
    }),

  loadMessages: publicProcedure
    .input(
      z.object({
        threadID: z.string(),
      }),
    )
    .query(({ input }) => {
      return loadMessagesFromThread(input.threadID).map((message) => ({
        id: message.id,
        text: message.text,
        role:
          message.role?.toLowerCase() === "user"
            ? ("user" as const)
            : ("assistant" as const),
      }));
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
  generateThreadMessage: publicProcedure
    .input(z.object({ id: z.string(), message: z.string() }))
    .mutation(async ({ input }) => {
      const threadTitle = await threadService.generateThreadTitle(input.message);

      return renameThread.get(threadTitle, input.id);
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
      )
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
