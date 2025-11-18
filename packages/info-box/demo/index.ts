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
    description: '配置 title, content 等参数',
    props: {
      content: '说明文案',
    },
  },
  {
    title: '各种状态',
    description: '配置 type 的值，实现成功，错误，警告，加载中的不同类型',
    props: {
      title: '各种 title',
      content: '各种 content',
      theme: 'success',
    },
  },
  {
    title: '自定义按钮文字',
    description: '配置 confirmText，cancelText',
    props: {
      theme: 'danger',
      title: '确认要删除1？',
      content: '确认要删除？',
      confirmText: '删除',
      cancelText: '取消',
    },
  },
  {
    title: '事件回调',
    description: '确认，取消回调',
    props: {
      theme: 'danger',
      title: '确认要删除1？',
      content: '确认要删除？',
      onConfirm: `() => {
        BkMessage({
          message: '确认',
        });
      }`,
      onCancel: `() => {
        BkMessage({
          message: '取消',
        });
      }`,
    },
    dependent: {
      components: ['message'],
    },
  },
  {
    title: '文本对齐方式',
    description: '配置 headerAlign，contentAlign，footerAlign',
    props: {
      title: '左对齐 title',
      content: '集中 center',
      headerAlign: 'left',
      contentAlign: 'center',
      footerAlign: 'right',
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'is-show',
    description: '初始化时是否显示',
    type: 'boolean',
    default: false,
  },
  {
    name: 'width',
    description: '信息框宽度',
    type: 'number',
    default: 400,
  },
  {
    name: 'class',
    description: '自定义class',
    type: 'string | string[]',
    default: '',
  },
  {
    name: 'type',
    description: '信息框类型',
    type: 'string',
    options: ['success', 'danger', 'warning', 'loading'],
    default: '',
  },
  {
    name: 'title',
    description: '信息框标题',
    type: 'string | VNode | () => VNode',
    default: '',
  },
  {
    name: 'subTitle',
    description: '信息框副标题',
    type: 'string | VNode | () => VNode',
    default: '',
  },
  {
    name: 'content',
    description: '信息框内容',
    type: 'string | VNode | () => VNode',
    default: '',
  },
  {
    name: 'footer',
    description: '信息框底部内容',
    type: 'string | VNode | () => VNode',
    default: '',
  },
  {
    name: 'headerAlign',
    description: '显示header的位置',
    type: 'string',
    options: ['center', 'left', 'right'],
    default: 'center',
  },
  {
    name: 'contentAlign',
    description: '显示content的位置',
    type: 'string',
    options: ['center', 'left', 'right'],
    default: 'center',
  },
  {
    name: 'footerAlign',
    description: '显示footer的位置',
    type: 'string',
    options: ['center', 'left', 'right'],
    default: 'center',
  },
  {
    name: 'showContentBgColor',
    description: '是否设置content或subTitle内容默认背景颜色',
    type: 'boolean',
    default: false,
  },
  {
    name: 'showMask',
    description: '是否显示遮罩',
    type: 'boolean',
    default: true,
  },
  {
    name: 'quickClose',
    description: '是否允许点击遮罩关闭',
    type: 'boolean',
    default: false,
  },
  {
    name: 'escClose',
    description: '是否允许按esc键关闭',
    type: 'boolean',
    default: false,
  },
  {
    name: 'closeIcon',
    description: '是否显示关闭icon',
    type: 'boolean',
    default: true,
  },
  {
    name: 'confirmText',
    description: '确认按钮文字',
    type: 'string | VNode | () => VNode',
    default: '',
  },
  {
    name: 'theme',
    description: '确认按钮主题',
    type: 'string',
    options: ['primary', 'danger', 'success', 'warning'],
    default: '',
  },
  {
    name: 'confirmButtonTheme',
    description: '确认按钮主题',
    type: 'string',
    options: ['primary', 'danger', 'success', 'warning'],
    default: '',
  },
  {
    name: 'cancelText',
    description: '取消按钮文字',
    type: 'string | VNode | () => VNode',
    default: '',
  },
  {
    name: 'beforeClose',
    description: '关闭前的回调',
    type: 'function',
    default: '',
  },
  {
    name: 'onConfirm',
    description: '确认后的回调',
    type: 'function',
    default: '',
  },
  {
    name: 'onCancel',
    description: '取消后的回调',
    type: 'function',
    default: '',
  },
  {
    name: 'onClose',
    description: '关闭后的回调',
    type: 'function',
    default: '',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [];

// 组件分组
const group = NavGroupMeta.Feedback;

// 组件名称
const name = 'info-box';

// 组件标签
const title = 'InfoBox';

// 组件中文标签
const titleCN = '信息框';

// 组件描述
const description = '信息框';

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
