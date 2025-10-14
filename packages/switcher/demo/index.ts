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
    title: '基础用法',
    description: '可以通过 value / v-model 属性来定义开关状态，',
    props: {
      value: true,
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'value',
    description: '是否打开',
    type: 'string | boolean | number',
    default: false,
  },
  {
    name: 'theme',
    description: '开关的主题',
    type: 'string',
    default: 'success',
    options: ['success', 'danger'],
  },
  {
    name: 'disabled',
    description: '是否禁用',
    type: 'boolean',
    default: false,
  },
  {
    name: 'showText',
    description: '是否显示文本',
    type: 'boolean',
    default: false,
  },
  {
    name: 'size',
    description: '尺寸，显示文本时此属性无效',
    type: 'string',
    default: 'medium',
    options: ['default', 'large', 'small'],
  },
  {
    name: 'isOutline',
    description: '是否为描边效果',
    type: 'boolean',
    default: false,
  },
  {
    name: 'isSquare',
    description: '是否为方形效果',
    type: 'boolean',
    default: false,
  },
  {
    name: 'trueValue',
    description: '表示开状态的值',
    type: 'boolean',
    default: true,
  },
  {
    name: 'falseValue',
    description: '表示关状态的值',
    type: 'boolean',
    default: false,
  },
  {
    name: 'onText',
    description: '打开状态显示的文本',
    type: 'string',
    default: 'ON',
  },
  {
    name: 'offText',
    description: '关闭状态显示的文本',
    type: 'string',
    default: 'OFF',
  },
  {
    name: 'beforeChange',
    description: '状态切换的前置检测接收操作后的状态（lastValue），返回true，false，Promise',
    type: 'function',
  },
  {
    name: 'withValidate',
    description: '是否在切换时进行校验',
    type: 'boolean',
    default: false,
  },
  {
    name: 'extCls',
    description: '自定义样式类名',
    type: 'string',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'update:modelValue',
    description: '更新 modelValue 的事件',
    params: [
      {
        name: 'value',
        type: 'string | boolean | number',
      },
    ],
  },
  {
    name: 'change',
    description: '状态发生变化时触发的事件',
    params: [
      {
        name: 'value',
        type: 'boolean',
      },
    ],
  },
];

// 组件自定义的复杂类型
const types = [];

// 组件分组
const group = NavGroupMeta.Form;

// 组件名称
const name = 'switcher';

// 组件标签
const title = 'Switcher';

// 组件中文标签
const titleCN = '开关';

// 组件描述
const description = '在两种状态之间的切换';

export default {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  presets,
  types,
  description,
};
