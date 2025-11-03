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
    title: '基础样式',
    description: '用于单选选项平铺展示场景',
    props: {
      label: '基础样式',
      checked: false,
    },
  },
  {
    title: '胶囊样式',
    description: '用于单选选项胶囊组展示场景',
    props: {
      size: 'small',
      modelValue: [],
    },
    template: `
     <bk-radio-group
        type="capsule"
      >
        <bk-radio-button label="QQ" />
        <bk-radio-button label="原始数据" />
        <bk-radio-button label="字典翻译" />
        <bk-radio-button label="微信" />
        <bk-radio-button label="Email" />
      </bk-radio-group>
    `,
  },
  {
    title: '按钮组样式',
    description: '用于单选选项按钮组展示场景',
    props: {
      size: 'small',
      modelValue: [],
    },
    template: `
      <bk-radio-group>
        <bk-radio-button label="QQ" />
        <bk-radio-button label="微信" />
        <bk-radio-button label="Email" />
      </bk-radio-group>
    `,
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'name',
    description: '名称',
    type: 'string',
    default: '',
  },
  {
    name: 'label',
    description: '标签',
    type: 'string | number | boolean',
    default: '',
  },
  {
    name: 'modelValue',
    description: '绑定值',
    type: 'string | number | boolean',
    default: '',
  },
  {
    name: 'checked',
    description: '是否选中',
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
    name: 'beforeChange',
    description: '前置改变事件',
    type: '(event: boolean | number | string) => Promise<boolean> | boolean',
    default: '() => true',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'update:modelValue',
    description: '绑定值改变时触发',
    params: [
      {
        name: 'value',
        type: 'string | number | boolean',
      },
    ],
  },
  {
    name: 'change',
    description: '值改变时触发',
    params: [
      {
        name: 'value',
        type: 'string | number | boolean',
      },
    ],
  },
];

const slots = [
  {
    name: 'default',
    description: '默认插槽, 用于放置单选框的标签',
  },
];

// 组件分组
const group = NavGroupMeta.Data;

// 组件名称
const name = 'radio';

// 组件标签
const title = 'Radio';

// 组件中文标签
const titleCN = '单选框';

// 组件描述
const description = '表单-单选框，在一组选项中进行单选';

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
  children: [
    {
      name: 'radio-group',
      props: [
        {
          name: 'name',
          description: '名称',
          type: 'string',
          default: '',
        },
        {
          name: 'modelValue',
          description: '绑定值',
          type: 'string | number | boolean',
          default: '',
        },
        {
          name: 'disabled',
          description: '是否禁用',
          type: 'boolean',
          default: false,
        },
        {
          name: 'beforeChange',
          description: '前置改变事件',
          type: '(event: boolean | number | string) => Promise<boolean> | boolean',
          default: '() => true',
        },
        {
          name: 'size',
          description: '尺寸',
          type: 'string',
          default: '',
          options: ['small', '', 'large'],
        },
        {
          name: 'type',
          description: '类型',
          type: 'string',
          default: 'default',
        },
        {
          name: 'withValidate',
          description: '值改变时是否触发表单的校验',
          type: 'boolean',
          default: true,
        },
      ],
      emits: [
        {
          name: 'change',
          description: '值改变时触发',
          params: [
            {
              name: 'value',
              type: 'string | number | boolean',
            },
          ],
        },
      ],
      slots: [
        {
          name: 'default',
          description: '默认插槽',
        },
      ],
    },
    {
      name: 'radio-button',
      props: [
        {
          name: 'name',
          description: '名称',
          type: 'string',
          default: '',
        },
        {
          name: 'label',
          description: '标签',
          type: 'string | number | boolean',
          default: '',
        },
        {
          name: 'modelValue',
          description: '绑定值',
          type: 'string | number | boolean',
          default: '',
        },
        {
          name: 'checked',
          description: '是否选中',
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
          name: 'beforeChange',
          description: '前置改变事件',
          type: '(event: boolean | number | string) => Promise<boolean> | boolean',
          default: '() => true',
        },
        {
          name: 'size',
          description: '尺寸',
          type: 'string',
          default: '',
          options: ['small', '', 'large'],
        },
      ],
      emits: [
        {
          name: 'change',
          description: '值改变时触发',
          params: [
            {
              name: 'value',
              type: 'string | number | boolean',
            },
          ],
        },
      ],
      slots: [
        {
          name: 'default',
          description: '默认插槽',
        },
      ],
    },
  ],
};

export default wiki;
