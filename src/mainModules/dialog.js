import { dialog } from 'electron';

exports.getFilePathByOpen = (targetWindow) => {
  const selectedFile = dialog.showOpenDialogSync(targetWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'Markdown Files', extensions: ['md', 'markdown'] },
    ],
  });

  if (!selectedFile) {
    return;
  }
  console.log(selectedFile);
};
