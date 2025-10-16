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
    title: '基础用法',
    description: '基础的时间选择器使用',
    props: {
      modelValue: new Date(),
    },
  },
  {
    title: '时间范围选择',
    description: '选择首尾时间范围',
    props: {
      modelValue: [['00:00:00', '23:59:59']],
      type: 'timerange',
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'modelValue',
    description: '时间选择器组件的值，可以是 Date 或字符串或数组，只有在 timerange 类型时才支持数组',
    type: 'string | Array | Date | number',
    default: '00:00:00',
  },
  {
    name: 'type',
    description: '类型',
    type: 'string',
    options: ['time', 'timerange'],
    default: 'time',
  },
  {
    name: 'format',
    description: '时间格式',
    type: 'string',
    default: 'HH:mm:ss',
  },
  {
    name: 'disabled',
    description: '是否禁用',
    type: 'boolean',
    default: false,
  },
  {
    name: 'readonly',
    description: '是否只读',
    type: 'boolean',
    default: false,
  },
  {
    name: 'editable',
    description: '是否可编辑',
    type: 'boolean',
    default: true,
  },
  {
    name: 'clearable',
    description: '是否可清空',
    type: 'boolean',
    default: true,
  },
  {
    name: 'open',
    description: '控制日历面板的显示与隐藏',
    type: 'boolean | null',
    default: null,
  },
  {
    name: 'multiple',
    description: '是否多选',
    type: 'boolean',
    default: false,
  },
  {
    name: 'placeholder',
    description: '占位文案',
    type: 'string',
    default: '',
  },
  {
    name: 'placement',
    description: '弹出位置',
    type: 'string',
    options: [
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'left',
      'left-start',
      'left-end',
      'right',
      'right-start',
      'right-end',
    ],
    default: 'bottom-start',
  },
  {
    name: 'append-to-body',
    description: '是否追加到 body',
    type: 'boolean',
    default: false,
  },
  {
    name: 'disabled-hours',
    description: '禁用小时',
    type: 'Array',
    default: () => [],
  },
  {
    name: 'disabled-minutes',
    description: '禁用分钟',
    type: 'Array',
    default: () => [],
  },
  {
    name: 'disabled-seconds',
    description: '禁用秒',
    type: 'Array',
    default: () => [],
  },
  {
    name: 'hide-disabled-options',
    description: '是否隐藏禁用的小时、分钟、秒',
    type: 'boolean',
    default: false,
  },
  {
    name: 'font-size',
    description: '字体大小',
    type: 'string',
    options: ['large', 'medium', 'normal'],
    default: 'normal',
  },
  {
    name: 'width',
    description: '宽度',
    type: 'number',
    default: 261,
  },
  {
    name: 'enter-mode',
    description: '回车模式',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'allow-cross-day',
    description: '是否允许跨天',
    type: 'boolean',
    default: true,
  },
  {
    name: 'behavior',
    description: '风格设置(simplicity:简约 normal:正常)',
    type: 'string',
    options: ['normal', 'simplicity'],
    default: 'normal',
  },
  {
    name: 'extPopoverCls',
    description: '配置自定义样式类名，传入的类会被加在弹出的日历面板 DOM `.bk-date-picker-dropdown` 上',
    type: 'string',
    default: '',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'open-change',
    description: '弹框显示状态变化时触发',
    params: [
      {
        name: 'visible',
        type: 'boolean',
      },
    ],
  },
  {
    name: 'input',
    description: '输入时触发',
    params: [
      {
        name: 'now',
        type: 'any',
      },
    ],
  },
  {
    name: 'change',
    description: '值变化时触发',
    params: [
      {
        name: 'publicVModelValue',
        type: 'any',
      },
    ],
  },
  {
    name: 'update:modelValue',
    description: 'v-model 更新时触发',
    params: [
      {
        name: 'publicVModelValue',
        type: 'any',
      },
    ],
  },
  {
    name: 'clear',
    description: '清空时触发',
    params: [],
  },
  {
    name: 'shortcut-change',
    description: '快捷选项变化时触发',
    params: [
      {
        name: 'shortcut',
        type: 'any',
      },
    ],
  },
  {
    name: 'pick-success',
    description: '选择成功时触发',
    params: [],
  },
  {
    name: 'pick-first',
    description: '首次选择时触发',
    params: [
      {
        name: 'val',
        type: 'any',
      },
    ],
  },
  {
    name: 'blur',
    description: '失焦时触发',
    params: [],
  },
  {
    name: 'focus',
    description: '聚焦时触发',
    params: [],
  },
];

// 组件分组
const group = NavGroupMeta.Form;

// 组件名称
const name = 'time-picker';

// 组件标签
const title = 'TimePicker';

// 组件中文标签
const titleCN = '时间选择器';

// 组件描述
const description = '时间选择器';

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
