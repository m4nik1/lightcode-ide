import { BrowserWindow, dialog, Menu, type MenuItemConstructorOptions } from 'electron';

const FILE_SAVE_REQUEST_CHANNEL = 'file.save-request';

export const createMacApplicationMenu = () => {
  const fileMenu: MenuItemConstructorOptions = {
    label: 'File',
    submenu: [
      {
        label: 'Open File',
        accelerator: 'CmdOrCtrl+O',
        click: () => {
          dialog.showOpenDialogSync({ properties: ['openFile'] })
        },
      },
      {
        label: 'Open Folder',
        accelerator: 'CmdOrCtrl+K CmdOrCtrl+O',
        click: () => {
            dialog.showOpenDialogSync({ properties: [ 'openDirectory' ] })
        },
      },
      { type: 'separator' },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: () => {
          BrowserWindow.getFocusedWindow()?.webContents.send(FILE_SAVE_REQUEST_CHANNEL);
        },
      },
      {
        label: 'Save As',
        accelerator: 'Shift+CmdOrCtrl+S',
        click: () => {
          // TODO: Prompt for a destination path and save the active file there.
        },
      },
    ],
  };

  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      { role: 'appMenu' },
      fileMenu,
      { role: 'editMenu' },
      { role: 'windowMenu' },
    ]),
  );
};