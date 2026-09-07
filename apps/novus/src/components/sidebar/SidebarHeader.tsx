import { ChevronDown, Folder, SquarePen } from "lucide-react";
import { cn } from "../../lib/utils";
import { aiThemeClassNames } from "../../theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type SidebarHeaderProps = {
  onNewChat?: () => void;
  projects: { id: string; name: string; path: string }[];
  onNewChatInProject: (projectId: string) => void;
};

export function SidebarHeader({
  onNewChat,
  projects,
  onNewChatInProject,
}: SidebarHeaderProps) {
  return (
    <div className="relative shrink-0 p-3 pt-10">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onNewChat}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2 rounded-xl border px-3 py-2 text-left text-[13px] transition-colors focus-visible:outline-1 focus-visible:outline-offset-[-1px]",
            aiThemeClassNames.surface,
            aiThemeClassNames.border,
            aiThemeClassNames.textPrimary,
            aiThemeClassNames.surfaceHover,
            aiThemeClassNames.focusVisibleSurfaceHover,
            aiThemeClassNames.borderFocus,
          )}
        >
          <SquarePen
            className={cn("size-4 shrink-0", aiThemeClassNames.textMuted)}
          />
          <span className="min-w-0 flex-1 truncate">New chat</span>
          <kbd
            className={cn(
              "ml-auto shrink-0 font-sans text-[11px] tracking-wide",
              aiThemeClassNames.textDisabled,
            )}
          >
            ⌘N
          </kbd>
        </button>
        {projects.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="New chat in project"
                title="New chat in project"
                className={cn(
                  "inline-flex size-8 shrink-0 items-center justify-center rounded-lg focus-visible:outline-1",
                  aiThemeClassNames.textMuted,
                  aiThemeClassNames.surfaceHover,
                  aiThemeClassNames.borderFocus,
                )}
              >
                <ChevronDown className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={cn(
                "max-w-64 border",
                aiThemeClassNames.menuSurface,
                aiThemeClassNames.border,
                aiThemeClassNames.textPrimary,
              )}
            >
              <DropdownMenuLabel className={aiThemeClassNames.textMuted}>
                New chat in
              </DropdownMenuLabel>
              {projects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  title={project.path}
                  onSelect={() => onNewChatInProject(project.id)}
                  className={aiThemeClassNames.menuItemFocus}
                >
                  <Folder className="size-3.5" />
                  <span className="truncate">{project.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className={cn("mt-3 h-px w-full", aiThemeClassNames.divider)} />
    </div>
  );
}
