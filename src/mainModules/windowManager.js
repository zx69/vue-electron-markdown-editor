import { dialog, BrowserWindow, ipcMain } from 'electron';
import { getFilePathByOpen } from './dialog';
import { openFile } from './fs';
import { createWindow } from './window';

export default class WindowManager {
  constructor() {
    this.windows = new Set();
    this.currentWindow = {};
  }

  getCurrentWindow(sender) {
    return BrowserWindow.fromWebContents(sender);
  }

  initIpcMain() {
    this.listenToOpenFile();
    this.listenToCreateWindow();
  }

  listenToOpenFile() {
    ipcMain.on('open-file', (e) => {
      const currentWindow = this.getCurrentWindow(e.sender);
      const file = getFilePathByOpen(currentWindow);
      if (!file || file.length === 0) {
        return;
      }
      const content = openFile(file[0]);
      e.reply('file-opened', file, content);
    });
  }

  listenToCreateWindow() {
    ipcMain.on('create-window', () => {
      const newWindow = createWindow();
      this.windows.add(newWindow);
    });
  }
}
