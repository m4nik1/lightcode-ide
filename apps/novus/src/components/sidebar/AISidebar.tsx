import { useEffect, useRef, useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import type { thread } from "./types";
import { aiThemeClassNames } from "../../theme";
import { cn } from "../../lib/utils";
import { FolderPlus } from "lucide-react";
import { ProjectDropdown } from "./ProjectDropdown";
import { trpcClient } from "../../utils/trpc";
import { useAIChat } from "../../context/useAIChat";
import { useProjects } from "@/context/useProjects";

export interface Project {
  id: string;
  name: string;
  path: string;
  threads: thread[];
}

export default function AISidebar() {
  const [projects, setProjects] = useState<Project[]>([]);
  const { getProjects } = useProjects();
  const { createProject, currentThread, setCurrentThread } = useAIChat();

  const currentTitle = currentThread
    ? `${currentThread.id}:${currentThread.title}`
    : null;

  const draftCount = useRef(0);

  async function handleNewChat(projectId = currentThread?.projectId) {
    if (!projectId) return;

    const project = projects.find(({ id }) => id === projectId);
    if (!project) return;

    const nextDraftNumber = draftCount.current + 1;
    draftCount.current = nextDraftNumber;

    const thread: thread = {
      id: `draft-${projectId}-${nextDraftNumber}`,
      projectId,
      title: "Untitled chat",
      projectPath: project.path,
    };

    const threadCreate = await trpcClient.addThread.mutate({
      threadName: thread.title,
      projectId: thread.projectId,
    });
    if (!threadCreate?.id || !threadCreate.name) return;

    const createdThread: thread = {
      ...thread,
      id: String(threadCreate.id),
      title: String(threadCreate.name),
    };

    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? { ...project, threads: [createdThread, ...project.threads] }
          : project,
      ),
    );
    setCurrentThread(createdThread);
  }

  function deleteThread(threadID: string) {
    if (!currentThread) return;

    setProjects((current) =>
      current.map((project) => ({
        ...project,
        threads: project.threads.filter((thread) => thread.id !== threadID),
      })),
    );
  }

  useEffect(() => {
    if (getProjects.data == null) return;
    const projectRows = getProjects.data;

    let cancelled = false;

    async function loadProjectsWithThreads() {
      const projectsWithThreads = await Promise.all(
        projectRows.map(async (project) => {
          const threadRows = await trpcClient.getThreads.query({
            projectID: project.id,
          });

          return {
            id: project.id,
            name: project.name,
            path: project.path,
            threads: threadRows.map((row) => ({
              id: row.id,
              projectId: row.project_id,
              title: row.name,
              projectPath: project.path,
            })),
          };
        }),
      );

      if (!cancelled) {
        setProjects(projectsWithThreads);
      }
    }

    void loadProjectsWithThreads();

    return () => {
      cancelled = true;
    };
  }, [getProjects.data, currentTitle]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "n") {
        event.preventDefault();
        void handleNewChat();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <nav
      aria-label="Projects and chats"
      className={cn(
        "relative box-border flex h-full w-68 shrink-0 flex-col border-r text-[13px]",
        aiThemeClassNames.sidebar,
        aiThemeClassNames.border,
        aiThemeClassNames.textPrimary,
      )}
    >
      <SidebarHeader onNewChat={() => handleNewChat()} />

      <div className="chat-messages-scrollbar relative min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        <div className="flex h-8 items-center pr-1.5">
          <h2
            className={cn(
              "m-0 pl-3 text-[13px] font-medium",
              aiThemeClassNames.textMuted,
            )}
          >
            Projects
          </h2>
          <button
            type="button"
            aria-label="Add project"
            className={cn(
              "ml-auto inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-md transition-[background-color,color] focus-visible:outline-1 focus-visible:outline-offset-[-1px]",
              aiThemeClassNames.textMuted,
              aiThemeClassNames.surfaceHover,
              aiThemeClassNames.hoverTextPrimary,
              aiThemeClassNames.focusVisibleSurfaceHover,
              aiThemeClassNames.focusVisibleTextPrimary,
              aiThemeClassNames.borderFocus,
            )}
            onClick={() => createProject()}
          >
            <FolderPlus className="size-3.25" />
          </button>
        </div>
        {getProjects.isLoading ? (
          <div className="space-y-2 px-3 pt-2" aria-hidden>
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                className={cn(
                  "h-3.5 animate-pulse rounded motion-reduce:animate-none",
                  aiThemeClassNames.surfaceActive,
                )}
                style={{ width: `${72 - row * 16}%` }}
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="px-3 pt-2">
            <p className={cn("m-0 leading-5", aiThemeClassNames.textMuted)}>
              Add a project folder to start chatting about its code.
            </p>
            <button
              type="button"
              onClick={() => createProject()}
              className={cn(
                "mt-3 inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-[12px] font-medium transition-colors focus-visible:outline-1 focus-visible:outline-offset-[-1px]",
                aiThemeClassNames.border,
                aiThemeClassNames.textPrimary,
                aiThemeClassNames.surfaceHover,
                aiThemeClassNames.focusVisibleSurfaceHover,
                aiThemeClassNames.borderFocus,
              )}
            >
              <FolderPlus className="size-3.5" />
              Add project
            </button>
          </div>
        ) : (
          <ul className="m-0 list-none p-0">
            {projects.map((project) => (
              <ProjectDropdown
                key={project.id}
                project={project}
                onCreateThread={() => handleNewChat(project.id)}
                onDeleteThread={deleteThread}
              />
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
