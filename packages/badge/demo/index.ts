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
import { NavGroupMeta, type IComponentWiki } from '@bkui-vue/shared';

// 组件示例
const presets = [
  {
    title: '基础用法',
    description: '用默认配置初始化组件',
    props: {
      theme: 'danger',
      count: 2,
      position: 'top-left',
    },
    slots: {
      default: `<bk-button theme="primary"> top-left </bk-button>`,
    },
    dependent: {
      components: ['button'],
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'theme',
    description: 'badge 主题',
    options: ['primary', 'success', 'info', 'danger', 'warning'],
    type: 'string',
    default: 'primary',
  },
  {
    name: 'count',
    description: '显示的数字',
    type: 'String | Number',
    default: 1,
  },
  {
    name: 'position',
    description: 'badge 显示位置',
    options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    type: 'string',
    default: 'top-right',
  },
  {
    name: 'radius',
    description: '设置边框的 radius 属性值',
    type: 'string',
    default: '18px',
  },
  {
    name: 'valLength',
    description: '数字显示最大长度，最大值建议英文不超过3个字母，中文不超过2个汉字',
    type: 'number',
    default: 3,
  },
  {
    name: 'overflowCount',
    description: '组件显示的最大值，当 count 超过 overflowCount，显示数字 +；仅当设置了 Number 类型的 count 值时生效',
    type: 'number',
    default: 99,
  },
  {
    name: 'dot',
    description: '是否仅显示红点；当设置 dot 为 true 时，count, icon, overflowCount 均会被忽略',
    type: 'boolean',
    default: false,
  },
  {
    name: 'visible',
    description: '是否显示 badge',
    type: 'boolean',
    default: false,
  },
  {
    name: 'extCls',
    description: '外部设置的 class 名',
    type: 'String',
    default: '-',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'hover',
    description: 'hover 事件的回调',
    params: [
      {
        name: 'event',
        type: 'MouseEvent',
      },
    ],
  },
  {
    name: 'leave',
    description: 'leave 事件的回调',
    params: [
      {
        name: 'event',
        type: 'MouseEvent',
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Data;

// 组件名称
const name = 'badge';

// 组件标签
const title = 'Badge';

// 组件中文标签
const titleCN = 'Badge 标记';

// 组件描述
const description = 'Badge 组件， 可以出现在任意 DOM 节点角上的数字或状态标记。';

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  presets,
  description,
};

export default wiki;
