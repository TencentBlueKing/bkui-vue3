<template>
  <div>
    <p>Default</p>
    <bk-tag-input
      v-model="state.tags"
      :placeholder="'Please select city'"
      :list="state.list"
    />
    <p>Hover display</p>
    <bk-tag-input
      v-model="state.tags"
      :placeholder="'Please select city'"
      show-clear-only-hover
      :list="state.list"
    />
  </div>
</template>

<script>
  import { defineComponent, reactive } from 'vue';

  import BkTagInput from '@bkui-vue/tag-input';
  export default defineComponent({
    components: {
      BkTagInput,
    },
    setup() {
      const state = reactive({
        tags: ['shenzhen'],
        list: [
          { id: 'shenzhen', name: 'Shenzhen' },
          { id: 'guangzhou', name: 'Guangzhou' },
          { id: 'beijing', name: 'Beijing' },
          { id: 'shanghai', name: 'Shanghai' },
          { id: 'hangzhou', name: 'Hangzhou' },
          { id: 'nanjing', name: 'Nanjing' },
          { id: 'chongqing', name: 'Chongqing' },
          { id: 'taibei', name: 'Taibei' },
          { id: 'haikou', name: 'Haikou' },
        ],
      });

      return {
        state,
      };
    },
  });
</script>

