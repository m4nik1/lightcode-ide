import { useEffect, useRef } from "react";
import { m4Editor } from "../editor/m4Editor";

type ModernEditorProps = {
  filePath: string | null;
  folderPath: string | null;
  editor: m4Editor;
};

export default function ModernEditor({ filePath, folderPath, editor }: ModernEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const latestFilePathRef = useRef<string | null>(filePath);
  
  useEffect(() => {
    latestFilePathRef.current = filePath;
  }, [filePath]);

  useEffect(() => {
    const unsubscribe = window.electronAPI.onFileSaveRequest(() => {
      void editor.save();
    });
    return unsubscribe;
  }, [editor]);

  const initializeEditor = async () => {
    if (editorRef.current == null) {
      return;
    }
    editor.setRef(editorRef);
  };

  const setupEditor = async (nextFilePath: string) => {
    await editor.createEditor(nextFilePath);
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
