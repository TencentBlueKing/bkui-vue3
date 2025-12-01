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
    title: '多选框组',
    description: '多个选项在同一个数组的场景，label 配置选中时的值',
    props: {
      modelValue: [],
    },
    slots: {
      default: `
        <bk-checkbox label="微信" />
        <bk-checkbox label="QQ" />
        <bk-checkbox label="Email" />
      `,
    },
    dependent: {
      components: ['checkbox'],
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'modelValue',
    description: '绑定值',
    type: 'Array<any>',
    isSupportVModel: true,
  },
  {
    name: 'disabled',
    description: '是否禁用',
    type: 'boolean',
    default: false,
  },
  {
    name: 'withValidate',
    description: '值改变时是否触发表单的校验',
    type: 'boolean',
    default: true,
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
        type: 'Array<any>',
      },
    ],
  },
  {
    name: 'change',
    description: '选中状态变化时触发',
    params: [
      {
        name: 'value',
        type: 'Array<any>',
      },
    ],
  },
];

// 组件插槽，用来自动生成插槽文档
const slots = [
  {
    name: 'default',
    description: '默认插槽',
  },
];

// 组件分组
const group = NavGroupMeta.Form;

// 组件名称
const name = 'checkbox-group';

// 组件标签
const title = 'CheckboxGroup';

// 组件中文标签
const titleCN = '多选框组';

// 组件描述
const description = '多选框组组件';

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
