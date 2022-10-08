<template>
  <bk-search-select v-model="value" />
</template>
<script setup>
  import { ref } from 'vue';
  const value = ref([
    {
      id: 12,
      name: 'hhhhh',
      values: [{ id: 'sdfsdf', name: 'sdfsdf' }],
    },
  ]);
</script>
