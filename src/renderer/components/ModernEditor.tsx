import { useEffect, useRef } from "react";
import { init } from "modern-monaco";

export default function ModernEditor() {
  const editorRef = useRef<HTMLDivElement | null>(null);

  const setupEditor = async () => {
    // let disposed = false;

    if (!editorRef.current) {
      return;
    }

    const monaco = await init();

    const model = monaco.editor.createModel("", "javascript");

    monaco.editor.create(editorRef.current, {
      model,
      smoothScrolling: true,
      cursorSmoothCaretAnimation: "on", // Smooth caret animation
      cursorBlinking: "smooth",
    });
  };

  useEffect(() => {
    setupEditor();
  }, []);

  return (
    <div
      ref={editorRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "16px",
      }}
    />
  );
}
