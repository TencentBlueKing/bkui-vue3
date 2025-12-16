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
    description: '基础的评分组件使用',
    props: {
      modelValue: 3.5,
      size: 'small',
      editable: true,
      withValidate: true,
    },
  },
  {
    title: '大小设置',
    description: '配置 size',
    props: {
      modelValue: 3.5,
      size: 'large',
      editable: true,
      withValidate: true,
    },
  },
  {
    title: '监听 change 事件',
    description: '配置 editable',
    props: {
      modelValue: 3.5,
      editable: true,
      withValidate: true,
    },
    events: {
      change: `(val) => {
        BkMessage({
          message: \`评分：\${val}\`,
        });
      }`,
    },
    dependent: {
      components: ['message'],
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'modelValue',
    description: '评分',
    type: 'number',
    default: 0,
  },
  {
    name: 'size',
    description: '大小',
    type: 'string',
    default: 'small',
  },
  {
    name: 'editable',
    description: '是否可编辑',
    type: 'boolean',
    default: true,
  },
  {
    name: 'withValidate',
    description: '是否显示验证',
    type: 'boolean',
    default: true,
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'change',
    description: '值变化时触发',
    params: [
      {
        name: 'val',
        type: 'number',
      },
    ],
  },
  {
    name: 'hover-change',
    description: '鼠标悬停时触发',
    params: [
      {
        name: 'val',
        type: 'number',
      },
    ],
  },
  {
    name: 'update:modelValue',
    description: 'v-model 更新时触发',
    params: [
      {
        name: 'val',
        type: 'number',
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Form;

// 组件名称
const name = 'rate';

// 组件标签
const title = 'Rate';

// 组件中文标签
const titleCN = '评分';

// 组件描述
const description = '评分';

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
