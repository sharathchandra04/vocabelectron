const {ipcRenderer, contextBridge} = require('electron');
// contextBridge.exposeInMainWorld("ipcRenderer",ipcRenderer)
const a = {
  ...ipcRenderer,
  on: ipcRenderer.on.bind(ipcRenderer),
  removeListener: ipcRenderer.removeListener.bind(ipcRenderer),
};
contextBridge.exposeInMainWorld("ipcRenderer", a);