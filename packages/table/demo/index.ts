/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
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

import { IComponentWiki, NavGroupMeta } from '@bkui-vue/shared';

import emits from './emits';
import props from './props';
import slots from './slots';
import types from './types';

const data = [
  {
    name: '张三',
    age: 25,
    address: '北京市朝阳区某个很长的地址',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    status: '在职',
    createTime: '2021-01-01',
  },
  {
    name: '李四',
    age: 30,
    address: '上海市浦东新区某个很长的地址',
    phone: '13800138001',
    email: 'lisi@example.com',
    status: '离职',
    createTime: '2021-01-01',
    updateTime: '2021-01-01',
  },
  {
    name: '王五',
    age: 28,
    address: '广州市天河区某个很长的地址',
    phone: '13800138002',
    email: 'wangwu@example.com',
    status: '在职',
    createTime: '2021-01-01',
    updateTime: '2021-01-01',
  },
  {
    name: '赵六',
    age: 28,
    address: '广州市天河区某个很长的地址',
    phone: '13800138003',
    email: 'wangwu@example.com',
    status: '离职',
    createTime: '2021-01-01',
    updateTime: '2021-01-01',
  },
  {
    name: '孙七',
    age: 28,
    address: '广州市天河区某个很长的地址',
    phone: '13800138004',
    email: 'wangwu@example.com',
    status: '在职',
    createTime: '2021-01-01',
    updateTime: '2021-01-01',
  },
  {
    name: '周八',
    age: 28,
    address: '广州市天河区某个很长的地址',
    phone: '13800138005',
    email: 'wangwu@example.com',
    status: '离职',
    createTime: '2021-01-01',
    updateTime: '2021-01-01',
  },
  {
    name: '吴九',
    age: 28,
    address: '广州市天河区某个很长的地址',
    phone: '13800138006',
    email: 'wangwu@example.com',
    status: '在职',
    createTime: '2021-01-01',
    updateTime: '2021-01-01',
  },
  {
    name: '郑十',
    age: 28,
    address: '广州市天河区某个很长的地址',
    phone: '13800138007',
    email: 'wangwu@example.com',
    status: '离职',
    createTime: '2021-01-01',
    updateTime: '2021-01-01',
  },
  {
    name: '陈十一',
    age: 28,
    address: '广州市天河区某个很长的地址',
    phone: '13800138008',
    email: 'wangwu@example.com',
    status: '在职',
    createTime: '2021-01-01',
    updateTime: '2021-01-01',
  },
  {
    name: '郑十一',
    age: 28,
    address: '广州市天河区某个很长的地址',
    phone: '13800138009',
    email: 'wangwu@example.com',
    status: '离职',
    createTime: '2021-01-01',
    updateTime: '2021-01-01',
  },
  {
    name: '郑十二',
    age: 28,
    address: '广州市天河区某个很长的地址',
    phone: '13800138010',
    email: 'wangwu@example.com',
    status: '在职',
  },
  {
    name: '郑十三',
    age: 28,
    address: '广州市天河区某个很长的地址',
    phone: '13800138011',
    email: 'wangwu@example.com',
    status: '离职',
  },
];

const data2 = [
  {
    groupId: 1,
    groupName: '11',
    groupDesc: '用户描述1',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: true,
  },
  {
    groupId: 2,
    groupName: '22',
    groupDesc: '用户描述2',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: false,
  },
  {
    groupId: 3,
    groupName: '33',
    groupDesc: '用户描述3',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: false,
  },
  {
    groupId: 4,
    groupName: '44',
    groupDesc: '用户描述4',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: false,
  },
  {
    groupId: 5,
    groupName: '55',
    groupDesc: '用户描述5',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: false,
  },
  {
    groupId: 6,
    groupName: '66',
    groupDesc: '用户描述6',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: false,
  },
  {
    groupId: 7,
    groupName: '77',
    groupDesc: '用户描述7',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: false,
  },
  {
    groupId: 8,
    groupName: '88',
    groupDesc: '用户描述8',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: false,
  },
  {
    groupId: 9,
    groupName: '99',
    groupDesc: '用户描述9',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: false,
  },
  {
    groupId: 10,
    groupName: '1010',
    groupDesc: '用户描述10',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: false,
  },
  {
    groupId: 11,
    groupName: '1111',
    groupDesc: '用户描述11',
    validityPeriod: '0505',
    joinedTime: '08-18',
    operateSource: '加入组',
    operator: '张三',
    removeMemberButtonControl: false,
  },
];

const data3 = [
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
    ip: '192.168.0.26',
    source: '微信',
    status: '正常',
    priority: 3,
    create_time: '2018-05-25 15:02:242',
    selected: false,
    percent: '10.01%',
  },
  {
    ip: '192.168.0.37',
    source: 'QQ',
    status: '创建中',
    priority: 2,
    create_time: '2018-05-25 15:02:243',
    selected: false,
    percent: '50%',
  },
  {
    ip: '192.168.0.38',
    source: 'QQ',
    status: '创建中',
    priority: 6,
    create_time: '2018-05-25 15:02:244',
    selected: true,
    percent: '1%',
  },
  {
    ip: '192.168.0.39',
    source: 'QQ',
    status: '创建中',
    priority: 5,
    create_time: '2018-05-25 15:02:24',
    selected: false,
    percent: '0.1%',
  },
];

// 组件示例
const presets = [
  {
    title: '基础用法',
    description: '通用基础样式满足简单表格场景',
    props: {
      data: data,
      border: 'none',
    },
    slots: {
      default: `
        <bk-table-column fixed="left" min-width="100" label="姓名" field="name" />
        <bk-table-column min-width="100" label="年龄" field="age" />
        <bk-table-column min-width="250" label="地址" field="address" />
        <bk-table-column min-width="200" label="电话" field="phone" />
        <bk-table-column min-width="200" label="邮箱" field="email" />
        <bk-table-column min-width="100" label="状态" field="status" />
        <bk-table-column min-width="100" label="创建时间" field="createTime" />
        <bk-table-column min-width="100" label="更新时间" field="updateTime" />
        <bk-table-column fixed="right" min-width="100" label="操作">
          <template #default="{}">
            <bk-button text theme="primary">Option</bk-button>
          </template>
        </bk-table-column>
      `,
    },
    dependent: {
      components: ['button'],
    },
  },
  {
    title: '斑马纹表格',
    description: '内无框线，通过斑马纹背景区分行',
    props: {
      data: data,
      stripe: true,
    },
    slots: {
      default: `
        <bk-table-column
          fixed="left"
          width="30"
          :min-width="30"
          align="center"
          type="selection"
        />
        <bk-table-column min-width="100" label="姓名" field="name" />
        <bk-table-column min-width="100" label="年龄" field="age" />
        <bk-table-column min-width="250" label="地址" field="address" />
        <bk-table-column min-width="200" label="电话" field="phone" />
        <bk-table-column min-width="200" label="邮箱" field="email" />
        <bk-table-column min-width="100" label="状态" field="status" />
        <bk-table-column min-width="100" label="创建时间" field="createTime" />
        <bk-table-column min-width="100" label="更新时间" field="updateTime" />
        <bk-table-column fixed="right" min-width="100" label="操作">
          <template #default="{}">
            <bk-button text theme="primary">Option</bk-button>
          </template>
        </bk-table-column>
      `,
    },
  },
  {
    title: '多级表头: bk-table-column 模板模式 ',
    description: '多级表头，支持自定义表头',
    props: {
      data: data2,
    },
    slots: {
      default: `
        <bk-table-column
          type="index"
          label="序号"
          width="80"
        ></bk-table-column>
        <bk-table-column
          :label="() => h('span', { style: { color: 'red' } }, ['用户组'])"
          prop="groupName"
          align="center"
        >
          <bk-table-column
            label="用户描述"
            prop="groupDesc"
          />
          <bk-table-column
            label="有效期"
            prop="validityPeriod"
          >
            <template #default="{ data }">xx{{ data.validityPeriod }}</template>
          </bk-table-column>
        </bk-table-column>

        <bk-table-column
          label="加入时间"
          prop="joinedTime"
        />
      `,
    },
  },
  {
    title: '多级表头: props.columns 绑定模式',
    description: '多级表头，支持自定义表头',
    props: {
      data: data2,
      columns: [
        {
          label: '序号',
          type: 'index',
          width: 80,
        },
        {
          label: '用户组',
          children: [
            {
              label: '操作员1',
              field: 'operator',
            },
            {
              label: '操作员2',
              field: 'operator',
            },
          ],
        },
        {
          label: '用户描述',
          field: 'groupDesc',
        },
        {
          label: '有效期',
          field: 'validityPeriod',
        },
        {
          label: '加入时间',
          field: 'joinedTime',
        },
      ],
    },
  },
  {
    title: 'appendLastRow',
    description: '追加最后一行',
    props: {
      data: data2,
      columns: [
        {
          label: '序号',
          type: 'index',
          width: 80,
        },
        {
          label: '用户组',
          children: [
            {
              label: '操作员1',
              field: 'operator',
            },
            {
              label: '操作员2',
              field: 'operator',
            },
          ],
        },
        {
          label: '用户描述',
          field: 'groupDesc',
        },
        {
          label: '有效期',
          field: 'validityPeriod',
        },
        {
          label: '加入时间',
          field: 'joinedTime',
        },
      ],
      appendLastRow: {
        type: 'summary',
        cellRender: `(column, index) => {
          if (index === 0) {
            return '统计';
          }
    
          return index + 10;
        }`,
      },
    },
  },
  {
    title: '自定义Column index渲染',
    description:
      '如果需要通过<bk-table-column></bk-table-column>方式渲染列表，但是列是动态可变的，可以通过指定列的index来保证表格列的排序，一般情况组件会自动获取排序，如果是深度定制的表格组件，可以通过指定index保证排序的正确性',
    props: {
      data: data,
    },
    slots: {
      default: `
        <bk-table-column type="index" index="0" min-width="100" label="序号" field="name" />
        <bk-table-column type="index" index="2" min-width="100" label="名称/内网IP" field="ip" />
        <bk-table-column type="index" index="1" min-width="100" label="来源" field="source" />
        <bk-table-column type="index" index="3" min-width="100" label="创建时间" field="create_time" />
        <bk-table-column fixed="right" min-width="100" label="操作">
          <template #default="{}">
            <bk-button text theme="primary">Option</bk-button>
          </template>
        </bk-table-column>
      `,
    },
    dependent: {
      components: ['button'],
    },
  },
  {
    title: '设置边框',
    description: '设置边框',
    props: {
      data: data3,
      border: ['row'],
      columns: [
        {
          label: '序号',
          type: 'index',
          fixed: true,
        },
        {
          label: '名称/内网IP',
          field: 'ip',
          width: 100,
        },
        {
          label: '来源',
          field: 'source',
        },
        {
          label: '创建时间',
          field: 'create_time',
        },
        {
          label: '优先级',
          field: 'priority',
        },
        {
          label: '完成度',
          field: 'percent',
        },
        {
          label: '状态',
          field: 'status',
        },
      ],
    },
  },
  {
    title: '自定义头部',
    description: '自定义头部',
    props: {
      data: data3,
      columns: [
        {
          label: `() => {
            return '自定义头部'
          }`,
          field: 'create_time',
          sort: true,
        },
        {
          label: '来源',
          field: 'source',
          sort: true,
        },
      ],
    },
  },
  {
    title: '启用虚拟滚动-渲染大数据表格',
    description: '大数据模式启用虚拟滚动',
    props: {
      height: 500,
      virtualEnabled: true,
      data: new Array(10000).fill(0).map((_, index) => ({
        ip: `内网IP${index}`,
        source: `来源${index}`,
        create_time: `创建时间${index}`,
        status: `状态${index}`,
        priority: `优先级${index}`,
        percent: `完成度${index}`,
      })),
      columns: [
        {
          label: '序号',
          type: 'index',
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
        },
        {
          label: '创建时间',
          field: 'create_time',
        },
        {
          label: '优先级',
          field: 'priority',
        },
        {
          label: '完成度',
          field: 'percent',
        },
        {
          label: '状态',
          field: 'status',
        },
      ],
    },
  },
  {
    title: '自定义Column渲染',
    description: '自定义Column渲染',
    props: {
      data: data3,
      columns: [
        {
          label: '序号',
          type: 'index',
          fixed: true,
        },
        {
          label: '名称/内网IP',
          field: 'ip',
          width: 100,
          render: `(data) => {
            return \`自定义-内容-\${data.ip}\`;
          }`,
        },
        {
          label: '来源',
          field: 'source',
          width: 80,
        },
        {
          label: '创建时间',
          field: 'create_time',
          render: `(data) => {
            return \`自定义-内容-\${data.create_time}\`;
          }`,
        },
        {
          label: '优先级',
          field: 'priority',
        },
        {
          label: '完成度',
          field: 'percent',
          render: `(data) => {
            return \`自定义-内容-\${data.percent}\`;
          }`,
        },
        {
          label: '状态',
          field: 'status',
        },
      ],
    },
  },
  {
    title: 'table event',
    description: 'table event',
    props: {
      data: data,
      columns: [
        {
          type: 'selection',
          align: 'center',
          fixed: 'left',
          width: 50,
        },
        {
          label: '姓名',
          field: 'name',
        },
        {
          label: '年龄',
          field: 'age',
        },
        {
          label: '地址',
          field: 'address',
        },
        {
          label: '电话',
          field: 'phone',
        },
        {
          label: '邮箱',
          field: 'email',
        },
        {
          label: '状态',
          field: 'status',
        },
        {
          label: '创建时间',
          field: 'createTime',
        },
        {
          label: '更新时间',
          field: 'updateTime',
        },
      ],
    },
    events: {
      select: `(args) => {
        // args: { row: any; index: number; checked: string; data: Array<any> }
        console.log('handleSelect', args);
      }`,
      rowClick: `(e, row, index, rows) => {
        console.log('handleRowClick', e, row, index, rows);
      }`,
    },
  },
  {
    title: 'Pagination - Local',
    description: '本地分页',
    props: {
      height: 500,
      data: new Array(520).fill(0).map((_, index) => ({
        ip: `内网IP${index}`,
        source: `来源${index}`,
        create_time: `创建时间${index}`,
        status: `状态${index}`,
        priority: `优先级${index}`,
        percent: `完成度${index}`,
      })),
      pagination: {
        count: 520,
        limit: 20,
        current: 1,
      },
      columns: [
        {
          label: '序号',
          type: 'index',
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
        },
        {
          label: '创建时间',
          field: 'create_time',
        },
        {
          label: '优先级',
          field: 'priority',
        },
        {
          label: '完成度',
          field: 'percent',
        },
        {
          label: '状态',
          field: 'status',
        },
      ],
    },
  },
  {
    title: 'Pagination - Remote',
    description: '远程分页',
    props: {
      height: 500,
      remotePagination: true,
      data: new Array(20).fill('').map((_, index) => ({
        ip: `${index}--192.168.0.x`,
        source: `${index}_QQ`,
        priority: index,
        percent: index,
        status: '创建中',
        create_time: `2018-05-25 15:02:24.${index}`,
      })),
      pagination: {
        count: 100,
        limit: 20,
        current: 1,
      },
      columns: [
        {
          label: '序号',
          type: 'index',
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
        },
        {
          label: '创建时间',
          field: 'create_time',
        },
        {
          label: '优先级',
          field: 'priority',
        },
        {
          label: '完成度',
          field: 'percent',
        },
        {
          label: '状态',
          field: 'status',
        },
      ],
    },
    events: {
      pageValueChange: `(value) => {
        console.log('pagination', pagination.value);
        pagination.value.current = value;

        const start = (pagination.value.current - 1) * pagination.value.limit;
        setTimeout(() => {
          pagination.value.count = 100;
          pagination.value.current = value;
          data.value = new Array(pagination.value.limit).fill('').map((_, index) => ({
            ip: \`\${start + index}--192.168.0.x\`,
            source: \`\${start + index}_QQ\`,
            priority: \`\${start + index}\`,
            percent: \`\${start + index}\`,
            status: '创建中',
            create_time: \`2018-05-25 15:02:24.\${start + index}\`,
          }));
        }, 100);
      }`,
      pageLimitChange: `(limit) => {
        pagination.value.limit = limit;

        const start = (pagination.value.current - 1) * pagination.value.limit;
        setTimeout(() => {
          pagination.value.count = 100;
          pagination.value.current = 1;
          data.value = new Array(pagination.value.limit).fill('').map((_, index) => ({
            ip: \`\${start + index}--192.168.0.x\`,
            source: \`\${start + index}_QQ\`,
            priority: \`\${start + index}\`,
            percent: \`\${start + index}\`,
            status: '创建中',
            create_time: \`2018-05-25 15:02:24.\${start + index}\`,
          }));
        }, 100);
      }`,
    },
    dependent: {
      props: ['pagination', 'data'],
    },
  },
  {
    title: '批量操作',
    description: '可拖拽列宽，支持自定义列宽',
    props: {
      data: data,
      pagination: {
        count: data.length,
        limit: 5,
        current: 1,
      },
      acrossAll: false,
      columns: [
        {
          type: 'selection',
          align: 'center',
          fixed: 'left',
          width: 50,
        },
        {
          label: '姓名',
          field: 'name',
          width: 100,
        },
        {
          label: '年龄',
          field: 'age',
          width: 100,
        },
        {
          label: '地址',
          field: 'address',
          width: 250,
        },
        {
          label: '电话',
          field: 'phone',
          width: 200,
        },
        {
          label: '邮箱',
          field: 'email',
          width: 200,
        },
        {
          label: '状态',
          field: 'status',
          width: 100,
        },
        {
          label: '创建时间',
          field: 'createTime',
          width: 100,
        },
        {
          label: '更新时间',
          field: 'updateTime',
          width: 100,
        },
      ],
    },
  },
  {
    title: '底部加载',
    description: '配置scroll-loading属性设置表格底部加载样式，结合scroll-end监听表格滚动至底部事件进行分页加载',
    props: {
      height: 500,
      data: new Array(100).fill('').map((_, index) => ({
        ip: `${index}--192.168.0.x`,
        source: `${index}_QQ`,
        priority: index,
        percent: index,
        status: '创建中',
        create_time: `2018-05-25 15:02:24.${index}`,
      })),
      scrollLoading: false,
      columns: [
        {
          label: '序号',
          type: 'index',
          fixed: true,
        },
        {
          label: '名称/内网IP',
          field: 'ip',
          width: 100,
        },
        {
          label: '来源',
          field: 'source',
        },
        {
          label: '创建时间',
          field: 'create_time',
        },
        {
          label: '优先级',
          field: 'priority',
        },
        {
          label: '完成度',
          field: 'percent',
        },
        {
          label: '状态',
          field: 'status',
        },
      ],
    },
    events: {
      scrollBottom: `() => {
        scrollLoading.value = true;
        setTimeout(() => {
          scrollLoading.value = false;
        }, 1500);
      }`,
    },
    dependent: {
      props: ['scrollLoading'],
    },
  },
  {
    title: '底部和头部插槽',
    description: '底部和头部插槽',
    props: {
      data: data,
      columns: [
        {
          type: 'selection',
          align: 'center',
          fixed: 'left',
          width: 50,
        },
        {
          label: '姓名',
          field: 'name',
          width: 100,
        },
        {
          label: '年龄',
          field: 'age',
          width: 100,
        },
        {
          label: '地址',
          field: 'address',
          width: 250,
        },
        {
          label: '电话',
          field: 'phone',
          width: 200,
        },
        {
          label: '邮箱',
          field: 'email',
          width: 200,
        },
        {
          label: '状态',
          field: 'status',
          width: 100,
        },
        {
          label: '创建时间',
          field: 'createTime',
          width: 100,
        },
        {
          label: '更新时间',
          field: 'updateTime',
          width: 100,
        },
      ],
    },
    slots: {
      fixedBottom: `
        <div style="height: 100px; background-color: #f0f0f0; text-align: center; line-height: 100px;">底部插槽</div>
      `,
      prepend: `
        <div style="height: 100px; background-color: #f0f0f0;">头部插槽</div>
      `,
    },
  },
  {
    title: '折叠表格功能',
    description: '结合slot expandRow',
    props: {
      data: data3,
      columns: [
        {
          type: 'selection',
          width: 20,
          minWidth: 20,
        },
        {
          type: 'expand',
          width: 140,
          minWidth: 30,
        },
        {
          label: '名称/内网IP',
          field: 'ip',
          width: 100,
        },
        {
          label: '来源',
          field: 'source',
        },
        {
          label: '创建时间',
          field: 'create_time',
        },
        {
          label: '优先级',
          field: 'priority',
        },
        {
          label: '完成度',
          field: 'percent',
        },
        {
          label: '状态',
          field: 'status',
        },
      ],
    },
    slots: {
      expandRow: `
        <div>row content</div>
      `,
      expandContent: `
        <div>expand content</div>
      `,
    },
  },
  {
    title: '过滤范围和匹配模式',
    description: '通过设置filterScope设置过滤范围为当前页面还是全部数据，如果是all，则过滤完毕会重置分页为首页',
    props: {
      height: 500,
      data: new Array(Math.ceil(Math.random() * 100) + 100).fill('').map((_, index) => ({
        ip: `${index}--192.168.0.x`,
        source: `${index}_QQ`,
        priority: index,
        percent: index,
        status: index % 2 === 0 ? '创建中' : '创建完成',
        create_time: `2018-05-25 15:02:24.${index}`,
      })),
      pagination: {
        count: 100,
        limit: 20,
        current: 1,
      },
      columns: [
        {
          label: '序号',
          type: 'index',
          minWidth: 80,
          fixed: true,
        },
        {
          field: 'ip',
          width: 100,
        },
        {
          label: '来源',
          field: 'source',
          width: 80,
          filter: {
            list: [
              {
                text: '0_QQ',
                value: '0_QQ',
              },
              {
                text: '1_QQ',
                value: '1_QQ',
              },
              {
                text: '2_QQ',
                value: '2_QQ',
              },
              {
                text: '3_QQ',
                value: '3_QQ',
              },
              {
                text: '4_QQ',
                value: '4_QQ',
              },
              {
                text: '5_QQ',
                value: '5_QQ',
              },
              {
                text: '6_QQ',
                value: '6_QQ',
              },
              {
                text: '7_QQ',
                value: '7_QQ',
              },
              {
                text: '8_QQ',
                value: '8_QQ',
              },
              {
                text: '9_QQ',
                value: '9_QQ',
              },
              {
                text: '10_QQ',
                value: '10_QQ',
              },
              {
                text: '11_QQ',
                value: '11_QQ',
              },
              {
                text: '12_QQ',
                value: '12_QQ',
              },
              {
                text: '13_QQ',
                value: '13_QQ',
              },
              {
                text: '14_QQ',
                value: '14_QQ',
              },
              {
                text: '15_QQ',
                value: '15_QQ',
              },
              {
                text: '16_QQ',
                value: '16_QQ',
              },
              {
                text: '17_QQ',
                value: '17_QQ',
              },
              {
                text: '18_QQ',
                value: '18_QQ',
              },
              {
                text: '19_QQ',
                value: '19_QQ',
              },
            ],
            checked: [],
            filterScope: 'all',
            match: 'fuzzy',
          },
        },
        {
          label: '创建时间',
          field: 'create_time',
        },
        {
          label: '优先级',
          field: 'priority',
          sort: true,
          filter: {
            list: [
              {
                text: '1',
                value: 1,
              },
              {
                text: '2',
                value: 2,
              },
              {
                text: '3',
                value: 3,
              },
            ],
            filterScope: 'current',
            match: 'full',
          },
        },
        {
          label: '完成度',
          field: 'percent',
        },
        {
          label: '状态',
          field: 'status',
        },
      ],
    },
  },
  {
    title: '排序范围',
    description: '通过设置sortScope设置排序范围为当前页面还是全部数据',
    props: {
      height: 500,
      data: new Array(Math.ceil(Math.random() * 100) + 100).fill('').map((_, index) => ({
        ip: `${index}--192.168.0.x`,
        source: `${index}_QQ`,
        priority: index,
        percent: index,
        status: index % 2 === 0 ? '创建中' : '创建完成',
        create_time: `2018-05-25 15:02:24.${index}`,
      })),
      pagination: {
        count: 100,
        limit: 20,
        current: 1,
      },
      columns: [
        {
          label: '序号',
          type: 'index',
          minWidth: 80,
          fixed: true,
        },
        {
          field: 'ip',
          width: 100,
        },
        {
          label: '来源',
          field: 'source',
          width: 80,
        },
        {
          label: '创建时间',
          field: 'create_time',
        },
        {
          label: '优先级',
          field: 'priority',
          sort: {
            sortScope: 'all',
            value: 'asc',
          },
        },
        {
          label: '完成度',
          field: 'percent',
          sort: {
            sortScope: 'current',
            value: 'desc',
          },
        },
        {
          label: '状态',
          field: 'status',
          sort: true,
        },
      ],
    },
  },
  {
    title: '表格合并',
    description: 'colspan & rowspan',
    props: {
      data: data3,
      columns: [
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
              {
                text: 'Resolving deltas: 100% (16/16), completed with 15 local objects',
                value: 'QQ',
              },
              {
                text: 'create mode 100644 site/views/search-select/value-behavior.vue',
                value: '微信',
              },
              {
                text: 'Writing objects: 100% (19/19), 2.19 KiB | 1.09 MiB/s, done.',
                value: 'Email',
              },
            ],
          },
        },
        {
          label: '创建时间',
          field: 'create_time',
          sort: 'custom',
        },
        {
          field: 'status',
          sort: true,
        },
      ],
    },
  },
  {
    title: '表格settings',
    description: '表格settings配置',
    props: {
      data: new Array(10).fill('').map((_r, rIndex) =>
        new Array(20).fill('').reduce(
          (output, _cr, cIndex) =>
            Object.assign(output, {
              [`col_${cIndex + 1}`]: `row_${rIndex + 1}_col_${cIndex + 1}`,
            }),
          {},
        ),
      ),
      columns: new Array(20).fill('').map((_c, index) => ({
        label: `Column${index + 1}`,
        field: `col_${index + 1}`,
        minWidth: 200,
        render: ({ row }) => {
          return row[`col_${index + 1}`];
        },
      })),
      settings: true,
    },
  },
  {
    title: '单元格空数据展示',
    description: '单元格空数据展示',
    props: {
      data: data,
      emptyCellText: '--无数据--',
      columns: [
        {
          type: 'selection',
          align: 'center',
          fixed: 'left',
          width: 50,
        },
        {
          label: '姓名',
          field: 'name',
        },
        {
          label: '年龄',
          field: 'age',
        },
        {
          label: '地址',
          field: 'address',
        },
        {
          label: '电话',
          field: 'phone',
        },
        {
          label: '邮箱',
          field: 'email',
        },
        {
          label: '状态',
          field: 'status',
        },
        {
          label: '创建时间',
          field: 'createTime',
        },
        {
          label: '更新时间',
          field: 'updateTime',
        },
      ],
    },
  },
  {
    title: '空状态表格',
    description: '无数据时展示空状态',
    props: {
      data: [],
      columns: [
        {
          label: '姓名',
          field: 'name',
          width: 100,
        },
        {
          label: '年龄',
          field: 'age',
          width: 100,
        },
        {
          label: '地址',
          field: 'address',
          width: 250,
        },
        {
          label: '电话',
          field: 'phone',
          width: 200,
        },
        {
          label: '邮箱',
          field: 'email',
          width: 200,
        },
        {
          label: '状态',
          field: 'status',
          width: 100,
        },
        {
          label: '创建时间',
          field: 'createTime',
          width: 100,
        },
        {
          label: '更新时间',
          field: 'updateTime',
          width: 100,
        },
      ],
    },
  },
  {
    title: '空状态表格-插槽',
    description: '无数据时展示空状态-插槽',
    props: {
      data: [],
      columns: [
        {
          label: '姓名',
          field: 'name',
          width: 100,
        },
        {
          label: '年龄',
          field: 'age',
          width: 100,
        },
        {
          label: '地址',
          field: 'address',
          width: 250,
        },
        {
          label: '电话',
          field: 'phone',
          width: 200,
        },
        {
          label: '邮箱',
          field: 'email',
          width: 200,
        },
        {
          label: '状态',
          field: 'status',
          width: 100,
        },
        {
          label: '创建时间',
          field: 'createTime',
          width: 100,
        },
        {
          label: '更新时间',
          field: 'updateTime',
          width: 100,
        },
      ],
    },
    slots: {
      empty: `
        <div>空空如也~~</div>
      `,
    },
  },
];

// 组件分组
const group = NavGroupMeta.Data;

// 组件名称
const name = 'table';

// 组件标签
const title = 'Table';

// 组件中文标签
const titleCN = '表格';

const description = '表格组件';

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  slots,
  types,
  presets,
  description,
};

export default wiki;
