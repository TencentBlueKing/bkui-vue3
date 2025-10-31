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
    description: '基础的虚拟渲染',
    props: {
      list: Array.from({ length: 1000 }, (_, index) => ({
        name: `用户${index + 1}`,
        index: index,
      })),
      height: 500,
      lineHeight: 30,
    },
    slots: {
      default: `
        <div
          v-for="item, index in data.data"
          :key="index"
          :style="{ height: '30px' }"
        >
          <span> name: {{ item.name }} </span>
          ---
          <span> index: {{ item.index }} </span>
        </div>
      `,
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'list',
    description: '传入原始数据源',
    type: 'Array<any>',
    default: '[]',
  },
  {
    name: 'enabled',
    description: '是否启用此功能, 设置为true才会启用所有的虚拟渲染 & 滚动相关计算',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'scrollEvent',
    description: '是否启用内置的Scroll Listener',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'lineHeight',
    description: '每行数据高度',
    type: 'number | function',
    default: '30',
  },
  {
    name: 'minHeight',
    description: '整体最小高度',
    type: 'number',
    default: '30',
  },
  {
    name: 'maxHeight',
    description: '整体最大高度',
    type: 'number | string',
    default: '',
  },
  {
    name: 'height',
    description: '整体高度, 可设置具体值，如果设置为 100%，则组件会自动计算外层DOM元素offsetHeight，用于计算可渲染行数',
    type: 'number | string',
    default: '100%',
  },
  {
    name: 'width',
    description: '渲染区域宽度, 如果设置 100% 则自适应外层元素宽度',
    type: 'number | string',
    default: '100%',
  },
  {
    name: 'className',
    description: '最外层元素ClassName',
    type: 'string | Array<string | object> | object',
    default: '',
  },
  {
    name: 'contentClassName',
    description: '内层层元素ClassName',
    type: 'string | Array<string | object> | object',
    default: '',
  },
  {
    name: 'contentStyle',
    description: '内层元素样式',
    type: 'object',
    default: '{}',
  },
  {
    name: 'scrollXName',
    description: '用于自定义X轴滚动条样式',
    type: 'string',
    default: 'F-scroll-x',
  },
  {
    name: 'scrollYName',
    description: '用于自定义Y轴滚动条样式',
    type: 'string',
    default: 'F-scroll-y',
  },
  {
    name: 'groupItemCount',
    description: '分组展示，一行数据可能有多条数据',
    type: 'number',
    default: '1',
  },
  {
    name: 'preloadItemCount',
    description: '预加载行数，避免空白渲染',
    type: 'number',
    default: '1',
  },
  {
    name: 'renderAs',
    description: '外层Dom元素需要渲染成的目标元素',
    type: 'string',
    default: 'div',
  },
  {
    name: 'scrollOffsetTop',
    description: 'top 滚动填充',
    type: 'number',
    default: '0',
  },
  {
    name: 'scrollPosition',
    description: '内置滚动位置',
    type: 'string',
    default: 'content',
  },
  {
    name: 'abosuteHeight',
    description: '绝对高度 | 实际高估',
    type: 'string | number',
    default: 'auto',
  },
  {
    name: 'throttleDelay',
    description: '滚动刷新计算间隔时间',
    type: 'number',
    default: '60',
  },
  {
    name: 'rowKey',
    description: '传入数据如果没有设置rowKey，是否自动生成$index作为唯一ID',
    type: 'string',
    default: 'undefined',
  },
  {
    name: 'keepAlive',
    description: '数据改变时是否保持之前的状态',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'scrollbar',
    description: '是否允许滚动条改变原有DOM结构',
    type: 'IScrollbarOption',
    default: '{ enabled: true }',
    link: '/components/virtual-render/api#IScrollbarOption',
  },
  {
    name: 'autoReset',
    description: '数据监听改变时，是否自动重置位置到[0, 0]',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'wrapperStyle',
    description: '外层元素样式',
    type: 'object',
    default: '{}',
  },
  {
    name: 'autoIndex',
    description: '传入数据如果没有设置rowKey，是否自动生成$index作为唯一ID',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'onContentScroll',
    description: '内容滚动事件',
    type: 'function',
    default: '',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'content-scroll',
    description: '内容滚动事件',
    params: [
      {
        name: 'event',
        type: 'any',
        description: '滚动事件',
      },
    ],
  },
];

const slots = [
  {
    name: 'default',
    description: '默认插槽',
    params: [
      {
        name: 'data',
        type: 'Array<any>',
        description: '数据',
      },
    ],
  },
  {
    name: 'beforeContent',
    description: '前插槽',
  },
  {
    name: 'afterContent',
    description: '后插槽',
  },
  {
    name: 'afterSection',
    description: '后分组插槽',
  },
];

const types = [
  {
    name: 'IScrollbarOption',
    description: '滚动条选项',
    fields: [
      {
        name: 'enabled',
        type: 'boolean',
        description: '是否启用滚动条',
      },
      {
        name: 'size',
        type: 'string',
        description: '滚动条尺寸',
        default: 'normal',
        options: ['normal', 'small'],
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Data;

// 组件名称
const name = 'virtual-render';

// 组件标签
const title = 'VirtualRender';

// 组件中文标签
const titleCN = '虚拟渲染';

// 组件描述
const description = '虚拟渲染';

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  types,
  slots,
  presets,
  description,
};

export default wiki;
