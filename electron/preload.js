const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("autoFillTool", {
  addRegistration: (payload) => ipcRenderer.invoke("registration:add", payload),
  selectWorkbook: () => ipcRenderer.invoke("workbook:select")
});
