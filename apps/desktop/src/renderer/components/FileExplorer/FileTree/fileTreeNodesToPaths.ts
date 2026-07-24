import type { FileTreeNode } from "../../../types/FileTreeNode";

/**
 * Flattens nested file-tree nodes into @pierre/trees path strings.
 * Directories use a trailing slash; files do not.
 */
export function fileTreeNodesToPaths(nodes: FileTreeNode[], parent = ""): string[] {
  const paths: string[] = [];
  for (const node of nodes) {
    const path = parent ? `${parent}/${node.name}` : node.name;
    if (node.kind === "folder") {
      paths.push(`${path}/`);
      if (node.children?.length) {
        paths.push(...fileTreeNodesToPaths(node.children, path));
      }
    } else {
      paths.push(path);
    }
  }
  return paths;
}
