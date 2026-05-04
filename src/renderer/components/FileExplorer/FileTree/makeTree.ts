import { FileTreeNode } from "src/renderer/types/FileTreeNode";

export default function makeTree(folderPath: string): Promise<FileTreeNode[]> {
    console.log("Starting to make tree for: ", folderPath);

    return window.electronAPI.readDirectory(folderPath);
}