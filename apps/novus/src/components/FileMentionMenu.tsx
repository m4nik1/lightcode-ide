import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { aiThemeClassNames } from "../theme";
import { useFileSearch } from "../context/useFileSearch";
import type { FileSearchResult } from "@/utils/trpc";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const [hasMoreBelow, setHasMoreBelow] = useState(false);

  const { searchResults } = useFileSearch();

  const updateOverflow = useCallback(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;

    setHasMoreBelow(
      scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight > 1,
    );
    // The rows move with scrolling; anchor their mask to the viewport's bottom.
    rowsRef.current?.style.setProperty(
      "--file-mention-fade-end",
      `${scroll.scrollTop + scroll.clientHeight - 8}px`,
    );
  }, []);

  useLayoutEffect(() => {
    activeRowRef.current?.scrollIntoView({ block: "nearest" });
    updateOverflow();
  }, [currentIndex, searchResults, updateOverflow]);

  useEffect(() => {
    const observer = new ResizeObserver(updateOverflow);
    if (scrollRef.current) observer.observe(scrollRef.current);
    if (rowsRef.current) observer.observe(rowsRef.current);
    return () => observer.disconnect();
  }, [updateOverflow]);

  return (
    <div className="file-mention-menu">
      <div className="file-mention-glass" aria-hidden="true" />
      <div
        ref={scrollRef}
        role="listbox"
        aria-label="Workspace files"
        className="file-mention-scroll"
        onScroll={updateOverflow}
      >
        <div
          ref={rowsRef}
          className="file-mention-rows"
          data-more-below={hasMoreBelow}
        >
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
    </div>
  );
}
