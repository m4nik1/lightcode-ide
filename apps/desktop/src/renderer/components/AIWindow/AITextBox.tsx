import {
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ArrowUpIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import ModelPicker from "./ModelPicker";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { trpc } from '../../utils/trpc'

export default function AITextBox() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const sendChat = useMutation(trpc.sendChat.mutationOptions());

  const canSend = value.trim().length > 0;

  // function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
  //   if (event.key === "Enter" && !event.shiftKey) {
  //     event.preventDefault();
  //     console.log("Message: ", value)
  //   }
  // }

  function messageSend() {
    sendChat.mutate({
      message: "Hello there!",
      user: "Raj"
    })
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative w-full">
        <div className="flex flex-col rounded-2xl border border-[#333] bg-[#1a1a1a] shadow-sm transition-[border-color,box-shadow] focus-within:border-[#444] focus-within:ring-1 focus-within:ring-[#444]/40">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder=""
            rows={3}
            className="min-h-[88px] text-[13px] w-full resize-none border-0 bg-transparent px-4 pt-4 pb-12 text-[#e0e0e0] shadow-none placeholder:text-[#666] focus-visible:border-0 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 pb-2.5">
            <ModelPicker />
            <button
              type="button"
              onClick={() => messageSend()}
              disabled={!canSend}
              aria-label="Send message"
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-full border border-[#333] bg-[#2a2a2a] text-[#888] transition-colors",
                canSend
                  ? "text-[#e0e0e0] hover:bg-[#333]"
                  : "cursor-not-allowed opacity-60"
              )}
            >
              <ArrowUpIcon className="size-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
