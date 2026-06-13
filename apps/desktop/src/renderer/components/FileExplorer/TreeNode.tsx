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
  onSelectItem: (path: string, isFolder: boolean) => void;
};

function getExtension(name: string): string {
  const idx = name.lastIndexOf(".");
  return idx === -1 ? "" : name.slice(idx + 1).toLowerCase();
}

function FileTypeIcon({ name }: { name: string }) {
  const ext = getExtension(name);
  const viewBox = "0 0 16 16";
  const size = { width: 16, height: 16, flexShrink: 0 } as const;

  switch (ext) {
    case "tsx": {
      const color = "#61dafb";
      return (
        <svg {...size} viewBox={viewBox} fill="none">
          <path d="M3 1.5H10L13 4.5V14.5H3V1.5Z" fill={color} fillOpacity={0.15} stroke={color} strokeWidth="1" />
          <path d="M10 1.5V4.5H13" stroke={color} strokeWidth="1" fill="none" />
          <text x="5" y="11" fontSize="6" fontFamily="monospace" fontWeight="700" fill={color}>TX</text>
        </svg>
      );
    }
    case "ts": {
      const color = "#3178c6";
      return (
        <svg {...size} viewBox={viewBox} fill="none">
          <path d="M3 1.5H10L13 4.5V14.5H3V1.5Z" fill={color} fillOpacity={0.15} stroke={color} strokeWidth="1" />
          <path d="M10 1.5V4.5H13" stroke={color} strokeWidth="1" fill="none" />
          <text x="4.5" y="11" fontSize="6.5" fontFamily="monospace" fontWeight="700" fill={color}>TS</text>
        </svg>
      );
    }
    case "js": {
      const color = "#f7df1e";
      return (
        <svg {...size} viewBox={viewBox} fill="none">
          <path d="M3 1.5H10L13 4.5V14.5H3V1.5Z" fill={color} fillOpacity={0.15} stroke={color} strokeWidth="1" />
          <path d="M10 1.5V4.5H13" stroke={color} strokeWidth="1" fill="none" />
          <text x="4.5" y="11" fontSize="6.5" fontFamily="monospace" fontWeight="700" fill={color}>JS</text>
        </svg>
      );
    }
    default: {
      const color = "#8b949e";
      return (
        <svg {...size} viewBox={viewBox} fill="none">
          <path d="M3 1.5H10L13 4.5V14.5H3V1.5Z" stroke={color} strokeWidth="1" fill="none" />
          <path d="M10 1.5V4.5H13" stroke={color} strokeWidth="1" fill="none" />
        </svg>
      );
    }
  }
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
    onSelectItem(path, isFolder);
    if (isFolder) {
      onToggleFolder(path);
    }
  };

  const paddingLeft = 8 + depth * 14;
  const className = `explorer-item${isSelected ? " explorer-item-selected" : ""}`;

  return (
    <>
      <div
        className={className}
        style={{
          ...styles.treeRow,
          paddingLeft,
          color: isFolder ? "#e0e0e0" : undefined,
          fontWeight: isFolder ? 600 : undefined,
        }}
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
          <span style={{ width: 16, flexShrink: 0 }} />
        )}
        {!isFolder && <FileTypeIcon name={node.name} />}
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

const styles: Record<string, CSSProperties> = {
  treeRow: {
    height: 26,
    display: "flex",
    alignItems: "center",
    gap: 6,
    paddingRight: 8,
    cursor: "pointer",
    fontSize: 13,
    color: "#d4d4d4",
    outline: "none",
    whiteSpace: "nowrap",
    borderRadius: 4,
    marginRight: 6,
    marginLeft: 2,
  },
  label: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};