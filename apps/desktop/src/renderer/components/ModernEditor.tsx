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
    if (editorRef.current == null) {
      return;
    }

    editor.setRef(editorRef);
  }, [editor]);

  useEffect(() => {
    if (!filePath) {
      return;
    }

    // Load the newly selected file into the existing editor instance.
    void editor.createEditor(filePath);
  }, [editor, filePath]);

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
