import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    openFile: () => ipcRenderer.invoke("dialog.openFile"),
    readFile: (filePath: string) => ipcRenderer.invoke('fs.readFile', filePath)
});
