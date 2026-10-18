import { useState } from "react";
import { Folder, SquarePen } from "lucide-react";
import { cn } from "../../lib/utils";
import { ChevronIcon } from "./icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { trpcClient, type ProjectRow } from "../../utils/trpc";
import { aiThemeClassNames } from "../../theme";
import { ThreadItem } from "./ThreadItem";

type ProjectDropdownProps = {
  project: ProjectRow;
  onCreateThread: () => void;
};

export function ProjectDropdown({
  project,
  onCreateThread,
}: ProjectDropdownProps) {
  const [expanded, setExpanded] = useState(true);
  const queryClient = useQueryClient();
  const { data: threads = [], isPending, isError } = useQuery({
    queryKey: ["threads", project.id],
    queryFn: () => trpcClient.getThreads.query({ projectID: project.id }),
  });
  const threadCount = threads.length;

  function handleThreadDeleted() {
    void queryClient.invalidateQueries({
      queryKey: ["threads", project.id],
    });
  }
  const listId = `project-${project.id}-threads`;

  return (
    <li className="py-px">
      <div
        className={cn(
          "group flex h-8 w-full select-none items-center rounded-lg text-[13px] font-medium transition-colors",
          aiThemeClassNames.textMuted,
          aiThemeClassNames.surfaceHover,
          aiThemeClassNames.hoverTextPrimary,
        )}
      >
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((current) => !current)}
          className={cn(
            "flex h-full min-w-0 flex-1 items-center gap-2 rounded-lg pr-1 pl-3 text-left focus-visible:outline-1 focus-visible:outline-offset-[-1px]",
            aiThemeClassNames.borderFocus,
          )}
        >
          <ChevronIcon expanded={expanded} />
          <Folder className="size-3.5 shrink-0" />
          <span className="min-w-0 flex-1 truncate">{project.name}</span>
          {!expanded && threadCount > 0 && (
            <span
              className={cn(
                "shrink-0 pr-1 text-[11px] font-normal tabular-nums",
                aiThemeClassNames.textDisabled,
              )}
            >
              {threadCount}
            </span>
          )}
        </button>
        <button
          type="button"
          aria-label={`New chat in ${project.name}`}
          onClick={onCreateThread}
          className={cn(
            "mr-1.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md opacity-0 transition-[background-color,color,opacity] focus-visible:opacity-100 focus-visible:outline-1 focus-visible:outline-offset-[-1px] group-hover:opacity-100",
            aiThemeClassNames.textMuted,
            aiThemeClassNames.surfaceHover,
            aiThemeClassNames.hoverTextPrimary,
            aiThemeClassNames.focusVisibleSurfaceHover,
            aiThemeClassNames.focusVisibleTextPrimary,
            aiThemeClassNames.borderFocus,
          )}
        >
          <SquarePen className="size-3.5" />
        </button>
      </div>

      {expanded && (
        <ul id={listId} className="m-0 list-none p-0">
          {isPending || isError || threadCount === 0 ? (
            <li
              className={cn(
                "relative flex h-8 items-center pl-8 text-[12px] before:absolute before:top-0 before:bottom-0 before:left-[17px] before:w-px",
                aiThemeClassNames.rail,
                aiThemeClassNames.textDisabled,
              )}
            >
              {isPending
                ? "Loading chats…"
                : isError
                  ? "Could not load chats."
                  : "No chats yet"}
            </li>
          ) : (
            threads.map((row) => (
              <ThreadItem
                key={row.id}
                thread={{
                  id: row.id,
                  title: row.name,
                  projectId: row.project_id,
                  projectPath: project.path,
                }}
                onDeleteThread={handleThreadDeleted}
              />
            ))
          )}
        </ul>
      )}
    </li>
  );
}
