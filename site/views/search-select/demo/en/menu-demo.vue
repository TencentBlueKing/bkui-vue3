<template>
  <bk-search-select
    v-model="value"
    :data="data"
  >
    <template #menu="{item}">
      <div>{{ item.name + '-- hello' }}</div>
    </template>
  </bk-search-select>
</template>

<script>
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    setup() {
      const data = [
        {
          name: 'Instance status',
          id: '1',
          multiple: true,
          placeholder: 'Please select/Please enter',
          noValidate: true,
          children: [
            {
              name: 'Creating',
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
          placeholder: 'Input format is XXX',
          noValidate: false,
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
      ];
      const value = ref([]);

      return {
        data,
        value,
      };
    },
  });
</script>
