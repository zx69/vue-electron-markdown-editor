import fs from 'fs';

export const readFile = (file) => {
  const content = fs.readFileSync(file).toString();
  return content;
};
