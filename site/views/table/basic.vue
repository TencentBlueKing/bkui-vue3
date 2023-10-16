<template>
  <div class="row">
    <bk-table
      :columns="tableColumn"
      :data="tableData"
      :settings="settings"
      :max-height="maxHeight"
      stripe
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
      tableData: [],
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
          },
        ],
        checked: ['ip', 'index'],
      },
    };
  },
  computed: {
    tableColumn() {
      return [
        {
          label: () => ('风险ID'),
          field: () => 'risk_id',
          width: 200,
          fixed: true,
          minWidth: 180,
          render: ({ data }) => {
            const to = {
              name: 'handleManageDetail',
              params: {
                riskId: data.risk_id,
              },
            };
            return (
              <router-link to={to}>
                {data.risk_id}
              </router-link>
            );
          },
        },
        {
          label: () => ('风险描述'),
          field: () => 'event_content',
          minWidth: 320,
          render: ({ data }) => data.event_content,
        },
        {
          label: () => ('风险标签'),
          field: () => 'tags',
          minWidth: 200,
          render: ({ data }) => {
            const tags = data.tags.map(item => strategyTagMap.value[item] || item);
            return <div>{data.strategy_id}</div>;
          },
        },
        {
          label: () => ('责任人'),
          field: () => 'operator',
          minWidth: 148,
          render: ({ data }) => <div>{data.operator}</div>,
        },
        {
          label: () => ('处理状态'),
          field: () => 'status',
          minWidth: 148,
          render: ({ data }) =>
            data.status === 'closed' && data.experiences > 0 ? (
              <div style='display: flex;align-items: center;height: 100%;'>
                <bk-tag theme={statusToMap[data.status].tag}>
                  <p style='display: flex;align-items: center;'>
                  </p>
                </bk-tag>
                <bk-button
                  text
                  theme='primary'
                >

                </bk-button>
              </div>
            ) : (
              <bk-tag theme={statusToMap[data.status].tag}>
                <p style='display: flex;align-items: center;'>

                </p>
              </bk-tag>
            ),
        },
        {
          label: () => ('当前处理人'),
          field: () => 'current_operator',
          minWidth: 148,
          render: ({ data }) => <div>{data.current_operator}</div>,
        },
        {
          label: () => ('风险标记'),
          field: () => 'risk_label',
          minWidth: 100,
          render: ({ data }) => (
            <span
              class={{
                misreport: data.risk_label === 'misreport',
                'risk-label-status': true,
              }}
            >
              {data.risk_label === 'normal' ? ('正常') : ('误报')}
            </span>
          ),
        },
        {
          label: () => ('首次发现时间'),
          field: () => 'event_time',
          sort: 'custom',
          width: 168,
          minWidth: 168,
        },
        {
          label: () => ('风险命中策略(ID)'),
          field: () => 'strategy_id',
          minWidth: 200,
          render: ({ data }) => {
            return <span>--</span>;
          },
        },
        {
          label: () => ('通知人员'),
          field: () => 'notice_users',
          minWidth: 160,
          render: ({ data }) => <div>{data.notice_users}</div>,
        },
        {
          label: () => ('最后一次处理时间'),
          field: () => 'last_operate_time',
          // sort: 'custom',
          minWidth: 168,
          render: ({ data }) => data.last_operate_time || '--',
        },
        {
          label: () => ('操作'),
          width: 148,
          fixed: 'right',
          render: ({ data }) => (
            <p>

            </p>
          ),
        },
      ];
    },
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
