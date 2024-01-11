<template>
  <div class="row">
    <bk-table
      :columns="columns"
      :data="tableData"
      :settings="settings"
      stripe
    >
      <template #setting>
        <h1>Setting Content Slot</h1>
      </template>
    </bk-table>
  </div>
</template>

<script lang="jsx">
  import { defineComponent } from 'vue';

  import { DATA_COLUMNS, DATA_TABLE } from './options';
  const columns = [...DATA_COLUMNS];

  export default defineComponent({
    components: {},
    data() {
      return {
        maxHeight: 300,
        isLoading: false,
        tableData: DATA_TABLE,
        columns,
        overflowTooltip: {
          popoverOption: {
            maxWidth: 400,
          },
        },
        settings: {
          trigger: 'click',
          fields: [
            {
              name: '序号',
              id: 'index',
              disabled: true,
            },
            {
              name: '名称/内网IP',
              id: 'ip',
            },
            {
              name: '来源',
              id: 'source',
            },
            {
              name: '创建时间',
              id: 'create_time',
            },
          ],
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
      handleMouseEnter(...args) {
        console.log('mouse-enter', args);
      },
      handleMouseLeave(...args) {
        console.log('mouse-leave', args);
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
