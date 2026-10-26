import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUp, Folder, House, Loader2 } from "lucide-react";
import { trpcClient } from "../utils/trpc";
import { aiThemeClassNames } from "../theme";
import { cn } from "../lib/utils";

type FolderPickerDialogProps = {
  onSelect: (path: string) => void;
  onCancel: () => void;
};

// Browser stand-in for Electron's native folder dialog. It browses folders on
// the machine running the Novus server, since that's where projects live.
export function FolderPickerDialog({ onSelect, onCancel }: FolderPickerDialogProps) {
  // null means the server's home directory.
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const listing = useQuery({
    queryKey: ["listDirectories", currentPath],
    queryFn: () => trpcClient.listDirectories.query({ path: currentPath }),
    placeholderData: (previous) => previous,
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const data = listing.data;
  const iconButton = cn(
    "inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-1 focus-visible:outline-offset-[-1px]",
    aiThemeClassNames.textMuted,
    aiThemeClassNames.surfaceHover,
    aiThemeClassNames.hoverTextPrimary,
    aiThemeClassNames.borderFocus,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Choose a project folder"
        className={cn(
          "flex h-[min(480px,100%)] w-full max-w-lg flex-col overflow-hidden rounded-xl border",
          aiThemeClassNames.border,
          aiThemeClassNames.raisedSurface,
          aiThemeClassNames.textPrimary,
        )}
      >
        <div className={cn("flex items-center gap-1 border-b px-3 py-2", aiThemeClassNames.border)}>
          <button
            type="button"
            aria-label="Parent folder"
            className={iconButton}
            disabled={!data?.parent}
            onClick={() => data?.parent && setCurrentPath(data.parent)}
          >
            <ArrowUp className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label="Home folder"
            className={iconButton}
            onClick={() => setCurrentPath(null)}
          >
            <House className="size-3.5" />
          </button>
          <p
            className={cn("m-0 min-w-0 flex-1 truncate pl-1 text-[12px]", aiThemeClassNames.textMuted)}
            title={data?.path}
            dir="rtl"
          >
            {/* rtl keeps the deepest folder visible when the path truncates */}
            <bdi>{data?.path ?? "Loading…"}</bdi>
          </p>
          {listing.isFetching && (
            <Loader2 className={cn("size-3.5 animate-spin", aiThemeClassNames.textMuted)} />
          )}
        </div>

        <div className="chat-messages-scrollbar min-h-0 flex-1 overflow-y-auto p-1.5">
          {listing.isError ? (
            <p className="m-0 px-3 py-2 text-[12px] text-[#E5484D]">
              Couldn't open this folder. Is the Novus server running?
            </p>
          ) : data && data.directories.length === 0 ? (
            <p className={cn("m-0 px-3 py-2 text-[12px]", aiThemeClassNames.textMuted)}>
              No subfolders.
            </p>
          ) : (
            <ul className="m-0 list-none p-0">
              {data?.directories.map((directory) => (
                <li key={directory.path}>
                  <button
                    type="button"
                    className={cn(
                      "flex h-8 w-full cursor-pointer items-center gap-2 rounded-md px-2.5 text-left text-[13px] transition-colors focus-visible:outline-1 focus-visible:outline-offset-[-1px]",
                      aiThemeClassNames.surfaceHover,
                      aiThemeClassNames.focusVisibleSurfaceHover,
                      aiThemeClassNames.borderFocus,
                    )}
                    onClick={() => setCurrentPath(directory.path)}
                  >
                    <Folder className={cn("size-3.5 shrink-0", aiThemeClassNames.textMuted)} />
                    <span className="truncate">{directory.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={cn("flex items-center justify-end gap-2 border-t px-3 py-2.5", aiThemeClassNames.border)}>
          <button
            type="button"
            onClick={onCancel}
            className={cn(
              "inline-flex h-7 cursor-pointer items-center rounded-md border px-2.5 text-[12px] font-medium transition-colors focus-visible:outline-1 focus-visible:outline-offset-[-1px]",
              aiThemeClassNames.border,
              aiThemeClassNames.surfaceHover,
              aiThemeClassNames.borderFocus,
            )}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!data}
            onClick={() => data && onSelect(data.path)}
            className={cn(
              "inline-flex h-7 cursor-pointer items-center rounded-md px-2.5 text-[12px] font-medium transition-colors",
              data ? aiThemeClassNames.accentAction : aiThemeClassNames.accentActionDisabled,
            )}
          >
            Open folder
          </button>
        </div>
      </div>
    </div>
  );
}
