import { useEffect, useRef } from "react";
import { init } from "modern-monaco";
import { editor } from "modern-monaco/types/monaco";
import { m4Editor } from "../editor/m4Editor";

type ModernEditorProps = {
  filePath: string | null;
};

export default function ModernEditor({ filePath }: ModernEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const latestFilePathRef = useRef<string | null>(filePath);
  let editor;
  

  useEffect(() => {
    latestFilePathRef.current = filePath;
  }, [filePath]);

  const initializeEditor = async () => {
    if (!editorRef.current) {
      return;
    }
  };

  const setupEditor = async (nextFilePath: string) => {
    editor = new m4Editor(editorRef.current);

    editor.createEditor(nextFilePath);
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
