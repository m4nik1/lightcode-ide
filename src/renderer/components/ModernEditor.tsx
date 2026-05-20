import { useEffect, useRef } from "react";
import { useEditorTabs } from "../context/EditorTabsContext";
import { m4Editor } from "../editor/m4Editor";
import { EditorTab } from "../types/EditorTab";

type ModernEditorProps = {
  filePath: string | null;
  editor: m4Editor;
};

export default function ModernEditor({ filePath, editor }: ModernEditorProps) {
  const { setTabs } = useEditorTabs();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const latestFilePathRef = useRef<string | null>(filePath);

  useEffect(() => {
    editor.setOnModifiedChange((modifiedFilePath, isModified) => {
      setTabs((tabs: EditorTab[]) =>
        tabs.map((tab: EditorTab) =>
          tab.filePath === modifiedFilePath
            ? { ...tab, isModified }
            : tab
        )
      );
    });
  }, [editor, setTabs]);

  useEffect(() => {
    latestFilePathRef.current = filePath;
  }, [filePath]);

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
