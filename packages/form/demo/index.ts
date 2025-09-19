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

const presets = [
  {
    title: '基础用法',
    description: '通过 model 绑定表单数据',
    props: {
      model: {},
    },
  },
];

const props = [
  {
    name: 'model',
    description: '表单数据',
    type: 'object',
    default: {},
  },
  {
    name: 'rules',
    description: '表单验证规则',
    type: 'Array',
    default: [],
  },
  {
    name: 'label-width',
    description: '表单项标签宽度',
    type: 'number',
    default: '150',
  },
  {
    name: 'label-position',
    description: '表单项标签位置',
    type: 'string',
    default: 'top',
    enum: ['top', 'left'],
  },
  {
    name: 'form-type',
    description: '表单类型',
    type: 'string',
    default: 'horizontal',
    enum: ['horizontal', 'vertical'],
  },
  {
    name: 'item-type',
    description: '表单项类型',
    type: 'string',
    default: 'horizontal',
    enum: ['horizontal', 'vertical'],
  },
  {
    name: 'label',
    description: '表单项标签',
    type: 'string',
    default: '',
  },
  {
    name: 'label-width',
    description: '表单项标签宽度',
    type: 'number',
    default: '150',
  },
  {
    name: 'label-position',
    description: '表单项标签位置',
    type: 'string',
    default: 'top',
    enum: ['top', 'left'],
  },
  {
    name: 'property',
    description: '表单项属性',
    type: 'string',
    default: '',
  },
  {
    name: 'required',
    description: '表单项是否必填',
    type: 'boolean',
    default: false,
  },
  {
    name: 'email',
    description: '表单项验证邮箱',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'max',
    description: '表单项最大值',
    type: 'number',
    default: 0,
  },
  {
    name: 'min',
    description: '表单项最小值',
    type: 'number',
    default: 0,
  },
  {
    name: 'maxlength',
    description: '表单项最大长度',
    type: 'number',
    default: 0,
  },
  {
    name: 'rules',
    description: '表单项验证规则',
    type: 'array',
    default: [],
  },
  {
    name: 'description',
    description: '表单项描述',
    type: 'string',
    default: '',
  },
  {
    name: 'error-display-type',
    description: '表单项错误信息显示类型',
    type: 'string',
    enum: ['normal', 'tooltips'],
    default: 'normal',
  },
  {
    name: 'error-tip-append-to-parent',
    description: '表单项错误信息是否追加到父级',
    type: 'boolean',
    default: false,
  },
];

const emits = [
  {
    name: 'submit',
    description: '表单提交',
    type: 'function',
  },
  {
    name: 'validate',
    description: '表单项验证',
    type: 'function',
  },
];

const group = NavGroupMeta.Form;

const name = 'form';

const title = 'Form';

const titleCN = '表单';

export default {
  presets,
  props,
  emits,
  group,
  name,
  title,
  titleCN,
};
