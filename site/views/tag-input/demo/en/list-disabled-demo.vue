<template>
  <bk-tag-input
    v-model="state.tags"
    :placeholder="'Please select city'"
    trigger="focus"
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
          { id: 'shenzhen', name: 'Shenzhen' },
          { id: 'guangzhou', name: 'Guangzhou' },
          { id: 'beijing', name: 'Beijing' },
          { id: 'shanghai', name: 'Shanghai', disabled: true },
          { id: 'hangzhou', name: 'Hangzhou' },
          { id: 'nanjing', name: 'Nanjing', disabled: true },
          { id: 'chongqing', name: 'Chongqing' },
          { id: 'taibei', name: 'Taibei' },
          { id: 'haikou', name: 'Haikou', disabled: true  },
        ],
      });

      return {
        state,
      };
    },
  });
</script>
