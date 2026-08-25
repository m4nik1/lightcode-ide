import { useEffect, useRef, useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import type { thread } from "./types";
import { aiThemeClassNames } from "../../theme";
import { cn } from "../../lib/utils";
import { FolderPlus } from "lucide-react";
import { ProjectDropdown } from "./ProjectDropdown";
import { trpcClient } from "../../utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useAIChat } from "../../context/useAIChat";

export interface Project {
  id: string;
  name: string;
  path: string;
  threads: thread[];
}

export default function AISidebar() {
  const [projects, setProjects] = useState<Project[]>([]);
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: () => trpcClient.getProjects.query(),
  });
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
    if (projectsQuery.data == null) return;
    const projectRows = projectsQuery.data;

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
  }, [projectsQuery.data, currentTitle]);

  return (
    <aside
      className={cn(
        "relative box-border flex h-full w-80 shrink-0 flex-col border-r text-[13px]",
        aiThemeClassNames.sidebar,
        aiThemeClassNames.border,
        aiThemeClassNames.sidebarDepth,
        aiThemeClassNames.textPrimary,
      )}
    >
      <SidebarHeader onNewChat={() => handleNewChat()} />

      <div className="relative min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        <div className="flex">
          <span className={cn("pl-2", aiThemeClassNames.textMuted)}>
            Projects
          </span>
          <button
            type="button"
            aria-label="Create project"
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
        {projects.map((project) => (
          <ProjectDropdown
            key={project.id}
            project={project}
            onCreateThread={() => handleNewChat(project.id)}
            onDeleteThread={deleteThread}
          />
        ))}
      </div>
    </aside>
  );
}
