<template>
  <bk-search-select
    v-model="value"
    :data="data"
    :validate-values="validateValues"
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
          conditions: [
            {
              name: '>',
              id: '>',
            },
            {
              name: '>=',
              id: '>=',
            },
            {
              name: '<=',
              id: '<=',
            },
            {
              name: '<',
              id: '<',
            },
            {
              name: '=',
              id: '=',
            },
          ],
        },
        {
          name: 'IP address',
          id: '3',
          disabled: true,
        },
        {
          name: 'Instance name',
          id: '4',
        },
        {
          name: 'Instance address',
          id: '5',
        },
        {
          name: 'Test VI',
          id: '6',
        },
      ]);
      const value = ref([]);

      const validateValues = async (item, values) => {
        console.info(item, values);
        return !item ? 'Format error' : true;
      };

      return {
        data,
        value,
        validateValues,
      };
    },
  });
</script>
