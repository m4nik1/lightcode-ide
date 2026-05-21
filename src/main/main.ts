import { app, BrowserWindow, dialog, ipcMain, type IpcMainInvokeEvent } from 'electron';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { createMacApplicationMenu } from './macAppMenu';

const isMac = process.platform === 'darwin';
const iconFileName = process.platform === 'win32' ? 'icon.ico' : 'Icon.png';

const iconPath = path.join(app.getAppPath(), 'assets', 'appIcon', iconFileName);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: iconPath,
    autoHideMenuBar: true,
    ...(isMac ? { titleBarStyle: 'hidden' } : { frame: false }),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
};

ipcMain.handle("dialog.openFile", () => {
  return dialog.showOpenDialog({ properties: ['openFile'] })
})

ipcMain.handle('fs.readFile', async (_event, filePath: string) => {
  const contents = await fs.readFile(filePath, 'utf8');
  return contents
})

ipcMain.handle('fs.writeFile', async (_event, filePath: string, content: string) => {
  await fs.writeFile(filePath, content);
})

ipcMain.handle('dialog.openFolder', () => {
  return dialog.showOpenDialog({ properties: ['openDirectory'] })
})

function getWindowFromEvent(event: IpcMainInvokeEvent) {
  return BrowserWindow.fromWebContents(event.sender);
}

ipcMain.handle('window.minimize', (event) => {
  getWindowFromEvent(event)?.minimize();
});

ipcMain.handle('window.toggleMaximize', (event) => {
  const window = getWindowFromEvent(event);

  if (!window) {
    return false;
  }

  if (window.isMaximized()) {
    window.unmaximize();
    return false;
  }

  window.maximize();
  return true;
});

ipcMain.handle('window.close', (event) => {
  getWindowFromEvent(event)?.close();
});

ipcMain.handle('window.isMaximized', (event) => {
  return getWindowFromEvent(event)?.isMaximized() ?? false;
});

type FileTreeNode = {
  name: string;
  kind: "file" | "folder";
  children?: FileTreeNode[];
};

ipcMain.handle("fs.readDirectory", async (_event, folderPath: string): Promise<FileTreeNode[]> => {
  async function readDirectory(pathToRead: string): Promise<FileTreeNode[]> {
    const entries = await fs.readdir(pathToRead, { withFileTypes: true });
    const nodes: FileTreeNode[] = await Promise.all(
      entries.map(async (entry): Promise<FileTreeNode> => {
        const fullPath = path.join(pathToRead, entry.name);
        if (entry.isDirectory()) {
          return {
            name: entry.name,
            kind: "folder",
            children: await readDirectory(fullPath),
          };
        }
        return {
          name: entry.name,
          kind: "file",
        };
      }),
    );
    return nodes;
  }
  return readDirectory(folderPath);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  if (isMac) {
    createMacApplicationMenu();
  }

  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
