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
    name: 'cellClick',
    description: '单元格点击时触发',
    params: [
      {
        name: 'event  ',
        type: 'MouseEvent',
      },
      {
        name: 'row',
        type: 'any',
      },
      {
        name: 'column',
        type: 'Column',
        link: '/component/table/api#Column',
      },
      {
        name: 'cell',
        type: '{ getValue: () => string }',
      },
      {
        name: 'rowIndex',
        type: 'number',
      },
      {
        name: 'columnIndex',
        type: 'number',
      },
    ],
  },
  {
    name: 'cellDblclick',
    description: '单元格双击时触发',
    params: [
      {
        name: 'event  ',
        type: 'MouseEvent',
      },
      {
        name: 'row',
        type: 'any',
      },
      {
        name: 'column',
        type: 'Column',
        link: '/component/table/api#Column',
      },
      {
        name: 'cell',
        type: '{ getValue: () => string }',
      },
      {
        name: 'rowIndex',
        type: 'number',
      },
      {
        name: 'columnIndex',
        type: 'number',
      },
    ],
  },
  {
    name: 'columnFilter',
    description: '列筛选时触发',
    params: [
      {
        name: 'args',
        type: '{ checked: string[]; column: Column; index: number }',
      },
    ],
  },
  {
    name: 'colFilterSave',
    description: '列筛选保存时触发',
    params: [
      {
        name: 'args',
        type: '{ column: Column; values: Array<any> }',
      },
    ],
  },
  {
    name: 'columnPick',
    description: '列选择时触发',
    params: [
      {
        name: '_cols',
        type: 'Array<IColumnActive>',
        link: '/component/table/api#IColumnActive',
      },
    ],
  },
  {
    name: 'columnSort',
    description: '列排序时触发',
    params: [
      {
        name: '_args',
        type: '{ column: Column; index: number; type: string }',
        link: '/component/table/api#Column',
      },
    ],
  },
  {
    name: 'dragend',
    description: '拖拽结束时触发',
    params: [
      {
        name: '_args',
        type: '{ sourceEvent: DragEvent; data: Array<any> }',
      },
    ],
  },
  {
    name: 'pageLimitChange',
    description: '分页每页条数变化时触发',
    params: [
      {
        name: '_arg',
        type: 'number',
      },
    ],
  },
  {
    name: 'pageValueChange',
    description: '分页页码变化时触发',
    params: [
      {
        name: '_arg',
        type: 'number',
      },
    ],
  },
  {
    name: 'rowClick',
    description: '行点击时触发',
    params: [
      {
        name: '_e',
        type: 'MouseEvent',
        description: '鼠标事件',
      },
      {
        name: '_row',
        type: 'any',
      },
      {
        name: '_index',
        type: 'number',
      },
      {
        name: '_rows',
        type: 'Array<any>',
      },
      {
        name: '_this',
        type: 'any',
      },
    ],
  },
  {
    name: 'rowDblclick',
    description: '行双击时触发',
    params: [
      {
        name: '_e',
        type: 'MouseEvent',
        description: '鼠标事件',
      },
      {
        name: '_row',
        type: 'any',
      },
      {
        name: '_index',
        type: 'number',
      },
      {
        name: '_rows',
        type: 'Array<any>',
      },
      {
        name: '_this',
        type: 'any',
      },
    ],
  },
  {
    name: 'rowExpand',
    description: '行展开时触发',
    params: [
      {
        name: '_args',
        type: '{ row: any; column: Column; index: number; rows: Array<any>; e: MouseEvent }',
        link: '/component/table/api#Column',
      },
    ],
  },
  {
    name: 'rowMouseEnter',
    description: '鼠标进入行时触发',
    params: [
      {
        name: '_e',
        type: 'MouseEvent',
      },
      {
        name: '_row',
        type: 'any',
      },
      {
        name: '_index',
        type: 'number',
      },
      {
        name: '_rows',
        type: 'Array<any>',
      },
      {
        name: '_this',
        type: 'any',
      },
    ],
  },
  {
    name: 'rowMouseLeave',
    description: '鼠标离开行时触发',
    params: [
      {
        name: '_e',
        type: 'MouseEvent',
      },
      {
        name: '_row',
        type: 'any',
      },
      {
        name: '_index',
        type: 'number',
      },
      {
        name: '_rows',
        type: 'Array<any>',
      },
      {
        name: '_this',
        type: 'any',
      },
    ],
  },
  {
    name: 'select',
    description: '行选择时触发',
    params: [
      {
        name: '_args',
        type: '{ row: any; index: number; checked: string; data: Array<any> }',
      },
    ],
  },
  {
    name: 'selectAll',
    description: '全选时触发',
    params: [
      {
        name: '_args',
        type: '{ checked: string; data: Array<any> }',
      },
    ],
  },
  {
    name: 'selectionChange',
    description: '选择变化时触发',
    params: [
      {
        name: 'args',
        type: '{ row: any; index: number; checked: string; data: Array<any>; isAll: boolean }',
      },
    ],
  },
  {
    name: 'scrollBottom',
    description: '滚动到底部时触发',
    params: [
      {
        name: '_args',
        type: '{ translateX: number; translateY: number; scrollTop: number; scrollLeft: number; bottom: number }',
      },
    ],
  },
  {
    name: 'settingChange',
    description: '设置变化时触发',
    params: [
      {
        name: 'args',
        type: 'any',
      },
    ],
  },
];
