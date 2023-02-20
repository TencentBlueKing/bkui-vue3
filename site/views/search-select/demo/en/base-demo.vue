<template>
  <bk-search-select
    v-model="value"
    :data="data"
    unique-select
    :value-split-code="'+'"
  />
</template>

<script>
  import { defineComponent, ref, shallowRef } from 'vue';

  export default defineComponent({
    setup() {
      const data = shallowRef([
        {
          name: 'Instance status',
          id: '1',
          multiple: true,
          placeholder: 'Required',
          async: true,
          validate: true,
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
        {
          name: 'testestset',
          id: '4',
        },
      ]);
      const value = ref([
        {
          id: '1',
          name: 'Instance status',
          values: [{
            name: 'Creating',
            id: '1-2',
          }],
        },
      ]);

      return {
        data,
        value,
      };
    },
  });
</script>
