import { useState, useCallback, useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
import TreeNode from "./TreeNode";
import makeTree from "./FileTree/makeTree";
import { FileTreeNode } from "../../types/FileTreeNode";
import { useEditorTabs } from "../../context/EditorTabsContext";

const INITIAL_EXPANDED_FOLDERS = ["src", "src/renderer"];

function FolderIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M1.75 4.25C1.75 3.56 2.31 3 3 3h3.17c.27 0 .53.11.72.3l1.06 1.06c.19.19.45.3.71.3H13c.69 0 1.25.56 1.25 1.25v6.84c0 .69-.56 1.25-1.25 1.25H3c-.69 0-1.25-.56-1.25-1.25V4.25Z"
        stroke="#9aa3ad"
        strokeWidth="1.1"
        fill="rgba(154,163,173,0.08)"
      />
    </svg>
  );
}

function getFolderName(path: string): string {
  if (!path) return "";
  const normalized = path.replace(/[\\/]+$/, "");
  const parts = normalized.split(/[\\/]/);
  return parts[parts.length - 1] || normalized;
}

export default function FileExplorer() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    () => new Set(INITIAL_EXPANDED_FOLDERS),
  );
  const [tree, setTree] = useState<FileTreeNode[]>([]);

  const { activeFolder, openFile } = useEditorTabs();
  const folderName = useMemo(() => getFolderName(activeFolder), [activeFolder]);
  const headerTitle = folderName || "Explorer";

  useEffect(() => {
    if (activeFolder != null) {
      console.log(activeFolder);
      makeTree(activeFolder).then((newTree) => {
        setTree(newTree);
      });
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

  const handleSelectItem = useCallback(
    (fileName: string, isFolder: boolean) => {
      const fullPath = activeFolder + "/" + fileName;
      console.log("full path:", fullPath);

      if (!isFolder) {
        openFile(fullPath);
      }
    },
    [activeFolder, openFile],
  );

  return (
    <div style={styles.container}>
      <div style={styles.sectionHeader}>
        <FolderIcon />
        <span style={styles.sectionLabel} title={activeFolder || undefined}>
          {headerTitle}
        </span>
      </div>
      <div
        className="explorer-tree"
        style={styles.treeContainer}
        role="tree"
        aria-label="File explorer"
      >
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
    background: "#0b0b0c",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    userSelect: "none",
    borderRight: "1px solid rgba(255,255,255,0.05)",
  },
  sectionHeader: {
    height: 36,
    display: "flex",
    alignItems: "center",
    paddingLeft: 12,
    paddingRight: 10,
    gap: 8,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.01em",
    color: "#e4e6eb",
    background: "#0d0d0f",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    flexShrink: 0,
  },
  sectionLabel: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  treeContainer: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    paddingTop: 6,
    paddingBottom: 8,
  },
};
