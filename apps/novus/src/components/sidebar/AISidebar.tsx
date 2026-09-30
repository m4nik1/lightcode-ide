import { useEffect } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { aiThemeClassNames } from "../../theme";
import { cn } from "../../lib/utils";
import { FolderPlus } from "lucide-react";
import { ProjectDropdown } from "./ProjectDropdown";
import { useAIChat } from "../../context/useAIChat";
import { useProjects } from "../../context/useProjects";
import { useThreads } from "../../context/useThreads";

export default function AISidebar() {
  const { getProjects, createProject } = useProjects();
  const projects = getProjects.data ?? [];
  const { newThread } = useThreads();
  const { currentThread, setCurrentThread } = useAIChat();

  async function handleNewChat(projectId = currentThread?.projectId) {
    const project = projects.find(({ id }) => id === projectId);
    if (!project) return;

    try {
      const createdThread = await newThread(project.id, project.path);
      await setCurrentThread(createdThread);
    } catch (error) {
      console.error("Failed to create chat", error);
    }
  }

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
              />
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
