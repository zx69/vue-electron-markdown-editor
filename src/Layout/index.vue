<template>
  <div class="layout">
    <ControlBar></ControlBar>
    <mainWindow></mainWindow>
  </div>
</template>

<script>
import ControlBar from './components/ControlBar.vue';
import mainWindow from './components/mainWindow.vue';

export default {
  components: {
    mainWindow,
    ControlBar,
  },
};
</script>

<style lang="scss">
</style>
