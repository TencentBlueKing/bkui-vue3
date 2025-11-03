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

import { NavGroupMeta, type IComponentWiki } from '@bkui-vue/shared';

// 组件示例
const presets = [
  {
    title: '基础滑块',
    description: '基础的滑块组件',
    style: {
      width: '80%',
      minWidth: '200px',
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'modelValue',
    description: '绑定值，可以是数字或数字数组（范围模式）',
    type: 'number | Array<number>',
    default: '',
  },
  {
    name: 'extCls',
    description: '自定义样式类名',
    type: 'string',
    default: '',
  },
  {
    name: 'vertical',
    description: '是否为垂直模式',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'height',
    description: '滑动选择器高度，vertical为true时使用',
    type: 'string',
    default: '200px',
  },
  {
    name: 'disable',
    description: '是否禁用',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'showTip',
    description: '是否显示提示信息',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'maxValue',
    description: '最大值',
    type: 'number',
    default: '100',
  },
  {
    name: 'minValue',
    description: '最小值',
    type: 'number',
    default: '0',
  },
  {
    name: 'step',
    description: '每一步的距离',
    type: 'number',
    default: '1',
  },
  {
    name: 'range',
    description: '是否为分段式滑块（范围模式）',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'showInterval',
    description: '是否显示间断点',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'showIntervalLabel',
    description: '是否显示间断点下的文字',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'showButtonLabel',
    description: '滑块下是否显示值，不可与间断点下的文字同时使用',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'showBetweenLabel',
    description: '是否只显示首尾刻度',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'showInput',
    description: '是否显示输入框',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'customContent',
    description: '自定义内容，用于自定义间断点的显示内容',
    type: 'object',
    default: 'null',
  },
  {
    name: 'formatterLabel',
    description: '自定义间断点下文字格式函数',
    type: 'function',
    default: '(value: number) => value',
  },
  {
    name: 'formatterButtonLabel',
    description: '自定义滑块下文字格式函数',
    type: 'function',
    default: '(value: number) => value',
  },
  {
    name: 'formatterTipLabel',
    description: '自定义提示信息格式函数',
    type: 'function',
    default: '(value: number) => value',
  },
  {
    name: 'labelClick',
    description: '标签点击事件处理函数',
    type: 'boolean | function',
    default: 'false',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'update:modelValue',
    description: '绑定值变化时触发',
    params: [
      {
        name: 'value',
        type: 'number | Array<number>',
        description: '当前值',
      },
    ],
  },
  {
    name: 'change',
    description: '值变化时触发',
    params: [
      {
        name: 'value',
        type: 'number | Array<number>',
        description: '当前值',
      },
    ],
  },
];

// 组件插槽，用来自动生成插槽文档
const slots = [
  {
    name: 'default',
    description: '滑块的默认内容',
    params: [],
  },
  {
    name: 'start',
    description: '滑块开始位置的自定义内容',
    params: [],
  },
  {
    name: 'end',
    description: '滑块结束位置的自定义内容',
    params: [],
  },
];

// 组件分组
const group = NavGroupMeta.Form;

// 组件名称
const name = 'slider';

// 组件标签
const title = 'Slider';

// 组件中文标签
const titleCN = '滑块';

// 组件描述
const description = '滑块组件，用于在指定范围内选择数值';

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  slots,
  presets,
  description,
};

export default wiki;
