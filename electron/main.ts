import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 730,
    minWidth: 1200,
    minHeight: 730,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    frame: false,             // Removed title bar and windows default window at the top (false)
    transparent: false,
    autoHideMenuBar: true,    // hiding the menu bar with file options etc.
    backgroundColor: '#00000000', // fully transparent?
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      sandbox: false,
      contextIsolation: false,
      nodeIntegration: true,
    },
  })

  win.setMenu(null);

  // window control listeners 
  ipcMain.on('minimize-window', () => win?.minimize());
  ipcMain.on('maximize-window', () => {
    if (win?.isMaximized()) win?.unmaximize();
    else win?.maximize();
  });
  ipcMain.on('close-window', () => win?.close());

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)