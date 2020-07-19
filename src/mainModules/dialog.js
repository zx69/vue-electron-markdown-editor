import { dialog, app } from 'electron';
import fs from 'fs';

export const getFilePathByOpen = (targetWindow) => {
  const selectedFile = dialog.showOpenDialogSync(targetWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Files', extensions: ['md', 'markdown', 'txt'] },
    ],
  });
  return selectedFile;
};

export const showSaveDialog = (targetWindow, file, content, type) => {
  let savePath = '';
  return new Promise((resolve, reject) => {
    // file is undefined/false means a new files
    if (!file) {
      savePath = dialog.showSaveDialogSync(targetWindow, {
        title: 'Save HTML',
        defaultPath: app.getPath('documents'),
        filters: [
          type === 'html'
            ? { name: 'HTML Files', extensions: ['html, htm'] }
            : { name: 'Markdown File', extensions: ['md', 'markdown'] },
        ],
      });
    }
    if (!savePath) {
      reject();
    } else {
      fs.writeFileSync(savePath, content);
      resolve();
    }
  });
};
