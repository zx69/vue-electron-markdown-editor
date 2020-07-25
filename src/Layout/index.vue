<template>
  <div class="layout">
    <ControlBar
      :isEdited="isEdited"
      @handleCreateWindow="handleCreateWindow"
      @handleOpenFile="handleOpenFile()"
      @handleSaveHtml="handleSaveHtml"
      @handleSaveMarkdown="handleSaveMarkdown"
      @handleRevertingFile="handleRevertingFile"
    ></ControlBar>
    <mainWindow
      ref="main-window"
      :originalContent="originalContent"
      @updateUserInterface="updateUserInterface"
      @handleOpenFile="handleOpenFile"
    ></mainWindow>
  </div>
</template>

<script>
import path from 'path';
import { remote, ipcRenderer } from 'electron';
import ControlBar from './components/ControlBar.vue';
import mainWindow from './components/mainWindow.vue';

console.log(remote);
const currentWindow = remote.getCurrentWindow();

export default {
  components: {
    mainWindow,
    ControlBar,
  },
  data() {
    return {
      windowTitle: '',
      filePath: '',
      originalContent: '',
      isEdited: false,
    };
  },
  mounted() {
    this.listenToFileOpened();
    // this.listenToFileSaved();
  },
  methods: {
    // 监听文件打开
    listenToFileOpened() {
      ipcRenderer.on('file-opened', (e, file, content) => {
        this.renderFile(file, content);
      });
    },
    // 保存文件数据, 更新状态
    renderFile(file, content) {
      this.filePath = file;
      this.originalContent = content;
      this.updateUserInterface(false);
    },

    // 更新文件状态显示
    updateUserInterface(isEdited) {
      // 更新标题
      let title = 'vue-electron-markdown-editor';
      if (this.filePath) {
        title = `${path.basename(this.filePath)} - ${title}`;
      }
      if (isEdited) {
        title = `${title} (Edited)`;
      }
      currentWindow.setTitle(title);

      // 保存是否修改状态
      this.isEdited = isEdited;
      currentWindow.setDocumentEdited(isEdited); // for macOS
      currentWindow.documentEdited = isEdited; // for windows
    },

    // 处理[New File]操作
    handleCreateWindow() {
      ipcRenderer.send('create-window');
    },
    // 处理[Open File]操作
    handleOpenFile(file) {
      ipcRenderer.send('open-file', file);
    },
    // 处理[Save HTML]操作
    handleSaveHtml() {
      ipcRenderer.send('save-html', this.$refs['main-window'].renderedHtml);
    },
    // 处理[Save File]操作
    handleSaveMarkdown() {
      ipcRenderer.send(
        'save-markdown',
        this.filePath,
        this.$refs['main-window'].rawMarkdownText,
      );
    },
    // 处理[Revert]操作
    handleRevertingFile() {
      console.log('here');
      this.$refs['main-window'].rawMarkdownText = this.originalContent;
    },

  },
};
</script>

<style lang="scss">
</style>
