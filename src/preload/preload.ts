import { contextBridge, ipcRenderer } from "electron";

const FILE_SAVE_REQUEST_CHANNEL = "file.save-request";

contextBridge.exposeInMainWorld("electronAPI", {
    openFile: () => ipcRenderer.invoke("dialog.openFile"),
    readFile: (filePath: string) => ipcRenderer.invoke('fs.readFile', filePath),
    writeFile: (filePath: string, content: string) => ipcRenderer.invoke('fs.writeFile', filePath, content),
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
