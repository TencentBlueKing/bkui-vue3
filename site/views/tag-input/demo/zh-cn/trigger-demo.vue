<template>
  <bk-tag-input
    v-model="state.tags"
    :placeholder="'请选择城市'"
    trigger="focus"
    collapse-tags
    :list="state.list"
  />
</template>

<script>
  import { defineComponent, reactive } from 'vue';

  export default defineComponent({
    setup() {
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

      return {
        state,
      };
    },
  });
</script>
