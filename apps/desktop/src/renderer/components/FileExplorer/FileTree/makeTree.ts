import { FileTreeNode } from "../../../types/FileTreeNode";

export default function makeTree(folderPath: string): Promise<FileTreeNode[]> {
    return window.electronAPI.readDirectory(folderPath);
}
