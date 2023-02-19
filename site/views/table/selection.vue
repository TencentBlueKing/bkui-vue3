<template>
  <bk-table
    :data="tableData"
    :is-row-select-enable="isRowSelectEnable"
    :empty-text="t('暂无数据')"
  >
    <bk-table-column
      type="selection"
      sort
      :width="100"
    />
    <bk-table-column
      :label="t('名称/内网IP')"
      field="ip"
    />
    <bk-table-column
      :label="t('来源')"
      field="source"
    />
    <bk-table-column
      :label="t('创建时间')"
      field="create_time"
    />
  </bk-table>
</template>

<script>
  import { defineComponent, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import { DATA_TABLE } from './options';
  const DATA_ROWS = DATA_TABLE.map(item => ({
    ...item,
  }));
  export default defineComponent({
    components: {},
    setup() {
      const { t } = useI18n();
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
        t,
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
