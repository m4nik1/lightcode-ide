import type { ComponentType, SVGProps } from "react";
import { LoaderCircle, MessageSquare, Trash2 } from "lucide-react";
import { ContextMenu } from "radix-ui";
import { cn } from "../../lib/utils";
import { aiThemeClassNames } from "../../theme";
import type { ThreadListRow } from "../../utils/trpc";
import { useThreads } from "@/context/useThreads";
import OpenAIIcon from "../icons/OpenAIIcon";

type ModelIcon = ComponentType<SVGProps<SVGSVGElement>>;

// Maps a model id prefix to its provider logo; add new providers here
const modelIcons: [prefix: string, icon: ModelIcon][] = [["gpt-", OpenAIIcon]];

function iconForModel(model: string | null): ModelIcon {
  const match =
    model && modelIcons.find(([prefix]) => model.startsWith(prefix));
  return match ? match[1] : MessageSquare;
}

type ThreadCardProps = {
  thread: ThreadListRow;
};

export function ThreadCard({ thread }: ThreadCardProps) {
  const { currentThread, setThread, deleteThread } = useThreads();
  const isSelected = currentThread?.id === thread.id;
  const ModelLogo = iconForModel(thread.model);

  async function handleDelete() {
    try {
      await deleteThread(thread.id);
    } catch (error) {
      console.error("Failed to delete chat", error);
    }
  }

  return (
    <li className="group relative py-0.5">
      <ContextMenu.Root>
        <ContextMenu.Trigger asChild>
          <button
            type="button"
            aria-current={isSelected ? "page" : undefined}
            title={`${thread.name} · ${thread.project_name}`}
            onClick={() =>
              setThread({
                id: thread.id,
                title: thread.name,
                projectId: thread.project_id,
                projectPath: thread.project_path,
              })
            }
            className={cn(
              "flex w-full select-none items-center gap-2 rounded-lg px-2.5 py-1.5 text-left transition-colors",
              aiThemeClassNames.focusOutline,
              isSelected
                ? aiThemeClassNames.surfaceActive
                : aiThemeClassNames.surfaceHover,
            )}
          >
            {/* Right padding on reveal keeps the title clear of the delete button */}
            <span className="flex min-w-0 flex-1 flex-col gap-0.5 group-focus-within:pr-6 group-hover:pr-6">
              <span
                className={cn(
                  "truncate text-[13px]",
                  isSelected
                    ? cn("font-medium", aiThemeClassNames.textPrimary)
                    : aiThemeClassNames.textSecondary,
                )}
              >
                {thread.name}
              </span>
              <span
                className={cn(
                  "flex min-w-0 items-center gap-1.5 text-[11px]",
                  aiThemeClassNames.textMuted,
                )}
              >
                <span className="sr-only">
                  {thread.running
                    ? "Responding"
                    : (thread.model ?? "No messages")}
                </span>
                {thread.running ? (
                  <LoaderCircle
                    aria-hidden
                    className="size-3 shrink-0 animate-spin motion-reduce:animate-none"
                  />
                ) : (
                  <ModelLogo aria-hidden className="size-3 shrink-0" />
                )}
                <span className="truncate">{thread.project_name}</span>
              </span>
            </span>
          </button>
        </ContextMenu.Trigger>
        {/* Sibling of the row button (buttons can't nest); revealed on hover or
            keyboard focus so delete isn't right-click only. */}
        <button
          type="button"
          aria-label={`Delete ${thread.name}`}
          onClick={() => void handleDelete()}
          className={cn(
            "absolute top-1/2 right-1.25 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md opacity-0 transition-[opacity,background-color,color] group-focus-within:opacity-100 group-hover:opacity-100",
            aiThemeClassNames.textMuted,
            aiThemeClassNames.surfaceHover,
            aiThemeClassNames.hoverTextPrimary,
            aiThemeClassNames.focusOutline,
          )}
        >
          <Trash2 aria-hidden className="size-3.5" />
        </button>
        <ContextMenu.Portal>
          <ContextMenu.Content
            className={cn(
              "z-50 min-w-36 rounded-xl border p-1 text-[13px]",
              aiThemeClassNames.border,
              aiThemeClassNames.menuSurface,
            )}
          >
            <ContextMenu.Item
              onSelect={() => void handleDelete()}
              className={cn(
                "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 outline-hidden",
                aiThemeClassNames.menuItemFocus,
                aiThemeClassNames.textPrimary,
              )}
            >
              <Trash2 aria-hidden className="size-3.5" />
              Delete
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    </li>
  );
}
