import { useEffect, useRef } from "react";
import { init } from "modern-monaco";
import { editor } from "modern-monaco/types/monaco";

type ModernEditorProps = {
  filePath: string | null;
};

export default function ModernEditor({ filePath }: ModernEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const latestFilePathRef = useRef<string | null>(filePath);
  let editor : editor.IStandaloneCodeEditor;

  useEffect(() => {
    latestFilePathRef.current = filePath;
  }, [filePath]);

  const initializeEditor = async () => {
    if (!editorRef.current) {
      return;
    }


  };

  const setupEditor = async (nextFilePath: string) => {

    const monaco = await init();

    console.log("Setting up editor with file selected.", nextFilePath)

    editor = monaco.editor.create(editorRef.current!, {
      smoothScrolling: true,
      cursorSmoothCaretAnimation: "on", // Smooth caret animation
      cursorBlinking: "smooth",
    });

    try {
      // Read the active file after App tells the editor which path was chosen.
      const fileContents = await window.electronAPI.readFile(nextFilePath);

      const model = monaco.editor.createModel(fileContents, undefined, monaco.Uri.file(nextFilePath));

      editor.setModel(model);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const bootEditor = async () => {
      await initializeEditor();

      if (latestFilePathRef.current) {
        await setupEditor(latestFilePathRef.current);
      }
    };

    void bootEditor();
  }, []);

  useEffect(() => {
    if (!filePath) {
      return;
    }

    // Load the newly selected file into the existing editor instance.
    void setupEditor(filePath);
  }, [filePath]);

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
