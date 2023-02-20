<template>
  <div>
    <bk-tag-input
      v-model="state.tags"
      :placeholder="'Please select city'"
      :list="state.list"
    />
    <p>Please enter "State" to experience the search effect</p>
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
