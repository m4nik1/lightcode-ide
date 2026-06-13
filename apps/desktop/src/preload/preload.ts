import { contextBridge, ipcRenderer } from "electron";

const FILE_SAVE_REQUEST_CHANNEL = "file.save-request";

contextBridge.exposeInMainWorld("electronAPI", {
    openFile: () => ipcRenderer.invoke("dialog.openFile"),
    openFolder: () => ipcRenderer.invoke("dialog.openFolder"),
    readFile: (filePath: string) => ipcRenderer.invoke('fs.readFile', filePath),
    writeFile: (filePath: string, content: string) => ipcRenderer.invoke('fs.writeFile', filePath, content),
    readDirectory: (folderPath: string) => ipcRenderer.invoke("fs.readDirectory", folderPath),
    openAIWindow: () => ipcRenderer.invoke("window.openAIWindow"),
    minimizeWindow: () => ipcRenderer.invoke("window.minimize"),
    toggleMaximizeWindow: () => ipcRenderer.invoke("window.toggleMaximize"),
    closeWindow: () => ipcRenderer.invoke("window.close"),
    isWindowMaximized: () => ipcRenderer.invoke("window.isMaximized"),
    onFileSaveRequest: (callback: () => void) => {
        const listener = () => {
            callback();
        };
        ipcRenderer.on(FILE_SAVE_REQUEST_CHANNEL, listener);
        return () => {
            ipcRenderer.removeListener(FILE_SAVE_REQUEST_CHANNEL, listener);
        };
    },
});
