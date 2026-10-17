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
  const threadCount = project.threads.length;
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
          {threadCount === 0 ? (
            <li
              className={cn(
                "relative flex h-8 items-center pl-8 text-[12px] before:absolute before:top-0 before:bottom-0 before:left-[17px] before:w-px",
                aiThemeClassNames.rail,
                aiThemeClassNames.textDisabled,
              )}
            >
              No chats yet
            </li>
          ) : (
            project.threads.map((t: thread) => (
              <ThreadItem
                key={t.id}
                thread={t}
                onDeleteThread={onDeleteThread}
              />
            ))
          )}
        </ul>
      )}
    </li>
  );
}
