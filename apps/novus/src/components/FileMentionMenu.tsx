import { useEffect, useRef } from "react";
import {
  AtomIcon,
  BracesIcon,
  FileCodeIcon,
  FileJsonIcon,
  FileTextIcon,
  ImageIcon,
  PackageIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../lib/utils";
import { aiThemeClassNames } from "../theme";
import { useFileSearch } from "@/context/useFileSearch";
import { FileSearchResult } from "@/utils/trpc";
import FileItem from "./ui/FileItem";

export type WorkspaceEntry = {
  name: string;
  dir: string;
  kind: "file" | "folder";
};

export function entryPath(entry: FileSearchResult) {
  return entry.relativePath
    ? `${entry.relativePath}/${entry.fileName}`
    : entry.fileName;
}

export function entryIcon(entry: FileSearchResult): {
  Icon: LucideIcon;
  colorClassName: string;
} {
  // if (entry.kind === "folder") {
  //   return { Icon: FolderIcon, colorClassName: aiThemeClassNames.textMuted };
  // }

  if (entry.fileName === "package.json") {
    return { Icon: FileJsonIcon, colorClassName: "text-[#E5484D]" };
  }

  const extension = entry.fileName.slice(entry.fileName.lastIndexOf(".") + 1);

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
      return {
        Icon: FileTextIcon,
        colorClassName: aiThemeClassNames.textMuted,
      };
  }
}

type FileMentionMenuProps = {
  currentIndex: number;
  onSelect: (entry: FileSearchResult) => void;
};

export default function FileMentionMenu({
  currentIndex,
  onSelect,
}: FileMentionMenuProps) {
  const activeRowRef = useRef<HTMLButtonElement>(null);

  const { searchResults } = useFileSearch();

  useEffect(() => {
    activeRowRef.current?.scrollIntoView({ block: "nearest" });
  }, [currentIndex]);

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
        {/* Maps out all the search results. Arrow keys navigate the index and
        the active row is highlighted */}
        {searchResults.map((entry, index) => (
          <FileItem
            key={entryPath(entry)}
            entry={entry}
            index={index}
            currentIndex={currentIndex}
            onSelect={onSelect}
            activeRowRef={activeRowRef}
          />
        ))}
      </div>
    </div>
  );
}
