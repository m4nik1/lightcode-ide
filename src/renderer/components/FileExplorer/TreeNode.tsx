import { CSSProperties } from "react";
import type { FileTreeNode } from "../../types/FileTreeNode";
import Chevron from "./ChevronArrow";


type TreeNodeProps = {
  node: FileTreeNode;
  depth: number;
  path: string;
  expandedFolders: Set<string>;
  selectedPath: string | null;
  onToggleFolder: (path: string) => void;
  onSelectItem: (path: string) => void;
};


function FolderIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      {open ? (
        <path
          d="M1.5 3C1.5 2.44772 1.94772 2 2.5 2H6.29289L7.79289 3.5H13.5C14.0523 3.5 14.5 3.94772 14.5 4.5V5H3L1.5 12.5V3Z"
          fill="#dcb67a"
        />
      ) : (
        <path
          d="M1.5 3C1.5 2.44772 1.94772 2 2.5 2H6.29289L7.79289 3.5H13.5C14.0523 3.5 14.5 3.94772 14.5 4.5V12C14.5 12.5523 14.0523 13 13.5 13H2.5C1.94772 13 1.5 12.5523 1.5 12V3Z"
          fill="#dcb67a"
        />
      )}
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M3 1.5H10L13 4.5V14.5H3V1.5Z"
        stroke="#8b949e"
        strokeWidth="1"
        fill="none"
      />
      <path d="M10 1.5V4.5H13" stroke="#8b949e" strokeWidth="1" fill="none" />
    </svg>
  );
}

export default function TreeNode({
  node,
  depth,
  path,
  expandedFolders,
  selectedPath,
  onToggleFolder,
  onSelectItem,
}: TreeNodeProps) {
  const isFolder = node.kind === "folder";
  const isExpanded = expandedFolders.has(path);
  const isSelected = selectedPath === path;

  const handleClick = () => {
    onSelectItem(path);
    if (isFolder) {
      onToggleFolder(path);
    }
  };

  const paddingLeft = 12 + depth * 16;
  const className = `explorer-item${isSelected ? " explorer-item-selected" : ""}`;

  return (
    <>
      <div
        className={className}
        style={{ ...styles.treeRow, paddingLeft }}
        onClick={handleClick}
        role="treeitem"
        aria-expanded={isFolder ? isExpanded : undefined}
        aria-selected={isSelected}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {isFolder ? (
          <Chevron open={isExpanded} />
        ) : (
          /* Spacer to align files with folder labels */
          <span style={{ width: 16, flexShrink: 0 }} />
        )}
        {isFolder ? <FolderIcon open={isExpanded} /> : <FileIcon />}
        <span style={styles.label}>{node.name}</span>
      </div>

      {isFolder && isExpanded && node.children
        ? node.children.map((child) => (
            <TreeNode
              key={`${path}/${child.name}`}
              node={child}
              depth={depth + 1}
              path={`${path}/${child.name}`}
              expandedFolders={expandedFolders}
              selectedPath={selectedPath}
              onToggleFolder={onToggleFolder}
              onSelectItem={onSelectItem}
            />
          ))
        : null}
    </>
  );
}

// ── Styles ──────────────────────────────────────────────────

const styles: Record<string, CSSProperties> = {
  treeRow: {
    height: 22,
    display: "flex",
    alignItems: "center",
    gap: 4,
    paddingRight: 8,
    cursor: "pointer",
    fontSize: 13,
    color: "#cccccc",
    outline: "none",
    whiteSpace: "nowrap",
  },
};
