/**
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
    title: '单选穿梭框',
    description: '单选完成项穿梭',
    props: {
      sourceList: [],
      targetList: [],
    },
    slots: {
      default: '<div>基础的穿梭框使用</div>',
    },
  },
  {
    title: '多选穿梭框',
    description: '多选完成项穿梭',
    props: {
      sourceList: [],
      targetList: [],
      multiple: true,
      slots: {
        default: '<div>多选的穿梭框使用</div>',
      },
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'title',
    description: '顶部title(title[0]: 左侧title,title[1]: 右侧title,)',
    type: 'Array',
    default: [],
  },
  {
    name: 'extCls',
    description: '自定义样式类名',
    type: 'string',
    default: '',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'open-change',
    description: '弹框显示状态变化时触发',
    params: [
      {
        name: 'visible',
        type: 'boolean',
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Form;

// 组件名称
const name = 'transfer';

// 组件标签
const title = 'Transfer';

// 组件中文标签
const titleCN = '穿梭框';

// 组件描述
const description = '穿梭框';

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
