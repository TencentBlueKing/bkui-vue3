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

const presets = [
  {
    title: '基础用法',
    description: '通过 type 设置异常类型',
    props: {
      type: '404',
      title: '页面不存在',
    },
  },
  {
    title: '局部异常提示',
    description: '通过 scene = part 设置局部异常提示',
    props: {
      scene: 'part',
      type: '404',
      title: '页面不存在',
    },
  },
];

const props = [
  {
    name: 'type | number',
    description: '异常类型',
    type: 'string',
    options: ['403', '404', '500', 'building', 'empty', 'search-empty'],
    default: '404',
  },
  {
    name: 'scene',
    description: '异常场景',
    type: 'string',
    options: ['page', 'part'],
    default: 'page',
  },
  {
    name: 'title',
    description: '异常标题',
    type: 'string',
    default: '',
  },
  {
    name: 'description',
    description: '异常描述',
    type: 'string',
    default: '',
  },
];

const emits = [];

const slots = [
  {
    name: 'type',
    description: '类型插槽',
  },
  {
    name: 'title',
    description: '标题插槽',
  },
  {
    name: 'description',
    description: '描述插槽',
  },
  {
    name: 'default',
    description: '底部插槽',
  },
];

const group = NavGroupMeta.Feedback;

const name = 'exception';

const title = 'Exception';

const titleCN = '异常';

const description = '异常';

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
