import {
  app, BrowserWindow, Menu, shell,
} from 'electron';
import windowManager from './windowManager';

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New File',
        accelerator: 'CmdOrCtrl+N',
        click(item, focusedWindow) {
          focusedWindow.webContents.send('create-window');
        },
      },
      {
        label: 'Open File',
        accelerator: 'CmdOrCtrl+O',
        click(item, focusedWindow) {
          focusedWindow.webContents.send('open-file');
        },
      },
      {
        label: 'Save File',
        accelerator: 'CmdOrCtrl+S',
        click(item, focusedWindow) {
          focusedWindow.webContents.send('save-markdown');
        },
      },
      {
        label: 'Export HTML',
        accelerator: 'Shift+CmdOrCtrl+S',
        click(item, focusedWindow) {
          focusedWindow.webContents.send('save-html');
        },
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo',
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo',
      },
      { type: 'separator' },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut',
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall',
      },
    ],
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize',
      },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close',
      },
    ],
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: 'Visit Website',
        click() {},
      },
      {
        label: 'Toggle Developer Tools',
        click(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.webContents.toggleDevTools();
          }
        },
      },
    ],
  },
];
// process.platform: darwin|fressbsd|linux|sunos|win32
// macOS菜单栏第一项固定为Application menu, 故设置一个application项在前面
if (process.platform === 'darwin') {
  const name = 'Vue-Electron-Markdown-Editor';
  template.unshift({
    label: name,
    submenu: [
      {
        label: `About ${name}`,
        role: 'about',
      },
      { type: 'separator' },
      {
        label: 'Services',
        role: 'services',
        submenu: [],
      },
      { type: 'separator' },

      {
        label: `Hide ${name}`,
        accelerator: 'Command+H',
        role: 'hide',
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers',
      },
      {
        label: 'Show All',
        role: 'unhide',
      },
      { type: 'separator' },
      {
        label: `Quit ${name}`,
        accelerator: 'Command+Q',
        click() { app.quit(); },
      },
    ],
  });

  const windowMenu = template.find((item) => item.label === 'Window');
  windowMenu.role = 'window';
  windowMenu.submenu.push(
    { type: 'separator' },
    {
      label: 'Bring All to Front',
      role: 'front',
    },
  );
}

export default Menu.buildFromTemplate(template);
