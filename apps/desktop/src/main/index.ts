import { app, BrowserWindow } from "electron";
import { join } from "path";
import { registerIpc } from "./ipc";
import { startSyncLoop } from "./sync";
import { restoreSession } from "./auth";

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "نظام إدارة المتجر — نقطة البيع",
    icon: join(__dirname, "../../resources/icon.png"),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const devServerUrl = process.env["ELECTRON_RENDERER_URL"];
  if (devServerUrl) {
    void win.loadURL(devServerUrl);
  } else {
    void win.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(() => {
  restoreSession();
  registerIpc();
  createWindow();
  startSyncLoop();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
