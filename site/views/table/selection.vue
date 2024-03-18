<template>
  <bk-table
    ref="refTable"
    :data="tableData"
    :checked="checked"
    :is-row-select-enable="isRowSelectEnable"
    @selection-change="handleSelectionChange"
    @select-all="handleSelectAll"
  >
    <bk-table-column
      type="selection"
      sort
      :width="100"
    />
    <bk-table-column
      label="名称/内网IP"
      field="ip"
    />
    <bk-table-column
      label="来源"
      field="source"
    />
    <bk-table-column
      label="创建时间"
      field="create_time"
    />
  </bk-table>
</template>

<script>
  import { defineComponent } from 'vue';

  import { DATA_TABLE } from './options';
  const DATA_ROWS = DATA_TABLE
    .map(item => ({
      ...item,
    }));
  export default defineComponent({
    components: {},
    data() {
      return {
        tableData: DATA_ROWS,
        checked: DATA_ROWS,
        pagination: { count: DATA_ROWS.length, limit: 10 },
      };
    },

    methods: {
      handleTableRowToggle() {
        this.$refs.refTable.toggleRowSelection(this.tableData[1]);
      },
      handleSelectAll(args) {
        console.log('handleSelectAll', args);
      },
      handleSelectionChange(val) {
        console.log('handleSelectionChange', val);
      },
      handleSortBy(arg) {
        console.log('handleSortBy', arg);
      },
      handleDblClick(...args) {
        console.log(args);
      },
      isRowSelectEnable({ index, isCheckAll }) {
        if (isCheckAll) {
          return true;
        }
        return index % 3;
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
