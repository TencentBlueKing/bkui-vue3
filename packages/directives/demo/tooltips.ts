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
    description: 'hover提示',
    template: `
      <div class="bk-tooltips-demo" style="cursor: pointer;" v-tooltips="$attrs">
        <p>元素</p>
      </div>
    `,
    props: {
      content: '提示信息',
    },
  },
  {
    title: '不同位置',
    description: '支持多个位置的提示',
    template: `
      <div class="bk-tooltips-demo" style="display: flex; gap: 20px; flex-wrap: wrap;">
        <div style="cursor: pointer; padding: 10px; border: 1px solid #ddd;" v-tooltips="$attrs">
          元素
        </div>
      </div>
    `,
    props: {
      content: '多种位置的提示',
      placement: 'top',
    },
  },
  {
    title: '点击触发',
    description: '点击元素时显示提示',
    template: `
      <div class="bk-tooltips-demo" style="display: flex; gap: 20px;">
        <div style="cursor: pointer; padding: 10px; border: 1px solid #ddd; background-color: #f0f8ff;" v-tooltips="$attrs">
          点击触发
        </div>
      </div>
    `,
    props: {
      content: '点击我显示提示',
      trigger: 'click',
    },
  },
  {
    title: '主题样式',
    description: '支持浅色和深色主题',
    template: `
      <div class="bk-tooltips-demo" style="display: flex; gap: 20px;">
        <div style="cursor: pointer; padding: 10px; border: 1px solid #ddd; background-color: black; color: white;" v-tooltips="$attrs">
          主题
        </div>
      </div>
    `,
    props: {
      content: '主题提示',
      theme: 'dark',
    },
  },
  {
    title: '高级配置',
    description: '支持箭头、延迟、距离等配置',
    template: `
      <div class="bk-tooltips-demo" style="display: flex; gap: 20px; flex-wrap: wrap;">
        <div style="cursor: pointer; padding: 10px; border: 1px solid #ddd;" v-tooltips="$attrs">
          延迟显示
        </div>
      </div>
    `,
    props: {
      content: '延迟显示的提示',
      delay: 1000,
      distance: 20,
      disabled: true,
      arrow: false,
    },
  },
];

const props = [
  {
    name: 'content',
    type: 'string',
    default: '提示信息',
    description: '提示信息',
  },
  {
    name: 'placement',
    type: 'string',
    default: 'top',
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
    description: '提示信息位置',
  },
  {
    name: 'boundary',
    type: 'string',
    default: 'document.body',
    options: ['parent', 'document.body'],
    description: '插入位置',
  },
  {
    name: 'showOnInit',
    type: 'boolean',
    default: false,
    description: '是否在初始化时显示',
  },
  {
    name: 'theme',
    type: 'string',
    default: 'dark',
    options: ['dark', 'light'],
    description: '主题',
  },
  {
    name: 'trigger',
    type: 'string',
    default: 'hover',
    options: ['hover', 'click'],
    description: '触发方式',
  },
  {
    name: 'arrow',
    type: 'boolean',
    default: true,
    description: '是否显示箭头',
  },
  {
    name: 'distance',
    type: 'number',
    default: 8,
    description: '距离, 单位: 像素',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: false,
    description: '是否禁用',
  },
  {
    name: 'delay',
    type: 'number',
    default: 0,
    description: '延迟时间, 单位: 毫秒',
  },
  {
    name: 'extCls',
    type: 'string',
    default: '',
    description: '自定义样式类名，传入的类会被加在组件最外层的 DOM',
  },
  {
    name: 'onShow',
    type: 'function',
    default: '',
    description: '显示时回调',
  },
  {
    name: 'onHide',
    type: 'function',
    default: '',
    description: '隐藏时回调',
  },
];

// 组件分组
const group = NavGroupMeta.Directive;

// 组件名称
const name = 'tooltips';

// 组件标签
const title = 'Tooltips';

// 组件中文标签
const titleCN = '工具提示';

// 组件描述
const description = '当鼠标指向页面元素时给出简单的提示';

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  presets,
  description,
};

export default wiki;
