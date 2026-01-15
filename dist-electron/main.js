import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
createRequire(import.meta.url);
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 730,
    minWidth: 1200,
    minHeight: 730,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    frame: false,
    // Removed title bar and windows default window at the top (false)
    transparent: false,
    autoHideMenuBar: true,
    // hiding the menu bar with file options etc.
    backgroundColor: "#00000000",
    // fully transparent?
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs"),
      sandbox: false,
      contextIsolation: false,
      nodeIntegration: true
    }
  });
  win.setMenu(null);
  ipcMain.on("minimize-window", () => win == null ? void 0 : win.minimize());
  ipcMain.on("maximize-window", () => {
    if (win == null ? void 0 : win.isMaximized()) win == null ? void 0 : win.unmaximize();
    else win == null ? void 0 : win.maximize();
  });
  ipcMain.on("close-window", () => win == null ? void 0 : win.close());
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
