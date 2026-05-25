const { app, BrowserWindow, shell, Menu, Tray, nativeImage } = require("electron");
const path = require("path");

const GRIT_URL = "https://www.grit-app.app";

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: "Grit",
    icon: path.join(__dirname, "icon.png"),
    backgroundColor: "#0d0d1a",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    autoHideMenuBar: true,
  });

  // Load the Grit web app
  mainWindow.loadURL(GRIT_URL);

  // Open external links in browser, not in app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(GRIT_URL)) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  // Custom title bar menu (minimal)
  const menu = Menu.buildFromTemplate([
    {
      label: "Grit",
      submenu: [
        { label: "Home",    click: () => mainWindow.loadURL(GRIT_URL) },
        { label: "Explore", click: () => mainWindow.loadURL(`${GRIT_URL}/explore.html`) },
        { label: "Games",   click: () => mainWindow.loadURL(`${GRIT_URL}/games.html`) },
        { label: "Messages",click: () => mainWindow.loadURL(`${GRIT_URL}/messages.html`) },
        { type: "separator" },
        { label: "Reload",  accelerator: "CmdOrCtrl+R", click: () => mainWindow.reload() },
        { type: "separator" },
        { label: "Quit",    accelerator: "CmdOrCtrl+Q", click: () => app.quit() },
      ],
    },
    {
      label: "View",
      submenu: [
        { label: "Zoom In",   accelerator: "CmdOrCtrl+=", click: () => {
          const z = mainWindow.webContents.getZoomFactor();
          mainWindow.webContents.setZoomFactor(Math.min(z + 0.1, 2));
        }},
        { label: "Zoom Out",  accelerator: "CmdOrCtrl+-", click: () => {
          const z = mainWindow.webContents.getZoomFactor();
          mainWindow.webContents.setZoomFactor(Math.max(z - 0.1, 0.5));
        }},
        { label: "Reset Zoom",accelerator: "CmdOrCtrl+0", click: () => {
          mainWindow.webContents.setZoomFactor(1);
        }},
        { type: "separator" },
        { label: "Toggle DevTools", accelerator: "F12", click: () => mainWindow.webContents.toggleDevTools() },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);

  mainWindow.on("closed", () => { mainWindow = null; });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});