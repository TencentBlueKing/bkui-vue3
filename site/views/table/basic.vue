<template>
  <div class="row">
    <bk-table
      :columns="columns"
      :data="tableData"
      :settings="settings"
      :max-height="maxHeight"
      :show-overflow-tooltip="overflowTooltip"
      stripe
      @dblclick="handleDblClick"
      @column-sort="handleSortBy"
      @cell-click="handleCellClick"
      @cell-dblclick="handleCellDblclick"
      @row-mouse-enter="handleMouseEnter"
      @row-mouse-leave="handleMouseLeave"
    >
      <template #setting>
        <h1>Setting Content Slot</h1>
      </template>
    </bk-table>
  </div>
</template>

<script lang="jsx">
  import { random } from 'lodash';
  import { defineComponent } from 'vue';

  import { DATA_COLUMNS, DATA_TABLE, DATA_FIX_TABLE } from './options';
  export default defineComponent({
    components: {},
    data() {
      return {
        maxHeight: 300,
        isLoading: false,
        tableData: DATA_FIX_TABLE.map((d, index) => Object.assign({}, d, { msg: index * random(0, 20, true) })),
        columns: [...DATA_COLUMNS],
        overflowTooltip: {
          popoverOption: {
            maxWidth: 400
          }
        },
        settings: {
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
