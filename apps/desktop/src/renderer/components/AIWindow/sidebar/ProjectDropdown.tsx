import { SquarePen } from "lucide-react";
import { cn } from "../../../lib/utils";
import { ChevronIcon } from "./icons";
import type { thread } from "./types";
import type { Project } from "@/components/AIWindow/sidebar/AISidebar";
import { aiThemeClassNames } from "../theme";
import { ThreadItem } from "./ThreadItem";

type ProjectDropdownProps = {
  project: Project;
  onCreateThread: () => void;
};

export function ProjectDropdown({
  project,
  onCreateThread,
}: ProjectDropdownProps) {
  const expanded = true;
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
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2 rounded-xl py-[7px] pr-1 pl-3 text-left focus-visible:outline-1 focus-visible:outline-offset-[-1px]",
            aiThemeClassNames.borderFocus,
          )}
        >
          <ChevronIcon expanded={expanded} />
          <span className="flex size-3.5 shrink-0 items-center justify-center">
          </span>
          <span className="min-w-0 flex-1 truncate">{project.name}</span>
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

      { project.threads.map((t : thread) => (
        <ThreadItem
          key={t.id}
          thread={t}
        />
      ))}

    </div>
  );
}
