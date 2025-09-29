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

import { NavGroupMeta } from '@bkui-vue/shared';

const presets = [
  {
    title: '基础用法',
    description: '悬浮导航在右侧展示',
    props: {
      'nav-items': [
        {
          icon: '',
          text: '联系',
          tooltip: '可以通过腾讯蓝鲸QQ联系我们',
          action: () => {
            window.open('http://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDgwMjAwMV80NDMwOTZfODAwODAyMDAxXzJf');
          },
        },
        {
          icon: '',
          text: '反馈',
          action: () => {
            window.open('https://bk.tencent.com/s-mart/community?page=1&keyword=%255BMagicBox%255D&sort=latest');
          },
        },
      ],
    },
  },
];

const props = [
  {
    name: 'nav-items',
    description: '需要展示的导航项',
    type: 'array',
    default: [],
  },
  {
    name: 'position',
    description: '位置，分为顶部、底部、中间',
    type: "'middle' | 'top' | 'bottom'",
    default: 'middle',
  },
  {
    name: 'model-value',
    description: '是否显示',
    type: 'boolean',
    default: true,
  },
  {
    name: 'ext-cls',
    description: '自定义样式类名',
    type: 'string',
    default: '',
  },
];

const emits = [
  {
    name: 'click',
    description: '点击导航栏时触发',
    params: [
      {
        name: 'item',
        type: 'object',
      },
    ],
  },
];

const group = NavGroupMeta.Nav;

const name = 'fixed-navbar';

const title = 'FixedNavbar';

const titleCN = '固定导航栏';

export default {
  presets,
  props,
  emits,
  group,
  name,
  title,
  titleCN,
};
