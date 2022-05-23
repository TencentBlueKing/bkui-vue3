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
export const DATA_TABLE = [
  {
    ip: 'from ip: 192.168.0.1',
    source: 'QQ',
    status: '创建中',
    create_time: '2018-05-25 15:02:241',
  },
  {
    ip: '192.168.0.2',
    source: '微信',
    status: '正常',
    create_time: '2018-05-25 15:02:242',

  },
  {
    ip: '192.168.0.3',
    source: 'QQ',
    status: '创建中',
    create_time: '2018-05-25 15:02:243',
  },
  {
    ip: '192.168.0.3',
    source: 'QQ',
    status: '创建中',
    create_time: '2018-05-25 15:02:244',
  },
  {
    ip: '192.168.0.3',
    source: 'QQ',
    status: '创建中',
    create_time: '2018-05-25 15:02:24',
  },
];

export const DATA_COLUMNS = [
  {
    label: '序号',
    type: 'index',
    sort: true,
    width: 50,
    minWidth: 80,
  },
  {
    label: '名称/内网IP',
    field: 'ip',
    width: 100,
  },
  {
    label: '来源',
    field: 'source',
    width: 80,
    filter: {
      list: [{ text: 'QQ', value: 'QQ' }, { text: '微信', value: '微信' }, { text: 'Email', value: 'Email' }],
    },
  },
  {
    label: '创建时间',
    field: 'create_time',
    sort: 'custom',
  },
  {
    label: (column, index) => `状态-${index}-${column.field}`,
    field: 'status',
    sort: true,
  },
];

export const DATA_FIX_TABLE = [
  ...(new Array(10).fill('')
    .map((_, index) => ({
      ip: `192.168.0.${index} 192.168.${index}.255 ${index}.168.255.255 192.${index}.0.255`,
      source: `source ${index}`,
      status: '创建中',
      create_by: `user ${index}`,
      create_time: `2018-05-25 15:02:${index}`,
      update_time: `2018-05-25 15:02:${index}`,
    }))),
];

export const DATA_FIX_COLUMNS = [
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
    width: 400,
  },
  {
    label: '来源',
    field: 'source',
    width: 280,
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
    render: () => 'OPTIONS',
    width: 180,
    fixed: 'right',
  },
];
