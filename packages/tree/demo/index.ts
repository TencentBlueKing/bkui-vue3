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
    description: '基础的树组件使用',
    props: {
      data: [
        {
          name: '方案成熟',
          async: true,
          content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
          id: '1',
          children: [
            {
              name: 'child-1-方案成熟-拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
              content: '拥有支撑数百款腾讯业务的经验沉淀，兼容各种复杂的系统架构，生于运维 · 精于运维',
              children: [],
            },
          ],
        },
      ],
      children: 'children',
      label: 'name',
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'data',
    description: '渲染列表',
    type: 'Array<any>',
    default: '[]',
  },
  {
    name: 'label',
    description: '指定节点标签为节点对象的某个属性值',
    type: 'string | function',
    default: 'label',
  },
  {
    name: 'nodeKey',
    description: '每个树节点用来作为唯一标识的属性，此标识应该是唯一的;如果设置系统会默认自动生成唯一id',
    type: 'string',
    default: 'undefined',
  },
  {
    name: 'children',
    description: '子节点 Key, 用于读取子节点',
    type: 'string',
    default: 'children',
  },
  {
    name: 'indent',
    description: '相邻级节点间的水平缩进，单位为像素',
    type: 'number',
    default: 16,
  },
  {
    name: 'lineHeight',
    description: '节点行高',
    type: 'number',
    default: 32,
  },
  {
    name: 'height',
    description: '设置树形组件高度；在设置 virtualRender=true时，请指定高度，避免组件自动计算高度导致多次渲染',
    type: 'number',
    default: '',
  },
  {
    name: 'levelLine',
    description:
      '设置层级连线, 可通过true|false设置默认开启|关闭，也可以直接设置`1px dashed #c3cdd7`自定义样式，或者设置为回调函数，动态设置',
    type: 'boolean | string | function',
    default: false,
  },
  {
    name: 'virtualRender',
    description:
      '	是否开启虚拟滚动, 默认虚拟滚动是开启的，数据量大的情况下有利于性能优化，可以通过设置 virtualRender = false 关闭虚拟滚动',
    type: 'boolean',
    default: false,
  },
  {
    name: 'prefixIcon',
    description: '当前节点标识图标, 通过 true | false，设置是否显示，如果需要自定义则配置为函数，返回VNode',
    type: 'function | boolean',
    default: true,
  },
  {
    name: 'async',
    description: '异步加载节点数据配置',
    type: 'AsyncOption',
    default: '{callback: undefined, cache: true, deepAutoOpen: "once", trigger: null}',
    link: '/components/tree/api#AsyncOption',
  },
  {
    name: 'offsetLeft',
    description: '每个节点偏移左侧距离',
    type: 'number',
    default: 5,
  },
  {
    name: 'search',
    description: '搜索配置,可以为一个配置项 SearchOption, 或者直接为一个字符串|数值|布尔值，如此则模糊匹配此值',
    type: 'SearchOption | string | number | boolean',
    default: 'undefined',
    link: '/components/tree/api#SearchOption',
  },
  {
    name: 'emptyText',
    description: '当数据为空时显示的文本',
    type: 'string',
    default: '没有数据',
  },
  {
    name: 'draggable',
    description: '是否开启节点拖拽',
    type: 'boolean',
    default: false,
  },
  {
    name: 'disableDrag',
    description: '节点是否禁用作为拖拽开启元素',
    type: 'function',
    default: '',
  },
  {
    name: 'disableDrop',
    description: '节点是否禁用作为拖拽结束位置元素',
    type: 'function',
    default: '',
  },
  {
    name: 'dragThreshold',
    description: '拖拽阈值, 用于判断拖拽时鼠标位置与节点的距离, 当鼠标位置与节点的距离大于此值时，才会触发拖拽',
    type: 'number',
    default: 0.2,
  },
  {
    name: 'dragSort',
    description: '节点是否可拖拽排序',
    type: 'boolean',
    default: false,
  },
  {
    name: 'dragSortMode',
    description: '拖拽排序模式, 默认 any',
    type: 'string',
    options: ['any', 'next'],
    default: 'any',
  },
  {
    name: 'selectable',
    description: '节点是否可以选中',
    type: 'boolean | function',
    default: true,
  },
  {
    name: 'disabledFolderSelectable',
    description: '节点是否可以选中',
    type: 'boolean',
    default: false,
  },
  {
    name: 'showCheckbox',
    description: '是否支持多选',
    type: 'boolean | function',
    default: false,
  },
  {
    name: 'checked',
    description: '默认选中的节点id，selectable为false时无效',
    type: 'array<any>',
    default: '[]',
  },
  {
    name: 'selected',
    description: '默认选中的节点id，selectable为false时无效',
    type: 'string | number | object',
    default: 'undefined',
  },
  {
    name: 'showNodeTypeIcon',
    description: '是否显示节点类型Icon',
    type: 'boolean',
    default: true,
  },
  {
    name: 'autoCheckChildren',
    description:
      '是否自动检查当前节点是否有子节点, 节点前面的展开收起Icon会根据判定值做改变, 如果需要自已控制，请设置为false',
    type: 'boolean | function',
    default: true,
  },
  {
    name: 'autoOpenParentNode',
    description:
      '如果设置了某一个叶子节点状态为展开，是否自动展开所有父级节点, 默认为true，如果设置为false，则每层状态需要自己控制',
    type: 'boolean',
    default: true,
  },
  {
    name: 'expandAll',
    description: '默认是否展开所有节点',
    type: 'boolean',
    default: false,
  },
  {
    name: 'nodeContentAction',
    description:
      '节点内容点击行为，此处配置每个节点除了展开\收起箭头之外的内容块时的行为.默认为 ["selected", "expand", "click"]，点击内容块为选中当前节点, 如果要禁用所有行为，请设置为空数组 []',
    type: 'array | function',
    default: ['selected', 'expand', 'click'],
  },
  {
    name: 'keepSlotData',
    description:
      '是否作用域插槽抛出参数是否保持源数据的引用，如果设置为true，则作用域插槽参数格式为: { data: node, attributes: {} }，如果设置为false，则作用域插槽参数格式为: { ...node, ...attributes }，attributes 为节点内置属性，包含节点是否展开，是否选中，是否有子节点等等',
    type: 'boolean',
    default: false,
  },
  {
    name: 'checkStrictly',
    description: '在显示复选框的情况下，是否严格的遵循父子互相关联的做法',
    type: 'boolean',
    default: true,
  },
  {
    name: 'intersectionObserver',
    description: '是否开启监听Tree节点进入Tree容器可视区域',
    type: 'object | boolean',
    default: false,
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'nodeChecked',
    description: '节点选中事件',
    params: [
      {
        name: 'isNodeChecked',
        type: 'any',
      },
      {
        name: 'isNodeIndeterminate',
        type: 'any',
      },
    ],
  },
  {
    name: 'nodeSelected',
    description: '节点选中事件',
    params: [
      {
        name: 'node',
        type: '{ selected: boolean, node: TreeNode }',
        link: '/components/tree/api#TreeNode',
      },
    ],
  },
  {
    name: 'nodeClick',
    description: '节点点击事件',
    params: [
      {
        name: 'item',
        type: 'TreeNode',
        link: '/components/tree/api#TreeNode',
      },
      {
        name: 'resolveScopedSlotParam',
        type: 'any',
      },
      {
        name: 'schemaVal',
        type: 'any',
      },
      {
        name: 'event',
        type: 'MouseEvent',
      },
    ],
  },
  {
    name: 'nodeCollapse',
    description: '节点折叠事件',
    params: [
      {
        name: 'item',
        type: 'TreeNode',
        link: '/components/tree/api#TreeNode',
      },
      {
        name: 'resolveScopedSlotParam',
        type: 'any',
      },
      {
        name: 'schemaVal',
        type: 'any',
      },
      {
        name: 'event',
        type: 'MouseEvent',
      },
    ],
  },
  {
    name: 'nodeExpand',
    description: '节点展开事件',
    params: [
      {
        name: 'item',
        type: 'TreeNode',
        link: '/components/tree/api#TreeNode',
      },
      {
        name: 'resolveScopedSlotParam',
        type: 'any',
      },
      {
        name: 'schemaVal',
        type: 'any',
      },
      {
        name: 'event',
        type: 'MouseEvent',
      },
    ],
  },
  {
    name: 'nodeDragLeave',
    description: '节点拖拽离开事件',
    params: [
      {
        name: 'e',
        type: 'DragEvent',
      },
      {
        name: 'targetNode',
        type: 'HTMLElement',
      },
    ],
  },
  {
    name: 'nodeDragOver',
    description: '节点拖拽结束事件',
    params: [
      {
        name: 'e',
        type: 'DragEvent',
      },
      {
        name: 'targetNode',
        type: 'HTMLElement',
      },
      {
        name: 'data',
        type: 'any',
      },
    ],
  },
  {
    name: 'nodeDragSort',
    description: '节点拖拽排序事件',
    params: [
      {
        name: 'sourceNode',
        type: 'TreeNode',
        link: '/components/tree/api#TreeNode',
      },
      {
        name: 'targetNode',
        type: 'TreeNode',
        link: '/components/tree/api#TreeNode',
      },
      {
        name: 'sourceIndex',
        type: 'number',
      },
      {
        name: 'targetIndex',
        type: 'number',
      },
      {
        name: 'targetSlibings',
        type: 'any',
      },
    ],
  },
  {
    name: 'nodeDragStart',
    description: '节点拖拽开始事件',
    params: [
      {
        name: 'e',
        type: 'DragEvent',
      },
      {
        name: 'targetNode',
        type: 'HTMLElement',
      },
    ],
  },
  {
    name: 'nodeDrop',
    description: '节点拖拽结束事件',
    params: [
      {
        name: 'e',
        type: 'DragEvent',
      },
      {
        name: 'targetNode',
        type: 'HTMLElement',
      },
      {
        name: 'data',
        type: 'any',
      },
    ],
  },
  {
    name: 'nodeEnterView',
    description: '节点进入视图事件',
    params: [
      {
        name: 'result',
        type: '{ level: number, target: HTMLElement, index: number, parent: TreeNode, node: TreeNode, isRoot: boolean }',
        link: '/components/tree/api#TreeNode',
      },
    ],
  },
];

const types = [
  {
    name: 'AsyncOption',
    description: '异步加载节点数据配置',
    fields: [
      {
        name: 'callback',
        type: '(item: any, cb: function) => Promise<any>',
        description: '点击节点需要执行的异步函数，函数返回 Promise',
      },
      {
        name: 'cache',
        type: 'boolean',
        description: '是否缓存请求结果，默认为True，只有在第一次才会发起请求，若设置为false则每次都会发起请求',
      },
      {
        name: 'deepAutoOpen',
        type: 'string',
        description: '异步请求节点是否自动展开，可选值：once 只在初始化是执行一次，every 每次数据更新都执行',
      },
      {
        name: 'trigger',
        type: 'array<string>',
        description: '触发异步加载的时机，可选值：expand 点击节点展开时，click 点击节点时，checked 节点选中时',
      },
    ],
  },
  {
    name: 'SearchOption',
    description: '搜索配置',
    fields: [
      {
        name: 'value',
        type: 'string | number | boolean',
        description: '搜索值',
      },
      {
        name: 'match',
        type: '(searchValue, itemText, item)) => boolean | string',
        options: ['full', 'fuzzy'],
        description: '搜索匹配方式，可选值：full 完全匹配，fuzzy 模糊匹配, 支持自定义匹配函数',
      },
      {
        name: 'resultType',
        type: 'string',
        options: ['tree', 'list'],
        description: '搜索结果展示方式，可选值：tree 树形展示，list 列表展示',
      },
      {
        name: 'showChildNodes',
        type: 'boolean',
        description: '是否显示匹配项的子节点',
      },
    ],
  },
  {
    name: 'TreeNode',
    description: '树节点',
    fields: [
      {
        name: '[key: string]',
        type: 'unknown',
        description: '任意key: value的属性',
      },
      {
        name: 'children',
        type: 'Array<TreeNode>',
        description: '子节点',
      },
    ],
  },
];

const slots = [
  {
    name: 'default',
    description: '默认自定义节点插槽, #default插槽与 #node插槽二选一即可，两者区别为参数格式不同，其他功能一致',
    params: [
      {
        name: 'item',
        type: '{ data: { ...node }, attributes: {} }',
      },
      {
        name: 'attributes',
        type: 'object',
      },
    ],
  },
  {
    name: 'node',
    description: '自定义节点插槽',
    params: [
      {
        name: 'item',
        type: '{...node, ...attributes}',
      },
    ],
  },
  {
    name: 'nodeType',
    description: '自定义节点类型Icon插槽',
    params: [
      {
        name: 'node',
        type: 'TreeNode',
        link: '/components/tree/api#TreeNode',
      },
    ],
  },
  {
    name: 'nodeAction',
    description: '展开收起自定义渲染',
    params: [
      {
        name: 'node',
        type: 'TreeNode',
        link: '/components/tree/api#TreeNode',
      },
    ],
  },
  {
    name: 'nodeAppend',
    description: '自定义节点后面的扩展展示',
    params: [
      {
        name: 'node',
        type: 'TreeNode',
        link: '/components/tree/api#TreeNode',
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Data;

// 组件名称
const name = 'tree';

// 组件标签
const title = 'Tree';

// 组件中文标签
const titleCN = '树';

// 组件描述
const description = '树';

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  types,
  slots,
  presets,
  description,
};

export default wiki;
