const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("node:path");
const { addRegistrationToWorkbook } = require("./services/dataProcessor");

const isDev = Boolean(process.env.VITE_DEV_SERVER_URL);

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 760,
    minWidth: 880,
    minHeight: 600,
    title: "Excel 自動填寫工具",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

ipcMain.handle("workbook:select", async () => {
  const result = await dialog.showOpenDialog({
    title: "選擇 Excel 檔案",
    properties: ["openFile"],
    filters: [{ name: "Excel Workbook", extensions: ["xlsx"] }]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
});

ipcMain.handle("registration:add", async (_event, payload) => {
  return addRegistrationToWorkbook(payload);
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
