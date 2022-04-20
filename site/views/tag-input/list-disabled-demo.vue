<template>
  <bk-tag-input
    v-model="tags"
    placeholder="请选择城市"
    trigger="focus"
    :list="list"
  />
</template>

<script setup>
  import { reactive } from 'vue';

  const tags = reactive(['shenzhen']);
  const list = reactive([
    { id: 'shenzhen', name: '深圳' },
    { id: 'guangzhou', name: '广州' },
    { id: 'beijing', name: '北京' },
    { id: 'shanghai', name: '上海', disabled: true },
    { id: 'hangzhou', name: '杭州' },
    { id: 'nanjing', name: '南京', disabled: true },
    { id: 'chongqing', name: '重庆' },
    { id: 'taibei', name: '台北' },
    { id: 'haikou', name: '海口', disabled: true },
  ]);
</script>
