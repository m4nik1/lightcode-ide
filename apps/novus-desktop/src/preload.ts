import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("novusDesktop", {
  openFolder: () => ipcRenderer.invoke("dialog.openFolder"),
});
