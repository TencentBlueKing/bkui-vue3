<template>
  <div style=" width: 100%;height: 300px">
    <bk-table
      :columns="columns"
      :data="tableData"
      :settings="{
        fields: [
          { name: 'Lucas Campbell', value: 'Lucas Campbell' },
          { name: 'Joel Cummings', value: 'Joel Cummings' },
          { name: 'Seth Palmer', value: 'Seth Palmer' }
        ],
        checked: [],
        limit: 2,
        size: 'default',
      }"
      @dblclick="handleDblClick"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  import { DATA_COLUMNS, DATA_TABLE } from './options';
  export default defineComponent({
    components: {},
    data() {
      return {
        tableData: [...DATA_TABLE],
        columns: [...DATA_COLUMNS],
      };
    },
    methods: {
      handleDblClick(...args) {
        console.log(args);
      },
    },
  });
</script>
