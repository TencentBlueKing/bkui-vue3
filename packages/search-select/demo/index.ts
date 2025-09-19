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

import { NavGroupMeta } from '@bkui-vue/shared';

// 组件示例
const presets = [
  {
    title: '基础用法',
    description: '通过 data 属性配置搜索选择器的选项数据',
    props: {
      data: [
        {
          id: 'host',
          name: '主机',
          children: [
            { id: 'host-1', name: '主机1' },
            { id: 'host-2', name: '主机2' },
            { id: 'host-3', name: '主机3' },
          ],
        },
        {
          id: 'ip',
          name: 'IP',
          children: [
            { id: 'ip-1', name: '192.168.1.1' },
            { id: 'ip-2', name: '192.168.1.2' },
            { id: 'ip-3', name: '192.168.1.3' },
          ],
        },
      ],
    },
  },
  {
    title: '多选模式',
    description: '通过设置 multiple 属性开启多选模式',
    props: {
      data: [
        {
          id: 'host',
          name: '主机',
          multiple: true,
          children: [
            { id: 'host-1', name: '主机1' },
            { id: 'host-2', name: '主机2' },
            { id: 'host-3', name: '主机3' },
            { id: 'host-4', name: '主机4' },
            { id: 'host-5', name: '主机5' },
          ],
        },
        {
          id: 'ip',
          name: 'IP',
          multiple: true,
          children: [
            { id: 'ip-1', name: '192.168.1.1' },
            { id: 'ip-2', name: '192.168.1.2' },
            { id: 'ip-3', name: '192.168.1.3' },
          ],
        },
      ],
    },
  },
  {
    title: '自定义条件',
    description: '通过 conditions 属性自定义逻辑条件',
    props: {
      data: [
        {
          id: 'host',
          name: '主机',
          children: [
            { id: 'host-1', name: '主机1' },
            { id: 'host-2', name: '主机2' },
          ],
        },
      ],
      conditions: [
        { id: 'and', name: '且' },
        { id: 'or', name: '或' },
        { id: 'not', name: '非' },
      ],
    },
  },
  {
    title: '异步数据',
    description: '通过 getMenuList 属性实现异步数据加载',
    props: {
      data: [
        {
          id: 'host',
          name: '主机',
          async: true,
        },
        {
          id: 'ip',
          name: 'IP',
          async: true,
        },
      ],
      'get-menu-list':
        'async (item, keyword) => { return new Promise((resolve) => { setTimeout(() => { resolve([{ id: "async-1", name: "异步数据1" }, { id: "async-2", name: "异步数据2" }]); }, 500); }); }',
    },
  },
  {
    title: '值验证',
    description: '通过 validateValues 属性实现值的验证',
    props: {
      data: [
        {
          id: 'port',
          name: '端口',
          children: [
            { id: 'port-1', name: '80' },
            { id: 'port-2', name: '443' },
            { id: 'port-3', name: '8080' },
          ],
        },
      ],
      'validate-values':
        'async (item, values) => { const port = parseInt(values[0]?.name); if (port < 1 || port > 65535) { return "端口号必须在1-65535之间"; } return true; }',
    },
  },
  {
    title: '禁用清空',
    description: '通过设置 clearable 为 false 禁用清空功能',
    props: {
      data: [
        {
          id: 'host',
          name: '主机',
          children: [
            { id: 'host-1', name: '主机1' },
            { id: 'host-2', name: '主机2' },
          ],
        },
      ],
      clearable: false,
    },
  },
  {
    title: '唯一选择',
    description: '通过设置 uniqueSelect 为 true 实现唯一选择',
    props: {
      data: [
        {
          id: 'host',
          name: '主机',
          children: [
            { id: 'host-1', name: '主机1' },
            { id: 'host-2', name: '主机2' },
            { id: 'host-3', name: '主机3' },
          ],
        },
        {
          id: 'ip',
          name: 'IP',
          children: [
            { id: 'ip-1', name: '192.168.1.1' },
            { id: 'ip-2', name: '192.168.1.2' },
          ],
        },
      ],
      'unique-select': true,
    },
  },
  {
    title: '自定义占位符',
    description: '通过 placeholder 属性自定义占位符文本',
    props: {
      data: [
        {
          id: 'host',
          name: '主机',
          children: [
            { id: 'host-1', name: '主机1' },
            { id: 'host-2', name: '主机2' },
          ],
        },
      ],
      placeholder: '请选择主机或输入关键词搜索',
    },
  },
  {
    title: '限制高度',
    description: '通过 maxHeight 属性限制下拉列表的最大高度',
    props: {
      data: [
        {
          id: 'host',
          name: '主机',
          children: [
            { id: 'host-1', name: '主机1' },
            { id: 'host-2', name: '主机2' },
            { id: 'host-3', name: '主机3' },
            { id: 'host-4', name: '主机4' },
            { id: 'host-5', name: '主机5' },
            { id: 'host-6', name: '主机6' },
            { id: 'host-7', name: '主机7' },
            { id: 'host-8', name: '主机8' },
            { id: 'host-9', name: '主机9' },
            { id: 'host-10', name: '主机10' },
          ],
        },
      ],
      'max-height': 200,
    },
  },
  {
    title: '值行为模式',
    description: '通过 valueBehavior 属性控制值的返回模式',
    props: {
      data: [
        {
          id: 'host',
          name: '主机',
          children: [
            { id: 'host-1', name: '主机1' },
            { id: 'host-2', name: '主机2' },
          ],
        },
      ],
      'value-behavior': 'need-key',
    },
  },
];

// 组件属性
const props = [
  {
    name: 'data',
    type: 'Array',
    default: '[]',
    description: '搜索选择器的选项数据',
  },
  {
    name: 'modelValue',
    type: 'Array',
    default: '[]',
    description: '绑定值，支持 v-model',
  },
  {
    name: 'maxHeight',
    type: 'Number',
    default: '392',
    description: '下拉列表的最大高度',
  },
  {
    name: 'conditions',
    type: 'Array',
    default: '[]',
    description: '自定义逻辑条件选项',
  },
  {
    name: 'clearable',
    type: 'Boolean',
    default: 'true',
    description: '是否显示清空按钮',
  },
  {
    name: 'placeholder',
    type: 'String',
    default: '-',
    description: '占位符文本',
  },
  {
    name: 'getMenuList',
    type: 'Function',
    default: '-',
    description: '异步获取菜单列表的方法',
  },
  {
    name: 'validateValues',
    type: 'Function',
    default: '-',
    description: '验证值的方法',
  },
  {
    name: 'uniqueSelect',
    type: 'Boolean',
    default: 'false',
    description: '是否唯一选择，同一选项只能选择一次',
  },
  {
    name: 'valueBehavior',
    type: 'String',
    default: 'all',
    description: '值的行为模式，可选值：all、need-key',
  },
];

// 组件事件
const emits = [
  {
    name: 'update:modelValue',
    description: '绑定值变化时触发',
    params: [
      {
        name: 'value',
        type: 'Array',
        description: '新的绑定值',
      },
    ],
  },
  {
    name: 'search',
    description: '点击搜索按钮时触发',
    params: [
      {
        name: 'event',
        type: 'MouseEvent',
        description: '鼠标事件对象',
      },
    ],
  },
  {
    name: 'selectKey',
    description: '选择条件时触发',
    params: [
      {
        name: 'item',
        type: 'Object',
        description: '选中的条件项',
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Form;

// 组件名称
const name = 'search-select';

// 组件标签
const title = 'SearchSelect';

// 组件中文标签
const titleCN = '搜索选择器';

export default {
  presets,
  props,
  emits,
  group,
  name,
  title,
  titleCN,
};
