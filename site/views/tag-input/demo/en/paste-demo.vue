<template>
  <div>
    <bk-tag-input
      v-model="state.tags"
      :placeholder="'Please select city'"
      :paste-fn="pasteFn"
      :list="state.list"
    />
    <p>Copy content to experience the effect of pasting multiple inputs</p>
  </div>
</template>

<script>
  import { defineComponent, reactive } from 'vue';

  export default defineComponent({
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
      const pasteFn = value => value.split('|').map(tag => ({ id: tag, name: tag }));

      return {
        state,
        pasteFn,
      };
    },
  });
</script>
