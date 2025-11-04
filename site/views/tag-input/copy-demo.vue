<template>
  <div>选择的数据为：{{ state.tags }}</div>
  <bk-tag-input
    v-model="state.tags"
    :list="state.list"
    placeholder="请选择城市"
    allow-auto-match
    allow-create
    has-delete-icon
    @change="handleChange"
    trigger="focus"
    separator=";"
    is-show-copy
    @copy-success="val => copySuccess(val)"
  />
</template>

<script setup>
  import { reactive } from 'vue';
  import BkMessage from '@bkui-vue/message';

  const copySuccess = val => {
    BkMessage({
      message: `复制成功，内容为：${val}`,
      width: 'auto'
    });
  };

  const state = reactive({
    tags: ['shenzhen'],
    // tags: ['111111', '222222', '333333'],
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

  const handleChange = val => {
    console.error('vuevuevue file handleChange', val);
  };
</script>
