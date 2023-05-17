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
import { string, toType } from 'vue-types';

import { PropTypes } from '@bkui-vue/shared';

import { BORDER_OPTION, LINE_HEIGHT, ROW_HOVER, ROW_HOVER_OPTIONS, SORT_OPTION, TABLE_ROW_ATTRIBUTE } from './const';

export enum SortScope {
  CURRENT = 'current',
  ALL = 'all'
}

export type ColumnFilterListItem = {
  text?: string;
  value?: string;
};

export enum OverflowModeEnum {
  STATIC = 'static',
  AUTO = 'auto'
}

export const overflowModeType = toType<`${OverflowModeEnum}`>('showOverflowTooltipMode', {
  default: OverflowModeEnum.AUTO,
});

export enum ColumnTypeEnum {
  SELECTION = 'selection',
  INDEX = 'index',
  EXPAND = 'expand',
  NONE = 'none',
}
export const columnType = toType<`${ColumnTypeEnum}`>('columnType', {
  default: ColumnTypeEnum.NONE,
});

export enum FullEnum {
  FULL = 'full',
  FUZZY = 'fuzzy',
}

export const fullType = toType<`${FullEnum}`>('full', {
  default: FullEnum.FULL,
});

export enum SettingSizeEnum {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export const settingSizeType = toType<`${SettingSizeEnum}`>('columnSize', {
  default: SettingSizeEnum.SMALL,
});

export enum FixedEnum {
  LEFT = 'left',
  RIGHT = 'right',
}

export const fixedType = string<`${FixedEnum}`>();

export type IOverflowTooltip = {
  content: string | Function,
  disabled?: boolean,
  watchCellResize?: boolean,
  mode?: `${OverflowModeEnum}`
};

export type ISortOption = {
  [key: string]: SORT_OPTION;
};
const sortScopeType = toType<`${SortScope}`>('sortScope', {}).def(SortScope.CURRENT);

export enum ColumnPickEnum {
  MULTI = 'multi',
  SINGLE = 'single',
  DISABLED = 'disabled',
}

export enum ResizerWay {
  DEBOUNCE = 'debounce',
  THROTTLE = 'throttle'
}

export const IColumnType = {
  label: PropTypes.oneOfType([PropTypes.func.def(() => ''), PropTypes.string.def('')]),
  field: PropTypes.oneOfType([PropTypes.func.def(() => ''), PropTypes.string.def('')]),
  render: PropTypes.oneOfType([PropTypes.func.def(() => ''), PropTypes.string.def('')]),
  width: PropTypes.oneOfType([PropTypes.number.def(undefined), PropTypes.string.def('auto')]),
  minWidth: PropTypes.oneOfType([PropTypes.number.def(undefined), PropTypes.string.def('auto')]).def(30),
  columnKey: PropTypes.string.def(''),
  showOverflowTooltip: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape<IOverflowTooltip>({
    content: PropTypes.string.def(''),
    disabled: PropTypes.bool.def(false),
    watchCellResize: PropTypes.bool.def(true),
    mode: overflowModeType,
  })]).def(undefined),
  type: columnType,
  resizable: PropTypes.bool.def(true),
  fixed: PropTypes.oneOfType([
    PropTypes.bool,
    fixedType,
  ]).def(false),
  sort: PropTypes.oneOfType([
    PropTypes.shape({
      sortFn: PropTypes.func.def(undefined),
      sortScope: sortScopeType,
      value: PropTypes.string.def(SORT_OPTION.NULL),
    }),
    PropTypes.bool,
    PropTypes.string]).def(false),
  filter: PropTypes.oneOfType([
    PropTypes.shape({
      list: PropTypes.arrayOf(PropTypes.any).def([]),
      filterFn: PropTypes.func.def(undefined),
      match: fullType,
      filterScope: sortScopeType,
      btnSave: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).def('确定'),
      btnReset: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).def('重置'),
    }),
    PropTypes.bool,
    PropTypes.string]).def(false),
  colspan: PropTypes.oneOfType([PropTypes.func.def(() => 1), PropTypes.number.def(1)]),
  rowspan: PropTypes.oneOfType([PropTypes.func.def(() => 1), PropTypes.number.def(1)]),
};

export const tableProps = {
  /**
   * 渲染列表
   */
  data: PropTypes.arrayOf(PropTypes.any).def([]),

  /**
   * Table 列渲染
   */
  columns: PropTypes.arrayOf(PropTypes.shape<Column>(IColumnType).loose).def([]),

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
  columnPick: toType<`${ColumnPickEnum}`>('columnPick', {}).def(ColumnPickEnum.DISABLED),

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
  minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(LINE_HEIGHT * 2),

  /**
   * 设置表格最d大高度
   * 默认：auto，依赖外层高度
   */
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def('auto'),

  /**
   * 行高，可以为固定数值类型
   * 可以是函数，返回当前行的高度，返回值为数值类型
   */
  rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).def(LINE_HEIGHT),

  /**
   * Thead行高，可以为固定数值类型
   */
  headHeight: PropTypes.number.def(LINE_HEIGHT),

  /**
   * 是否显示Head
   */
  showHead: PropTypes.bool.def(true),

  /**
   * table header config
   */
  thead: PropTypes.shape<Thead>({
    height: PropTypes.number.def(LINE_HEIGHT),
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
  border: PropTypes.oneOfType([
    PropTypes.arrayOf(toType<`${BORDER_OPTION}`>('boderType', {})),
    PropTypes.string,
  ]).def([BORDER_OPTION.ROW]),

  /**
   * 分页配置
   * 默认值为false，不启用分页
   * 设置为 true，启用分页功能，默认值参考分页组件 Pagination
   */
  pagination: PropTypes.oneOfType([PropTypes.bool.def(false), PropTypes.object.def({})]).def(false),

  /**
   * 分页组件高度
   * 在设置了分页配置之后才会生效
   * 用于配置分页组件的高度，在不同项目中，分页组件高度会影响表格高度计算
   * 这里设置为可配置项，避免自计算导致的性能问题以及不确定性样式问题
   */
  paginationHeihgt: PropTypes.number.def(LINE_HEIGHT),

  /**
   * 是否启用远程分页
   */
  remotePagination: PropTypes.bool.def(false),

  /**
   * 空数据展示
   */
  // emptyText: PropTypes.string.def('暂无数据'),
  emptyText: PropTypes.string,

  /**
   * bk-table-setting-content
   */
  settings: PropTypes.oneOfType([
    PropTypes.shape({
      fields: PropTypes.arrayOf(PropTypes.shape<Field>({
        label: PropTypes.string,
        field: PropTypes.string,
        disabled: PropTypes.bool,
      })),
      checked: PropTypes.arrayOf(PropTypes.string),
      limit: PropTypes.number.def(0),
      size: settingSizeType,
      sizeList: PropTypes.shape<SizeItem[]>([]),
      showLineHeight: PropTypes.bool.def(true),
    }), PropTypes.bool]).def(false),

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
   * 仅对设置了selection的情况下生效
   * 用于初始化或者更新row已选中状态
   * 内部使用逻辑为：row[selectionKey]，可以为多级选择，但是多级选择只支持 row.child.child
   */
  selectionKey: PropTypes.string.def(''),

  /**
   * 提供自定义判定当前行是否选中
   * 如果设置了此属性，其他判定均不生效
   * ({ row, cell, data }) => bool
   */
  isSelectedFn: PropTypes.func.def(undefined),

  /**
   * 行数据的 Key，用来优化 Table 的渲染
   * 此key用于渲染table row的key，便于大数据渲染时的性能优化
   * 在使用 reserve-selection, reserve-expand 功能的情况下，该属性是必填的。
   * 类型为 String 时，支持多层访问：user.info.id，同时支持 user.info[0].id
   */
  rowKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).def(TABLE_ROW_ATTRIBUTE.ROW_INDEX),

  /**
   * 当内容过长被隐藏时显示 tooltip, 此处为全局配置, 如果只配置此处，整个table都启用
   * column内部可以单个配置覆盖此配置
   */
  showOverflowTooltip: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape<IOverflowTooltip>({
    content: PropTypes.string.def(''),
    disabled: PropTypes.bool.def(false),
    watchCellResize: PropTypes.bool.def(true),
    mode: overflowModeType,
  })]).def(false),

  /**
   * 为避免不必要的数据修改导致的不可控组件更新
   * 默认组件不会对传入组件的data进行任何修改
   * 设置此属性为true则会对源数据进行同步（如：启用selection，勾选时想要自动同步到源数据）
   * 目前只会对指定了selectionKey的情况下才会对指定的字段数据进行更新，同时需要指定 rowKey，保证匹配到的row是正确的目标对象
   */
  asyncData: PropTypes.bool.def(false),

  /**
   * 鼠标划过行样式行为
   * @param { ROW_HOVER.AUTO }
   * @param { ROW_HOVER.HIGHLIGHT }
   */
  rowHover: PropTypes.oneOf(ROW_HOVER_OPTIONS).def(ROW_HOVER.HIGHLIGHT),

  /**
   * 默认的排序列的 prop 和顺序。它的 prop 属性指定默认的排序的列，order指定默认排序的顺序
   */
  defaultSort: PropTypes.shape<ISortOption>({}).def({}),

  /**
   * 配合 column selection 使用
   * 用于配置渲染行数据的勾选框是否可用
   * 可以直接为 true|false，全部启用或者禁用
   * 如果是函数，则返回 true|false
   * ({ row, index, isCheckAll }) => boolean
   */
  isRowSelectEnable: PropTypes.oneOfType([
    PropTypes.func.def(() => true),
    PropTypes.bool.def(true),
  ]).def(true),

  /**
   * 当外层容器尺寸改变时，当前组件用什么方式进行重新计算
   * 默认为 throttle，按照指定频率重新计算
   * 可选值：debounce，在指定时间范围内只执行一次重新计算
   */
  resizerWay: toType<`${ResizerWay}`>('ResizerWay', {
    default: ResizerWay.DEBOUNCE,
  }),
  /**
   * 是否监表格尺寸变化而响应式重新计算渲染
   */
  observerResize: PropTypes.bool.def(true),
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
  fields?: Field[],
  checked?: string[];
  limit?: number;
  size?: string;
  sizeList?: SizeItem[];
  showLineHeight?: boolean;
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
  columnKey?: string;
  showOverflowTooltip?: boolean | IOverflowTooltip;
  type?: string;
  fixed?: string | boolean;
  resizable?: boolean;
  sort?: {
    sortFn?: Function;
    sortScope?: string;
    value?: string;
  } | boolean | string;
  filter?: {
    list?: any,
    filterFn?: Function;
  } | boolean | string;
  colspan?: Function | Number;
  rowspan?: Function | Number;
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
  activeColumns: IColumnActive[],
  rowActions: Record<string, any>,
  scrollTranslateY: Number,
  scrollTranslateX: Number,
  pos: Record<string, any>,
  settings: any,
  setting: any,
  defaultSort: Record<string, any>
};

export type Colgroups = Column & {
  calcWidth: number,
  resizeWidth: number,
  listeners: Map<string, Function>,
};
