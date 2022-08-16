<template>
  <bk-select
    v-model="selectedValue"
    class="bk-select"
    :list="datasource"
    enable-virtual-render
    filterable
    multiple
    :input-search="false"
    multiple-mode="tag"
  />
</template>
<script setup>
  import { onMounted, ref } from 'vue';
  const datasource = ref([]);
  const selectedValue = ref();
  onMounted(() => {
    console.time();
    datasource.value = new Array(6000).fill('')
      .map((_, index) => ({ value: index, label: `测试数据${index}` }));
    console.timeEnd();
  });
</script>
<style scoped>
.bk-select {
  width: 300px;
}
</style>
