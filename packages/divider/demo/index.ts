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
    title: '基础分割线',
    description: '没有文字的独立分割线条',
    props: {
      direction: 'horizontal',
    },
  },
  {
    title: '文字分割线',
    description: '垂直分割线条',
    props: {
      direction: 'horizontal',
    },
    slots: {
      default: '<div>文字分割线</div>',
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'direction',
    description: '分割线方向',
    type: 'string',
    options: ['horizontal', 'vertical'],
    default: 'horizontal',
  },
  {
    name: 'align',
    description: '分割线对齐方式',
    type: 'string',
    options: ['left', 'center', 'right'],
    default: 'center',
  },
  {
    name: 'color',
    description: '分割线颜色',
    type: 'string',
    default: '#dde4eb',
  },
  {
    name: 'width',
    description: '分割线宽度',
    type: 'number',
    default: 1,
  },
  {
    name: 'type',
    description: '分割线类型',
    type: 'string',
    options: ['solid', 'dashed'],
    default: 'solid',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'click',
    description: '点击分割线时触发',
    params: [
      {
        name: 'event',
        type: 'MouseEvent',
      },
    ],
  },
];

const slots = [
  {
    name: 'default',
    description: '默认插槽',
  },
];

// 组件分组
const group = NavGroupMeta.Nav;

// 组件名称
const name = 'divider';

// 组件标签
const title = 'Divider';

// 组件中文标签
const titleCN = '分割线';

// 组件描述
const description = '分割线';

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
