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
    title: '基础用法',
    description: '通过 theme 设置不同的主题， success / info / warning / danger. 也可通过 ext-cls 配置自定义样式类名',
    props: {
      theme: 'default',
    },
    slots: {
      default: '标签',
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'theme',
    description: 'Tag 主题',
    type: 'string',
    default: '',
    options: ['primary', 'success', 'warning', 'danger', 'info', 'default'],
  },
  {
    name: 'closable',
    description: '是否可关闭',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'type',
    description: 'Tag 的样式类型',
    type: 'string',
    default: '',
    options: ['filled', 'stroke'],
  },
  {
    name: 'checkable',
    description: '是否可选中',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'checked',
    description: '是否选中，跟 checkable 配合使用',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'radius',
    description: 'Tag 的边框圆角值',
    type: 'string',
    default: '2px',
  },
  {
    name: 'size',
    description: 'Tag 的尺寸大小',
    type: 'string',
    default: 'medium',
    options: ['small', 'medium', 'large'],
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'change',
    description: '选中状态改变的回调，参数为新的选中状态',
    params: [
      {
        name: 'checked',
        type: 'boolean',
      },
    ],
  },
  {
    name: 'close',
    description: '关闭 Tag 时的回调',
    params: [
      {
        name: 'e',
        type: 'Event',
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Data;

// 组件名称
const name = 'tag';

// 组件标签
const title = 'Tag';

// 组件中文标签
const titleCN = '标签';

// 组件描述
const description = '标签';

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
