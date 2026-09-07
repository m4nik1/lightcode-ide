import { type RefObject } from "react";
import { cn } from "../../lib/utils";
import type { FileSearchResult } from "@/utils/trpc";
import { entryIcon, entryPath } from "../FileMentionMenu";

interface FileItemProps {
  entry: FileSearchResult;
  onSelect: (entry: FileSearchResult) => void;
  index: number;
  currentIndex: number;
  activeRowRef: RefObject<HTMLButtonElement | null>;
}

export default function FileItem({
  entry,
  onSelect,
  index,
  currentIndex,
  activeRowRef,
}: FileItemProps) {
  const { Icon, colorClassName } = entryIcon(entry);
  const isActive = index === currentIndex;
  const extension = entry.fileName.split(".").at(-1)?.toLowerCase();
  const badge =
    entry.fileName === "package.json"
      ? "npm"
      : extension === "ts" || extension === "js"
        ? extension
        : null;
  return (
    <button
      ref={isActive ? activeRowRef : undefined}
      type="button"
      role="option"
      aria-selected={isActive}
      title={entryPath(entry)}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => onSelect(entry)}
      className="file-mention-row"
    >
      {badge ? (
        <span
          className={`file-mention-icon file-mention-badge file-mention-badge-${badge}`}
          aria-hidden="true"
        >
          {badge === "npm" ? (
            <svg viewBox="0 0 18 18" fill="currentColor">
              <path d="M3 3h12v12h-3V6H9v9H3z" />
            </svg>
          ) : (
            badge.toUpperCase()
          )}
        </span>
      ) : (
        <Icon
          className={cn("file-mention-icon", colorClassName)}
          strokeWidth={1.75}
          aria-hidden="true"
        />
      )}
      <span className="file-mention-label">
        <span className="file-mention-name">{entry.fileName}</span>
        {entry.relativePath ? (
          <span className="file-mention-directory">
            {entry.relativePath}
          </span>
        ) : null}
      </span>
    </button>
  );
}
