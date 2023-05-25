<template>
  <section class="loading-directive-control">
    <div>
      <span>loading</span>
      <bk-switcher v-model="loading" />
    </div>
    <div>
      <span>title</span>
      <bk-input v-model="title" />
    </div>
  </section>
  <div
    v-bkloading="loadingConf"
    class="directive-loading-box"
  >
    directive
  </div>
</template>

<script setup>
  import { reactive, ref } from 'vue';
  const loading = ref(true);
  const title = ref('loading...');

  const loadingConf = reactive({
    loading,
    title,
  });
</script>

<style lang="postcss">
  .loading-directive-control {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: max-content 1fr;
    align-items: center;

    > div {
      display: grid;
      align-items: center;
      grid-gap: 10px;
      grid-template-columns: max-content 1fr;
    }
  }

  .directive-loading-box {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 360px;
  }
</style>
