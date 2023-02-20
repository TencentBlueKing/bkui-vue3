<template>
  <bk-table
    :data="tableData"
    :is-row-select-enable="isRowSelectEnable"
    :empty-text="'No data'"
  >
    <bk-table-column
      type="selection"
      sort
      :width="100"
    />
    <bk-table-column
      :label="'Name/Intranet IP'"
      field="ip"
    />
    <bk-table-column
      :label="'Source'"
      field="source"
    />
    <bk-table-column
      :label="'Create time'"
      field="create_time"
    />
  </bk-table>
</template>

<script>
  import { defineComponent, reactive, ref } from 'vue';

  import { DATA_TABLE } from '../../options';
  const DATA_ROWS = DATA_TABLE.map(item => ({
    ...item,
  }));
  export default defineComponent({
    components: {},
    setup() {
      const tableData = ref([...DATA_ROWS]);
      const pagination = reactive({ count: DATA_ROWS.length, limit: 10 });

      const handleSortBy = (arg) => {
        console.log('handleSortBy', arg);
      };

      const handleDblClick = (...args) => {
        console.log(args);
      };

      const isRowSelectEnable = ({ index, isCheckAll }) => {
        if (isCheckAll) {
          return true;
        }
        return index % 3;
      };

      return {
        tableData,
        pagination,
        handleSortBy,
        handleDblClick,
        isRowSelectEnable,
      };
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
