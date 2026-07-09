import { useEffect, useRef, useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import type { thread } from "./types";
import { aiThemeClassNames } from "../theme";
import { cn } from "../../../lib/utils";
import { FolderPlus } from "lucide-react";
import { ProjectDropdown } from "./ProjectDropdown";
import { trpc, trpcClient } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

export interface Project {
  id: string;
  name: string;
  path: string;
  threads: thread[];
}

export default function AISidebar() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>();
  const projectsQuery = useQuery(trpc.getProjects.queryOptions());

  const draftCount = useRef(0);

  function handleNewChat(projectId = activeProjectId) {
    if (!projectId) return;

    const nextDraftNumber = draftCount.current + 1;
    draftCount.current = nextDraftNumber;

    const thread: thread = {
      id: `draft-${projectId}-${nextDraftNumber}`,
      projectId,
      title: "Untitled chat",
    };

    setActiveProjectId(projectId);

    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? { ...project, threads: [...project.threads, thread] }
          : project,
      ),
    );
  }

  useEffect(() => {
    console.log("projects: ", projectsQuery.data)
    if (!projectsQuery.data) return;

    setProjects(
      projectsQuery.data.map((project) => ({
        id: project.id,
        name: project.name,
        path: project.path,
        threads: [],
      })),
    );
  }, [projectsQuery.data]);

  async function addProject() {
    const projectFolder = await window.electronAPI.openFolder();
    const projectFolderPath = projectFolder.filePaths[0];

    if (!projectFolderPath) {
      return;
    }

    const folderName = projectFolderPath.split("/")?.at(-1);

    if (!folderName) {
      return;
    }

    await trpcClient.addProject.mutate({
      projectName: folderName,
      path: projectFolderPath,
    });

    console.log("Project path: ", projectFolderPath);

    await projectsQuery.refetch();

    console.log("Project folder found: ", projectFolderPath);
  }

  return (
    <aside
      className={cn(
        "chat-composer-shared-blur border-r border-[#262626] box-border relative flex h-full w-[260px] shrink-0 flex-col text-[13px]",
        aiThemeClassNames.textPrimary,
      )}
    >
      <SidebarHeader onNewChat={() => handleNewChat()} />

      <div className="relative min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        <div className="flex">
          <span className="text-gray-500 pl-2">Projects</span>
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
            onClick={() => addProject()}
          >
            <FolderPlus className="size-[13px]" />
          </button>
        </div>
        {projects.map((project) => (
          <ProjectDropdown
            key={project.id}
            project={project}
            onCreateThread={() => handleNewChat(project.id)}
          />
        ))}
      </div>
    </aside>
  );
}
