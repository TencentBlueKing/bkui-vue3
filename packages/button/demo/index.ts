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
    description: '用默认配置初始化组件',
    props: {
      theme: 'default',
      size: 'small',
    },
    slots: {
      default: `基础按钮`,
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'theme',
    description: '按钮主题',
    options: ['primary', 'success', 'danger', 'warning', 'default'],
    type: 'string',
    default: 'default',
  },
  {
    name: 'size',
    description: '按钮尺寸大小',
    options: ['small', 'large'],
    type: 'string',
  },
  {
    name: 'hover-theme',
    description: 'mouseHover 按钮样式, 当设置了此属性时，theme 和 text 失效',
    options: ['primary', 'success', 'danger', 'warning', 'default'],
    type: 'string',
    default: 'primary',
  },
  {
    name: 'text',
    description: '是否为文字按钮',
    type: 'boolean',
  },
  {
    name: 'outline',
    description: '是否为反色按钮',
    type: 'boolean',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'click',
    description: '点击时触发事件',
    params: [
      {
        name: 'event',
        type: 'MouseEvent',
      },
    ],
  },
  {
    name: 'mouseover',
    description: '鼠标移入触发事件',
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
const group = NavGroupMeta.Base;

// 组件名称
const name = 'button';

// 组件标签
const title = 'Button';

// 组件中文标签
const titleCN = '基础按钮';

// 组件描述
const description = '常用的操作按钮';

const wiki: IComponentWiki = {
  group,
  name,
  slots,
  title,
  titleCN,
  props,
  emits,
  presets,
  description,
};

export default wiki;
