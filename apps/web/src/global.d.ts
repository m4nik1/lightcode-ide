/// <reference types="vite/client" />

export {};

declare global {
  interface Window {
    novusDesktop?: {
      openFolder: () => Promise<string | null>;
    };
  }
}
