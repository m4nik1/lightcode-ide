/// <reference types="vite/client" />

export {};

declare global {
  interface Window {
    electronAPI?: {
      openFolder: () => Promise<{ canceled: boolean; filePaths: string[] }>;
    };
  }
}
