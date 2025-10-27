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
    title: '经典模式',
    description: '有标题格式标准化的确认框',
    props: {
      trigger: 'click',
      title: '文本框',
      content: '',
      confirmText: '确定',
      cancelText: '取消',
    },
    slots: {
      default: `
        <div style="align-self: center;">这是一段需要确认的内容</div>
      `,
    },
  },
  {
    title: '简易模式',
    description: '没有标题的确认框',
    props: {
      trigger: 'click',
      content: '',
      confirmText: '确定',
      cancelText: '取消',
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'trigger',
    description: '触发方式',
    type: 'string',
    options: ['click', 'hover'],
    default: 'hover',
  },
  {
    name: 'title',
    description: '标题',
    type: 'string',
    default: '',
  },
  {
    name: 'content',
    description: '正文',
    type: 'string',
    default: '',
  },
  {
    name: 'confirmText',
    description: '确认按钮文字',
    type: 'string',
    default: '',
  },
  {
    name: 'cancelText',
    description: '取消按钮文字',
    type: 'string',
    default: '',
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
    default: 'light',
  },
  {
    name: 'width',
    description: '宽度',
    type: 'string | number',
    default: 'auto',
  },
  {
    name: 'confirmConfig',
    description: '确定按钮的配置，同Button的Props',
    type: 'ButtonPropTypes',
    default: {},
  },
  {
    name: 'cancelConfig',
    description: '取消按钮的配置，同Button的Props',
    type: 'ButtonPropTypes',
    default: {},
  },
  {
    name: 'popover-options',
    description: 'Popover组件的配置项',
    type: 'PopoverPropTypes',
    default: {},
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'confirm',
    description: '确定操作回调函数',
    params: [],
  },
  {
    name: 'cancel',
    description: '取消操作回调函数',
    params: [],
  },
  {
    name: 'after-show',
    description: '显示提示框时触发函数',
    params: [],
  },
  {
    name: 'after-hidden',
    description: '隐藏提示框时触发函数',
    params: [],
  },
];

// 组件自定义的复杂类型
const types = [
  {
    name: 'ButtonPropTypes',
    type: 'ButtonPropTypes',
    link: '/component/button/api#ButtonPropTypes',
    description: '按钮的配置项',
  },
  {
    name: 'PopoverPropTypes',
    type: 'PopoverPropTypes',
    link: '/component/popover/api#PopoverPropTypes',
    description: '弹出内容的配置项',
  },
];

// 组件分组
const group = NavGroupMeta.Nav;

// 组件名称
const name = 'pop-confirm';

// 组件标签
const title = 'Popconfirm';

// 组件中文标签
const titleCN = '弹出确认框';

// 组件描述
const description =
  'bkPopconfirm是基于bkPopover改造而来，继承了bkPopover所有属性，具体请参考bkPopover文档，本文主要列出bkPopconfirm独有或不同的属性。基础样式由标题、正文和按钮构成。';

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
};

export default wiki;
