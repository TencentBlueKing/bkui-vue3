<template>
  <div style=" width: 100%;height: 300px;">
    <bk-table
      :columns="columns"
      :data="tableData"
      :empty-text="'暂无数据'"
      @row-click="handleRowClick"
    />
    <span>on row click: {{ `index: ${ activeRowInfo.index }` }}</span>
  </div>
</template>

<script>
  import { defineComponent, reactive } from 'vue';

  import { DATA_COLUMNS, DATA_TABLE } from '../../options';
  export default defineComponent({
    components: {},
    setup() {
      const activeRowInfo = reactive({});

      const handleRowClick = (e, row, index, rows, source) => {
        Object.assign(activeRowInfo, { e, row, index, rows, source });
        console.log('active row', activeRowInfo);
      };

      return {
        tableData: [...DATA_TABLE],
        columns: [...DATA_COLUMNS],
        activeRowInfo,
        handleRowClick,
      };
    },
  });
</script>
