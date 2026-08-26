import { useState } from "react";
import { Folder, SquarePen } from "lucide-react";
import { cn } from "../../lib/utils";
import { ChevronIcon } from "./icons";
import type { thread } from "./types";
import type { Project } from "./AISidebar";
import { aiThemeClassNames } from "../../theme";
import { ThreadItem } from "./ThreadItem";

type ProjectDropdownProps = {
  project: Project;
  onCreateThread: () => void;
  onDeleteThread: (threadID: string) => void;
};

export function ProjectDropdown({
  project,
  onCreateThread,
  onDeleteThread,
}: ProjectDropdownProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="py-0.5">
      <div
        className={cn(
          "group flex w-full select-none items-center rounded-xl text-[13px] transition-colors",
          aiThemeClassNames.textMuted,
          aiThemeClassNames.surfaceHover,
          aiThemeClassNames.hoverTextPrimary,
        )}
      >
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2 rounded-xl py-[7px] pr-1 pl-3 text-left focus-visible:outline-1 focus-visible:outline-offset-[-1px]",
            aiThemeClassNames.borderFocus,
          )}
        >
          <ChevronIcon expanded={expanded} />
          <Folder className="size-3.5 shrink-0" />
          <span className="min-w-0 flex-1 truncate">{project.name}</span>
          <span
            className={cn(
              "mr-1 inline-flex h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-full px-1.5 text-[11px] tabular-nums",
              aiThemeClassNames.surfaceActive,
              aiThemeClassNames.textMuted,
            )}
          >
            {project.threads.length}
          </span>
        </button>
        <button
          type="button"
          aria-label={`Create thread in ${project.name}`}
          onClick={onCreateThread}
          className={cn(
            "mr-2 inline-flex size-5 shrink-0 items-center justify-center rounded-md opacity-0 transition-[background-color,color,opacity] focus-visible:opacity-100 focus-visible:outline-1 focus-visible:outline-offset-[-1px] group-hover:opacity-100",
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

      {expanded &&
        (project.threads.length === 0 ? (
          <p
            className={cn(
              "py-1.5 pl-[30px] text-[12px]",
              aiThemeClassNames.textDisabled,
            )}
          >
            No chats yet
          </p>
        ) : (
          project.threads.map((t: thread) => (
            <ThreadItem key={t.id} thread={t} onDeleteThread={onDeleteThread} />
          ))
        ))}
    </div>
  );
}
