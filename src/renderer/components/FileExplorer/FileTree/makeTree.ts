import { FileTreeNode } from "src/renderer/types/FileTreeNode";

export default function makeTree(folderPath: string): Promise<FileTreeNode[]> {
    return window.electronAPI.readDirectory(folderPath);
}