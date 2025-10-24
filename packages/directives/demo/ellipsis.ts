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
    description: '鼠标悬停显示完整内容',
    template: `
      <div v-ellipsis >
        鼠标悬停时可以看到完整内容
      </div>
    `,
  },
];

const props = [
  {
    name: 'content',
    type: 'string',
    default: '',
    description: '内容',
  },
  {
    name: 'popoverOption',
    type: 'object',
    default: '',
    description: 'Popover 选项',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: false,
    description: '是否禁用',
  },
  {
    name: 'target',
    type: 'string | HTMLElement',
    default: '',
    description: '目标元素',
  },
];

// 组件分组
const group = NavGroupMeta.Directive;

// 组件名称
const name = 'ellipsis';

// 组件标签
const title = 'Ellipsis';

// 组件中文标签
const titleCN = '文本省略';

// 组件描述
const description = '鼠标悬停时通过 Popover 显示完整内容';

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  presets,
  props,
  description,
};

export default wiki;
