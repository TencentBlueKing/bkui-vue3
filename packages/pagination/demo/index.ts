/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台 (BlueKing PaaS):
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
import { NavGroupMeta } from '@bkui-vue/shared';

// 组件示例
const presets = [
  {
    title: '小型分页',
    description: '小型分页',
    props: {
      modelValue: 1,
      count: 100,
      limit: 10,
      limitList: [10, 20, 50, 100],
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'modelValue',
    description: '当前页码',
    type: 'number',
    default: 1,
  },
  {
    name: 'count',
    description: '数据总数',
    type: 'number',
    default: 0,
  },
  {
    name: 'limit',
    description: '每页显示条数(须存在于limit-list中)',
    type: 'number',
    default: 10,
  },
  {
    name: 'limitList',
    description: '每页显示条数可选项列表',
    type: 'array',
    default: [10, 20, 50, 100],
  },
  {
    name: 'showLimit',
    description: '是否显示每页显示条数控件',
    type: 'boolean',
    default: true,
  },
  {
    name: 'type',
    description: '组件外观类型',
    type: 'default | compact',
    default: 'default',
  },
  {
    name: 'location',
    description: '每页显示条数控件位置',
    type: 'left | right',
    default: 'right',
  },
  {
    name: 'align',
    description: '分页控件位置，优先级高于location',
    type: 'left | center | right',
    default: 'right',
  },
  {
    name: 'small',
    description: '小型分页',
    type: 'boolean',
    default: false,
  },
  {
    name: 'showTotalCount',
    description: '是否显示总计',
    type: 'boolean',
    default: true,
  },
  {
    name: 'prevText',
    description: '上一页按钮文案',
    type: 'string',
    default: '',
  },
  {
    name: 'nextText',
    description: '下一页按钮文案',
    type: 'string',
    default: '',
  },
  {
    name: 'disabled',
    description: '每页显示条数控件位置',
    type: 'left | right',
    default: 'right',
  },
  {
    name: 'layout',
    description: '控件布局',
    type: 'array',
    default: ['total', 'list', 'limit'],
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'update:modelValue',
    description: '当前页码发生改变时触发的事件',
    params: [
      {
        name: '_value',
        type: 'number',
      },
    ],
  },
  {
    name: 'change',
    description: '当前页码变化时的回调',
    params: [
      {
        name: '_value',
        type: 'number',
      },
    ],
  },
  {
    name: 'limitChange',
    description: '当前分页尺寸变化时的回调',
    params: [
      {
        name: '_value',
        type: 'number',
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Data;

// 组件名称
const name = 'pagination';

// 组件标签
const title = 'Pagination';

// 组件中文标签
const titleCN = '分页';

// 组件描述
const description = '数据分页';

export default {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  presets,
  description,
};
