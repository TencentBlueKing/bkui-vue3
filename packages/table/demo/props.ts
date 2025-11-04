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
export default [
  {
    name: 'data',
    type: 'Array<any>',
    default: '[]',
    description: '表格数据',
  },
  {
    name: 'columns',
    type: 'Array<Column>',
    default: '[]',
    description: '表格列配置',
    link: '/component/table/api#Column',
  },
  {
    name: 'activeColumn',
    type: 'number | Array<Number>',
    default: '-1',
    description: '当前选中列',
  },
  {
    name: 'columnPick',
    type: 'string',
    options: ['single', 'multi', 'disabled'],
    default: 'disabled',
    description: '表格列选中方式，可选值：single、multi、disabled',
  },
  {
    name: 'height',
    type: 'string | number',
    default: 'auto',
    description: '表格高度',
  },
  {
    name: 'stripe',
    type: 'Boolean',
    default: 'false',
    description: '是否为斑马纹表格',
  },
  {
    name: 'minHeight',
    type: 'string | number',
    default: '42',
    description: '表格最小高度',
  },
  {
    name: 'maxHeight',
    type: 'string | number',
    default: 'auto',
    description: '表格最大高度',
  },
  {
    name: 'rowHeight',
    type: '((type: string, row: Record<string, object>, rowIndex: number, size?) => number)| number',
    default: '',
    description: '行高',
  },
  {
    name: 'headHeight',
    type: 'number',
    default: '42',
    description: '表头行高',
  },
  {
    name: 'showHead',
    type: 'Boolean',
    default: 'true',
    description: '是否显示表头',
  },
  {
    name: 'sortValFormat',
    type: 'Array',
    default: '[""]',
    description: '排序时对需要排序的字符串数值进行格式化',
  },
  {
    name: 'thead',
    type: 'Thead',
    default: '{ color: "def1", height: 42, isShow: true }',
    description: '表头配置',
    link: '/component/table/api#Thead',
  },
  {
    name: 'virtualEnabled',
    type: 'Boolean',
    default: 'false',
    description: '是否启用虚拟渲染',
  },
  {
    name: 'border',
    type: 'Array<"col" | "horizontal" | "none" | "outer" | "row"> | String',
    default: '["row"]',
    description: '表格边框显示设置',
  },
  {
    name: 'pagination',
    type: 'boolean | object',
    default: 'false',
    description: '分页配置',
  },
  {
    name: 'paginationHeight',
    type: 'number',
    default: '60',
    description: '分页组件高度',
  },
  {
    name: 'remotePagination',
    type: 'Boolean',
    default: 'false',
    description: '是否启用远程分页',
  },
  {
    name: 'acrossAll',
    type: 'Boolean',
    default: 'false',
    description: '是否支持跨页全选',
  },
  {
    name: 'emptyText',
    type: 'String',
    default: '',
    description: '暂无数据',
  },
  {
    name: 'emptyCellText',
    type: 'String | Function',
    default: '',
    description: '单元格数据为空展示',
  },
  {
    name: 'isEmptyCell',
    type: 'Array<string | null | undefined> | function',
    default: '["", undefined, null]',
    description: '判定单元格是否为空的规则',
  },
  {
    name: 'settings',
    type: 'Settings | boolean',
    default: 'false',
    description: '表格设置配置',
    link: '/component/table/api#Settings',
  },
  {
    name: 'rowClass',
    type: 'string | object | function',
    default: '{}',
    description: '行的 class 的回调方法',
  },
  {
    name: 'rowStyle',
    type: 'string | object | function',
    default: '{}',
    description: '行的 style 的回调方法',
  },
  {
    name: 'cellStyle',
    type: 'string | object | function',
    default: '{}',
    description: '单元格的 style 的回调方法',
  },
  {
    name: 'cellClass',
    type: 'String | Object | Function',
    default: '{}',
    description: '单元格的 className 的回调方法',
  },
  {
    name: 'scrollLoading',
    type: 'object | boolean',
    default: 'undefined',
    description: '表格底部loading加载效果 详细配置可参考bk-loading组件',
  },
  {
    name: 'reserveExpand',
    type: 'boolean',
    default: 'false',
    description: '是否保留展开收起操作',
  },
  {
    name: 'selectionKey',
    type: 'string',
    default: '',
    description:
      '用于初始化或者更新row已选中状态, 对设置了selection的情况下生效, 内部使用逻辑为：row[selectionKey]，可以为多级选择，但是多级选择只支持 row.child.child',
  },
  {
    name: 'checked',
    type: 'Array',
    default: '[]',
    description: '仅对设置了selection的情况下生效, 值可以为 [key1, key2, key3, ...] 或者 [row1, row2, row3, ...]',
  },
  {
    name: 'isSelectedFn',
    type: 'function',
    default: 'undefined',
    description: '自定义判定当前行是否选中',
  },
  {
    name: 'rowKey',
    type: 'string | function',
    default: 'row_index',
    description: '行数据的 Key',
  },
  {
    name: 'showOverflowTooltip',
    type: 'IOverflowTooltipOption | boolean',
    default: 'false',
    description: '当内容过长被隐藏时显示 tooltip, column内部可以单个配置覆盖此配置',
    link: '/component/table/api#IOverflowTooltipOption',
  },
  {
    name: 'asyncData',
    type: 'Boolean',
    default: 'false',
    description:
      '为避免不必要的数据修改导致的不可控组件更新, 默认组件不会对传入组件的data进行任何修改, 设置此属性为true则会对源数据进行同步（如：启用selection，勾选时想要自动同步到源数据）, 目前只会对指定了selectionKey的情况下才会对指定的字段数据进行更新，同时需要指定 rowKey，保证匹配到的row是正确的目标对象',
  },
  {
    name: 'rowHover',
    type: 'string',
    options: ['auto', 'highlight'],
    default: 'highlight',
    description: '鼠标划过行样式行为',
  },
  {
    name: 'defaultSort',
    type: 'ISortOption',
    default: '{}',
    description: '默认的排序列的 prop 和顺序',
    link: '/component/table/api#ISortOption',
  },
  {
    name: 'isRowSelectEnable',
    type: 'function | boolean',
    default: 'true',
    description: '配合 column selection 使用, 用于配置渲染行数据的勾选框是否可用',
  },
  {
    name: 'resizerWay',
    type: 'string',
    options: ['debounce', 'throttle'],
    default: 'debounce',
    description:
      '当外层容器尺寸改变时, 当前组件用什么方式进行重新计算, 默认为 throttle，按照指定频率重新计算, 可选值：debounce，在指定时间范围内只执行一次重新计算',
  },
  {
    name: 'observerResize',
    type: 'boolean',
    default: 'true',
    description: '是否监听表格尺寸变化',
  },
  {
    name: 'intersectionObserver',
    type: 'Boolean',
    default: 'false',
    description: '是否使用IntersectionObserver监听表格Cell进如有可视区域再渲染',
  },
  {
    name: 'align',
    type: 'string',
    options: ['center', 'left', 'right', ''],
    default: '',
    description: '对齐方式',
  },
  {
    name: 'headerAlign',
    type: 'string',
    options: ['center', 'left', 'right', ''],
    default: '',
    description: '表头对齐方式',
  },
  {
    name: 'prependStyle',
    type: 'object',
    default: '{}',
    description:
      '插入至表格第一行之前的内容容器样式, 默认样式为固定在第一行, 需要跟随滚动或者其他样式, 可以通过此配置进行覆盖',
  },
  {
    name: 'colSortBehavior',
    type: 'string',
    options: ['independent', 'interdependent'],
    default: 'independent',
    description: '列排序行为',
  },
  {
    name: 'isFlex',
    type: 'boolean',
    default: 'true',
    description: '是否采用flex布局表格',
  },
  {
    name: 'rowDraggable',
    type: 'function | boolean | object',
    default: 'false',
    description: '是否支持行拖拽排序',
  },
  {
    name: 'shiftMultiChecked',
    type: 'Boolean',
    default: 'false',
    description: '是否支持shift键多行选择',
  },
  {
    name: 'scrollbar',
    type: 'Boolean',
    default: 'true',
    description: '是否启用Scrollbar',
  },
  {
    name: 'fixedBottom',
    type: 'FixedBottomOption',
    default: 'null',
    description: '固定在底部的配置项',
    link: '/component/table/api#FixedBottomOption',
  },
  {
    name: 'appendLastRow',
    type: 'AppendLastRowOption',
    default: '{ type: "default", cellRender: undefined }',
    link: '/component/table/api#AppendLastRowOption',
    description: '表格尾部追加的行配置',
  },
];
