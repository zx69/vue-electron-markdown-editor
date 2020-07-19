import fs from 'fs';

export const openFile = (file) => {
  const content = fs.readFileSync(file).toString();
  return content;
};
