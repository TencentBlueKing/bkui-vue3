<template>
  <bk-search-select
    v-model="value"
    :data="data"
    unique-select
    :value-split-code="'+'"
  />
</template>
<script setup>
  import { ref, shallowRef } from 'vue';
  const data = shallowRef([
    {
      name: '实例状态',
      id: '1',
      multiple: true,
      placeholder: '必须项',
      async: true,
      validate: true,
      children: [
        {
          name: 'redis 创 建 中 ',
          id: '1-2',
        },
        {
          name: '运行中',
          id: '1-3',
          disabled: false,
        },
        {
          name: '已关机',
          id: '1-4',
        },
      ],
    },
    {
      name: '实例业务',
      id: '2',
      children: [
        {
          name: '王者荣耀',
          id: '2-1',
          disabled: false,
        },
        {
          name: '刺激战场',
          id: '2-2',
        },
        {
          name: '绝地求生',
          id: '2-3',
        },
      ],
    },
    {
      name: 'IP地址',
      id: '3',
      disabled: true,
    },
    {
      name: 'testestset',
      id: '4',
    },
  ]);
  const value = ref([
    {
      id: '1',
      name: '实例状态',
      values: [{
        name: '创建中',
        id: '1-2',
      }],
    },
  ]);
</script>
