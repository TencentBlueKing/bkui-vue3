<template>
  <bk-search-select
    v-model="value"
    :placeholder="'Please select'"
    :data="data"
    value-behavior="need-key"
  />
</template>

<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const data = ref([
        {
          name: 'Instance status',
          id: '1',
          multiple: true,
          children: [
            {
              name: 'Redis is being created',
              id: '1-2',
            },
            {
              name: 'In operation',
              id: '1-3',
              disabled: false,
            },
            {
              name: 'Shutdown',
              id: '1-4',
            },
          ],
        },
        {
          name: 'Instance business',
          id: '2',
          children: [
            {
              name: 'Glory of Kings',
              id: '2-1',
              disabled: false,
            },
            {
              name: 'Stimulate the battlefield',
              id: '2-2',
            },
            {
              name: 'Survival of the Jedi',
              id: '2-3',
            },
          ],
        },
        {
          name: 'IP address',
          id: '3',
          disabled: true,
        },
      ]);
      const value = ref([]);

      return {
        data,
        value,
      };
    },
  });
</script>
