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
    name: 'Column',
    description: '表格列配置',
    fields: [
      {
        name: 'label',
        type: '((_column, _index) => JSX.Element | boolean | number | string) | boolean | number | string',
        description: '列标题',
      },
      {
        name: 'field',
        type: '((_column, _index) => JSX.Element | boolean | number | string) | boolean | number | string',
        description: '列字段',
      },
      {
        name: 'render',
        type: '(args: HeadRenderArgs) => JSX.Element | boolean | number | string',
        description: '列渲染函数',
        link: '/component/table/api#HeadRenderArgs',
      },
      {
        name: 'disabled',
        type: 'boolean',
        description: '是否禁用',
      },
      {
        name: 'renderHead',
        type: '(args: HeadRenderArgs) => JSX.Element | boolean | number | string',
        description: '列头渲染函数',
        link: '/component/table/api#HeadRenderArgs',
      },
      {
        name: 'width',
        type: 'number | string',
        description: '列宽',
      },
      {
        name: 'minWidth',
        type: 'number | string',
        description: '列最小宽',
      },
      {
        name: 'columnKey',
        type: 'string',
        description: '列唯一标识',
      },
      {
        name: 'showOverflowTooltip',
        type: 'IOverflowTooltipOption | boolean',
        description: '是否显示溢出提示',
        link: '/component/table/api#IOverflowTooltipOption',
      },
      {
        name: 'type',
        type: 'string',
        description: '列类型',
      },
      {
        name: 'fixed',
        type: 'boolean | string',
        description: '是否固定',
      },
      {
        name: 'resizable',
        type: 'boolean',
        description: '是否可以调节宽度',
      },
      {
        name: 'sort',
        type: 'ISortShape | boolean | string',
        description: '排序',
        link: '/component/table/api#ISortShape',
      },
      {
        name: 'filter',
        type: 'IFilterShape | boolean | string',
        description: '筛选',
        link: '/component/table/api#IFilterShape',
      },
      {
        name: 'colspan',
        type: '(({ column, colIndex, row, rowIndex }) => number) | number',
        description: '列合并',
      },
      {
        name: 'rowspan',
        type: '(({ column, colIndex, row, rowIndex }) => number) | number',
        description: '行合并',
      },
      {
        name: 'textAlign',
        type: 'string',
        description: '文本对齐',
      },
      {
        name: 'className',
        type: '((row: Record<string, object>) => string) | string',
        description: '列样式类名',
      },
      {
        name: 'align',
        type: 'string',
        description: '对齐方式',
      },
      {
        name: 'prop',
        type: '((_column, _index) => JSX.Element | boolean | number | string) | boolean | number | string',
        description: '列属性',
      },
      {
        name: 'index',
        type: 'number',
        description: '列索引',
      },
      {
        name: 'explain',
        type: '{ content: ((_column, _index) => JSX.Element | boolean | number | string) | boolean | number | string; head: ((_column, _index) => JSX.Element | boolean | number | string) | boolean | number | string | boolean } | boolean',
        description: '列说明',
      },
      {
        name: 'children',
        type: 'Array<Column>',
        description: '子列',
      },
      {
        name: 'acrossPage',
        type: 'boolean',
        description: '跨页',
      },
    ],
  },
  {
    name: 'HeadRenderArgs',
    description: '列渲染函数参数',
    fields: [
      {
        name: 'cell',
        type: 'any',
        description: '单元格数据',
      },
      {
        name: 'data',
        type: 'any',
        description: '数据',
      },
      {
        name: 'row',
        type: 'object',
        description: '行数据',
      },
      {
        name: 'column',
        type: 'Column',
        description: '列数据',
        link: '/component/table/api#Column',
      },
      {
        name: 'index',
        type: 'number',
        description: '列索引',
      },
      {
        name: 'rows',
        type: 'Array<object>',
        description: '所有行数据',
      },
    ],
  },
  {
    name: 'IOverflowTooltipOption',
    description: '溢出提示配置',
    fields: [
      {
        name: 'content',
        type: '((col: Column, row: Record<string, object>) => string) | string',
        description: '提示内容',
        link: '/component/table/api#Column',
      },
      {
        name: 'disabled',
        type: '((col: Column, row: Record<string, object>) => boolean) | boolean',
        description: '是否禁用',
        link: '/component/table/api#Column',
      },
      {
        name: 'allowHtml',
        type: 'boolean',
        description: '是否允许HTML',
      },
      {
        name: 'watchCellResize',
        type: 'boolean',
        description: '是否监听单元格尺寸变化',
      },
      {
        name: 'mode',
        type: 'string',
        options: ['auto', 'static'],
        description: '溢出模式',
      },
      {
        name: 'popoverOption',
        type: 'Record<string, object>',
        description: '弹出框配置',
      },
      {
        name: 'resizerWay',
        type: 'string',
        options: ['debounce', 'throttle'],
        description: '重新计算方式',
      },
      {
        name: 'showHead',
        type: 'boolean',
        description: '是否显示表头',
      },
    ],
  },
  {
    name: 'ISortShape',
    description: '排序配置',
    fields: [
      {
        name: 'sortFn',
        type: '(...args) => number',
        description: '排序函数',
      },
      {
        name: 'sortScope',
        type: 'string',
        options: ['all', 'current'],
        description: '排序范围',
      },
      {
        name: 'value',
        type: 'string',
        options: ['asc', 'desc', 'null', 'custom'],
        description: '排序值',
      },
    ],
  },
  {
    name: 'IFilterShape',
    description: '筛选配置',
    fields: [
      {
        name: 'list',
        type: 'IHeadFilter[]',
        description: '筛选列表',
        link: '/component/table/api#IHeadFilter',
      },
      {
        name: 'filterFn',
        type: '(...args) => boolean',
        description: '筛选函数',
      },
      {
        name: 'match',
        type: 'string',
        options: ['full', 'fuzzy'],
        description: '匹配模式',
      },
      {
        name: 'checked',
        type: 'Array<string>',
        description: '已选中的值',
      },
      {
        name: 'filterScope',
        type: 'SortScope',
        description: '筛选范围',
        link: '/component/table/api#SortScope',
      },
      {
        name: 'btnSave',
        type: 'boolean | string',
        description: '保存按钮',
      },
      {
        name: 'btnReset',
        type: 'boolean | string',
        description: '重置按钮',
      },
      {
        name: 'height',
        type: 'number',
        description: '高度',
      },
      {
        name: 'maxHeight',
        type: 'number',
        description: '最大高度',
      },
    ],
  },
  {
    name: 'IHeadFilter',
    description: '表头筛选项',
    fields: [
      {
        name: 'label',
        type: 'string',
        description: '标签',
      },
      {
        name: 'text',
        type: 'string',
        description: '文本',
      },
      {
        name: 'value',
        type: 'string',
        description: '值',
      },
      {
        name: 'tipKey',
        type: 'string',
        description: '提示键',
      },
      {
        name: 'showOverflowTooltip',
        type: 'boolean',
        description: '是否显示溢出提示',
      },
    ],
  },
  {
    name: 'Settings',
    description: '表格设置配置',
    fields: [
      {
        name: 'fields',
        type: 'Array<Field>',
        description: '字段列表',
        link: '/component/table/api#Field',
      },
      {
        name: 'checked',
        type: 'Array<string>',
        description: '已选中的字段',
      },
      {
        name: 'limit',
        type: 'number',
        description: '限制数量',
      },
      {
        name: 'size',
        type: 'string',
        description: '尺寸',
      },
      {
        name: 'sizeList',
        type: 'Array<SizeItem>',
        description: '尺寸列表',
      },
      {
        name: 'showLineHeight',
        type: 'boolean',
        description: '是否显示行高',
      },
      {
        name: 'extCls',
        type: 'string',
        description: '扩展样式类',
      },
      {
        name: 'trigger',
        type: 'string',
        description: '触发方式',
      },
    ],
  },
  {
    name: 'Field',
    description: '字段配置',
    fields: [
      {
        name: 'label',
        type: 'string',
        description: '标签',
      },
      {
        name: 'field',
        type: 'string',
        description: '字段名',
      },
      {
        name: 'disabled',
        type: 'boolean',
        description: '是否禁用',
      },
      {
        name: 'id',
        type: 'string',
        description: 'ID',
      },
      {
        name: 'name',
        type: 'string',
        description: '名称',
      },
    ],
  },
  {
    name: 'SizeItem',
    description: '尺寸项配置',
    fields: [
      {
        name: 'value',
        type: 'string',
        description: '值',
      },
      {
        name: 'label',
        type: 'string',
        description: '标签',
      },
      {
        name: 'height',
        type: 'number',
        description: '高度',
      },
    ],
  },
  {
    name: 'FixedBottomOption',
    description: '固定底部配置',
    fields: [
      {
        name: 'position',
        type: 'string',
        options: ['absolute', 'relative'],
        description: '定位方式',
      },
      {
        name: 'height',
        type: 'number',
        description: '高度',
      },
      {
        name: 'minHeight',
        type: 'number',
        description: '最小高度',
      },
      {
        name: 'loading',
        type: 'boolean',
        description: '是否加载中',
      },
    ],
  },
  {
    name: 'AppendLastRowOption',
    description: '追加最后行配置',
    fields: [
      {
        name: 'type',
        type: 'string',
        options: ['default', 'summary'],
        description: '类型',
      },
      {
        name: 'cellRender',
        type: '(column: Column, index: number) => VNode | number | string',
        description: '单元格渲染函数',
      },
    ],
  },
  {
    name: 'IDraggableRowOption',
    description: '可拖拽行配置',
    fields: [
      {
        name: 'label',
        type: '(() => string) | string',
        description: '标签',
      },
      {
        name: 'render',
        type: '() => HTMLElement | JSX.Element',
        description: '渲染函数',
      },
      {
        name: 'fontSize',
        type: 'number',
        description: '字体大小',
      },
      {
        name: 'icon',
        type: 'JSX.Element',
        description: '图标',
      },
      {
        name: 'width',
        type: 'number',
        description: '宽度',
      },
    ],
  },
  {
    name: 'Thead',
    description: '表头配置',
    fields: [
      {
        name: 'height',
        type: 'number',
        description: '高度',
      },
      {
        name: 'isShow',
        type: 'boolean',
        description: '是否显示',
      },
      {
        name: 'color',
        type: '"def1" | "def2" | string',
        description: '颜色',
      },
      {
        name: 'cellFn',
        type: '({ index, column }) => JSX.Element | VNode | string',
        description: '单元格渲染函数',
      },
    ],
  },
  {
    name: 'IColumnActive',
    description: '列选中状态',
    fields: [
      {
        name: 'index',
        type: 'number',
        description: '列索引',
      },
      {
        name: 'active',
        type: 'boolean',
        description: '是否激活',
      },
    ],
  },
];
