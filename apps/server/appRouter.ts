import { publicProcedure, router } from "./trpc.ts";
import { z } from "zod";
import { CodexAppServerClient } from "@lightcode/codex-protocol";
import { ThreadService } from "./ThreadService.ts";
import { AI_MODEL_IDS, REASONING_EFFORTS } from "./aiModelConfig.ts";
import {
  createProject,
  getProjects,
  createThread,
  type ProjectRecord,
  type ThreadRecord,
  getThreads,
  loadMessagesFromThread,
} from "./lightQueries.ts";

const threadService = new ThreadService(
  new CodexAppServerClient({
    clientInfo: {
      name: "lightcode-ide",
      title: 'Lightcode',
      version: '0.0.1',
    }
  }),
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
        model: z.object({
          model: z.enum(AI_MODEL_IDS),
          thinking: z.enum(REASONING_EFFORTS),
        }),
        mode: z.enum(["build", "plan"]),
        access: z.enum([
          "read-only",
          "workspace-write",
          "danger-full-access",
        ]),
      }),
    )
    .query(async function* ({ input }) {
      for await (const event of threadService.sendMessage(input)) {
        yield event;
      }
    }),
  
  getThreadTitle: publicProcedure
    .input(
      z.object({
        threadID: z.string()
      }),
    )
    .mutation(async function ({ input }) {
      const generatedTitle = await threadService.generateTitle(input.threadID)

      return generatedTitle
    }),

  stopTurn: publicProcedure
    .input(
      z.object({ threadID: z.string() })
    )
    .query(async function ({ input }) {
      await threadService.stopTurn(input.threadID)
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

  deleteThread: publicProcedure
    .input(z.object({ threadID: z.string() }))
    .mutation(({ input }) => {
      return threadService.deleteThread(input.threadID)
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
