import { publicProcedure, router } from "./trpc.ts";
import { z } from "zod";
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
import lightSpeedSearch from "./lightspeedSearch.ts";
import { FileFinder } from "@ff-labs/fff-node";
import { readdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export const createAppRouter = (threadService: ThreadService, lightSearch : lightSpeedSearch) => router({
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

  fileSearch: publicProcedure
    .input(
      z.object({
        projectPath: z.string(),
        searchQuery: z.string()
      }),
    )
    .query(async ({ input }) => {
      // Create instance to the projectPath
      const lightSpeedInstance : FileFinder | undefined = await lightSearch.indexProject(input.projectPath);
      
      // Check that if its undefined
      if(!lightSpeedInstance) {
        return [];
      }

      // Actually do the file search
      const fileResults = lightSearch.executeFileSearch(lightSpeedInstance, input.searchQuery);

      return fileResults;
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

  listDirectories: publicProcedure
    .input(z.object({ path: z.string().nullish() }).nullish())
    .query(async ({ input }) => {
      // Lets browser clients pick a project folder on the server's machine.
      const directory = path.resolve(input?.path || os.homedir());
      const entries = await readdir(directory, { withFileTypes: true });
      const parent = path.dirname(directory);

      return {
        path: directory,
        parent: parent === directory ? null : parent,
        directories: entries
          .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
          .map((entry) => ({
            name: entry.name,
            path: path.join(directory, entry.name),
          }))
          .sort((a, b) => a.name.localeCompare(b.name)),
      };
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

export type AppRouter = ReturnType<typeof createAppRouter>;
