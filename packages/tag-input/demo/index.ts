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

const list = [
  { id: 'shenzhen', name: '深圳' },
  { id: 'guangzhou', name: '广州' },
  { id: 'beijing', name: '北京' },
  { id: 'shanghai', name: '上海' },
  { id: 'hangzhou', name: '杭州' },
  { id: 'nanjing', name: '南京' },
  { id: 'chongqing', name: '重庆' },
  { id: 'taibei', name: '台北' },
  { id: 'haikou', name: '海口' },
];

// 组件示例
const presets = [
  {
    title: '基础用法',
    description: '简单的标签输入，可以配置回车 或 鼠标失焦结束输入',
    props: {
      list,
      clearable: true,
      modelValue: ['shenzhen', 'guangzhou', 'beijing', 'shanghai', 'hangzhou'],
      trigger: 'focus',
    },
  },
  {
    title: '支持批量录入',
    description: '通过限定的分隔符，粘贴后自动生成tag',
    props: {
      list,
      clearable: true,
      disabled: false,
      'paste-fn': value => value.split('|').map(tag => ({ id: tag, name: tag })),
      modelValue: ['shenzhen', 'guangzhou', 'beijing', 'shanghai', 'hangzhou'],
      trigger: 'focus',
    },
  },
  {
    title: '支持选择与输入',
    description: '触发输入框后，自动拉取已创建的 tag ，支持单选或多选 tag',
    props: {
      list,
      modelValue: ['shenzhen', 'guangzhou', 'beijing', 'shanghai', 'hangzhou'],
      'allow-create': true,
      'collapse-tags': true,
      'has-delete-icon': true,
      trigger: 'focus',
    },
  },
  {
    title: '失去焦点自动匹配',
    description:
      '设置 allow-auto-match 属性当输入内容时失去焦点后，如果完全匹配则自动选中，如果设置 allow-create 属性则创建标签',
    props: {
      list,
      modelValue: ['shenzhen', 'guangzhou', 'beijing', 'shanghai', 'hangzhou'],
      'allow-create': true,
      'allow-auto-match': true,
      'has-delete-icon': true,
      trigger: 'focus',
    },
  },
  {
    title: '分组展示',
    description: '配置 use-group 来启用分组功能， 数据源必须加上 children 的配置',
    props: {
      list: [
        {
          id: '1',
          name: '华中地区',
          children: [
            { id: '1-1', name: '河南省' },
            { id: '1-2', name: '湖北省' },
            { id: '1-3', name: '湖南省' },
          ],
        },
        {
          id: '2',
          name: '华北地区',
          children: [
            { id: '2-1', name: '北京市' },
            { id: '2-2', name: '天津市' },
            { id: '2-3', name: '河北省' },
          ],
        },
        {
          id: '3',
          name: '华南地区',
          children: [
            { id: '3-1', name: '广东省' },
            { id: '3-2', name: '海南省' },
          ],
        },
      ],
      modelValue: ['1-1', '1-2', '1-3', '2-1', '2-2'],
      trigger: 'focus',
      'use-group': true,
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'list',
    description: '下拉菜单所需的数据列表',
    type: 'Array<object>',
    default: '[]',
  },
  {
    name: 'placeholder',
    description: '空数据时显示的提示文案',
    type: 'string',
    default: '请输入并按 Enter 结束',
  },
  {
    name: 'disabled',
    description: '是否禁用组件',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'allow-next-focus',
    description: '多选时，是否允许选中后继续展示下拉选项',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'save-key',
    description: '循环 list 时，保存字段的 key 值',
    type: 'string',
    default: 'id',
  },
  {
    name: 'display-key',
    description: '循环 list 时，展示字段的 key 值',
    type: 'string',
    default: 'name',
  },
  {
    name: 'search-key',
    description: '输入时，搜索的 key 值',
    type: 'string',
    default: 'name',
  },
  {
    name: 'tooltip-key',
    description: '让选中的标签在鼠标移上去时显示提示文案',
    type: 'string',
    default: '',
  },
  {
    name: 'has-delete-icon',
    description: '是否显示标签删除按钮',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'clear-text-space',
    description: '自定义标签是否允许字符中间存在空格',
    type: 'boolean',
    default: 'true',
  },
  {
    name: 'clearable',
    description: '是否允许清空',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'allow-create',
    description: '是否允许自定义标签输入',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'max-data',
    description: '是否限制可选个数，-1为不限制',
    type: 'number',
    default: '-1',
  },
  {
    name: 'max-result',
    description: '下拉列表搜索结果显示个数，默认为 10',
    type: 'number',
    default: '10',
  },
  {
    name: 'use-group',
    description: '是否启用分组',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'allow-auto-match',
    description: '配置输入时失焦点后，如果完全匹配则自动选中，如果自定义则自动输入',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'content-width',
    description: '自定义设置下拉弹框的宽度，单选会撑满因此失效',
    type: 'number',
    default: '190',
  },
  {
    name: 'content-max-height',
    description: '自定义设置下拉弹框的长度',
    type: 'number',
    default: '300',
  },
  {
    name: 'separator',
    description: '输入分隔符号，支持批量输入',
    type: 'string',
    default: '',
  },
  {
    name: 'tpl',
    description: '自定义下拉列表模板',
    type: 'function',
    default: '',
  },
  {
    name: 'tag-tpl',
    description: '自定义标签模板',
    type: 'function',
    default: '',
  },
  {
    name: 'paste-fn',
    description: '批量粘贴处理文本返回格式',
    type: 'function',
    default: '',
  },
  {
    name: 'left-space',
    description: '文字与左边框距离',
    type: 'number',
    default: '0',
  },
  {
    name: 'trigger',
    description: '搜索列表触发展示方式，默认是输入关键字搜索时展示，也可以获取焦点是展示（用在数据量少的时候）',
    type: 'string',
    default: 'search',
    options: ['search', 'focus'],
  },
  {
    name: 'create-tag-validator',
    description:
      '自定义标签校验函数，返回 boolean，参数(tag)，tag表示当前输入值，在自定义标签时，可以自定义添加标签的校验',
    type: 'function',
    default: '',
  },
  {
    name: 'filter-callback',
    description:
      '过滤函数，参数 (filterVal, filterKey, data)，分别表示当前过滤的文本、当前数据使用的 key、所有数据，方便使用者根据自己的逻辑来筛选数据',
    type: 'function',
    default: '',
  },
  {
    name: 'show-clear-only-hover',
    description: '是否在只有 hover 的时候才显示 clear 清除按钮',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'is-async-list',
    description: '如果为 true 则表示将会传入异步 list，配合通过输入后再获取异步 list 传入组件时使用。',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'collapse-tags',
    description: '失焦是否折叠 tags',
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'tag-overflow-tips',
    description: '定义 tag 超出内容的 v-bk-tooltips 配置',
    type: 'Partial<IOptions>',
    default: '',
    link: '/component/tooltips/api#tooltipsProps',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'change',
    description: '值改变触发',
    params: [
      {
        name: 'tagList',
        type: 'Array<string>',
      },
    ],
  },
  {
    name: 'select',
    description: '选择值时触发',
    params: [
      {
        name: 'e',
        type: 'Event',
      },
    ],
  },
  {
    name: 'focus',
    description: '获得焦点时触发',
    params: [
      {
        name: 'e',
        type: 'Event',
      },
    ],
  },
  {
    name: 'blur',
    description: '失去焦点时触发',
    params: [
      {
        name: 'inputValue',
        type: 'string',
      },
      {
        name: 'tagList',
        type: 'Array<string>',
      },
    ],
  },
  {
    name: 'remove',
    description: '删除 Tag 时触发',
    params: [
      {
        name: 'tag',
        type: 'object',
      },
    ],
  },
  {
    name: 'removeAll',
    description: '清空时触发',
    params: [
      {
        name: 'e',
        type: 'Event',
      },
    ],
  },
  {
    name: 'input',
    description: '输入时触发',
    params: [
      {
        name: 'inputValue',
        type: 'string',
      },
    ],
  },
];

const types = [];

const group = NavGroupMeta.Form;

// 组件名称
const name = 'tag-input';

// 组件标签
const title = 'TagInput';

// 组件中文标签
const titleCN = '标签输入框';

// 组件描述
const description = '常用于对标签列表的填写、关键字的输入';

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  presets,
  description,
  types,
};

export default wiki;
