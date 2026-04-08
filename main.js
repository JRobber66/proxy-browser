const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');

let mainWindow;
let proxyCreds = {
  username: '',
  password: ''
};

function createWindow(startUrl = 'https://example.com') {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');

  const wc = mainWindow.webContents;

  wc.on('login', (event, details, authInfo, callback) => {
    if (authInfo.isProxy) {
      event.preventDefault();
      callback(proxyCreds.username || '', proxyCreds.password || '');
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.handle('launch-proxied-browser', async (_, config) => {
  const { host, port, username, password, startUrl } = config;

  proxyCreds.username = username || '';
  proxyCreds.password = password || '';

  const child = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const ses = child.webContents.session;

  try {
    await ses.setProxy({
      proxyRules: `http://${host}:${port}`,
      proxyBypassRules: '<-loopback>'
    });

    child.webContents.on('login', (event, details, authInfo, callback) => {
      if (authInfo.isProxy) {
        event.preventDefault();
        callback(username || '', password || '');
      }
    });

    await child.loadURL(startUrl || 'https://example.com');

    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});