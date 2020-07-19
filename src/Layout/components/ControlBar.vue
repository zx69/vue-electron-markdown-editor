<template>
  <header class="control-bar">
    <button @click="handleCreateWindow">新建</button>
    <button @click="handleOpenFile">打开</button>
    <button @click="saveMarkdown" :disabeld="!isEdited">保存</button>
    <button :disabeld="!isEdited">回退</button>
    <button @click="handleSaveHtml">保存为HTML</button>
    <button>显示文件</button>
    <button>默认程序打开</button>
  </header>
</template>

<script>

// const currentWindow = remote.getCurrentWindow();
// console.log(remote.getFilePathByOpen);
// const mainProcess = remote.require('./background');

export default {
  props: {
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  // data() {
  //   return {

  //   };
  // },
  computed: {
    // currentWindow() {
    //   return remote.getCurrentWindow();
    // },
    // mainProcess() {
    //   return remote.require('../../background.js');
    // },
  },
  mounted() {
    // this.initFileOpenListener();
  },
  methods: {
    // initFileOpenListener() {
    //   ipcRenderer.on('file-opened', (e, file, content) => {
    //     console.log(file, content);
    //   });
    // },
    handleCreateWindow() {
      this.$emit('handleCreateWindow');
    },
    handleOpenFile() {
      this.$emit('handleOpenFile');
    },
    handleSaveHtml() {
      this.$emit('handleSaveHtml');
    },
    handleSaveMarkdown() {
      this.$emit('handleSaveMarkdown');
    },
  },
};
</script>

<style lang="scss">
.control-bar {
  background-color: rgb(217, 241, 238);
  padding: 10px 10px 10px 10px;
}

button {
  font-size: 14px;
  background-color: rgb(181, 220, 216);
  border: none;
  padding: 0.5em 1em;
}

button:hover {
  background-color: rgb(156, 198, 192);
}

button:active {
  background-color: rgb(144, 182, 177);
}

button:disabled {
  background-color: rgb(196, 204, 202);
}
</style>
