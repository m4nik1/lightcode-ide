import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

const isMac = process.platform === 'darwin';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let mainWindow;
const serverStatus = 'Stopped'

function updateServerStatus(status : String) {
  serverStatus = status;

  mainWindow.webContents.send('server:status', serverStatus);
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 1000,
    autoHideMenuBar: true,
    ...(isMac ? { titleBarStyle: 'hidden' } : { frame: false }),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
};

ipcMain.handle('dialog.openFolder', () => {
  return dialog.showOpenDialog({ properties: ['openDirectory'] });
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

ipcMain.handle('server:getStatus', () => serverStatus)

app.whenReady().then(async () => {
  try {
    await startServer()
    updateServerStatus('Ready')
  } catch(err) {
    console.error('Unable to start server: ', err);
    updateServerStatus('Stopped (error)')
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
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
