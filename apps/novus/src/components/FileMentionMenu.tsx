import { useEffect, useRef } from "react";
import {
  AtomIcon,
  BracesIcon,
  FileCodeIcon,
  FileJsonIcon,
  FileTextIcon,
  FolderIcon,
  ImageIcon,
  PackageIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../lib/utils";
import { aiThemeClassNames } from "../theme";

export type WorkspaceEntry = {
  name: string;
  dir: string;
  kind: "file" | "folder";
};

const mockWorkspaceFiles: WorkspaceEntry[] = [
  { name: "package-lock.json", dir: "", kind: "file" },
  { name: "package.json", dir: "", kind: "file" },
  { name: "Novus.png", dir: "public/assets", kind: "file" },
  { name: "novus-logo.svg", dir: "public/assets", kind: "file" },
  { name: "assets", dir: "public", kind: "folder" },
  { name: "components", dir: "src", kind: "folder" },
  { name: "Nav.jsx", dir: "src/components", kind: "file" },
  { name: "EditorMock.jsx", dir: "src/components", kind: "file" },
  { name: "Footer.jsx", dir: "src/components", kind: "file" },
  { name: "Hero.jsx", dir: "src/components", kind: "file" },
  { name: "Sidebar.jsx", dir: "src/components", kind: "file" },
  { name: "App.jsx", dir: "src", kind: "file" },
  { name: "main.jsx", dir: "src", kind: "file" },
  { name: "index.css", dir: "src", kind: "file" },
  { name: "theme.ts", dir: "src", kind: "file" },
  { name: "lib", dir: "src", kind: "folder" },
  { name: "utils.ts", dir: "src/lib", kind: "file" },
  { name: "hooks", dir: "src", kind: "folder" },
  { name: "useChat.ts", dir: "src/hooks", kind: "file" },
  { name: "favicon.ico", dir: "public", kind: "file" },
  { name: "index.html", dir: "", kind: "file" },
  { name: "vite.config.ts", dir: "", kind: "file" },
  { name: "tsconfig.json", dir: "", kind: "file" },
  { name: "README.md", dir: "", kind: "file" },
];

export function entryPath(entry: WorkspaceEntry) {
  return entry.dir ? `${entry.dir}/${entry.name}` : entry.name;
}

export function filterWorkspaceFiles(query: string) {
  if (!query) return mockWorkspaceFiles;

  const needle = query.toLowerCase();

  return mockWorkspaceFiles.filter((entry) =>
    entryPath(entry).toLowerCase().includes(needle),
  );
}

function entryIcon(entry: WorkspaceEntry): {
  Icon: LucideIcon;
  colorClassName: string;
} {
  if (entry.kind === "folder") {
    return { Icon: FolderIcon, colorClassName: aiThemeClassNames.textMuted };
  }

  if (entry.name === "package.json") {
    return { Icon: FileJsonIcon, colorClassName: "text-[#E5484D]" };
  }

  const extension = entry.name.slice(entry.name.lastIndexOf(".") + 1);

  switch (extension.toLowerCase()) {
    case "json":
      return { Icon: BracesIcon, colorClassName: "text-[#4EC9B0]" };
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
      return { Icon: ImageIcon, colorClassName: "text-[#E06BC4]" };
    case "svg":
      return { Icon: PackageIcon, colorClassName: "text-[#E8A33D]" };
    case "jsx":
    case "tsx":
      return { Icon: AtomIcon, colorClassName: "text-[#4FC3E8]" };
    case "js":
    case "ts":
      return { Icon: FileCodeIcon, colorClassName: "text-[#E8C33D]" };
    default:
      return { Icon: FileTextIcon, colorClassName: aiThemeClassNames.textMuted };
  }
}

type FileMentionMenuProps = {
  entries: WorkspaceEntry[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onSelect: (entry: WorkspaceEntry) => void;
};

export default function FileMentionMenu({
  entries,
  activeIndex,
  onActiveIndexChange,
  onSelect,
}: FileMentionMenuProps) {
  const activeRowRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRowRef.current?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-full z-40 mb-2 overflow-hidden rounded-[18px] border",
        aiThemeClassNames.glassBorder,
        aiThemeClassNames.glassMenuSurface,
      )}
    >
      <div
        role="listbox"
        className="chat-messages-scrollbar file-mention-fade max-h-[19rem] overflow-y-auto p-1.5"
      >
        {entries.map((entry, index) => {
          const { Icon, colorClassName } = entryIcon(entry);
          const isActive = index === activeIndex;

          return (
            <button
              key={entryPath(entry)}
              ref={isActive ? activeRowRef : undefined}
              type="button"
              role="option"
              aria-selected={isActive}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => onActiveIndexChange(index)}
              onClick={() => onSelect(entry)}
              className={cn(
                "flex h-10 w-full items-center gap-2.5 rounded-lg px-2.5 text-left transition-colors focus-visible:outline-none",
                isActive && aiThemeClassNames.mentionActiveSurface,
              )}
            >
              <Icon
                className={cn("size-4 shrink-0", colorClassName)}
                strokeWidth={1.75}
              />
              <span
                className={cn(
                  "truncate text-[13px]",
                  aiThemeClassNames.textPrimary,
                )}
              >
                {entry.name}
              </span>
              {entry.dir ? (
                <span
                  className={cn(
                    "truncate text-xs",
                    aiThemeClassNames.textMuted,
                  )}
                >
                  {entry.dir}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
