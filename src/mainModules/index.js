
const modules = require.context('.', false, /\.js$/);

const exportsObj = {};

modules.keys().forEach(key => {
  if(key === './index.js'){
    return;
  }
  exportsObj[key.replace(/(\.\/|\.js)/g, ''/)] = modules(key).default;
});

export default exportsObj;