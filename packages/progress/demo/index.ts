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
    title: '基础进度条',
    description: '用于展示当前进度的直线',
    props: {
      percent: 20,
      theme: 'primary',
      size: '',
      showText: false,
      textInside: false,
      color: '#13ce66'
    },
    style: {
      width: '80%',
      minWidth: '200px',
    },
  },
  {
    title: '环形进度条/仪表盘',
    description: '空间位置占据较大，视觉效果较强的环形',
    props: {
      percent: 20,
      type: 'circle',
      width: 126,
      bgColor: '#f5f5f5',
      color: '#13ce66',
    },
    style: {
      width: '80%',
      minWidth: '200px',
      display: 'flex',
      justifyContent: 'center',
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'ext-cls',
    description: '自定义样式类名',
    type: 'string',
    default: '',
  },
  {
    name: 'type',
    description: '进度条类型',
    type: 'string',
    options: ['line', 'circle', 'dashboard'],
    default: 'line',
  },
  {
    name: 'percent',
    description: '进度',
    type: 'number',
    default: 0,
  },
  {
    name: 'theme',
    description: '线性进度条主题色',
    type: 'string',
    options: ['primary', 'success', 'warning', 'danger'],
    default: 'primary',
  },
  {
    name: 'size',
    description: '进度条尺寸',
    type: 'string',
    options: ['small', '', 'large', 'huge'],
    default: '',
  },
  {
    name: 'width',
    description: '环形/仪表盘大小,针对 circle 和 dashboard 类型有效',
    type: 'number',
    default: 126,
  },
  {
    name: 'stroke-width',
    description: '进度条的粗细宽度',
    type: 'number',
    default: NaN,
  },
  {
    name: 'stroke-linecap',
    description: '仪表盘进度路径两端形状',
    type: 'string',
    options: ['round', 'square', 'butt'],
    default: 'round',
  },
  {
    name: 'text-inside',
    description: '线性进度条是否显示文字到进度条内',
    type: 'boolean',
    default: false,
  },
  {
    name: 'show-text',
    description: '是否显示文案',
    type: 'boolean',
    default: true,
  },
  {
    name: 'color',
    description: '进度条颜色',
    type: 'string',
    default: '',
  },
  {
    name: 'bg-color',
    description: '环形/仪表盘路径背景颜色',
    type: 'string',
    default: '',
  },
  {
    name: 'fixed',
    description: '进度条百分比的小数位数，值必须为 0 到 20 之间',
    type: 'number',
    default: 0,
  },
  {
    name: 'format',
    description: '自定义的进度条文字格式',
    type: 'function',
    default: '(percent: number): string => `${percent}%`',
  },
  {
    name: 'title-style',
    description: 'title-style',
    type: 'object',
    default: '{ fontSize: "16px", verticalAlign: "middle" }',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [];

const slots = [
  {
    name: 'default',
    description: '默认插槽',
  },
];

// 组件分组
const group = NavGroupMeta.Data;

// 组件名称
const name = 'progress';

// 组件标签
const title = 'Progress';

// 组件中文标签
const titleCN = '进度条';

// 组件描述
const description = '用于展示当前进度的直线';

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
