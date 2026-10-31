<template>
  <bk-search-select
    class="search-select-border-demo"
    v-model="value"
    :data="data"
    unique-select
  />
</template>
<script setup>
  import { ref, shallowRef } from 'vue';

  const data = shallowRef([
    {
      name: 'ID',
      id: 'id',
    },
    {
      name: '集群名称',
      id: 'name',
    },
    {
      name: '状态',
      id: 'status',
      multiple: true,
      children: [
        {
          id: 'normal',
          name: '正常',
        },
        {
          id: 'abnormal',
          name: '异常',
        },
      ],
    },
  ]);
  const value = ref([]);
</script>
<style lang="less" scoped>
  /* 边框画在内层容器上，需要用 :deep 穿透 scoped */
  .search-select-border-demo :deep(.bk-search-select-container) {
    border-color: #ea3636;

    /* 组件聚焦态用 !important 设置了蓝色边框，覆盖时同样需要 !important */
    &.is-focus {
      /* stylelint-disable-next-line declaration-no-important */
      border-color: #ea3636 !important;
    }
  }
</style>
