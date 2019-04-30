const { Tray, Menu, ipcMain } = require("electron");
const ACTIONS = require('./Actions')

const trayMenu = new Menu.buildFromTemplate([
  {
    label: "Open",
    accelerator: "ctrl+O",
    click: () => ipcMain.emit(ACTIONS.OPEN_WINDOW)
  },
  {
    label: "Refresh",
    accelerator: "ctrl+R",
    click: () => ipcMain.emit(ACTIONS.REFRESH_WINDOW)
  },
  {
    label: "Quit",
    accelerator: "ctrl+W",
    click: () => {
      ipcMain.emit(ACTIONS.SHOULD_EXIT);
      ipcMain.emit(ACTIONS.APP_EXIT);
    }
  }
]);

const createTray = (iconPath) => {
  const tray = new Tray(iconPath);
  tray.setToolTip("Microsoft Teams For linux");
  tray.setContextMenu(trayMenu);
  return tray;
};



exports = module.exports = createTray;
