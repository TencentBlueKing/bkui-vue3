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

// 组件示例
const presets = [
  {
    title: '基础用法',
    description: '通用基础样式满足简单表格场景',
    props: {
      data: data,
      pagination: {
        count: data.length,
        limit: 10,
        current: 1,
      },
      border: 'none',
    },
    slots: {
      default: `
        <bk-table-column fixed="left" min-width="100" label="姓名" field="name" />
        <bk-table-column min-width="100" label="年龄" field="age" />
        <bk-table-column min-width="250" label="地址" field="address" />
        <bk-table-column min-width="200" label="电话" field="phone" />
        <bk-table-column min-width="200" label="邮箱" field="email" />
        <bk-table-column min-width="100" label="状态" filter field="status" />
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
      pagination: {
        count: data.length,
        limit: 10,
        current: 1,
      },
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
        <bk-table-column min-width="100" label="状态" filter field="status" />
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
    title: '多级表头  ',
    description: '多级表头，支持自定义表头',
    props: {
      data: data2,
      pagination: {
        count: data.length,
        limit: 10,
        current: 1,
      },
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
];

// 组件分组
const group = NavGroupMeta.Form;

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
