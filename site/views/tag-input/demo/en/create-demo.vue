<template>
  <bk-tag-input
    v-model="state.tags"
    :placeholder="'Please select city'"
    allow-create
    has-delete-icon
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
