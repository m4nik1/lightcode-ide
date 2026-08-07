export {};

declare global {
  interface Window {
    electronAPI: {
      openFolder: () => Promise<Electron.OpenDialogReturnValue>;
    };
  }
}