import { aiThemeClassNames } from "./theme";
import { cn } from "../../lib/utils";

export type ChatMessage = {
  id: string;
  text: string;
};

type ChatBubblesProps = {
  messages: ChatMessage[];
};

export default function ChatBubbles({ messages }: ChatBubblesProps) {
  if (messages.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center text-center text-lg font-semibold text-[#737373] opacity-35">
        Send a message to start the conversation.
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto py-6">
      {messages.map((message) => (
        <div key={message.id} className="flex justify-end">
          <div
            className={cn(
              "max-w-[78%] whitespace-pre-wrap rounded-2xl border px-4 py-2.5 text-[13px] leading-5",
              aiThemeClassNames.border,
              aiThemeClassNames.textPrimary,
              "bg-[#1a1a1a]",
            )}
          >
            {message.text}
          </div>
        </div>
      ))}
    </div>
  );
}
