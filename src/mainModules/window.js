import {
  BrowserWindow, Menu,
} from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';

export const createMenu = () => {
  // darwin表示macOS，针对macOS的设置
  if (process.platform === 'darwin') {
    const template = [
      {
        label: 'App Demo',
        submenu: [
          { role: 'about' },
          { role: 'quit' },

        ],

      },
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } else {
    Menu.setApplicationMenu(null);
  }
};

export const createWindow = () => {
  let x = 0;
  let y = 0;
  const currentWindow = BrowserWindow.getFocusedWindow();

  if (currentWindow) {
    const [currentWindowX, currentWindowY] = currentWindow.getPosition();
    x = currentWindowX + 20;
    y = currentWindowY + 20;
  }

  // Create the browser window.
  let win = new BrowserWindow({
    x,
    y,
    show: false,
    width: 1200,
    height: 620,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      webSecurity: false,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }

  win.once('ready-to-show', () => {
    win.show();
  });

  win.on('closed', () => {
    win = null;
  });
  createMenu();
  return win;
};
