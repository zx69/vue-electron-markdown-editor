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
      const newWindow = createWindow();
      this.windows.add(newWindow);
    });
  }

  handleOpenFile(currentWindow, file) {
    const content = readFile(file);
    this.saveFileRecordToSystem(currentWindow, file);
    currentWindow.webContents.send('file-opened', file, content);
  }

  saveFileRecordToSystem(currentWindow, file) {
    app.addRecentDocument(file);
    currentWindow.setRepresentedFilename(file);
  }
}
