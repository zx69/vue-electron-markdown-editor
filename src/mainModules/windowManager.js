import { app, BrowserWindow, ipcMain } from 'electron';
import { getFilePathByOpen, showSaveDialog } from './dialog';
import { readFile } from './fs';
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
    this.listenToSaveHtml();
    this.listenToSaveMarkdown();
  }

  listenToOpenFile() {
    ipcMain.on('open-file', (e) => {
      const currentWindow = this.getCurrentWindow(e.sender);
      this.currentWindow = currentWindow;
      const fileList = getFilePathByOpen(currentWindow);
      if (!fileList || fileList.length === 0) {
        return;
      }
      const file = fileList[0];
      const content = this.handleOpenFile(currentWindow, file);
      e.reply('file-opened', file, content);
    });
  }

  listenToSaveHtml() {
    ipcMain.on('save-html', (e, content) => {
      const currentWindow = this.getCurrentWindow(e.sender);
      this.currentWindow = currentWindow;
      showSaveDialog(currentWindow, false, content, 'html');
    });
  }

  listenToSaveMarkdown() {
    ipcMain.on('save-markdown', (e, file, content) => {
      const currentWindow = this.getCurrentWindow(e.sender);
      this.currentWindow = currentWindow;
      showSaveDialog(currentWindow, file, content, 'markdown').then(() => {
        this.saveFileRecordToSystem(file);
      });
    });
  }

  listenToCreateWindow() {
    ipcMain.on('create-window', () => {
      const newWindow = createWindow();
      this.windows.add(newWindow);
    });
  }

  handleOpenFile(currentWindow, file) {
    const content = readFile(file);
    this.saveFileRecordToSystem(file);
    return content;
  }

  saveFileRecordToSystem(file) {
    app.addRecentDocument(file);
    this.currentWindow.setResponsedFilename(file);
  }
}
