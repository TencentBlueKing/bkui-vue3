/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
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

import { ExtractPropTypes } from 'vue';

import { PropTypes } from '@bkui-vue/shared';

import { BORDER_OPTION, BORDER_OPTIONS, TABLE_ROW_ATTRIBUTE } from './const';

export enum SortScope {
  CURRENT = 'current',
  ALL = 'all'
}

export type ColumnFilterListItem = {
  text?: string;
  value?: string;
};

export const tableProps = {
  /**
   * 渲染列表
   */
  data: PropTypes.arrayOf(PropTypes.any).def([]),

  /**
   * Table 列渲染
   */
  columns: PropTypes.arrayOf(PropTypes.shape<Column>({
    label: PropTypes.oneOfType([PropTypes.func.def(() => ''), PropTypes.string.def('')]),
    field: PropTypes.oneOfType([PropTypes.func.def(() => ''), PropTypes.string.def('')]),
    render: PropTypes.oneOfType([PropTypes.func.def(() => ''), PropTypes.string.def('')]),
    width: PropTypes.oneOfType([PropTypes.number.def(undefined), PropTypes.string.def('auto')]),
    minWidth: PropTypes.oneOfType([PropTypes.number.def(undefined), PropTypes.string.def('auto')]).def(),
    type: PropTypes.commonType(['selection', 'index', 'expand', 'none'], 'columnType').def('none'),
    resizable: PropTypes.bool.def(true),
    fixed: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.commonType(['left', 'right'], 'fixed'),
    ]).def(false),
    sort: PropTypes.oneOfType([
      PropTypes.shape({
        sortFn: PropTypes.func.def(undefined),
        sortScope: PropTypes.commonType(Object.values(SortScope)).def(SortScope.CURRENT),
      }),
      PropTypes.bool,
      PropTypes.string]).def(false),
    filter: PropTypes.oneOfType([
      PropTypes.shape({
        list: PropTypes.arrayOf(PropTypes.any).def([]),
        filterFn: PropTypes.func.def(undefined),
      }),
      PropTypes.bool,
      PropTypes.string]).def(false),
  })).def([]),

  /**
   * 当前选中列
   * 当设置选中多列时（columnPick = multi），配置为数组[index1, index2, index3]，只能选中单列时，可以为数值或者数组[index]
   */
  activeColumn: PropTypes.oneOfType([PropTypes.number.def(-1), PropTypes.arrayOf(PropTypes.number.def(-1))]),

  /**
   * 表格列选中方式
   * 支持：单列（single），多列（multi），禁用（disabled）
   * 默认：disabled
   */
  columnPick: PropTypes.commonType(['multi', 'single', 'disabled'], 'columnPick').def('disabled'),

  /**
   * 设置表格高度
   * 默认：auto 根据行数自动填充高度
   * 100%，依赖初始化时父级容器高度
   */
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def('auto'),

  /**
   * 设置表格最小高度
   * 默认：300
   */
  minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(80),

  /**
   * 设置表格最d大高度
   * 默认：auto，依赖外层高度
   */
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def('auto'),

  /**
   * 行高，可以为固定数值类型
   * 可以是函数，返回当前行的高度，返回值为数值类型
   */
  rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).def(40),

  /**
   * Thead行高，可以为固定数值类型
   */
  headHeight: PropTypes.number.def(40),

  /**
   * 是否显示Head
   */
  showHead: PropTypes.bool.def(true),

  /**
   * table header config
   */
  thead: PropTypes.shape<Thead>({
    height: PropTypes.number.def(40),
    isShow: PropTypes.bool.def(true),
    cellFn: PropTypes.func.def(undefined),
  }),

  /**
   * 是否启用虚拟渲染 & 滚动
   * 当数据量很大时，启用虚拟渲染可以解决压面卡顿问题
   */
  virtualEnabled: PropTypes.bool.def(false),

  /**
   * 表格边框显示设置，可以是一个组合
   * 生效规则: 除非单独设置 none,否则会追加每个设置
   */
  border: PropTypes.arrayOf(PropTypes.commonType(BORDER_OPTIONS, 'border')).def([BORDER_OPTION.ROW]),

  /**
   * 分页配置
   * 默认值为false，不启用分页
   * 设置为 true，启用分页功能，默认值参考分页组件 Pagination
   */
  pagination: PropTypes.oneOfType([PropTypes.bool.def(false), PropTypes.object.def({})]).def(false),

  /**
   * 是否启用远程分页
   */
  remotePagination: PropTypes.bool.def(false),

  /**
   * 空数据展示
   */
  emptyText: PropTypes.string.def('暂无数据'),

  /**
   * bk-table-setting-content
   */
  settings: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape<Settings>({
    fields: PropTypes.shape<Field[]>([]).def(undefined),
    checked: PropTypes.shape<string[]>([]).def(undefined),
    limit: PropTypes.number.def(undefined),
    size: PropTypes.size(['small', 'default', 'large']).def('default'),
    sizeList: PropTypes.shape<SizeItem[]>([]).def(undefined),
  })]).def(false),

  /**
   * 行的 class 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style
   */
  rowClass: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]).def({}),

  /**
   * 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style
   */
  rowStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]).def({}),


  /**
   * 单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style
   */
  cellStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]).def({}),


  /**
   * 单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className
   */
  cellClass: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]).def({}),

  /**
   * 表格底部loading加载效果，可以配合表格scroll-bottom事件使用
   * 详细配置可参考bk-loading组件
   */
  scrollLoading: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).def(undefined),

  /**
   * 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的展开收起操作（需指定 row-key）
   */
  reserveExpand: PropTypes.bool.def(false),

  /**
   * 行数据的 Key，用来优化 Table 的渲染；
   * 在使用 reserve-selection, reserve-expand 功能的情况下，该属性是必填的。
   * 类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function
   */
  rowKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).def(TABLE_ROW_ATTRIBUTE.ROW_INDEX),
};


/**
 * 配置自定义行高选项
 */
export type SizeItem = {
  value?: string;
  label?: string;
  height?: number;
};

export type Settings = {
  fields?: Field[];
  checked?: string[];
  limit?: number;
  size?: string;
  sizeList?: SizeItem[]
};

export type Field = {
  label: string;
  field?: string;
  disabled?: boolean;
};


export type Column = {
  label: Function | string;
  field?: Function | string;
  render?: Function | string;
  width?: number | string;
  minWidth?: number | string;
  type?: string;
  fixed?: string | boolean;
  resizable?: boolean;
  sort?: {
    sortFn?: Function;
    sortScope?: string;
  } | boolean | string;
  filter?: {
    list?: any,
    filterFn?: Function;
  } | boolean | string;
};

export type Thead = {
  height?: Number,
  isShow?: boolean,
  cellFn?: Function
};

export type GroupColumn = {
  calcWidth?: number;
  resizeWidth?: number;
  isHidden?: boolean;
  listeners?: Map<string, any>;
} & Column;

export type Columns = ReadonlyArray<Column>;
export type TablePropTypes = Readonly<ExtractPropTypes<typeof tableProps>>;
export type IColumnActive = {
  index: number;
  active: boolean;
};

export type IReactiveProp = {
  activeColumns: IColumnActive[]
};

export type Colgroups = Column & {
  calcWidth: number,
  resizeWidth: number,
  listeners: Map<string, Function>,
};
