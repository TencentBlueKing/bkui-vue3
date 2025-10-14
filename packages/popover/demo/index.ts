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
import { NavGroupMeta } from '@bkui-vue/shared';
import { EMIT_EVENTS } from '../src/const';

// 组件示例
const presets = [
  {
    title: '基础用法',
    description: 'popover 的基础用法',
    props: {
      placement: 'auto',
      theme: 'dark',
      trigger: 'hover',
      content: '这是popover的内容',
      width: 300,
      height: 200,
      maxWidth: 300,
      maxHeight: 200,
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
    type: 'IContent',
    default: '',
  },
  {
    name: 'renderDirective',
    description: '渲染方式，值为 show 时，气泡内容 dom 元素不会销毁',
    type: 'if | show',
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
    type: 'auto | auto-start | auto-end | top | top-start | top-end | bottom | bottom-start | bottom-end | left | left-start | left-end | right | right-start | right-end',
    default: 'top-start',
  },
  {
    name: 'theme',
    description: '组件主题色',
    type: 'dark | light',
    default: 'dark',
  },
  {
    name: 'trigger',
    description: '触发方式。如果值为manual，则通过isShow控制显示、隐藏',
    type: 'click | hover | manual',
    default: 'hover',
  },
  {
    name: 'renderType',
    description: 'content 渲染方式, auto: 默认渲染模式，shown：弹出层容器挂载完毕才会渲染内部组件',
    type: 'auto | shown',
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
    description: '弹出位置偏移， IAxesOffsets：{ mainAxis?: number; crossAxis?: number; alignmentAxis?: number | null; }',
    type: 'number | IAxesOffsets',
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
    description: '用于设置显示隐藏延迟时间，如果设置为数值类型，则表示显示和隐藏都延迟指定数值，如果需要分开设置显示隐藏请设置为数组[showDelay, hideDealy]',
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
    description: '自定义Content组件渲染，point-event延迟渲染时间，避免子组件point-event渲染时触发popover鼠标事件，如果设置为0，则不启用此设置',
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
    name: EMIT_EVENTS.CLICK_OUTSIDE,
    description: '点击空白区域时触发的事件',
    params: [
      {
        name: '_args',
        type: {
          isShow: 'boolean',
          event: 'MouseEvent',
        },
      },
    ],
  },
  {
    name: EMIT_EVENTS.CONTENT_MOUSEENTER,
    description: '鼠标移入内容时触发的事件',
    params: [
      {
        name: 'e',
        type: 'MouseEvent',
      },
    ],
  },
  {
    name: EMIT_EVENTS.CONTENT_MOUSELEAVE,
    description: '鼠标移出内容时触发的事件',
    params: [
      {
        name: 'e',
        type: 'MouseEvent',
      },
    ],
  },
  {
    name: EMIT_EVENTS.CONTENT_AfterHidden,
    description: '内容隐藏时触发的事件',
    params: [
      {
        name: '_args',
        type: {
          isShow: 'boolean',
        },
      },
    ],
  },
  {
    name: EMIT_EVENTS.CONTENT_AfterShow,
    description: '内容显示时触发的事件',
    params: [
      {
        name: '_args',
        type: {
          isShow: 'boolean',
        },
      },
    ],
  },
];

// 组件自定义的复杂类型
const types = [
  {
    name: 'IContent',
    description: '显示的内容',
    type: 'HTMLElement | JSX.Element | number | string',
  },
  {
    name: 'IAxesOffsets',
    description: '位置偏移',
    fields: [
      {
        name: 'mainAxis',
        type: 'number',
        description: '',
      },
      {
        name: 'crossAxis',
        type: 'number',
        description: '',
      },
      {
        name: 'alignmentAxis',
        type: 'number | null',
        description: '',
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Nav;

// 组件名称
const name = 'popover';

// 组件标签
const title = 'Popover';

// 组件中文标签
const titleCN = '弹出框提示';

// 组件描述
const description = '当鼠标指向页面元素时给出简单的提示';

export default {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  presets,
  types,
  description,
};
