export type FileTreeNode = {
  name: string;
  kind: "file" | "folder";
  children?: FileTreeNode[];
};
