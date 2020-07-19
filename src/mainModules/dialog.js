import { dialog } from 'electron';

export const getFilePathByOpen = (targetWindow) => {
  const selectedFile = dialog.showOpenDialogSync(targetWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Files', extensions: ['md', 'markdown', 'txt'] },
    ],
  });
  return selectedFile;
};
