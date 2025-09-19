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

import { NavGroupMeta } from '@bkui-vue/shared';

// 组件示例
const presets = [
  {
    title: '基础用法',
    description: '通过 data 设置数据，通过 columns 设置列。',
    props: {
      data: [
        { name: '张三', age: 25, address: '北京市朝阳区' },
        { name: '李四', age: 30, address: '上海市浦东新区' },
        { name: '王五', age: 28, address: '广州市天河区' },
      ],
      columns: [
        { label: '姓名', field: 'name' },
        { label: '年龄', field: 'age' },
        { label: '地址', field: 'address' },
      ],
    },
  },
  {
    title: '斑马纹表格',
    description: '通过设置 stripe 属性开启斑马纹样式。',
    props: {
      stripe: true,
      data: [
        { name: '张三', age: 25, address: '北京市朝阳区' },
        { name: '李四', age: 30, address: '上海市浦东新区' },
        { name: '王五', age: 28, address: '广州市天河区' },
      ],
      columns: [
        { label: '姓名', field: 'name' },
        { label: '年龄', field: 'age' },
        { label: '地址', field: 'address' },
      ],
    },
  },
  {
    title: '带边框表格',
    description: '通过设置 border 属性开启边框样式。',
    props: {
      border: ['row', 'col'],
      data: [
        { name: '张三', age: 25, address: '北京市朝阳区' },
        { name: '李四', age: 30, address: '上海市浦东新区' },
        { name: '王五', age: 28, address: '广州市天河区' },
      ],
      columns: [
        { label: '姓名', field: 'name' },
        { label: '年龄', field: 'age' },
        { label: '地址', field: 'address' },
      ],
    },
  },
  {
    title: '可排序表格',
    description: '通过设置列的 sort 属性开启排序功能。',
    props: {
      data: [
        { name: '张三', age: 25, address: '北京市朝阳区' },
        { name: '李四', age: 30, address: '上海市浦东新区' },
        { name: '王五', age: 28, address: '广州市天河区' },
      ],
      columns: [
        { label: '姓名', field: 'name', sort: true },
        { label: '年龄', field: 'age', sort: true },
        { label: '地址', field: 'address' },
      ],
    },
  },
  {
    title: '可筛选表格',
    description: '通过设置列的 filter 属性开启筛选功能。',
    props: {
      data: [
        { name: '张三', age: 25, address: '北京市朝阳区', status: '在职' },
        { name: '李四', age: 30, address: '上海市浦东新区', status: '离职' },
        { name: '王五', age: 28, address: '广州市天河区', status: '在职' },
      ],
      columns: [
        { label: '姓名', field: 'name' },
        { label: '年龄', field: 'age' },
        { label: '地址', field: 'address' },
        {
          label: '状态',
          field: 'status',
          filter: {
            list: [
              { text: '在职', value: '在职' },
              { text: '离职', value: '离职' },
            ],
          },
        },
      ],
    },
  },
  {
    title: '固定列表格',
    description: '通过设置列的 fixed 属性固定列。',
    props: {
      data: [
        { name: '张三', age: 25, address: '北京市朝阳区', phone: '13800138000', email: 'zhangsan@example.com' },
        { name: '李四', age: 30, address: '上海市浦东新区', phone: '13800138001', email: 'lisi@example.com' },
        { name: '王五', age: 28, address: '广州市天河区', phone: '13800138002', email: 'wangwu@example.com' },
      ],
      columns: [
        { label: '姓名', field: 'name', fixed: 'left', width: 100 },
        { label: '年龄', field: 'age', width: 80 },
        { label: '地址', field: 'address', width: 200 },
        { label: '电话', field: 'phone', width: 120 },
        { label: '邮箱', field: 'email', fixed: 'right', width: 200 },
      ],
    },
  },
  {
    title: '可调整列宽表格',
    description: '通过设置列的 resizable 属性开启列宽调整功能。',
    props: {
      data: [
        { name: '张三', age: 25, address: '北京市朝阳区' },
        { name: '李四', age: 30, address: '上海市浦东新区' },
        { name: '王五', age: 28, address: '广州市天河区' },
      ],
      columns: [
        { label: '姓名', field: 'name', resizable: true, width: 120 },
        { label: '年龄', field: 'age', resizable: true, width: 80 },
        { label: '地址', field: 'address', resizable: true, width: 200 },
      ],
    },
  },
  {
    title: '分页表格',
    description: '通过设置 pagination 属性开启分页功能。',
    props: {
      data: Array.from({ length: 50 }, (_, index) => ({
        name: `用户${index + 1}`,
        age: 20 + (index % 20),
        address: `地址${index + 1}`,
      })),
      columns: [
        { label: '姓名', field: 'name' },
        { label: '年龄', field: 'age' },
        { label: '地址', field: 'address' },
      ],
      pagination: true,
    },
  },
  {
    title: '虚拟滚动表格',
    description: '通过设置 virtualEnabled 属性开启虚拟滚动，适用于大数据量场景。',
    props: {
      data: Array.from({ length: 1000 }, (_, index) => ({
        name: `用户${index + 1}`,
        age: 20 + (index % 20),
        address: `地址${index + 1}`,
      })),
      columns: [
        { label: '姓名', field: 'name' },
        { label: '年龄', field: 'age' },
        { label: '地址', field: 'address' },
      ],
      virtualEnabled: true,
      height: 400,
    },
  },
  {
    title: '自定义渲染表格',
    description: '通过设置列的 render 属性自定义单元格渲染。',
    props: {
      data: [
        { name: '张三', age: 25, status: 1 },
        { name: '李四', age: 30, status: 0 },
        { name: '王五', age: 28, status: 1 },
      ],
      columns: [
        { label: '姓名', field: 'name' },
        { label: '年龄', field: 'age' },
        {
          label: '状态',
          field: 'status',
          render: ({ cell }) => (cell === 1 ? '在职' : '离职'),
        },
      ],
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'data',
    type: 'Array',
    default: '[]',
    description: '表格数据',
  },
  {
    name: 'columns',
    type: 'Array',
    default: '[]',
    description: '表格列配置',
  },
  {
    name: 'activeColumn',
    type: 'Number | Array',
    default: '-1',
    description: '当前选中列',
  },
  {
    name: 'columnPick',
    type: 'String',
    default: 'disabled',
    description: '表格列选中方式，可选值：single、multi、disabled',
  },
  {
    name: 'height',
    type: 'String | Number',
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
    type: 'String | Number',
    default: 'LINE_HEIGHT',
    description: '表格最小高度',
  },
  {
    name: 'maxHeight',
    type: 'String | Number',
    default: 'auto',
    description: '表格最大高度',
  },
  {
    name: 'rowHeight',
    type: 'Number | Function',
    default: '-',
    description: '行高',
  },
  {
    name: 'headHeight',
    type: 'Number',
    default: 'LINE_HEIGHT',
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
    type: 'Object',
    default: '{ color: "def1", height: LINE_HEIGHT, isShow: true }',
    description: '表头配置',
  },
  {
    name: 'virtualEnabled',
    type: 'Boolean',
    default: 'false',
    description: '是否启用虚拟渲染',
  },
  {
    name: 'border',
    type: 'Array | String',
    default: '["row"]',
    description: '表格边框显示设置',
  },
  {
    name: 'pagination',
    type: 'Boolean | Object',
    default: 'false',
    description: '分页配置',
  },
  {
    name: 'paginationHeight',
    type: 'Number',
    default: 'TB_FOOT_HEIGHT',
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
    default: '-',
    description: '空数据展示文本',
  },
  {
    name: 'emptyCellText',
    type: 'String | Function',
    default: '""',
    description: '单元格数据为空展示',
  },
  {
    name: 'isEmptyCell',
    type: 'Array | Function',
    default: '["", undefined, null]',
    description: '判定单元格是否为空的规则',
  },
  {
    name: 'settings',
    type: 'Object | Boolean',
    default: 'false',
    description: '表格设置配置',
  },
  {
    name: 'rowClass',
    type: 'String | Object | Function',
    default: '{}',
    description: '行的 class 的回调方法',
  },
  {
    name: 'rowStyle',
    type: 'String | Object | Function',
    default: '{}',
    description: '行的 style 的回调方法',
  },
  {
    name: 'cellStyle',
    type: 'String | Object | Function',
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
    type: 'Object | Boolean',
    default: 'undefined',
    description: '表格底部loading加载效果',
  },
  {
    name: 'reserveExpand',
    type: 'Boolean',
    default: 'false',
    description: '是否保留展开收起操作',
  },
  {
    name: 'selectionKey',
    type: 'String',
    default: '""',
    description: '用于初始化或者更新row已选中状态',
  },
  {
    name: 'checked',
    type: 'Array',
    default: '[]',
    description: '默认选中行',
  },
  {
    name: 'isSelectedFn',
    type: 'Function',
    default: 'undefined',
    description: '自定义判定当前行是否选中',
  },
  {
    name: 'rowKey',
    type: 'String | Function',
    default: 'TABLE_ROW_ATTRIBUTE.ROW_INDEX',
    description: '行数据的 Key',
  },
  {
    name: 'showOverflowTooltip',
    type: 'Object | Boolean',
    default: 'false',
    description: '当内容过长被隐藏时显示 tooltip',
  },
  {
    name: 'asyncData',
    type: 'Boolean',
    default: 'false',
    description: '是否对源数据进行同步',
  },
  {
    name: 'rowHover',
    type: 'String',
    default: 'highlight',
    description: '鼠标划过行样式行为',
  },
  {
    name: 'defaultSort',
    type: 'Object',
    default: '{}',
    description: '默认的排序列的 prop 和顺序',
  },
  {
    name: 'isRowSelectEnable',
    type: 'Function | Boolean',
    default: 'true',
    description: '配置渲染行数据的勾选框是否可用',
  },
  {
    name: 'resizerWay',
    type: 'String',
    default: 'debounce',
    description: '外层容器尺寸改变时的重新计算方式',
  },
  {
    name: 'observerResize',
    type: 'Boolean',
    default: 'true',
    description: '是否监听表格尺寸变化',
  },
  {
    name: 'intersectionObserver',
    type: 'Boolean',
    default: 'false',
    description: '是否使用IntersectionObserver监听表格Cell',
  },
  {
    name: 'align',
    type: 'String',
    default: '-',
    description: '对齐方式',
  },
  {
    name: 'headerAlign',
    type: 'String',
    default: '-',
    description: '表头对齐方式',
  },
  {
    name: 'prependStyle',
    type: 'Object',
    default: '{}',
    description: '插入至表格第一行之前的内容容器样式',
  },
  {
    name: 'colSortBehavior',
    type: 'String',
    default: 'independent',
    description: '列排序行为',
  },
  {
    name: 'isFlex',
    type: 'Boolean',
    default: 'true',
    description: '是否采用flex布局表格',
  },
  {
    name: 'rowDraggable',
    type: 'Function | Boolean | Object',
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
    type: 'Object',
    default: 'null',
    description: '固定在底部的配置项',
  },
  {
    name: 'appendLastRow',
    type: 'Object',
    default: '{ type: "default", cellRender: undefined }',
    description: '表格尾部追加的行配置',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'cellClick',
    description: '单元格点击时触发',
    params: [
      {
        name: 'args',
        type: 'Object',
        description: '事件参数，包含 event、row、column、cell、rowIndex、columnIndex',
      },
    ],
  },
  {
    name: 'cellDblclick',
    description: '单元格双击时触发',
    params: [
      {
        name: 'args',
        type: 'Object',
        description: '事件参数，包含 event、row、column、cell、rowIndex、columnIndex',
      },
    ],
  },
  {
    name: 'columnFilter',
    description: '列筛选时触发',
    params: [
      {
        name: 'args',
        type: 'Object',
        description: '事件参数，包含 checked、column、index',
      },
    ],
  },
  {
    name: 'colFilterSave',
    description: '列筛选保存时触发',
    params: [
      {
        name: 'args',
        type: 'Object',
        description: '事件参数，包含 column、values',
      },
    ],
  },
  {
    name: 'columnPick',
    description: '列选择时触发',
    params: [
      {
        name: 'cols',
        type: 'Array',
        description: '选中的列信息',
      },
    ],
  },
  {
    name: 'columnSort',
    description: '列排序时触发',
    params: [
      {
        name: 'args',
        type: 'Object',
        description: '事件参数，包含 column、index、type',
      },
    ],
  },
  {
    name: 'dragend',
    description: '拖拽结束时触发',
    params: [
      {
        name: 'args',
        type: 'Object',
        description: '事件参数，包含 sourceEvent、data',
      },
    ],
  },
  {
    name: 'pageLimitChange',
    description: '分页每页条数变化时触发',
    params: [
      {
        name: 'limit',
        type: 'Number',
        description: '每页条数',
      },
    ],
  },
  {
    name: 'pageValueChange',
    description: '分页页码变化时触发',
    params: [
      {
        name: 'page',
        type: 'Number',
        description: '页码',
      },
    ],
  },
  {
    name: 'rowClick',
    description: '行点击时触发',
    params: [
      {
        name: 'event',
        type: 'MouseEvent',
        description: '鼠标事件',
      },
      {
        name: 'row',
        type: 'Object',
        description: '行数据',
      },
      {
        name: 'index',
        type: 'Number',
        description: '行索引',
      },
      {
        name: 'rows',
        type: 'Array',
        description: '所有行数据',
      },
      {
        name: 'this',
        type: 'Object',
        description: '表格实例',
      },
    ],
  },
  {
    name: 'rowDblclick',
    description: '行双击时触发',
    params: [
      {
        name: 'event',
        type: 'MouseEvent',
        description: '鼠标事件',
      },
      {
        name: 'row',
        type: 'Object',
        description: '行数据',
      },
      {
        name: 'index',
        type: 'Number',
        description: '行索引',
      },
      {
        name: 'rows',
        type: 'Array',
        description: '所有行数据',
      },
      {
        name: 'this',
        type: 'Object',
        description: '表格实例',
      },
    ],
  },
  {
    name: 'rowExpand',
    description: '行展开时触发',
    params: [
      {
        name: 'args',
        type: 'Object',
        description: '事件参数，包含 row、column、index、rows、e',
      },
    ],
  },
  {
    name: 'rowMouseEnter',
    description: '鼠标进入行时触发',
    params: [
      {
        name: 'event',
        type: 'MouseEvent',
        description: '鼠标事件',
      },
      {
        name: 'row',
        type: 'Object',
        description: '行数据',
      },
      {
        name: 'index',
        type: 'Number',
        description: '行索引',
      },
      {
        name: 'rows',
        type: 'Array',
        description: '所有行数据',
      },
      {
        name: 'this',
        type: 'Object',
        description: '表格实例',
      },
    ],
  },
  {
    name: 'rowMouseLeave',
    description: '鼠标离开行时触发',
    params: [
      {
        name: 'event',
        type: 'MouseEvent',
        description: '鼠标事件',
      },
      {
        name: 'row',
        type: 'Object',
        description: '行数据',
      },
      {
        name: 'index',
        type: 'Number',
        description: '行索引',
      },
      {
        name: 'rows',
        type: 'Array',
        description: '所有行数据',
      },
      {
        name: 'this',
        type: 'Object',
        description: '表格实例',
      },
    ],
  },
  {
    name: 'select',
    description: '行选择时触发',
    params: [
      {
        name: 'args',
        type: 'Object',
        description: '事件参数，包含 row、index、checked、data',
      },
    ],
  },
  {
    name: 'selectAll',
    description: '全选时触发',
    params: [
      {
        name: 'args',
        type: 'Object',
        description: '事件参数，包含 checked、data',
      },
    ],
  },
  {
    name: 'selectionChange',
    description: '选择变化时触发',
    params: [
      {
        name: 'args',
        type: 'Object',
        description: '事件参数，包含 row、index、checked、data、isAll',
      },
    ],
  },
  {
    name: 'scrollBottom',
    description: '滚动到底部时触发',
    params: [
      {
        name: 'args',
        type: 'Object',
        description: '事件参数，包含 translateX、translateY、scrollTop、scrollLeft、bottom',
      },
    ],
  },
  {
    name: 'settingChange',
    description: '设置变化时触发',
    params: [
      {
        name: 'args',
        type: 'Object',
        description: '设置参数',
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Form;

// 组件名称
const name = 'table';

// 组件标签
const title = 'Table';

// 组件中文标签
const titleCN = '表格';

export default {
  presets,
  props,
  emits,
  group,
  name,
  title,
  titleCN,
};
