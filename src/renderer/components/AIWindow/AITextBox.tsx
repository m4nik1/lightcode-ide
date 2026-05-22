import { useRef, useState, type KeyboardEvent } from "react";

export default function AITextBox() {

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const placeholder = "Ask me anything...";
  const [value, setValue] = useState("");

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      setValue("");
    }
  }


  return (
      <div className="w-full">
        <div className="relative rounded-xl border border-border bg-card shadow-sm">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="w-full resize-none bg-transparent px-3 py-2.5 pr-20 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            style={{ minHeight: "42px", maxHeight: "180px" }}
          />
        </div>
    </div>
  );
}