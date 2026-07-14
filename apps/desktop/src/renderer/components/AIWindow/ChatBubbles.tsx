import { aiThemeClassNames } from "./theme";
import { cn } from "../../lib/utils";
import { useAIChat } from "@/context/useAIChat";

export type ChatMessage = {
  id: string;
  query: string;
  aiResponse: string;
};

type ChatBubblesProps = {
  isAIResponse: boolean;
};

export default function ChatBubbles({ isAIResponse }: ChatBubblesProps) {
  const bubblePosition = isAIResponse
    ? "flex justify-start"
    : "flex justify-end";

  const { messages } = useAIChat();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto py-6">
      {messages.map((message) => (
        <div>
          <div key={message.id} className={bubblePosition}>
            <div
              className={cn(
                "max-w-[78%] whitespace-pre-wrap rounded-2xl border px-4 py-2.5 text-[13px] leading-5",
                aiThemeClassNames.border,
                aiThemeClassNames.textPrimary,
                "bg-[#1a1a1a]",
              )}
            >
              {message.query}
            </div>
          </div>
          <div key={message.id} className="flex justify-start">
            <div
              className={cn(
                "max-w-[78%] whitespace-pre-wrap rounded-2xl border px-4 py-2.5 text-[13px] leading-5",
                aiThemeClassNames.border,
                aiThemeClassNames.textPrimary,
                "bg-[#1a1a1a]",
                !message.aiResponse && "shimmer"
              )}
            >
              {message.aiResponse ?  message.aiResponse : "thinking"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
