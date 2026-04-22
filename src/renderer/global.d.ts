export {};

declare global {
  interface Window {
    electronAPI: {
      openFile: () => Promise<Electron.OpenDialogReturnValue>;
      readFile: (filePath: string) => Promise<string>;
    };
  }
}
