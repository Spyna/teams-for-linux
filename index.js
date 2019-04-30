const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");
const windowStateKeeper = require("electron-window-state");
const createTray = require("./Tray");
const ACTIONS = require("./Actions");
const DEFAULT_WINDOW_WIDTH = 1024;
const DEFAULT_WINDOW_HEIGHT = 800;
const open = require("open");
const contextMenu = require("electron-context-menu");

let shouldExit = false;
const iconPath = path.join(__dirname, "teams-icon.png");
let tray = null;

function createWindow() {
  tray = createTray(iconPath);
  tray.setTitle("Teams for linux");

  let windowState = windowStateKeeper({
    defaultWidth: DEFAULT_WINDOW_WIDTH,
    defaultHeight: DEFAULT_WINDOW_HEIGHT
  });

  // Create the browser window.
  let window = new BrowserWindow({
    x: windowState.x,
    y: windowState.y,
    icon: iconPath,
    width: windowState.width,
    height: windowState.height,

    show: false,
    webPreferences: {
      partition: "persist:teams-for-linux",
      preload: path.join(__dirname, "app", "enableJquery.js")
    }
  });
  // and load the url of outlook.

  window.on("page-title-updated", (event, title) => window.webContents.send("page-title", title));

  window.webContents.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
  );
  window.setMenuBarVisibility(true);
  window.once("ready-to-show", () => window.show());

  window.loadURL("https://teams.microsoft.com");
  windowState.manage(window);
  window.on("close", event => {
    ipcMain.emit(ACTIONS.CLOSE_WINDOW, event);
  });

  window.webContents.on("new-window", (event, url) => {
    event.preventDefault();
    open(url, err => {
      if (err) {
        console.error(`exec error: ${err.message}`);
      }
    });
  });

  contextMenu({
    window: window,
    showCopyImageAddress: true,
    showSaveImageAs: true
  });

  const isAlreadyRunning = app.requestSingleInstanceLock();
  if (!isAlreadyRunning) {
    shouldExit = true;
    app.exit();
  } else {
    app.on("second-instance", (event, commandLine, workingDirectory) => {
      // Someone tried to run a second instance, we should focus our window.
      window.show();
      window.focus();
    });
  }

  ipcMain.on(ACTIONS.CLOSE_WINDOW, event => {
    if (!shouldExit) {
      event.preventDefault();
      window.hide();
    } else {
      app.quit();
    }
  });
  ipcMain.on(ACTIONS.SHOULD_EXIT, () => (shouldExit = true));
  ipcMain.on(ACTIONS.APP_EXIT, () => app.quit());
  ipcMain.on(ACTIONS.OPEN_WINDOW, () => window.show());
  ipcMain.on(ACTIONS.REFRESH_WINDOW, () => {
    window.show();
    window.reload();
  });
}

app.on("ready", createWindow);
