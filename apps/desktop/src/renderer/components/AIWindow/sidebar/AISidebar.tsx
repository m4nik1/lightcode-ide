import { useEffect, useMemo, useRef, useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { ProjectDropdown } from "./ProjectDropdown";
import type { AIProject, AIThread } from "./types";
import { aiThemeClassNames } from "../theme";
import { cn } from "../../../lib/utils";

type AISidebarProps = {
  projects: AIProject[];
  activeProjectId: string;
  activeThreadId: string;
};

function createInitialExpandedState(
  projects: AIProject[],
): Record<string, boolean> {
  return Object.fromEntries(projects.map((project) => [project.id, true]));
}

export default function AISidebar({
  projects,
  activeProjectId,
  activeThreadId,
}: AISidebarProps) {
  const [expandedProjects, setExpandedProjects] = useState<
    Record<string, boolean>
  >(() => createInitialExpandedState(projects));
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

  const projectsWithDrafts = useMemo(
    () =>
      projects.map((project) => ({
        ...project,
        threads: [...(draftThreads[project.id] ?? []), ...project.threads],
      })),
    [draftThreads, projects],
  );

  function toggleProject(projectId: string) {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  }

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
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: true,
    }));
    setActiveProject(projectId);
    setActiveThread(thread.id);
  }

  return (
    <aside
      className={cn(
        "ai-sidebar-glass box-border relative flex h-full w-[260px] shrink-0 flex-col text-[13px]",
        aiThemeClassNames.textPrimary,
      )}
    >
      <SidebarHeader onNewChat={() => handleNewChat()} />

      <div className="relative min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {projectsWithDrafts.map((project) => (
          <ProjectDropdown
            key={project.id}
            project={project}
            expanded={expandedProjects[project.id] ?? true}
            onToggle={() => toggleProject(project.id)}
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
