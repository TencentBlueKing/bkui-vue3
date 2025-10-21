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

// 组件示例
const presets = [
  {
    title: '基础用法',
    description: '通过 data 设置数据，通过 columns 设置列。',
    props: {
      data: [
        { name: '张三', age: 25, address: '北京市朝阳区' },
        { name: '李四', age: 30, address: '上海市浦东新区' },
        { name: '王五', age: 28, address: '广州市天河区' },
      ],
      columns: [
        { label: '姓名', field: 'name' },
        { label: '年龄', field: 'age' },
        { label: '地址', field: 'address' },
      ],
    },
  },
  {
    title: '斑马纹表格',
    description: '通过设置 stripe 属性开启斑马纹样式。',
    props: {
      stripe: true,
      data: [
        { name: '张三', age: 25, address: '北京市朝阳区' },
        { name: '李四', age: 30, address: '上海市浦东新区' },
        { name: '王五', age: 28, address: '广州市天河区' },
      ],
      columns: [
        { label: '姓名', field: 'name' },
        { label: '年龄', field: 'age' },
        { label: '地址', field: 'address' },
      ],
    },
  },
  {
    title: '带边框表格',
    description: '通过设置 border 属性开启边框样式。',
    props: {
      border: ['row', 'col'],
      data: [
        { name: '张三', age: 25, address: '北京市朝阳区' },
        { name: '李四', age: 30, address: '上海市浦东新区' },
        { name: '王五', age: 28, address: '广州市天河区' },
      ],
      columns: [
        { label: '姓名', field: 'name' },
        { label: '年龄', field: 'age' },
        { label: '地址', field: 'address' },
      ],
    },
  },
  {
    title: '可排序表格',
    description: '通过设置列的 sort 属性开启排序功能。',
    props: {
      data: [
        { name: '张三', age: 25, address: '北京市朝阳区' },
        { name: '李四', age: 30, address: '上海市浦东新区' },
        { name: '王五', age: 28, address: '广州市天河区' },
      ],
      columns: [
        { label: '姓名', field: 'name', sort: true },
        { label: '年龄', field: 'age', sort: true },
        { label: '地址', field: 'address' },
      ],
    },
  },
  {
    title: '可筛选表格',
    description: '通过设置列的 filter 属性开启筛选功能。',
    props: {
      data: [
        { name: '张三', age: 25, address: '北京市朝阳区', status: '在职' },
        { name: '李四', age: 30, address: '上海市浦东新区', status: '离职' },
        { name: '王五', age: 28, address: '广州市天河区', status: '在职' },
      ],
      columns: [
        { label: '姓名', field: 'name' },
        { label: '年龄', field: 'age' },
        { label: '地址', field: 'address' },
        {
          label: '状态',
          field: 'status',
          filter: {
            list: [
              { text: '在职', value: '在职' },
              { text: '离职', value: '离职' },
            ],
          },
        },
      ],
    },
  },
  {
    title: '固定列表格',
    description: '通过设置列的 fixed 属性固定列。',
    props: {
      data: [
        { name: '张三', age: 25, address: '北京市朝阳区', phone: '13800138000', email: 'zhangsan@example.com' },
        { name: '李四', age: 30, address: '上海市浦东新区', phone: '13800138001', email: 'lisi@example.com' },
        { name: '王五', age: 28, address: '广州市天河区', phone: '13800138002', email: 'wangwu@example.com' },
      ],
      columns: [
        { label: '姓名', field: 'name', fixed: 'left', width: 100 },
        { label: '年龄', field: 'age', width: 80 },
        { label: '地址', field: 'address', width: 200 },
        { label: '电话', field: 'phone', width: 120 },
        { label: '邮箱', field: 'email', fixed: 'right', width: 200 },
      ],
    },
  },
  {
    title: '可调整列宽表格',
    description: '通过设置列的 resizable 属性开启列宽调整功能。',
    props: {
      data: [
        { name: '张三', age: 25, address: '北京市朝阳区' },
        { name: '李四', age: 30, address: '上海市浦东新区' },
        { name: '王五', age: 28, address: '广州市天河区' },
      ],
      columns: [
        { label: '姓名', field: 'name', resizable: true, width: 120 },
        { label: '年龄', field: 'age', resizable: true, width: 80 },
        { label: '地址', field: 'address', resizable: true, width: 200 },
      ],
    },
  },
  {
    title: '分页表格',
    description: '通过设置 pagination 属性开启分页功能。',
    props: {
      data: Array.from({ length: 50 }, (_, index) => ({
        name: `用户${index + 1}`,
        age: 20 + (index % 20),
        address: `地址${index + 1}`,
      })),
      columns: [
        { label: '姓名', field: 'name' },
        { label: '年龄', field: 'age' },
        { label: '地址', field: 'address' },
      ],
      pagination: true,
    },
  },
  {
    title: '虚拟滚动表格',
    description: '通过设置 virtualEnabled 属性开启虚拟滚动，适用于大数据量场景。',
    props: {
      data: Array.from({ length: 1000 }, (_, index) => ({
        name: `用户${index + 1}`,
        age: 20 + (index % 20),
        address: `地址${index + 1}`,
      })),
      columns: [
        { label: '姓名', field: 'name' },
        { label: '年龄', field: 'age' },
        { label: '地址', field: 'address' },
      ],
      virtualEnabled: true,
      height: 400,
    },
  },
  {
    title: '自定义渲染表格',
    description: '通过设置列的 render 属性自定义单元格渲染。',
    props: {
      data: [
        { name: '张三', age: 25, status: 1 },
        { name: '李四', age: 30, status: 0 },
        { name: '王五', age: 28, status: 1 },
      ],
      columns: [
        { label: '姓名', field: 'name' },
        { label: '年龄', field: 'age' },
        {
          label: '状态',
          field: 'status',
          render: ({ cell }) => (cell === 1 ? '在职' : '离职'),
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
