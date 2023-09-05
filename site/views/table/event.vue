<template>
  <div style=" width: 100%;height: 300px;">
    <bk-table
      :columns="columns"
      :data="tableData"
      @row-click="handleRowClick"
      @select="handleRowSelect"
    />
    <span>on row click: {{ `index: ${ activeRowInfo.index }` }}</span>
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
        activeRowInfo: {},
      };
    },
    methods: {
      handleRowSelect(arg) {
        console.log('handleRowSelect', arg);
      },
      handleRowClick(e, row, index, rows, source) {
        Object.assign(this.activeRowInfo, { e, row, index, rows, source });
        console.log('active row', this.activeRowInfo);
      },
    },
  });
</script>
