const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  saveResults: (data) => ipcRenderer.invoke('save-results', data)
});