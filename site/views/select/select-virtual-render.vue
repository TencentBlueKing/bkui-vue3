<template>
  <bk-select
    v-model="selectedValue"
    class="bk-select"
    :list="datasource"
    enable-virtual-render
  />
</template>
<script setup>
  import { ref } from 'vue';
  const datasource = ref(new Array(100000).fill('')
    .map((_, index) => ({ value: index, label: `测试数据${index}` })));
  const selectedValue = ref('');
</script>
<style scoped>
.bk-select {
  width: 300px;
}
</style>
