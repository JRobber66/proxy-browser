const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('proxyAPI', {
  launchProxiedBrowser: (config) => ipcRenderer.invoke('launch-proxied-browser', config)
});