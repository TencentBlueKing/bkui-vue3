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
    description: '最简单的用法',
    props: {
      width: 400,
      renderType: 'auto',
      theme: 'light',
    },
    slots: {
      default: `<div class="bk-popover-demo">当鼠标经过这段文字时，会显示一个气泡框</div>`,
      content: `<div>
JSX value should be either an expression or a quoted JSX text ...
Quoted JSX attributes use XML-style escapes #1225 - GitHub
Substitution Scholia and Thucydides' Use of Prepositions
    </div>
      `,
    },
  },
  {
    title: '不同位置',
    description: '通过 placement 属性展示十二种方位的提示',
    props: {
      popoverDelay: [300, 0],
      content: 'placement 文字提示',
      placement: 'top-start',
      theme: 'light',
    },
    slots: {
      default: `<bk-button class="bk-popover-demo">placement</bk-button>`,
    },
    dependent: {
      components: ['button'],
    },
  },
  {
    title: '总是显示',
    description: '设置属性 always 总是显示提示框',
    props: {
      width: 300,
      content:
        '这里是提示文字当鼠标经过这段文字时，会显示一个气泡框当鼠标经过这段文字时，会显示一个气泡框当鼠标经过这段文字时',
      placement: 'right',
      theme: 'light',
      always: true,
    },
    slots: {
      default: `<bk-button class="bk-popover-demo">总是显示</bk-button>`,
    },
    dependent: {
      components: ['button'],
    },
  },
  {
    title: '点击占位区弹窗不收起',
    description: '设置 hideIgnoreReference: true，若占位区为非行内元素，请配置 referenceCls: 类名',
    props: {
      content: '确实不会收起',
      trigger: 'click',
      hideIgnoreReference: true,
    },
    slots: {
      default: `<div class="bk-popover-demo">点我不会收起弹窗</div>`,
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'isShow',
    description: '控制显示、隐藏',
    type: 'boolean',
    default: false,
  },
  {
    name: 'always',
    description: '是否总是可见',
    type: 'boolean',
    default: false,
  },
  {
    name: 'disabled',
    description: '是否禁用提示框',
    type: 'boolean',
    default: false,
  },
  {
    name: 'clickContentAutoHide',
    description: '非 manual 模式，点击 content 自动隐藏面板',
    type: 'boolean',
    default: false,
  },
  {
    name: 'width',
    description: '提示框的内容容器的宽度',
    type: 'string | number',
    default: 'auto',
  },
  {
    name: 'height',
    description: '提示框的内容容器的高度',
    type: 'string | number',
    default: 'auto',
  },
  {
    name: 'maxWidth',
    description: '提示框的内容容器的最大宽度',
    type: 'string | number',
    default: 'auto',
  },
  {
    name: 'maxHeight',
    description: '提示框的内容容器的最大高度',
    type: 'string | number',
    default: 'auto',
  },
  {
    name: 'content',
    description: '显示的内容',
    type: 'HTMLElement | JSX.Element | number | string',
    default: '',
  },
  {
    name: 'renderDirective',
    description: '渲染方式，值为 show 时，气泡内容 dom 元素不会销毁',
    type: 'string',
    options: ['if', 'show'],
    default: 'if',
  },
  {
    name: 'target',
    description: '',
    type: 'string | HTMLElement | PointerEvent',
    default: '',
  },
  {
    name: 'allowHtml',
    description: 'Content 是否支持传入HTML string',
    type: 'boolean',
    default: false,
  },
  {
    name: 'placement',
    description: '组件显示位置',
    type: 'string',
    options: [
      'auto',
      'auto-start',
      'auto-end',
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'left',
      'left-start',
      'left-end',
      'right',
      'right-start',
      'right-end',
    ],
    default: 'top-start',
  },
  {
    name: 'theme',
    description: '组件主题色',
    type: 'string',
    options: ['dark', 'light'],
    default: 'dark',
  },
  {
    name: 'trigger',
    description: '触发方式。如果值为manual，则通过isShow控制显示、隐藏',
    type: 'string',
    options: ['click', 'hover', 'manual'],
    default: 'hover',
  },
  {
    name: 'renderType',
    description: 'content 渲染方式, auto: 默认渲染模式，shown：弹出层容器挂载完毕才会渲染内部组件',
    type: 'string',
    options: ['auto', 'shown'],
    default: 'shown',
  },
  {
    name: 'arrow',
    description: '是否显示箭头',
    type: 'boolean',
    default: false,
  },
  {
    name: 'padding',
    description: '弹出填充',
    type: 'number',
    default: 5,
  },
  {
    name: 'offset',
    description:
      '弹出位置偏移， IAxesOffsets：{ mainAxis?: number; crossAxis?: number; alignmentAxis?: number | null; }',
    type: 'number | IAxesOffsets',
    link: '/component/popover/api#IAxesOffsets',
    default: 6,
  },
  {
    name: 'boundary',
    description: '弹出内容绑定元素',
    type: 'parent | HTMLElement',
    default: 'parent',
  },
  {
    name: 'zIndex',
    description: '层级',
    type: 'number',
    default: undefined,
  },
  {
    name: 'disableTeleport',
    description: '是否禁用 Teleport',
    type: 'boolean',
    default: false,
  },
  {
    name: 'autoPlacement',
    description: '自动选择具有最多可用空间的展示位置',
    type: 'boolean',
    default: false,
  },
  {
    name: 'autoVisibility',
    description: '当有滚动条，滚动出可视范围时自动隐藏pop',
    type: 'boolean',
    default: true,
  },
  {
    name: 'disableOutsideClick',
    description: '是否禁用clickoutside',
    type: 'boolean',
    default: false,
  },
  {
    name: 'disableTransform',
    description: '是否禁用css transform更新位移',
    type: 'boolean',
    default: false,
  },
  {
    name: 'reference',
    description: '自定义 reference',
    type: 'any',
    default: null,
  },
  {
    name: 'modifiers',
    description: '兼容v1版本遗留配置，不建议使用',
    type: 'array',
    default: [],
  },
  {
    name: 'popoverDelay',
    description:
      '用于设置显示隐藏延迟时间，如果设置为数值类型，则表示显示和隐藏都延迟指定数值，如果需要分开设置显示隐藏请设置为数组[showDelay, hideDealy]',
    type: 'number | array',
    default: 100,
  },
  {
    name: 'extCls',
    description: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM',
    type: 'string',
    default: '',
  },
  {
    name: 'referenceCls',
    description: '配置自定义样式类名，传入的类会被加在 Reference 外部的 div 上',
    type: 'string',
    default: '',
  },
  {
    name: 'hideIgnoreReference',
    description: '点击 Reference 占位区是否忽略收起 popover',
    type: 'boolean',
    default: false,
  },
  {
    name: 'componentEventDelay',
    description:
      '自定义Content组件渲染，point-event延迟渲染时间，避免子组件point-event渲染时触发popover鼠标事件，如果设置为0，则不启用此设置',
    type: 'number',
    default: 0,
  },
  {
    name: 'forceClickoutside',
    description: '或略其他判定条件，强制监听clickoutside & 执行hide',
    type: 'boolean',
    default: false,
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'clickoutside',
    description: '点击空白区域时触发的事件',
    params: [
      {
        name: '_args',
        type: "{isShow: 'boolean', event: 'MouseEvent'}",
      },
    ],
  },
  {
    name: 'contentMouseenter',
    description: '鼠标移入内容时触发的事件',
    params: [
      {
        name: 'e',
        type: 'MouseEvent',
      },
    ],
  },
  {
    name: 'contentMouseleave',
    description: '鼠标移出内容时触发的事件',
    params: [
      {
        name: 'e',
        type: 'MouseEvent',
      },
    ],
  },
  {
    name: 'afterHidden',
    description: '内容隐藏时触发的事件',
    params: [
      {
        name: '_args',
        type: "{isShow: 'boolean'}",
      },
    ],
  },
  {
    name: 'afterShow',
    description: '内容显示时触发的事件',
    params: [
      {
        name: '_args',
        type: "{isShow: 'boolean'}",
      },
    ],
  },
];

// 组件暴露方法
const exposes = [
  {
    name: 'show',
    description: '弹出popover',
    type: 'Function',
  },
  {
    name: 'hide',
    description: '隐藏popover',
    type: 'Function',
  },
  {
    name: 'stopHide',
    description: '阻止隐藏popover',
    type: 'Function',
  },
  {
    name: 'updatePopover',
    description: '更新popover配置，参数 (virtualEl = null, props = {})',
    type: 'Function',
  },
  {
    name: 'handleClickOutside',
    description: '触发click outside',
    type: 'Function',
  },
];

// // 组件自定义的复杂类型
const types = [
  {
    name: 'IAxesOffsets',
    description: '位置偏移',
    fields: [
      {
        name: 'mainAxis',
        type: 'number',
        description: '主轴偏移量',
      },
      {
        name: 'crossAxis',
        type: 'number',
        description: '交叉轴偏移量',
      },
      {
        name: 'alignmentAxis',
        type: 'number | null',
        description: '对齐轴偏移量',
      },
    ],
  },
];

const slots = [
  {
    name: 'default',
    description: '默认插槽',
  },
  {
    name: 'content',
    description: '弹框内容插槽',
  },
];

// 组件分组
const group = NavGroupMeta.Feedback;

// 组件名称
const name = 'popover';

// 组件标签
const title = 'Popover';

// 组件中文标签
const titleCN = '弹出框提示';

// 组件描述
const description = '当鼠标指向页面元素时给出简单的提示';

const wiki: IComponentWiki = {
  group,
  name,
  slots,
  title,
  titleCN,
  props,
  emits,
  exposes,
  presets,
  types,
  description,
};

export default wiki;
