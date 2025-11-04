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

import { NavGroupMeta, IComponentWiki } from '@bkui-vue/shared';

const dataSource = [
  {
    name: '访问入口',
    id: 'domain',
    multiple: true,
    async: false,
  },
  {
    name: 'ID',
    id: 'id',
  },
  {
    name: '集群名称',
    id: 'name',
  },
  {
    name: '管控区域',
    id: 'bk_cloud_id',
    multiple: true,
    children: [
      {
        id: 0,
        name: '直连区域',
      },
    ],
  },
  {
    name: '状态',
    id: 'status',
    multiple: true,
    children: [
      {
        id: 'normal',
        name: '正常',
      },
      {
        id: 'abnormal',
        name: '异常',
      },
    ],
  },
  {
    name: '所属 DB 模块',
    id: 'db_module_id',
    multiple: true,
    children: [
      {
        id: 2,
        name: 'tendbha57',
      },
      {
        id: 19,
        name: 'xiaog56',
      },
    ],
  },
  {
    name: '版本',
    id: 'major_version',
    multiple: true,
    children: [
      {
        id: 'MySQL-5.7',
        name: 'MySQL-5.7',
      },
      {
        id: 'MySQL-5.6',
        name: 'MySQL-5.6',
      },
    ],
  },
  {
    name: '地域',
    id: 'region',
    multiple: true,
    children: [
      {
        id: 'default',
        name: 'default',
      },
      {
        id: 'default2',
        name: 'default2',
      },
    ],
  },
  {
    name: '创建人',
    id: 'creator',
  },
  {
    name: '时区',
    id: 'time_zone',
    multiple: true,
    children: [
      {
        id: '+08:00',
        name: '+08:00',
      },
    ],
  },
];

// 组件示例
const presets = [
  {
    title: '基础用法',
    description: '通过 data 属性配置搜索选择器的选项数据',
    props: {
      data: dataSource,
      modelValue: [],
      uniqueSelect: true,
    },
  },
  {
    title: '复杂条件',
    description: '支持AND/OR',
    props: {
      data: dataSource,
      modelValue: [],
      uniqueSelect: true,
      conditions: [
        { id: 'and', name: '且' },
        { id: 'or', name: '或' },
      ],
    },
  },
];

// 组件属性
const props = [
  {
    name: 'data',
    type: 'Array<Omit<ISearchItem, "isSelected" | "value">>',
    default: '[]',
    description: '搜索选择器的选项数据',
    link: '/component/search-select/api#ISearchItem',
  },
  {
    name: 'modelValue',
    type: 'Array<ISearchValue>',
    default: '[]',
    description: '绑定值，支持 v-model',
    link: '/component/search-select/api#ISearchValue',
  },
  {
    name: 'maxHeight',
    type: 'number',
    default: '392',
    description: '下拉列表的最大高度',
  },
  {
    name: 'conditions',
    type: 'Array<ICommonItem>',
    default: '[]',
    description: '自定义逻辑条件选项',
    link: '/component/search-select/api#ICommonItem',
  },
  {
    name: 'clearable',
    type: 'boolean',
    default: 'true',
    description: '是否显示清空按钮',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: '',
    description: '占位符文本',
  },
  {
    name: 'getMenuList',
    type: '(item: ISearchItem, keyword: string) => Promise<ISearchItem[]>',
    default: '',
    description: '异步获取菜单列表的方法',
    link: '/component/search-select/api#ISearchItem',
  },
  {
    name: 'validateValues',
    type: '(item: ISearchItem, values: ICommonItem[]) => Promise<string | true>;',
    default: '',
    description: '验证值的方法',
    link: '/component/search-select/api#ICommonItem',
  },
  {
    name: 'uniqueSelect',
    type: 'string',
    default: 'false',
    description: '是否唯一选择，同一选项只能选择一次',
  },
  {
    name: 'valueBehavior',
    type: 'string',
    options: ['all', 'need-key'],
    default: 'all',
    description: '值的行为模式，可选值：all、need-key',
  },
];

// 组件事件
const emits = [
  {
    name: 'update:modelValue',
    description: '绑定值变化时触发',
    params: [
      {
        name: 'value',
        type: 'Array<ISearchValue>',
        description: '新的绑定值',
        link: '/component/search-select/api#ISearchValue',
      },
    ],
  },
  {
    name: 'search',
    description: '点击搜索按钮时触发',
    params: [
      {
        name: 'event',
        type: 'MouseEvent',
        description: '鼠标事件对象',
      },
    ],
  },
  {
    name: 'selectKey',
    description: '选择条件时触发',
    params: [
      {
        name: 'item',
        type: 'ICommonItem',
        description: '选中的条件项',
        link: '/component/search-select/api#ICommonItem',
      },
    ],
  },
  {
    name: 'copy',
    description: '复制时触发',
    params: [
      {
        name: 'event',
        type: 'ClipboardEvent',
        description: '复制事件',
      },
      {
        name: 'text',
        type: 'string',
        description: '复制文本',
      },
      {
        name: 'item',
        type: 'ISearchValue',
        description: '复制项',
        link: '/component/search-select/api#ISearchValue',
      },
    ],
  },
];

const slots = [
  {
    name: 'menu',
    description: 'menu面板子项插槽',
    params: [
      {
        name: 'data',
        type: 'MenuSlotParams',
        link: '/component/search-select/api#MenuSlotParams',
      },
    ],
  },
  {
    name: 'prepend',
    description: '组件最左侧填充插槽',
  },
  {
    name: 'append',
    description: '组件最右侧填充插槽',
  },
  {
    name: 'validate',
    description: '校验错误信息展示插槽',
  },
];

const types = [
  {
    name: 'ISearchItem',
    description: '菜单子项参数',
    fields: [
      {
        name: 'id',
        type: 'string',
        description: '选项ID',
      },
      {
        name: 'name',
        type: 'string',
        description: '选项名称',
      },
      {
        name: 'children',
        type: 'Array<ICommonItem>',
        description: '子选项列表',
        link: '/component/search-select/api#ICommonItem',
      },
      {
        name: 'multiple',
        type: 'boolean',
        description: '是否多选',
      },
      {
        name: 'async',
        type: 'boolean',
        description: '是否远程获取子列表',
      },
      {
        name: 'noValidate',
        type: 'boolean',
        description: '是否禁用校验',
      },
      {
        name: 'placeholder',
        type: 'string',
        description: '占位符文本',
      },
      {
        name: 'disabled',
        type: 'boolean',
        description: '是否禁用',
      },
      {
        name: 'value',
        type: 'ICommonItem',
        link: '/component/search-select/api#ICommonItem',
        description: '选中后立即生成tag的值',
      },
      {
        name: 'isSelected',
        type: 'boolean',
        description: '是否已选中',
      },
      {
        name: 'onlyRecommendChildren',
        type: 'boolean',
        description: '添加推荐选项字符时 是否只匹配children数据',
      },
      {
        name: 'logical',
        type: 'SearchLogical',
        description: '多选值时 逻辑符号',
      },
      {
        name: 'showLogicalPanel',
        type: 'boolean',
        description: '是否显示逻辑符号选项列表 默认不显示 仅在多选时生效',
      },
      {
        name: 'isCustomMenu',
        type: 'boolean',
        description: '是否配置了自定义子项menu',
      },
    ],
  },
  {
    name: 'ICommonItem',
    description: '子项参数',
    fields: [
      {
        name: 'id',
        type: 'string',
        description: '选项ID',
      },
      {
        name: 'name',
        type: 'string',
        description: '选项名称',
      },
      {
        name: 'disabled',
        type: 'boolean',
        description: '是否禁用',
      },
      {
        name: 'realId',
        type: 'string',
        description: '真实选项ID',
      },
      {
        name: 'value',
        type: 'Omit<ICommonItem, "disabled" | "value">',
        description: '值',
        link: '/component/search-select/api#ICommonItem',
      },
      {
        name: 'isSelected',
        type: 'boolean',
        description: '是否已选中',
      },
      {
        name: 'logical',
        type: 'SearchLogical',
        description: '逻辑符号',
        link: '/component/search-select/api#SearchLogical',
      },
    ],
  },
  {
    name: 'SearchLogical',
    description: '逻辑符号',
    fields: [
      {
        name: 'AND',
        type: 'string',
        description: '且',
      },
      {
        name: 'OR',
        type: 'string',
        description: '或',
      },
    ],
  },
  {
    name: 'SearchItemType',
    description: '选项类型',
    fields: [
      {
        name: 'default',
        type: 'string',
        description: '默认',
      },
      {
        name: 'condition',
        type: 'string',
        description: '条件',
      },
      {
        name: 'text',
        type: 'string',
        description: '文本',
      },
    ],
  },
  {
    name: 'ISearchValue',
    description: '搜索值参数',
    fields: [
      {
        name: 'id',
        type: 'string',
        description: '选项ID',
      },
      {
        name: 'name',
        type: 'string',
        description: '选项名称',
      },
      {
        name: 'realId',
        type: 'string',
        description: '真实选项ID',
      },
      {
        name: 'isSelected',
        type: 'boolean',
        description: '是否已选中',
      },
      {
        name: 'logical',
        type: 'SearchLogical',
        description: '逻辑符号',
      },
      {
        name: 'type',
        type: 'SearchItemType',
        description: '选项类型',
        link: '/component/search-select/api#SearchItemType',
      },
      {
        name: 'values',
        type: 'Array<Omit<ICommonItem, "disabled" | "logical">>',
        description: '子选项列表',
        link: '/component/search-select/api#ICommonItem',
      },
    ],
  },
  {
    name: 'MenuSlotParams',
    description: 'menu面板子项插槽参数',
    fields: [
      {
        name: 'value',
        type: 'ICommonItem',
        link: '/component/search-select/api#ICommonItem',
        description: '选项值',
      },
      {
        name: 'id',
        type: 'string',
        description: '选项ID',
      },
      {
        name: 'name',
        type: 'string',
        description: '选项名称',
      },
      {
        name: 'onSubmit',
        type: '(value: string) => void',
        description: '提交选项值',
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Form;

// 组件名称
const name = 'search-select';

// 组件标签
const title = 'SearchSelect';

// 组件中文标签
const titleCN = '搜索选择器';

// 组件描述
const description = '搜索选择器';

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  slots,
  types,
  presets,
  description,
};

export default wiki;
