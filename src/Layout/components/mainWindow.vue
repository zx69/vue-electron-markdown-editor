<template>
  <main class="main-content">
    <label
      for="markdown"
      hidden
    >Markdown Content</label>
    <textarea
      class="view__markdown"
      v-model="rawMarkdownText"
    ></textarea>
    <div
      class="view__html"
      v-html="renderedHtml"
    ></div>
  </main>
</template>

<script>
import marked from 'marked';
import { ipcRenderer } from 'electron';

export default {
  props: {
    originalContent: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      rawMarkdownText: this.originalContent,
      renderedHtml: '',
    };
  },
  mounted() {
    // this.initFileOpenListener();
  },
  methods: {
    initFileOpenListener() {
      ipcRenderer.on('file-opened', (e, file, content) => {
        // this.filePath = file;
        // this.originalContent = content;
        this.rawMarkdownText = content;
      });
    },
    renderMarkdownToHtml() {
      this.renderedHtml = marked(this.rawMarkdownText);
    },
  },
  watch: {
    originalContent(val) {
      this.rawMarkdownText = val;
    },
    rawMarkdownText(val) {
      this.renderMarkdownToHtml(val);
      this.$emit('updateUserInterface', val !== this.originalContent);
    },
  },

};
</script>

<style lang="scss">
/* 使用Flexbox对齐应用程序的两个窗格*/
.main-content {
  height: 100vh;
  display: flex;
}

/* 使用Flexbox将两个窗格设置为相同的宽度 */
.view__markdown,
.view__html {
  min-height: 100%;
  max-width: 50%;
  flex-grow: 1;
  padding: 1em;
  overflow: scroll;
  font-size: 16px;
}

.view__markdown {
  border: 5px solid rgb(238, 252, 250);
  background-color: rgb(238, 252, 250);
  font-family: monospace;

  &.drag-over {
    background-color: rgb(181, 220, 216);
    border-color: rgb(75, 160, 151);
  }

  &.drag-error {
    background-color: rgba(170, 57, 57, 1);
    border-color: rgba(255, 170, 170, 1);
  }
}
</style>
