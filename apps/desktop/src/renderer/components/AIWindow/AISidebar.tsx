import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AIThread = {
  id: string;
  title: string;
};

type AIProject = {
  id: string;
  name: string;
  threads: AIThread[];
};

type AISidebarProps = {
  projects: AIProject[];
  activeProjectId: string;
  activeThreadId: string;
};

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden
      className={cn(
        "shrink-0 transition-transform duration-150",
        expanded && "rotate-90",
      )}
    >
      <path
        d="M3.5 2L7 5L3.5 8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M1.5 4.5H5.2L6.5 3H12.5V11.5H1.5V4.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThreadIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect
        x="2.5"
        y="2.5"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M8 6L11.5 2.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

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

  function toggleProject(projectId: string) {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  }

  return (
    <aside className="box-border flex h-full w-[260px] shrink-0 flex-col border-r border-[#2b2b2b] bg-[#181818] pt-7 text-[13px] text-[#ccc]">
      <div className="shrink-0 px-3 pt-3 pb-2 text-xs text-[#6e6e6e]">
        Projects
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {projects.map((project) => {
          const isActive = project.id === activeProjectId;
          const isExpanded = expandedProjects[project.id] ?? true;

          return (
            <div key={project.id}>
              <button
                type="button"
                onClick={() => toggleProject(project.id)}
                className={cn(
                  "flex w-full select-none items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] transition-colors",
                  isActive
                    ? "bg-[#2a2a2a] text-[#f1f1f1]"
                    : "text-[#b8b8b8] hover:bg-[#232323] hover:text-[#e0e0e0]",
                )}
              >
                <ChevronIcon expanded={isExpanded} />
                <span className="flex size-3.5 shrink-0 items-center justify-center">
                  {isActive ? (
                    <Loader2
                      className="size-3.5 animate-spin"
                      strokeWidth={2}
                    />
                  ) : (
                    <FolderIcon />
                  )}
                </span>
                <span className="min-w-0 flex-1 truncate">{project.name}</span>
                {isActive ? (
                  <span className="ml-auto shrink-0 text-xs text-[#6e6e6e]">
                    now
                  </span>
                ) : null}
              </button>

              {isExpanded
                ? project.threads.map((thread) => {
                    const isThreadActive = thread.id === activeThreadId;

                    return (
                      <div
                        key={thread.id}
                        className={cn(
                          "flex select-none items-center gap-2 rounded-md py-1.5 pr-3 pl-[30px] text-xs transition-colors",
                          isThreadActive
                            ? "bg-[#2a2a2a] text-[#f1f1f1]"
                            : "text-[#a8a8a8] hover:bg-[#232323] hover:text-[#d4d4d4]",
                        )}
                      >
                        <ThreadIcon />
                        <span className="min-w-0 truncate">{thread.title}</span>
                      </div>
                    );
                  })
                : null}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
