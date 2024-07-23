<template>
  <bk-table ref="refTable" pagination :data="tableData" :border="['outer']" :is-row-select-enable="isRowSelectEnable">
    <bk-table-column :width="100" type="selection" sort />
    <bk-table-column field="ip" label="名称/内网IP" />
    <bk-table-column field="source" label="来源" />
    <bk-table-column field="create_time" label="创建时间" />
  </bk-table>
</template>

<script>
import { defineComponent } from 'vue';

import { DATA_TABLE } from './options';
const DATA_ROWS = DATA_TABLE.map((item) => ({
  ...item,
}));
export default defineComponent({
  components: {},
  data() {
    return {
      activeIndex: [1, 2],
      tableData: DATA_ROWS,
      checked: DATA_ROWS,
      pagination: { count: DATA_ROWS.length, limit: 10 },
    };
  },

  methods: {
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
