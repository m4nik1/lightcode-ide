import { useState, useCallback, useEffect } from "react";
import type { CSSProperties } from "react";
import TreeNode from "./TreeNode";
import makeTree from "./FileTree/makeTree";
import { FileTreeNode } from "../../types/FileTreeNode";
import { useEditorTabs } from "../../context/EditorTabsContext";

export default function FileExplorer() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    () => new Set(["src", "src/renderer"]),
  );

  const { activeFolder, openFile } = useEditorTabs();
  const [tree, setTree] = useState<FileTreeNode[]>([]);


  useEffect(() => {
    if(activeFolder != null) {
      console.log(activeFolder);
      makeTree(activeFolder).then((newTree) => {
        setTree(newTree)
      })
    }
  }, [activeFolder]);

  const handleToggleFolder = useCallback((path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const handleSelectItem = useCallback((fileName: string, isFolder : boolean) => {
    const fullPath = activeFolder + '/' + fileName;
    console.log("full path:", fullPath);

    if(!isFolder) {
      openFile(fullPath);
    }
    
  }, [activeFolder]);


  return (
    <div style={styles.container}>
      <div style={styles.sectionHeader}>
        <span style={styles.sectionLabel}>lightcode</span>
      </div>
      <div style={styles.treeContainer} role="tree" aria-label="File explorer">
        {tree.map((node) => (
          <TreeNode
            key={node.name}
            node={node}
            depth={0}
            path={node.name}
            expandedFolders={expandedFolders}
            selectedPath={activeFolder}
            onToggleFolder={handleToggleFolder}
            onSelectItem={handleSelectItem}
          />
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    width: "100%",
    height: "100%",
    background: "#0A0A0A",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    userSelect: "none",
  },
  sectionHeader: {
    height: 22,
    display: "flex",
    alignItems: "center",
    paddingLeft: 4,
    gap: 2,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.04em",
    color: "#cccccc",
    textTransform: "uppercase",
    background: "#000000",
    borderBottom: "1px solid #1e1e1e",
    flexShrink: 0,
    cursor: "pointer",
  },
  sectionLabel: {},
  treeContainer: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    paddingTop: 2,
    paddingBottom: 8,
  },
};
