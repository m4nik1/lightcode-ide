import { useEffect, useEffectEvent } from "react";
import { NEW_CHAT_SHORTCUT, SidebarHeader } from "./SidebarHeader";
import { aiThemeClassNames } from "../../theme";
import { cn } from "../../lib/utils";
import { FolderPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ThreadCard } from "./ThreadCard";
import { trpcClient } from "../../utils/trpc";
import { useProjects } from "../../context/useProjects";
import { useThreads } from "../../context/useThreads";
import { FolderPickerDialog } from "../FolderPickerDialog";

export default function AISidebar() {
  const {
    getProjects,
    createProject,
    addProjectFromPath,
    isFolderPickerOpen,
    setFolderPickerOpen,
  } = useProjects();
  const projects = getProjects.data ?? [];
  const { newThread, currentThread } = useThreads();
  const getThreads = useQuery({
    queryKey: ["threads"],
    queryFn: () => trpcClient.getAllThreads.query(),
    // Poll only while a thread is responding, so its spinner clears on its own
    refetchInterval: (query) =>
      query.state.data?.some(({ running }) => running) ? 1500 : false,
  });
  const threads = getThreads.data ?? [];

  // Falls back to the first project if the open chat's project is gone
  const defaultProjectId =
    projects.find(({ id }) => id === currentThread?.projectId)?.id ??
    projects[0]?.id;

  async function handleNewChat(projectId = defaultProjectId) {
    const project = projects.find(({ id }) => id === projectId);
    if (!project) return;

    try {
      await newThread(project.id, project.path);
    } catch (error) {
      console.error("Failed to create chat", error);
    }
  }

  // Reads the latest projects/thread without re-subscribing on every render
  const onNewChatShortcut = useEffectEvent((event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "n") {
      event.preventDefault();
      void handleNewChat();
    }
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => onNewChatShortcut(event);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const secondaryButton = cn(
    "mt-3 inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-[12px] font-medium transition-colors",
    aiThemeClassNames.border,
    aiThemeClassNames.textPrimary,
    aiThemeClassNames.surfaceHover,
    aiThemeClassNames.focusVisibleSurfaceHover,
    aiThemeClassNames.focusOutline,
  );

  return (
    <nav
      aria-label="Chats"
      className={cn(
        "relative box-border flex h-full w-68 shrink-0 flex-col border-r text-[13px]",
        aiThemeClassNames.sidebar,
        aiThemeClassNames.border,
        aiThemeClassNames.textPrimary,
      )}
    >
      <SidebarHeader
        projects={projects}
        defaultProjectId={defaultProjectId}
        onNewChat={(projectId) => void handleNewChat(projectId)}
        onAddProject={() => void createProject()}
      />

      <div className="chat-messages-scrollbar relative min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        <div className="flex h-8 items-center pr-1.5">
          <h2
            className={cn(
              "m-0 pl-3 text-[13px] font-medium",
              aiThemeClassNames.textMuted,
            )}
          >
            Chats
          </h2>
          <button
            type="button"
            aria-label="Add project"
            className={cn(
              "ml-auto inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md transition-[background-color,color]",
              aiThemeClassNames.textMuted,
              aiThemeClassNames.surfaceHover,
              aiThemeClassNames.hoverTextPrimary,
              aiThemeClassNames.focusVisibleSurfaceHover,
              aiThemeClassNames.focusVisibleTextPrimary,
              aiThemeClassNames.focusOutline,
            )}
            onClick={() => createProject()}
          >
            <FolderPlus className="size-3.5" />
          </button>
        </div>
        {getProjects.isLoading || getThreads.isLoading ? (
          <div className="space-y-2 px-3 pt-2">
            <span role="status" className="sr-only">
              Loading chats
            </span>
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                aria-hidden
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
              className={secondaryButton}
            >
              <FolderPlus className="size-3.5" />
              Add project
            </button>
          </div>
        ) : getThreads.isError && !getThreads.data ? (
          <div className="px-3 pt-2">
            <p className={cn("m-0 leading-5", aiThemeClassNames.textMuted)}>
              Could not load chats.
            </p>
            <button
              type="button"
              onClick={() => void getThreads.refetch()}
              className={secondaryButton}
            >
              Retry
            </button>
          </div>
        ) : threads.length === 0 ? (
          <p className={cn("m-0 px-3 pt-2 leading-5", aiThemeClassNames.textMuted)}>
            No chats yet. Press {NEW_CHAT_SHORTCUT} to start one.
          </p>
        ) : (
          <ul className="m-0 list-none p-0">
            {threads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </ul>
        )}
      </div>
      {isFolderPickerOpen && (
        <FolderPickerDialog
          onCancel={() => setFolderPickerOpen(false)}
          onSelect={(projectFolderPath) => {
            setFolderPickerOpen(false);
            void addProjectFromPath(projectFolderPath);
          }}
        />
      )}
    </nav>
  );
}
