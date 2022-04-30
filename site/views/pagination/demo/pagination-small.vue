<template>
  <bk-pagination
    v-model="current"
    :count="count"
    :limit="10"
    small
  />
</template>
<script setup>
  import { ref } from 'vue';

  import { BkPagination } from '@bkui-vue/pagination';

  const count = ref(100);
  const current = ref(1);

</script>

