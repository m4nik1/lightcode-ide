import {
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import ModelPicker from "./ModelPicker";

export default function AITextBox() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");

  const placeholder = "Ask me anything...";

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitPrompt();
    }
  }

  return (
    <div className="w-full">
      <div className="relative rounded-xl border border-[#333] bg-[#222] shadow-sm">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="w-full resize-none bg-transparent px-3 pt-2.5 pb-10 text-xs text-[#e0e0e0] placeholder:text-[#666] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          style={{ minHeight: "42px", maxHeight: "140px" }}
        />
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between rounded-b-xl px-2 py-1.5">
          <ModelPicker />
        </div>
      </div>
    </div>
  );
}

