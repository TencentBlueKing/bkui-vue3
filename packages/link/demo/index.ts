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
    title: '基础类型',
    description: '点击链接按钮后新开页面到对应链接',
    props: {
      theme: 'primary',
    },
    slots: {
      default: '文本链接',
    },
  },
  {
    title: '下划线类型',
    description: '比基础类型多一条下划线，视觉提示更强',
    props: {
      theme: 'primary',
      underline: true,
    },
    slots: {
      default: '文本链接',
    },
  },
  {
    title: '图标类型',
    description: '比基础类型多一个图标，更容易让用户理解',
    props: {
      theme: 'primary',
    },
    slots: {
      default:
        '<div style="display: flex;align-items: center;gap: 4px; justify-content: center;"><i class="bkui-vue-wiki-icon icon-help"></i> 文本链接</div>',
    },
  },
];

// 组件属性
const props = [
  {
    name: 'theme',
    description: '链接的主题颜色',
    type: 'string',
    options: ['danger', 'default', 'primary', 'success', 'warning'],
    default: 'default',
  },
  {
    name: 'href',
    description: '链接的 URL 地址',
    type: 'string',
  },
  {
    name: 'disabled',
    description: '是否禁用链接',
    type: 'boolean',
    default: false,
  },

  {
    name: 'underline',
    description: '是否显示下划线',
    type: 'boolean',
    default: false,
  },
  {
    name: 'target',
    description: '链接的打开方式',
    type: 'string',
    options: ['_self', '_blank', '_parent', '_top'],
    default: '_self',
  },
];

// 组件事件
const emits = [
  {
    name: 'click',
    description: '点击链接时触发',
    params: [
      {
        name: 'event',
        type: 'Event',
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Nav;

// 组件名称
const name = 'link';

// 组件标签
const title = 'Link';

// 组件中文标签
const titleCN = '文字链接';

// 组件描述
const description = 'Link 文字超链接';

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
