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
    title: '基础颜色选择器',
    description: '基础的颜色选择器',
    props: {
      modelValue: '',
    },
  },
  {
    title: '不同尺寸',
    description: '不同尺寸的颜色选择器',
    props: {
      modelValue: '',
      size: 'large',
    },
  },
  {
    title: 'trigger slot',
    description: '通过 trigger slot 配置触发对象',
    props: {
      modelValue: '',
    },
    slots: {
      trigger: `
        <div>
          {{ data.value }}
          <span>{{ data.isShowDropdown ? '收起' : '展开' }}</span>
        </div>
      `,
    },
  },
  {
    title: '预设颜色值',
    description: '通过 recommend 配置预设颜色值',
    props: {
      modelValue: '',
      recommend: ['#000', '#333', '#666', '#999', 'FFF'],
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'modelValue',
    description: '绑定值，颜色值',
    type: 'string',
    default: '',
    isSupportVModel: true,
  },
  {
    name: 'disabled',
    description: '是否禁用',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'readonly',
    description: '是否只读',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'transfer',
    description: '控制面板是否出现在 body 内',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'size',
    description: '颜色选择器尺寸',
    type: 'string',
    options: ['large', 'small', ''],
    default: '',
  },
  {
    name: 'showValue',
    description: '是否在颜色选择器上显示色值',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'recommend',
    description: '预设颜色值，true 展示组件内置预设值，false 不展示预设值，数组则为自定义预设值',
    type: 'boolean | Array<string>',
    default: 'true',
  },
  {
    name: 'extCls',
    description: '自定义样式类名',
    type: 'string',
    default: '',
  },
  {
    name: 'withValidate',
    description: '在表单中时，是否应用 form-item 的校验规则',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'recommendEmpty',
    description: '预设值中是否包含空值',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'showOnInit',
    description: '是否在初始化时默认展开popover',
    type: 'boolean',
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
        type: 'string',
        description: '颜色值',
      },
    ],
  },
  {
    name: 'change',
    description: '颜色值变化时触发',
    params: [
      {
        name: 'value',
        type: 'any',
        description: '颜色值',
      },
    ],
  },
];

// 组件插槽，用来自动生成插槽文档
const slots = [
  {
    name: 'trigger',
    description: '选项插槽',
    params: [
      {
        name: 'value',
        type: 'string',
        description: '当前颜色值',
      },
      {
        name: 'isShowDropdown',
        type: 'boolean',
        description: '下拉面板是否显示',
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Form;

// 组件名称
const name = 'color-picker';

// 组件标签
const title = 'ColorPicker';

// 组件中文标签
const titleCN = '颜色选择器';

// 组件描述
const description = '颜色选择器组件，用于选择颜色值';

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
