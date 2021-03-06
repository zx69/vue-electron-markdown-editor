import {
  app, BrowserWindow, ipcMain,
} from 'electron';
import fs from 'fs';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import { getFilePathByOpen, showSaveDialog, showMessageBox } from './dialog';
import { readFile } from './fs';

// hide default menu buttons of window
// export const createMenu = () => {
//   // darwin表示macOS，针对macOS的设置
//   if (process.platform === 'darwin') {
//     const template = [
//       {
//         label: 'App Demo',
//         submenu: [
//           { role: 'about' },
//           { role: 'quit' },

//         ],

//       },
//     ];
//     const menu = Menu.buildFromTemplate(template);
//     Menu.setApplicationMenu(menu);
//   } else {
//     Menu.setApplicationMenu(null);
//   }
// };

// documentEdited: 记录文件是否修改，在renderer中赋值， 用于windows
// macOs有默认的isDocumentEdited值获取文件变化（Boolean）,但windoww没有，故在win下挂载变量以记录
const defineDocumentEdited = (targetWindow) => {
  Object.defineProperty(targetWindow, 'documentEdited', {
    value: false,
    configurable: false,
    enumerable: true,
    writable: true,
  });
};

class WindowManager {
  constructor() {
    this.windows = new Set();
    this.currentWindow = {};
    // openFiles: collections of the files had opened. use for multiple files watcher
    // to prevent the save function overwrite the change we make from other editor
    // key: BrowserWindow instances | value: file watcher
    this.openFiles = new Map();
  }

  // 根据webContents获取窗口对象
  getCurrentWindow(sender) {
    return BrowserWindow.fromWebContents(sender);
  }

  isDocumentEdited(targetWindow) {
    // macOs || windows
    return (targetWindow.isDocumentEdited() || targetWindow.documentEdited);
  }

  // 初始化监听
  initIpcMain() {
    this.listenToOpenFile();
    this.listenToCreateWindow();
    this.listenToSaveHtml();
    this.listenToSaveMarkdown();
  }

  // 创建新窗口
  createWindow() {
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

    win.on('close', (e) => {
      if (this.isDocumentEdited(win)) {
        e.preventDefault();

        const result = showMessageBox({
          win,
          title: 'Quit with Unsaved Changes?',
          message: 'Your changes will be lost if you do not save.',
          buttonsArr: [
            'Quit Anyway',
            'Cancel',
          ],
        });
        if (result === 0) {
          win.destroy();
        }
      }
    });

    win.on('closed', () => {
      this.windows.delete(win);
      this.stopWatchingFile(win);
      win = null;
    });

    // createMenu();
    defineDocumentEdited(win);
    return win;
  }

  listenToOpenFile() {
    ipcMain.on('open-file', (e, file) => {
      const currentWindow = this.getCurrentWindow(e.sender);
      if (file) {
        this.handleOpenFile(currentWindow, file);
        return;
      }
      const fileList = getFilePathByOpen(currentWindow);
      if (!fileList || fileList.length === 0) {
        return;
      }
      const selectedFile = fileList[0];
      this.handleOpenFile(currentWindow, selectedFile);
    });
  }

  listenToSaveHtml() {
    ipcMain.on('save-html', (e, content) => {
      const currentWindow = this.getCurrentWindow(e.sender);
      showSaveDialog(currentWindow, false, content, 'html');
    });
  }

  listenToSaveMarkdown() {
    ipcMain.on('save-markdown', (e, file, content) => {
      const currentWindow = this.getCurrentWindow(e.sender);
      showSaveDialog(currentWindow, file, content, 'markdown').then(() => {
        this.saveFileRecordToSystem(currentWindow, file);
        e.reply('file-opened', file, content);
      });
    });
  }

  listenToCreateWindow() {
    ipcMain.on('create-window', () => {
      const newWindow = this.createWindow();
      this.windows.add(newWindow);
    });
  }

  handleOpenFile(currentWindow, file) {
    if (this.isDocumentEdited(currentWindow)) {
      const result = showMessageBox({
        win: currentWindow,
        title: 'Overwrite Current Unsaved Changes?',
        message: 'Opening a new file in this window will overwrite your unsaved changes. Open this file anyway?',
        buttonsArr: [
          'Yes',
          'Cancel',
        ],
      });
      if (result === 1) {
        return;
      }
    }
    const content = readFile(file);
    this.saveFileRecordToSystem(currentWindow, file);
    currentWindow.webContents.send('file-opened', file, content);
  }

  // 保存文件打开记录, 用于macOS
  saveFileRecordToSystem(currentWindow, file) {
    app.addRecentDocument(file);
    currentWindow.setRepresentedFilename(file);
  }

  startWatchingFile(targetWindow, file) {
    this.stopWatchingFile(targetWindow);

    const watcher = fs.watch(file, (eventType) => {
      if (eventType === 'change') {
        if (this.isDocumentEdited(targetWindow)) {
          const result = showMessageBox({
            win: targetWindow,
            title: 'Overwrite Current Unsaved Changes?',
            message: 'Another application has changed this file. Load changes?',
            buttonsArr: [
              'Yes',
              'Cancel',
            ],
          });
          if (result === 1) {
            return;
          }
        }
        const content = readFile(file);
        targetWindow.webContents.send('file-opened', file, content);
      }
    });
    this.openedFiles.set(targetWindow, watcher);
  }

  stopWatchingFile(targetWindow) {
    if (this.openFiles.has[targetWindow]) {
      // fs.FSWatcher.close（）
      this.openFiles.get(targetWindow).close();
      this.openFiles.delete(targetWindow);
    }
  }
}

export default new WindowManager();
