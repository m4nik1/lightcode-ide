import type { CSSProperties } from "react";
import { CheckIcon, ChevronDownIcon, FolderPlus, SquarePen } from "lucide-react";
import { cn } from "../../lib/utils";
import { aiThemeClassNames } from "../../theme";
import type { ProjectRow } from "../../utils/trpc";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type SidebarHeaderProps = {
  projects: ProjectRow[];
  // Project a plain "New chat" (or the shortcut) starts in
  defaultProjectId?: string;
  onNewChat: (projectId?: string) => void;
  onAddProject: () => void;
};

export const NEW_CHAT_SHORTCUT = /Mac|iPhone|iPad/.test(navigator.platform)
  ? "⌘N"
  : "Ctrl+N";

const dragStrip: CSSProperties = {
  height: 38,
  // @ts-expect-error -- Electron-specific CSS for draggable title bar
  WebkitAppRegion: "drag",
};

const rowButton = cn(
  "flex h-8 items-center rounded-lg text-[13px] font-medium transition-colors",
  aiThemeClassNames.surfaceHover,
  aiThemeClassNames.focusVisibleSurfaceHover,
  aiThemeClassNames.focusOutline,
);

const menuItem = cn(
  "text-[13px]",
  aiThemeClassNames.menuItemFocus,
  aiThemeClassNames.textPrimary,
);

export function SidebarHeader({
  projects,
  defaultProjectId,
  onNewChat,
  onAddProject,
}: SidebarHeaderProps) {
  const defaultProject = projects.find(({ id }) => id === defaultProjectId);

  return (
    <div className="shrink-0">
      <div aria-hidden style={dragStrip} />
      <div className="flex gap-0.5 px-2 pt-1 pb-2">
        <button
          type="button"
          onClick={() => onNewChat()}
          title={defaultProject ? `New chat in ${defaultProject.name}` : undefined}
          className={cn(
            rowButton,
            "min-w-0 flex-1 gap-2.5 pr-2.5 pl-3 text-left",
            aiThemeClassNames.textPrimary,
          )}
        >
          <SquarePen
            className={cn("size-4 shrink-0", aiThemeClassNames.textMuted)}
          />
          <span className="min-w-0 flex-1 truncate">New chat</span>
          <kbd
            className={cn(
              "shrink-0 font-sans text-[11px]",
              aiThemeClassNames.textDisabled,
            )}
          >
            {NEW_CHAT_SHORTCUT}
          </kbd>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="New chat in project"
              className={cn(
                rowButton,
                "group/trigger w-7 shrink-0 justify-center",
                aiThemeClassNames.textMuted,
                aiThemeClassNames.hoverTextPrimary,
                aiThemeClassNames.dataOpenSurfaceHover,
              )}
            >
              <ChevronDownIcon
                aria-hidden
                className="size-3.5 transition-transform group-data-[state=open]/trigger:rotate-180"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={cn(
              "w-60 rounded-xl border p-1 ring-0",
              aiThemeClassNames.border,
              aiThemeClassNames.menuSurface,
            )}
          >
            {projects.length > 0 && (
              <>
                <DropdownMenuLabel
                  className={cn("text-[12px]", aiThemeClassNames.textMuted)}
                >
                  New chat in
                </DropdownMenuLabel>
                {projects.map((project) => (
                  <DropdownMenuItem
                    key={project.id}
                    title={project.path}
                    onSelect={() => onNewChat(project.id)}
                    className={menuItem}
                  >
                    {project.id === defaultProject?.id ? (
                      <CheckIcon aria-hidden className="size-3.5" />
                    ) : (
                      <span aria-hidden className="size-3.5 shrink-0" />
                    )}
                    <span className="min-w-0 truncate">{project.name}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className={aiThemeClassNames.divider} />
              </>
            )}
            <DropdownMenuItem onSelect={onAddProject} className={menuItem}>
              <FolderPlus aria-hidden className="size-3.5" />
              Add project…
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
