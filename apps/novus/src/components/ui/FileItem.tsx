interface FileItemProps {
  onSelect: () => void;
  index: number;
  currentIndex: number;
}

export default function FileItem({
  onSelect,
  index,
  currentIndex,
}: FileItemProps) {
  const { Icon, colorClassName } = entryIcon(entry);
  const isActive = index === currentIndex;
  return (
    <button
      key={entryPath(entry)}
      ref={isActive ? activeRowRef : undefined}
      type="button"
      role="option"
      aria-selected={isActive}
      onMouseDown={(event) => event.preventDefault()}
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
        className={cn("truncate text-[13px]", aiThemeClassNames.textPrimary)}
      >
        {entry.fileName}
      </span>
      {entry.relativePath ? (
        <span className={cn("truncate text-xs", aiThemeClassNames.textMuted)}>
          {entry.relativePath}
        </span>
      ) : null}
    </button>
  );
}
