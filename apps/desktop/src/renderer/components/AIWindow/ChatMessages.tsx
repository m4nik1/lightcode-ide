import { useEffect, useRef } from "react";
import { aiThemeClassNames } from "./theme";
import { Shimmer } from "../ai-elements/shimmer";
import { cn } from "../../lib/utils";
import { useAIChat } from "../../context/useAIChat";

export type ChatMessage = {
  id: string;
  text: string;
  role: "user" | "assistant";
};

export default function ChatMessages() {
  const { messages } = useAIChat();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    scrollContainer.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex min-h-0 flex-1 flex-col overflow-y-auto py-6"
    >
      <div className="flex w-full max-w-[1080px] flex-col gap-3 self-center sm:w-[75%]">
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={cn("flex", isUser ? "justify-end" : "justify-start")}
            >
              {isUser ? (
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
              ) : (
                <div
                  className={cn(
                    "max-w-[78%] whitespace-pre-wrap text-[13px] leading-5",
                    aiThemeClassNames.textPrimary,
                  )}
                >
                  {message.text || (
                    <Shimmer
                      as="span"
                      className="text-sm [--color-background:#ededed] [--color-muted-foreground:#737373]"
                      duration={1}
                      spread={4}
                    >
                      Thinking
                    </Shimmer>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
