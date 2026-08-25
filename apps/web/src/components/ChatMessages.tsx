import { useEffect, useRef } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { aiThemeClassNames } from "../theme";
import { Shimmer } from "./ai-elements/shimmer";
import { cn } from "../lib/utils";
import { useAIChat } from "../context/useAIChat";

const markdownComponents: Components = {
  a: ({ children }) => (
    <span className="text-[#A1A1A1] underline underline-offset-2">
      {children}
    </span>
  ),
};

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
                    aiThemeClassNames.messageSurface,
                  )}
                >
                  {message.text}
                </div>
              ) : (
                <div
                  className={cn(
                    "min-w-0 max-w-[78%] break-words text-[13px] leading-5 [&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-[#555555] [&_blockquote]:pl-3 [&_blockquote]:text-[#A1A1A1] [&_code]:rounded [&_code]:bg-[#292929] [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_h1]:my-3 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:my-3 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:my-2 [&_h3]:font-semibold [&_hr]:my-4 [&_hr]:border-[#2A2A2A] [&_img]:max-w-full [&_img]:rounded-lg [&_li]:my-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-[#2A2A2A] [&_pre]:bg-[#1B1B1B] [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:my-3 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_td]:border [&_td]:border-[#2A2A2A] [&_td]:px-3 [&_td]:py-1.5 [&_th]:border [&_th]:border-[#2A2A2A] [&_th]:bg-[#1B1B1B] [&_th]:px-3 [&_th]:py-1.5 [&_th]:text-left [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
                    aiThemeClassNames.textPrimary,
                  )}
                >
                  {message.text ? (
                    <ReactMarkdown
                      components={markdownComponents}
                      remarkPlugins={[remarkGfm]}
                      skipHtml
                    >
                      {message.text}
                    </ReactMarkdown>
                  ) : (
                    <Shimmer
                      as="span"
                      className={cn("text-sm", aiThemeClassNames.shimmer)}
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
