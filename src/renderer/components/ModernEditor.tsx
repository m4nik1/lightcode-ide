import { useEffect, useRef } from "react";
import { init } from "modern-monaco";

type ModernEditorProps = {
  filePath: string | null;
};

export default function ModernEditor({ filePath }: ModernEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const monacoRef = useRef<Awaited<ReturnType<typeof init>> | null>(null);
  const editorInstanceRef = useRef<ReturnType<Awaited<ReturnType<typeof init>>["editor"]["create"]> | null>(null);
  const latestFilePathRef = useRef<string | null>(filePath);

  useEffect(() => {
    latestFilePathRef.current = filePath;
  }, [filePath]);

  const initializeEditor = async () => {
    if (!editorRef.current || editorInstanceRef.current) {
      return;
    }

    const monaco = await init();
    monacoRef.current = monaco;
    editorInstanceRef.current = monaco.editor.create(editorRef.current, {
      smoothScrolling: true,
      cursorSmoothCaretAnimation: "on", // Smooth caret animation
      cursorBlinking: "smooth",
    });
  };

  const setupEditor = async (nextFilePath: string) => {
    if (!monacoRef.current || !editorInstanceRef.current) {
      return;
    }

    // Read the active file after App tells the editor which path was chosen.
    const fileContents = await window.electronAPI.readFile(nextFilePath);
    const modelUri = monacoRef.current.Uri.file(nextFilePath);
    const existingModel = monacoRef.current.editor.getModel(modelUri);
    const model = existingModel ?? monacoRef.current.editor.createModel(fileContents, undefined, modelUri);

    if (existingModel) {
      existingModel.setValue(fileContents);
    }

    editorInstanceRef.current.setModel(model);
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
