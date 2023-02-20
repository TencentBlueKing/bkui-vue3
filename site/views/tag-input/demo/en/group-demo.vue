<template>
  <bk-tag-input
    v-model="state.tags"
    :placeholder="'Please select'"
    use-group
    trigger="focus"
    :list="state.list"
  />
</template>

<script>
  import { defineComponent, reactive } from 'vue';

  export default defineComponent({
    setup() {
      const state = reactive({
        tags: [],
        list: [
          {
            id: '1',
            name: 'Central China',
            children: [
              { id: '1-1', name: 'Henan Province' },
              { id: '1-2', name: 'Hubei Province' },
              { id: '1-3', name: 'Hunan Province' },
            ],
          },
          {
            id: '2',
            name: 'North China',
            children: [
              { id: '2-1', name: 'Beijing City' },
              { id: '2-2', name: 'Tianjin City' },
              { id: '2-3', name: 'Hebei City' },
            ],
          },
          {
            id: '3',
            name: 'South China',
            children: [
              { id: '3-1', name: 'Guangdong Province' },
              { id: '3-2', name: 'Hainan Province' },
            ],
          },
        ],
      });

      return {
        state,
      };
    },
  });
</script>
