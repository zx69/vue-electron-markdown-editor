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
    listenToFileOpened() {
      ipcRenderer.on('file-opened', (e, file, content) => {
        this.filePath = file;
        this.originalContent = content;
        this.updateUserInterface(false);
      });
    },
    saveFileContent(file, content) {
      this.filePath = file;
      this.originalContent = content;
    },
    updateUserInterface(isEdited) {
      let title = 'vue-electron-markdown-editor';
      if (this.filePath) {
        title = `${path.basename(this.filePath)} - ${title}`;
      }
      if (isEdited) {
        title = `${title} (Edited)`;
      }
      currentWindow.setTitle(title);

      this.isEdited = isEdited;
      currentWindow.setDocumentEdited(isEdited); // for macOS
      currentWindow.documentEdited = isEdited; // for windows
    },
    handleCreateWindow() {
      ipcRenderer.send('create-window');
    },
    handleOpenFile(file) {
      ipcRenderer.send('open-file', file);
    },
    handleSaveHtml() {
      ipcRenderer.send('save-html', this.$refs['main-window'].renderedHtml);
    },
    handleSaveMarkdown() {
      ipcRenderer.send(
        'save-markdown',
        this.filePath,
        this.$refs['main-window'].rawMarkdownText,
      );
    },
    handleRevertingFile() {
      console.log('here');
      this.$refs['main-window'].rawMarkdownText = this.originalContent;
    },

  },
};
</script>

<style lang="scss">
</style>
