<template>
  <bk-search-select
    v-model="value"
    :data="data"
    unique-select
  />
</template>
<script setup>
  import { ref, shallowRef } from 'vue';
  function generateRandomIPs(count) {
    const generateIP = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      name: generateIP(),
    }));
  }
  const ipList = generateRandomIPs(20);
  function generateRandomValues(count) {
    const arrayCopy = ipList.slice();
    for (let i = arrayCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
    }
    return arrayCopy.slice(0, count);
  }
  const data = shallowRef([
    {
      name: 'IP地址',
      id: '3',
      multiple: true,
      placeholder: 'IP地址',
      children: ipList,
    },
    {
      name: '实例状态',
      id: '1',
      multiple: true,
      showLogicalPanel: true,
      placeholder: '有逻辑关系的状态',
      children: [
        {
          name: '创建中',
          id: '1-2',
        },
        {
          name: '运行中',
          id: '1-3',
          disabled: true,
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
          disabled: true,
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
      name: '搜索文本',
      id: '4',
      multiple: false,
    },
    {
      name: '不可选择',
      id: '5',
      disabled: true,
    },
  ]);
  const value = ref([{ name: 'IP地址', id: '3', values: generateRandomValues(6) }]);
</script>
