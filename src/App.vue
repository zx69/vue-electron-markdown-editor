<template>
  <div id="app"
    @dragstart.prevent
    @dragover.prevent
    @dragleave.prevent
    @drop.prevent
  >
    <Layout></Layout>
  </div>
</template>

<script>
import Layout from '@/Layout';

export default {
  name: 'App',
  components: {
    Layout,
  },
};
</script>

<style lang="scss">
@import '@/style/index.scss';
</style>
