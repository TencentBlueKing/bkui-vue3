<template>
  <div class="row">
    <bk-table
      :columns="columns"
      :data="tableData"
      row-hover="auto"
      settings
      show-overflow-tooltip
      @dblclick="handleDblClick"
      @column-sort="handleSortBy"
      @cell-click="handleCellClick"
      @cell-dblclick="handleCellDblclick"
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
        isLoading: false,
        tableData: [...DATA_TABLE],
        columns: [...DATA_COLUMNS],
        settings: {
          fields: [{
                     label: '序号',
                     field: 'index',
                     disabled: true,
                   },
                   {
                     label: '名称/内网IP',
                     field: 'ip',
                   },
                   {
                     label: '来源',
                     field: 'source',
                   },
                   {
                     label: '创建时间',
                     field: 'create_time',
                   }],
          checked: ['ip', 'index'],
        },
      };
    },
    methods: {
      handleCellClick(arg) {
        const { cell, row, column } = arg;
        console.log('handleCellClick', cell, row, column, cell.getValue());
      },
      handleCellDblclick(arg) {
        const { cell, row, column } = arg;
        console.log('handleCellDblclick', cell, row, column, cell.getValue());
      },
      handleSortBy(arg) {
        console.log('handleSortBy', arg);
      },
      handleDblClick(...args) {
        console.log(args);
      },
    },
  });
</script>
<style scoped>
.row {
  display: flex;
  width: 100%;
}

.cell {
  flex: 1;
  margin: 0 5px 0 5px;
}
</style>
