<template>
  <div class="row">
    <bk-table
      :columns="columns"
      :data="tableData"
      row-hover="ato"
      settings
      show-overflow-tooltip
      :empty-text="emptyText"
      @dblclick="handleDblClick"
      @column-sort="handleSortBy"
    />
  </div>
</template>

<script>
  import { defineComponent, reactive, ref } from 'vue';

  import { DATA_TABLE, DATE_COL_SPAN } from '../../options';
  export default defineComponent({
    components: {},
    setup() {
      const emptyText = ref('暂无数据');
      const settings = reactive({
        fields: [
          {
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
          },
        ],
        checked: ['ip', 'index'],
      });

      const handleSortBy = (arg) => {
        console.log('handleSortBy', arg);
      };

      const handleDblClick = (...args) => {
        console.log(args);
      };

      return {
        emptyText,
        settings,
        tableData: [...DATA_TABLE],
        columns: [...DATE_COL_SPAN],
        handleSortBy,
        handleDblClick,
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
