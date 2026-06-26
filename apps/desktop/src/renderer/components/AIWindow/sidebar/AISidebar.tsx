import { useEffect, useRef, useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import type { AIThread } from "./types";
import { aiThemeClassNames } from "../theme";
import { cn } from "../../../lib/utils";
import { FolderPlus } from "lucide-react";
import { ProjectDropdown } from "./ProjectDropdown";

type AISidebarProps = {
  activeProjectId: string;
  activeThreadId: string;
};

export interface Project {
  id: string;
  name: string;
  path: string;
}

export default function AISidebar({
  activeProjectId,
  activeThreadId,
}: AISidebarProps) {
  // const [expandedProjects, setExpandedProjects] = useState<
  //   Record<string, boolean>
  // >(() => createInitialExpandedState(projects));

  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState(activeProjectId);
  const [activeThread, setActiveThread] = useState(activeThreadId);
  const [draftThreads, setDraftThreads] = useState<Record<string, AIThread[]>>(
    {},
  );
  const draftCount = useRef(0);

  useEffect(() => {
    setActiveProject(activeProjectId);
    setActiveThread(activeThreadId);
  }, [activeProjectId, activeThreadId]);

  // const projectsWithDrafts = useMemo(
  //   () =>
  //     projects.map((project) => ({
  //       ...project,
  //       threads: [...(draftThreads[project.id] ?? []), ...project.threads],
  //     })),
  //   [draftThreads, projects],
  // );

  // function toggleProject(projectId: string) {
  //   setExpandedProjects((prev) => ({
  //     ...prev,
  //     [projectId]: !prev[projectId],
  //   }));
  // }

  function handleSelectThread(projectId: string, threadId: string) {
    setActiveProject(projectId);
    setActiveThread(threadId);
  }

  function handleNewChat(projectId = activeProject || activeProjectId) {
    const nextDraftNumber = draftCount.current + 1;
    draftCount.current = nextDraftNumber;
    const thread: AIThread = {
      id: `draft-${projectId}-${nextDraftNumber}`,
      title: "Untitled chat",
    };

    setDraftThreads((prev) => ({
      ...prev,
      [projectId]: [thread, ...(prev[projectId] ?? [])],
    }));

    setActiveProject(projectId);
    setActiveThread(thread.id);
  }

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

    setProjects((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: folderName,
        path: projectFolderPath,
      },
    ]);

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
            isActiveProject={project.id === activeProject}
            activeThreadId={activeThread}
            onCreateThread={() => handleNewChat(project.id)}
            onSelectThread={(threadId) =>
              handleSelectThread(project.id, threadId)
            }
          />
        ))}
      </div>
    </aside>
  );
}
