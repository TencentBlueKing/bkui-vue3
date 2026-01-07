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
    description: '通过拉伸、展开收起的交互调整页面的布局',
    props: {
      'initial-divide': '40%',
      placement: 'left',
    },
    slots: {
      aside: `<div>aside</div>`,
      main: `<div>main</div>`,
    },
  },
  {
    title: '最小化',
    description: '是否自动最小化',
    props: {
      'auto-minimize': true,
    },
    slots: {
      aside: `<div>aside</div>`,
      main: `<div>main</div>`,
    },
  },
  {
    title: '实时拉伸',
    description: '是否实时拉伸',
    props: {
      immediate: true,
    },
    slots: {
      aside: `<div>aside</div>`,
      main: `<div>main</div>`,
    },
  },
  {
    title: '可折叠',
    description: '是否开启折叠功能',
    props: {
      collapsible: true,
      isCollapsed: true,
    },
    slots: {
      aside: `<div>aside</div>`,
      main: `<div>main</div>`,
    },
  },
  {
    title: '多级嵌套',
    description: '多级嵌套',
    props: {
      collapsible: true,
    },
    slots: {
      aside: `
        <bk-resize-layout
          :border="false"
          placement="top"
          collapsible
        >
          <template #aside>
            <div>aside-top</div>
          </template>
          <template #main>
            <div>main-1</div>
          </template>
        </bk-resize-layout>
      `,
      main: `
        <bk-resize-layout
          :border="false"
          placement="bottom"
          collapsible
        >
          <template #aside>
            <div>aside-bottom</div>
          </template>
          <template #main>
            <bk-resize-layout
              style="height: 100%"
              :border="false"
              placement="right"
              collapsible
            >
              <template #aside>
                <div>aside-right</div>
              </template>
              <template #main>
                <div>main-3</div>
              </template>
            </bk-resize-layout>
          </template>
        </bk-resize-layout>
      `,
    },
    dependent: {
      components: ['resize-layout'],
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'placement',
    description: '侧栏在布局中的位置',
    type: 'string',
    default: 'left',
    options: ['top', 'left', 'right', 'bottom'],
  },
  {
    name: 'min',
    description: '侧栏最小像素宽度',
    type: 'number',
    default: 3,
  },
  {
    name: 'max',
    description: '侧栏最大像素宽度',
    type: 'number',
    default: Infinity,
  },
  {
    name: 'triggerWidth',
    description: '拖拽区域大小',
    type: 'number',
    default: 5,
  },
  {
    name: 'initialDivide',
    description: '侧栏初始大小,当同时设置initialDivide与min都为number类型时以最大值为默认值',
    type: 'string',
    default: '20%',
  },
  {
    name: 'immediate',
    description: '是否实时拉伸',
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
    name: 'collapsible',
    description: '是否开启折叠功能',
    type: 'boolean',
    default: false,
  },
  {
    name: 'isCollapsed',
    description: '折叠状态',
    type: 'boolean',
    default: false,
  },
  {
    name: 'autoMinimize',
    description: '是否自动折叠',
    type: 'boolean',
    default: false,
  },
  {
    name: 'border',
    description: '是否显示外边框',
    type: 'boolean',
    default: true,
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'before-resize',
    description: '拉伸前的回调',
    params: [
      {
        name: 'e',
        type: 'event',
      },
    ],
  },
  {
    name: 'resizing',
    description: '拉伸时的回调',
    params: [
      {
        name: 'value',
        type: 'number',
      },
    ],
  },
  {
    name: 'after-resize',
    description: '拉伸后的回调',
    params: [
      {
        name: 'value',
        type: 'number',
      },
    ],
  },
  {
    name: 'collapse-change',
    description: '展开/折叠状态变更事件',
    params: [
      {
        name: 'isCollapsed',
        type: 'boolean',
      },
    ],
  },
];

const slots = [
  {
    name: 'aside',
    description: '侧栏内容',
  },
  {
    name: 'main',
    description: '主要内容',
  },
  {
    name: 'collapse-trigger',
    description: '折叠按钮',
  },
];

// 组件自定义的复杂类型
const types = [];

// 组件分组
const group = NavGroupMeta.Layout;

// 组件名称
const name = 'resize-layout';

// 组件标签
const title = 'ResizeLayout';

// 组件中文标签
const titleCN = '拉伸布局';

// 组件描述
const description = '通过拉伸侧栏调整布局大小';

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  presets,
  types,
  description,
  slots,
};
export default wiki;
