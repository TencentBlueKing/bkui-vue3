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
  {
    name: 'searchPlaceholder',
    description: '搜索框 placeholder',
    type: 'string',
    default: '',
  },
  {
    name: 'settingKey',
    description: '唯一key值',
    type: 'string',
    default: 'id',
  },
  {
    name: 'displayKey',
    description: '循环list时，显示字段的key值(当list为普通数组时可不传传了也无效)',
    type: 'string',
    default: 'value',
  },
  {
    name: 'sortKey',
    description: '排序所依据的key(当list为普通数组时可不传，默认按照index值排序)',
    type: 'string',
    default: 'value',
  },
  {
    name: 'showOverflowTips',
    description: '内容超出是否显示tooltip',
    type: 'boolean',
    default: false,
  },
  {
    name: 'searchable',
    description: '是否开启搜索',
    type: 'boolean',
    default: false,
  },
  {
    name: 'sortable',
    description: '是否开启排序功能',
    type: 'boolean',
    default: false,
  },
  {
    name: 'sourceList',
    description: '穿梭框数据源(支持普通数组)',
    type: 'Array<any>',
    default: [],
  },
  {
    name: 'targetList',
    description: '默认已选择的数据源',
    type: 'Array<any>',
    default: [],
  },
  {
    name: 'emptyContent',
    description: '穿梭框无数据时提示文案',
    type: 'Array<string>',
    default: [],
  },
  {
    name: 'multiple',
    description: '支持checkbox多选模式',
    type: 'boolean',
    default: false,
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'change',
    description: '值变化时触发',
    params: [
      {
        name: 'sourceList',
        type: 'Array<any>',
      },
      {
        name: 'targetList',
        type: 'Array<any>',
      },
      {
        name: 'targetValueList',
        type: 'Array<any>',
      },
    ],
  },
  {
    name: 'update:targetList',
    description: '更新 targetList 的事件',
    params: [
      {
        name: 'targetList',
        type: 'Array<any>',
      },
    ],
  },
];

const slots = [
  {
    name: 'left-header',
    description: '左侧头部插槽',
  },
  {
    name: 'right-header',
    description: '右侧头部插槽',
  },
  {
    name: 'left-empty-content',
    description: '左侧无数据时插槽',
  },
  {
    name: 'right-empty-content',
    description: '右侧空内容插槽',
  },
  {
    name: 'source-option',
    description: '左侧选项插槽',
    params: [
      {
        name: 'item',
        type: 'any',
      },
    ],
  },
  {
    name: 'target-option',
    description: '右侧选项插槽',
    params: [
      {
        name: 'item',
        type: 'any',
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
  slots,
  presets,
  description,
};

export default wiki;
