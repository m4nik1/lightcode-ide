import type { FileTreeNode } from "./types/FileTreeNode";

export {};

declare global {
  interface Window {
    electronAPI: {
      openFile: () => Promise<Electron.OpenDialogReturnValue>;
      openFolder: () => Promise<Electron.OpenDialogReturnValue>;
      readFile: (filePath: string) => Promise<string>;
      writeFile: (filePath: string, content: string) => Promise<void>;
      readDirectory: (folderPath: string) => Promise<FileTreeNode[]>;
      minimizeWindow: () => Promise<void>;
      toggleMaximizeWindow: () => Promise<boolean>;
      closeWindow: () => Promise<void>;
      isWindowMaximized: () => Promise<boolean>;
      onFileSaveRequest: (callback: () => void) => () => void;
    };
  }
}
