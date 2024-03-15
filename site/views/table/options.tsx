/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition):
 *
 * ---------------------------------------------------
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

// import BtnDemo from './btn-demo.vue';
export const DATA_TABLE = [
  {
    ip: '192.168.0.1-2018-05-25 15:02:241',
    source: 'QQ',
    status: '创建中',
    create_time: '2018-05-25 15:02:241',
    selected: false,
    priority: 1,
    percent: '15%',
    children: [
      {
        ip: '192.168.0.2',
        source: '微信',
        status: '正常',
        create_time: '2018-05-25 15:02:242',
        selected: false,
      },
      {
        ip: '192.168.0.3',
        source: 'QQ',
        status: '创建中',
        create_time: '2018-05-25 15:02:243',
        selected: false,
      },
      {
        ip: '192.168.0.3',
        source: 'QQ',
        status: '创建中',
        create_time: '2018-05-25 15:02:244',
        selected: true,
      },
    ],
  },
  {
    ip: '192.168.0.2',
    source: '微信',
    status: '正常',
    priority: 3,
    create_time: '2018-05-25 15:02:242',
    selected: false,
    percent: '10.01%',
  },
  {
    ip: '192.168.0.3',
    source: 'QQ',
    status: '创建中',
    priority: 2,
    create_time: '2018-05-25 15:02:243',
    selected: false,
    percent: '50%',
  },
  {
    ip: '192.168.0.3',
    source: 'QQ',
    status: '创建中',
    priority: 6,
    create_time: '2018-05-25 15:02:244',
    selected: true,
    percent: '1%',
  },
  {
    ip: '192.168.0.3',
    source: 'QQ',
    status: '创建中',
    priority: 5,
    create_time: '2018-05-25 15:02:24',
    selected: false,
    percent: '0.1%',
  },
];

/**
 * DATA_COLUMNS
 *
 *
 *
 */
export const DATA_COLUMNS = [
  {
    label: '序号',
    type: 'index',
    width: 50,
    minWidth: 80,
    sort: {
      value: 'desc',
    },
    className: () => 'custom-class',
  },
  {
    label: '名称/内网IP',
    field: 'ip',
    width: 100,
    showOverflowTooltip: {
      disabled: false,
      showHead: true,
    },
    sort: true,
    explain: {
      content: '当表格中的字段或数据需要做解释说明时，可增加 [下划线] 提示，hover 可查看解释说明的 tooltips',
      head: 'Head当表格中的字段或数据需要做解释说明时，可增加 [下划线] 提示，hover 可查看解释说明的 tooltips',
    },
  },
  {
    label: '来源',
    field: 'source',
    width: 80,
    filter: {
      list: new Array(20).fill('').map((_, index) => ({ text: `${index}_QQ`, value: `${index}_QQ` })),
      checked: ['QQ'],
    },
  },
  {
    label: '创建时间',
    field: 'create_time',
    sort: 'custom',
  },
  {
    label: '优先级',
    field: 'priority',
    sort: true,
  },
  {
    label: '完成度',
    field: 'percent',
    sort: true,
  },
  {
    label: (column, index) => `状态-${index}-${column.field}`,
    field: 'status',
    render: ({ row }) => `${row.status}-${row.msg}`,
    sort: true,
  },
];

/**
 * DATA_COLUMNS
 *
 *
 */
export const DATA_COLUMNS2 = [
  ...DATA_COLUMNS,
  {
    label: '创建时间2',
    field: 'create_time',
    sort: 'custom',
    filter: true,
  },
  {
    label: '创建时间3',
    field: 'create_time',
    sort: 'custom',
    filter: true,
  },
  {
    label: '创建时间4',
    field: 'create_time',
    sort: 'custom',
  },
  {
    label: '创建时间5',
    field: 'create_time',
    sort: 'custom',
  },
  {
    label: '创建时间6',
    field: 'create_time',
    sort: 'custom',
  },
  {
    label: '创建时间7',
    field: 'create_time',
    sort: 'custom',
  },
  {
    label: (column, index) => `状态-${index}-${column.field}`,
    field: 'status',
    sort: true,
  },
];

/**
 * DATA_COLUMNS
 *
 *
 */
export const DATA_COLUMNS1 = [...DATA_COLUMNS2];

/**
 * DATA_COLUMNS
 *
 *
 */
export const DATA_EXPAND_COLUMNS = [
  {
    type: 'expand',
    width: 140,
    minWidth: 30,
  },
  ...DATA_COLUMNS,
];

/**
 * DATA_COLUMNS
 *
 *
 */
export const DATA_FIX_TABLE = [
  ...new Array(100).fill('').map((_, index) => ({
    ip: `192.168.0.${index} 192.168.${index}.255 ${index}.168.255.255 192.${index}.0.255`,
    source: `source ${index}`,
    status: '创建中',
    create_by: `user ${index}`,
    create_time: `2018-05-25 15:02:${index}`,
    update_time: `2018-05-25 15:02:${index}`,
  })),
];

/**
 * DATA_COLUMNS
 *
 *
 */
export const DATA_FIX_COLUMNS = [
  {
    type: 'selection',
    width: 20,
    minWidth: 20,
    fixed: true,
    showOverflowTooltip: {
      mode: 'static',
      content: (_column, _row) => 'xxx_uuu',
      disabled: (_column, _row) => false,
    },
  },
  {
    label: '序号',
    type: 'index',
    sort: true,
    width: 100,
    fixed: true,
  },
  {
    label: '名称/内网IP',
    field: 'ip',
    minWidth: 400,
    fixed: true,
  },
  {
    label: '来源',
    field: 'source',
    filter: true,
    minWidth: 280,
  },
  {
    label: '创建者',
    field: 'create_by',
    width: 280,
  },
  {
    label: '更新时间',
    field: 'create_time',
    width: 280,
  },
  {
    label: '状态',
    field: 'status',
    width: 180,
    fixed: 'right',
  },
  {
    label: '操作',
    render: ({ data }) => <bk-input v-model={data.status}></bk-input>,
    width: 180,
    fixed: 'right',
  },
];

/**
 * DATA_COLUMNS
 *
 *
 */
export const DATE_COL_SPAN = [
  {
    label: '序号',
    type: 'index',
    sort: {
      value: 'asc',
    },
    width: 50,
    minWidth: 80,
  },
  {
    label: '名称/内网IP',
    field: 'ip',
    width: 100,
    colspan: 2,
    showOverflowTooltip: {
      mode: 'auto',
    },
  },
  {
    label: '来源',
    field: 'source',
    width: 80,
    filter: {
      list: [
        { text: 'Resolving deltas: 100% (16/16), completed with 15 local objects', value: 'QQ' },
        { text: 'create mode 100644 site/views/search-select/value-behavior.vue', value: '微信' },
        { text: 'Writing objects: 100% (19/19), 2.19 KiB | 1.09 MiB/s, done.', value: 'Email' },
      ],
    },
  },
  {
    label: '创建时间',
    field: 'create_time',
    rowspan: 3,
    sort: 'custom',
  },
  {
    label: (column, index) => `状态-${index}-${column.field}`,
    field: 'status',
    sort: true,
  },
];
