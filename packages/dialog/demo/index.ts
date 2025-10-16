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
    description: 'isShow 控制 dialog 的显示隐藏',
    props: {
      'show-mask': false,
      'is-show': true,
      transfer: '.edit-component-view',
    },
    slots: {
      default: '<div>dialog 内容</div>',
    },
  },
  {
    title: '遮罩',
    description: '通过设置 showMask 属性来设置是否显示遮罩',
    props: {
      'show-mask': false,
      title: '没有遮罩的 dialog',
      transfer: '.edit-component-view',
    },
    slots: {
      default: '<div>dialog 内容</div>',
    },
  },
  {
    title: '遮罩',
    description: '通过 beforeChange 属性关闭前确认。',
    props: {
      title: '关闭前确认',
      transfer: '.edit-component-view',
      'before-close': () => {
        return new Promise(resolve => {
          alert('确认关闭？');
          resolve(true);
        });
      },
    },
    slots: {
      default: '<div>dialog 内容</div>',
    },
  },
  {
    title: '全屏弹框',
    description: '通过 fullscreen 属性配置全屏弹框，当设置为全屏弹框时，draggable 配置不生效即弹框不能拖动。',
    props: {
      title: '全屏弹框',
      fullscreen: true,
      transfer: '.edit-component-view',
    },
    slots: {
      default: '<div>dialog 内容</div>',
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'is-show',
    description: '是否显示弹框',
    type: 'boolean',
    default: false,
  },
  {
    name: 'title',
    description: '弹框的标题',
    type: 'string',
    default: '',
  },
  {
    name: 'width',
    description: '设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数',
    type: 'string',
    default: '480',
  },
  {
    name: 'close-icon',
    description: '是否显示右上角的关闭 icon',
    type: 'boolean',
    default: true,
  },
  {
    name: 'esc-close',
    description: '是否允许 esc 按键关闭弹框',
    type: 'boolean',
    default: true,
  },
  {
    name: 'show-mask',
    description: '是否显示遮罩',
    type: 'boolean',
    default: true,
  },
  {
    name: 'quick-close',
    description: '是否允许点击遮罩关闭弹窗',
    type: 'boolean',
    default: true,
  },
  {
    name: 'transfer',
    description: '是否显示在body内（即与id#app同级）',
    type: 'boolean | string | "DOM选择器"',
    default: true,
  },
  {
    name: 'fullscreen',
    description: '是否全屏',
    type: 'boolean',
    default: false,
  },
  {
    name: 'z-index',
    description: '弹框的z-index',
    type: 'number',
    default: undefined,
  },
  {
    name: 'draggable',
    description: '是否可拖拽',
    type: 'boolean',
    default: false,
  },
  {
    name: 'confirm-text',
    description: '确认按钮文字',
    type: 'string',
    default: '确认',
  },
  {
    name: 'cancel-text',
    description: '取消按钮文字',
    type: 'string',
    default: '取消',
  },
  {
    name: 'confirm-button-theme',
    description: '确认按钮主题',
    type: 'string',
    options: ['primary', 'danger', 'success', 'warning'],
    default: 'primary',
  },
  {
    name: 'header-align',
    description: '头部对齐方式',
    type: 'string',
    options: ['center', 'left', 'right'],
    default: 'left',
  },
  {
    name: 'footer-align',
    description: '底部对齐方式',
    type: 'string',
    options: ['center', 'left', 'right'],
    default: 'right',
  },
  {
    name: 'before-close',
    description: '关闭前确认',
    type: '() => Promise<boolean> | boolean',
    default: '',
  },
  {
    name: 'render-directive',
    description: '渲染方式',
    type: 'string',
    options: ['if', 'show'],
    default: 'if',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'update:is-show',
    description: '弹框显示状态变化时触发',
    params: [
      {
        name: '_value',
        type: 'boolean',
      },
    ],
  },
  {
    name: 'shown',
    description: '弹框显示时触发',
    params: [],
  },
  {
    name: 'hidden',
    description: '弹框隐藏时触发',
    params: [],
  },
  {
    name: 'closed',
    description: '点击取消，右上角的关闭icon或按esc触发',
    params: [],
  },
  {
    name: 'confirm',
    description: '点击确认按钮时触发',
    params: [],
  },
  {
    name: 'prev',
    description: '点击上一步按钮时触发',
    params: [],
  },
  {
    name: 'next',
    description: '点击下一步按钮时触发',
    params: [],
  },
];

// 组件分组
const group = NavGroupMeta.Nav;

// 组件名称
const name = 'dialog';

// 组件标签
const title = 'Dialog';

// 组件中文标签
const titleCN = '弹框';

// 组件描述
const description = '弹框';

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
