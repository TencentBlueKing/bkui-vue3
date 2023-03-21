<template>
  <div>
    <bk-tag-input
      v-model="state.tags"
      placeholder="请选择城市"
      :list="state.list"
      @input="handleInput"
    />
    <p>请输入“州”来体验下搜索效果</p>
  </div>
</template>

<script setup>
  import { reactive } from 'vue';

  const state = reactive({
    tags: ['shenzhen'],
    list: [
      { id: 'shenzhen', name: '深圳' },
      { id: 'guangzhou', name: '广州' },
      { id: 'beijing', name: '北京' },
      { id: 'shanghai', name: '上海' },
      { id: 'hangzhou', name: '杭州' },
      { id: 'nanjing', name: '南京' },
      { id: 'chongqing', name: '重庆' },
      { id: 'taibei', name: '台北' },
      { id: 'haikou', name: '海口' },
    ],
  });

  const handleInput = (val) => {
    console.log(1, val);
  };
</script>
