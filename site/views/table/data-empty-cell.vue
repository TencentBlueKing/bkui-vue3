<template>
  <div class="row">
    <bk-table
      :columns="columns"
      :data="tableData"
      :settings="settings"
      :show-overflow-tooltip="overflowTooltip"
      empty-cell-text="--"
      stripe
      @dblclick="handleDblClick"
      @column-sort="handleSortBy"
      @cell-click="handleCellClick"
      @cell-dblclick="handleCellDblclick"
      @row-mouse-enter="handleMouseEnter"
      @row-mouse-leave="handleMouseLeave"
    />
  </div>
</template>

<script lang="jsx">
  import { defineComponent } from 'vue';

  import { DATA_COLUMNS } from './options';
  const DATA_TABLE = [
    {
      ip: '192.168.0.1-2018-05-25 15:02:241',
      source: false,
      status: '创建中',
      create_time: '2018-05-25 15:02:241',
    },
    {
      ip: '192.168.0.2',
      source: null,
      status: '正常',
      create_time: undefined,
      selected: false,
    },
    {
      ip: '192.168.0.3',
      source: 'QQ',
      status: '',
      create_time: '2018-05-25 15:02:243',
      selected: null,
    },
    {
      ip: '192.168.0.3',
      source: 0,
      status: '',
      create_time: '2018-05-25 15:02:244',
      selected: true,
    },
    {
      ip: '192.168.0.3',
      source: 'QQ',
      status: '创建中',
      create_time: '2018-05-25 15:02:24',
      selected: false,
    },
  ];
  export default defineComponent({
    components: {},
    data() {
      return {
        isLoading: false,
        tableData: DATA_TABLE,
        columns: [...DATA_COLUMNS],
        overflowTooltip: {
          popoverOption: {
            maxWidth: 400,
          },
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
