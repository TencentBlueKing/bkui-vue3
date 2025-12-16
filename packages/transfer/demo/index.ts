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

const sourceList = [
  { service_code: 'pipeline', service_name: '流水线', disabled: true },
  { service_code: 'codecc', service_name: '代码检查' },
  { service_code: 'bcs', service_name: '容器服务' },
  { service_code: 'artifactory', service_name: '版本仓库' },
  { service_code: 'ticket', service_name: '凭证管理' },
  { service_code: 'code', service_name: '代码库', disabled: true },
  { service_code: 'experience', service_name: '版本体验' },
  { service_code: 'environment', service_name: '环境管理' },
  { service_code: 'quality', service_name: '质量红线' },
  { service_code: 'turbo', service_name: '编译加速' },
];

const style = `
  .bk-transfer {
    width: 100%;
  }
`;

// 组件示例
const presets = [
  {
    title: '单选穿梭框',
    description: '单选完成项穿梭',
    props: {
      displayKey: 'service_name',
      settingKey: 'service_code',
      sourceList: sourceList,
      searchable: true,
      sortable: true,
      targetList: [],
    },
    slots: {
      default: '<div>基础的穿梭框使用</div>',
    },
    style,
  },
  {
    title: '多选穿梭框',
    description: '多选完成项穿梭',
    props: {
      displayKey: 'service_name',
      settingKey: 'service_code',
      sourceList: sourceList,
      searchable: true,
      sortable: true,
      targetList: [],
      multiple: true,
    },
    style,
  },
  {
    title: '配置 target-list 以及设置排序',
    description:
      '配置 sortable 以及 sort-key 使得操作数据时数据的排序不变，配置 target-list 设置默认选择的数据。sortable 为 true 时开启排序功能，为 false 时则关闭，sort-key 为排序所依据的 key 值。注意：当 source-list 为普通数组时，开启排序时默认按照值排序，此时不需要传 sort-key。',
    props: {
      displayKey: 'service_name',
      settingKey: 'service_code',
      sourceList: sourceList,
      targetList: ['pipeline', 'codecc'],
      searchable: true,
      sortable: true,
    },
    style,
  },
  {
    title: '普通数组配置',
    description: '此时根据值排序；display-key、sort-key、setting-key 不需要传。',
    props: {
      sourceList: [1, 4, 9, 'ab', 8, 5, 'bc', 3],
      targetList: [1, 4, 9, 'bc'],
      searchable: true,
      sortable: true,
    },
    style,
  },
  {
    title: '自定义 header 和无数据时显示内容',
    description:
      '配置 slot 为 left-header 或 right-header 可自定义 header 内容，配置 slot 为 left-empty-content 和 right-empty-content 可自定义数据为空时所显示的内容(注意：当配置了 slot 时，其 title 和 empty-content 配置不会生效)',
    props: {
      displayKey: 'service_name',
      settingKey: 'service_code',
      sourceList: sourceList,
      targetList: ['pipeline', 'codecc'],
      searchable: true,
      sortable: true,
    },
    slots: {
      'left-header': `
        <div>自定义左侧头部</div>
      `,
      'right-header': `
        <div>自定义右侧头部</div>
      `,
      'left-empty-content': `
        <div>自定义左侧无数据时显示内容</div>
      `,
      'right-empty-content': `
        <div>自定义右侧无数据时显示内容</div>
      `,
    },
    style,
  },
  {
    title: '自定义 选项 模板',
    description: '配置 slot 为 source-option 或 target-option 可自定义选项模板',
    props: {
      displayKey: 'service_name',
      settingKey: 'service_code',
      sourceList: sourceList,
      targetList: ['pipeline', 'codecc'],
      searchable: true,
      sortable: true,
    },
    slots: {
      'source-option': `
        <div>service_code: {{ data.service_code }}, service_name: {{ data.service_name }}</div>
      `,
      'target-option': `
        <div>service_code: {{ data.service_code }}, service_name: {{ data.service_name }}</div>
      `,
    },
    style,
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
    isSupportVModel: true,
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
const group = NavGroupMeta.Feedback;

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
