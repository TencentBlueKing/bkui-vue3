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
    title: '日期选择',
    description: '选择单个日期',
    props: {
      'model-value': new Date(),
      type: 'date',
    },
  },
  {
    title: '日期范围选择',
    description: '选择首尾日期范围',
    props: {
      'model-value': [new Date(), new Date()],
      type: 'daterange',
    },
  },
  {
    title: '日期时间选择',
    description: '选择单个时间点',
    props: {
      'model-value': new Date(),
      type: 'datetime',
    },
  },
  {
    title: '日期时间范围选择',
    description: '选择首尾日期时间范围',
    props: {
      'model-value': [new Date(), new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 3)],
      type: 'datetimerange',
    },
  },
  {
    title: '月份选择',
    description: '选择单个月份',
    props: {
      'model-value': new Date(),
      type: 'month',
    },
  },
  {
    title: '月份范围选择',
    description: '选择首尾月份范围',
    props: {
      'model-value': [new Date(), new Date(new Date().getFullYear(), new Date().getMonth() + 1)],
      type: 'monthrange',
    },
  },
  {
    title: '年份选择',
    description: '选择单个年份',
    props: {
      'model-value': new Date(),
      type: 'year',
    },
  },
  {
    title: '年份范围选择',
    description: '选择首尾年份范围',
    props: {
      'model-value': [new Date(), new Date(new Date().getFullYear() + 1)],
      type: 'yearrange',
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'type',
    description: '显示类型',
    type: 'string',
    options: [
      'year',
      'yearrange',
      'month',
      'monthrange',
      'date',
      'daterange',
      'datetime',
      'datetimerange',
      'time',
      'timerange',
    ],
    default: 'date',
  },
  {
    name: 'ext-popover-cls',
    description: '外部设置的 popover class name',
    type: 'string',
    default: '',
  },
  {
    name: 'format',
    description: '显示格式',
    type: 'string',
    default: '',
  },
  {
    name: 'readonly',
    description: '是否只读',
    type: 'boolean',
    default: false,
  },
  {
    name: 'disabled',
    description: '是否禁用',
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
    description: '是否打开',
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
    name: 'time-picker-options',
    description: '时间选择器配置',
    type: 'object',
    default: '{}',
  },
  {
    name: 'split-panels',
    description: '是否分割面板',
    type: 'boolean',
    default: true,
  },
  {
    name: 'start-date',
    description: '开始日期',
    type: 'Date',
    default: '',
  },
  {
    name: 'placeholder',
    description: '占位符',
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
    description: '是否添加到 body',
    type: 'boolean',
    default: false,
  },
  {
    name: 'shortcuts',
    description: '配置快捷选择日期',
    type: 'Array<IDatePickerShortcut>',
    link: '/component/date-picker/api#IDatePickerShortcut',
    default: '[]',
  },
  {
    name: 'shortcut-close',
    description: '快捷选项是否关闭',
    type: 'boolean',
    default: false,
  },
  {
    name: 'model-value',
    description: '绑定值',
    type: 'Date | String | Number | [Date | String | Number, Date | String | Number] | null',
    default: '',
  },
  {
    name: 'value',
    description: '绑定值（兼容）',
    type: 'Date | String | Number | [Date | String | Number, Date | String | Number] | null',
    default: '',
  },
  {
    name: 'options',
    description: '其他配置',
    type: 'object',
    default: '{}',
  },
  {
    name: 'font-size',
    description: '字体大小',
    type: 'string',
    options: ['large', 'medium', 'normal'],
    default: 'normal',
  },
  {
    name: 'up-to-now',
    description: '结束时间是否允许"至今"',
    type: 'boolean',
    default: false,
  },
  {
    name: 'use-shortcut-text',
    description: '是否使用快捷文案',
    type: 'boolean',
    default: false,
  },
  {
    name: 'shortcut-selected-index',
    description: '快捷选项选中索引',
    type: 'number',
    default: -1,
  },
  {
    name: 'header-slot-cls',
    description: '头部插槽样式类',
    type: 'string',
    default: '',
  },
  {
    name: 'footer-slot-cls',
    description: '底部插槽样式类',
    type: 'string',
    default: '',
  },
  {
    name: 'allow-cross-day',
    description: '是否允许跨天',
    type: 'boolean',
    default: false,
  },
  {
    name: 'behavior',
    description: '行为模式',
    type: 'string',
    options: ['normal', 'simplicity'],
    default: 'normal',
  },
  {
    name: 'disabled-date',
    description: '禁用日期函数',
    type: 'function',
    default: '',
  },
  {
    name: 'with-validate',
    description: '是否启用验证',
    type: 'boolean',
    default: true,
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
      {
        name: 'type',
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
      {
        name: 'shortcutIndex',
        type: 'number',
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
      {
        name: 'type',
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

const slots = [
  {
    name: 'header',
    description: '可用该插槽，自定义日期选择器 header 的展示',
  },
  {
    name: 'trigger',
    description: '可用该插槽配合 open 属性，自定义日期选择器的展示',
    params: [
      {
        name: 'displayValue',
        type: 'string',
      },
    ],
  },
  {
    name: 'footer',
    description: '可用该插槽，自定义日期选择器 footer 的展示',
  },
  {
    name: 'shortcuts',
    description: 'datetimerange、daterange 类型可用该插槽，自定义时间范围选择器快捷选项区域的展示',
    params: [
      {
        name: 'arg',
        type: '{ change: Function }',
      },
    ],
  },
  {
    name: 'confirm',
    description: '可用该插槽，自定义日期选择器 confirm 的展示',
  },
];

const types = [
  {
    name: 'IDatePickerShortcut',
    description: '快捷选择日期配置',
    fields: [
      {
        name: 'text',
        type: 'string',
        description: '快捷选择日期文本',
      },
      {
        name: 'value',
        type: '() => Date[]',
        description: '快捷选择日期值',
      },
      {
        name: 'onClick',
        type: 'function',
        description: '点击回调函数',
        params: [
          {
            name: 'picker',
            type: 'any',
            description: '选择值',
          },
        ],
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Form;

// 组件名称
const name = 'date-picker';

// 组件标签
const title = 'DatePicker';

// 组件中文标签
const titleCN = '日期选择器';

// 组件描述
const description = '日期选择器';

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
