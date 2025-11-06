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
    description: '通过 theme 设置不同的主题， danger / info / success / warning',
    props: {
      theme: 'danger',
      title: '提示文字',
    },
  },
  {
    title: '可关闭',
    description: '通过 closable 设置是否可关闭',
    props: {
      theme: 'danger',
      title: '提示文字',
      closable: true,
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'theme',
    description: '主题',
    type: 'string',
    options: ['danger', 'info', 'success', 'warning'],
    default: 'info',
  },
  {
    name: 'title',
    description: '标题',
    type: 'string',
    default: '提示文字',
  },
  {
    name: 'closable',
    description: '是否可关闭',
    type: 'boolean',
    default: false,
  },
  {
    name: 'closeText',
    description: '关闭按钮内容',
    type: 'string',
    default: '',
  },
  {
    name: 'showIcon',
    description: '是否显示图标',
    type: 'boolean',
    default: true,
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'change',
    description: '固定状态发生改变时触发的事件',
    params: [
      {
        name: 'event',
        type: 'Event',
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
    name: 'title',
    description: '标题',
  },
  {
    name: 'icon',
    description: '图标',
  },
];

// 组件分组
const group = NavGroupMeta.Feedback;

// 组件名称
const name = 'alert';

// 组件标签
const title = 'Alert';

// 组件中文标签
const titleCN = '警告';

// 组件描述
const description = '展示页面的提示信息';

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
