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

import {
  BORDER_OPTION,
  COL_MIN_WIDTH,
  IHeadColor,
  LINE_HEIGHT,
  ROW_HOVER,
  ROW_HOVER_OPTIONS,
  SORT_OPTION,
  TABLE_ROW_ATTRIBUTE,
  TB_FOOT_HEIGHT,
} from './const';

export enum SortScope {
  CURRENT = 'current',
  ALL = 'all',
}

export type ColumnFilterListItem = {
  text?: string;
  value?: string;
};

export enum OverflowModeEnum {
  STATIC = 'static',
  AUTO = 'auto',
}

export const EnumOverflowModeType = toType<`${OverflowModeEnum}`>(
  'showOverflowTooltipMode',
  {
    default: OverflowModeEnum.AUTO,
  },
);

export enum ColumnTypeEnum {
  SELECTION = 'selection',
  INDEX = 'index',
  EXPAND = 'expand',
  NONE = 'none',
}

export enum TableAlignEnum {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
  NONE = '',
}

export const columnType = toType<`${ColumnTypeEnum}`>('columnType', {
  default: ColumnTypeEnum.NONE,
});
export const TableAlign = toType<`${TableAlignEnum}`>('columnType', {
  default: TableAlignEnum.NONE,
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

export type IOverflowTooltipProp = {
    content: string | Function;
    disabled?: boolean;
    watchCellResize?: boolean;
    mode?: `${OverflowModeEnum}`;
    popoverOption?: any;
    resizerWay?: ResizerWay;
  } | boolean;

export type IOverflowTooltip = IOverflowTooltipProp;

export const IOverflowTooltipPropType = toType<IOverflowTooltipProp>(
  'IOverflowTooltipPropType',
  {},
).def(false);

export const IOverflowTooltipType = toType<IOverflowTooltip>(
  'IOverflowTooltipType',
  {},
).def({
  content: '',
  disabled: false,
  watchCellResize: true,
  mode: OverflowModeEnum.AUTO,
});

export type ISortOption = {
  [key: string]: SORT_OPTION;
};

export const ISortType = toType<ISortPropShape>('ISortPropShape', {}).def(false);

export type ISortShape = {
  sortFn?: Function;
  sortScope?: SortScope;
  value?: SORT_OPTION;
};

export type ISortPropShape = ISortShape | boolean | string;

export type IFilterShape = {
  list: any[];
  filterFn?: Function;
  match?: FullEnum;
  checked?: any[];
  filterScope?: SortScope;
  btnSave?: boolean | string;
  btnReset?: boolean | string;
};

export type IFilterPropShape = IFilterShape | boolean | string;

export const IFilterType = toType<IFilterPropShape>('IFilterPropShape', {}).def(false);

export enum ColumnPickEnum {
  MULTI = 'multi',
  SINGLE = 'single',
  DISABLED = 'disabled',
}

export enum ResizerWay {
  DEBOUNCE = 'debounce',
  THROTTLE = 'throttle',
}

export const IColumnType = toType<Column>('IColumnType', {}).def({
  width: '100%',
  label: () => '',
});

export const ITableSettings = toType<ISettingPropType>(
  'ITableSettingPropType',
  {},
).def(false);

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
  sizeList?: SizeItem[];
  showLineHeight?: boolean;
};

export type ISettingPropType = Settings | boolean;

export type Field = {
  label: string;
  field?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
};

export type LabelFunctionString = ((_column, _index) => string | JSX.Element) | string;
export const LabelFunctionStringType = toType<LabelFunctionString>(
  'LabelFunctionStringType',
  {},
);

export type RenderFunctionString = ({
  cell,
  data,
  row,
  column,
  index,
  rows,
}) => string | JSX.Element;
export const RenderFunctionStringType = toType<RenderFunctionString>(
  'RenderFunctionStringType',
  {},
);

export type SpanFunctionString = ({
  column,
  colIndex,
  row,
  rowIndex,
}) => number | Number;
export const SpanFunctionStringType = toType<SpanFunctionString>(
  'SpanFunctionStringType',
  {},
);

export type RowClassFunctionString = ((row: any) => string) | string;
export const RowClassFunctionStringType = toType<RowClassFunctionString>(
  'RowClassFunctionStringType',
  {},
);

export type RowHeightFunctionNumber = ((
  _type: string,
  _row: any,
  _rowIndex: number,
  _size?
) => number) | number;
export const RowHeightFunctionNumberType = toType<RowHeightFunctionNumber>(
  'RowHeightFunctionNumberType',
  {},
);

type FunctionNumber = Function | number;
export const FunctionNumberType = toType<FunctionNumber>(
  'FunctionNumberType',
  {},
);

type StringNumber = string | number;
export const StringNumberType = toType<StringNumber>('StringNumberType', {});

/**
 * 表格字段解释说明
 */
export type IColumnExplain = {
  content: LabelFunctionString,
  head: LabelFunctionString | boolean
} | boolean

export type Column = {
  label: LabelFunctionString;
  field?: LabelFunctionString;
  render?: RenderFunctionString;
  renderHead?: RenderFunctionString;
  width?: number | string;
  minWidth?: number | string;
  columnKey?: string;
  showOverflowTooltip?: boolean | IOverflowTooltip;
  type?: string;
  fixed?: string | boolean;
  resizable?: boolean;
  sort?: ISortShape | boolean | string;
  filter?: IFilterShape | boolean | string;
  colspan?: SpanFunctionString;
  rowspan?: SpanFunctionString;
  textAlign?: string;
  className?: RowClassFunctionString;
  align?: string;
  prop?: LabelFunctionString;
  index?: Number;
  explain?: IColumnExplain;
};

export const IColumnProp = toType<Column>('IColumnPropType', {}).def({
  label: undefined,
  minWidth: COL_MIN_WIDTH,
});

export type Thead = {
  height?: Number;
  isShow?: boolean;
  cellFn?: Function;
  color?: IHeadColor | string;
};

export type Columns = ReadonlyArray<Column>;
export type TablePropTypes = Readonly<ExtractPropTypes<typeof tableProps>>;

export type GroupColumn = {
  calcWidth?: number;
  resizeWidth?: number;
  isHidden?: boolean;
  listeners?: Map<string, any>;
} & Column;

export type IColumnActive = {
  index: number;
  active: boolean;
};

export type IReactiveProp = {
  activeColumns: IColumnActive[];
  rowActions: Record<string, any>;
  scrollTranslateY: Number;
  scrollTranslateX: Number;
  pos: Record<string, any>;
  settings: Settings | boolean;
  setting: {
    size: string;
    height: Number;
  };
  defaultSort: Record<string, any>;
};

export type Colgroups = Column & {
  calcWidth: number;
  resizeWidth: number;
  listeners: Map<string, Function>;
};

export const tableProps = {
  /**
   * 渲染列表
   */
  data: PropTypes.arrayOf(PropTypes.any).def([]),

  /**
   * Table 列渲染
   */
  columns: PropTypes.arrayOf(IColumnType).def([]),

  /**
   * 当前选中列
   * 当设置选中多列时（columnPick = multi），配置为数组[index1, index2, index3]，只能选中单列时，可以为数值或者数组[index]
   */
  activeColumn: PropTypes.oneOfType([
    PropTypes.number.def(-1),
    PropTypes.arrayOf(PropTypes.number.def(-1)),
  ]),

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
  height: StringNumberType.def('auto'),

  /**
   * 是否为斑马纹 Table
   */
  stripe: PropTypes.bool.def(false),

  /**
   * 设置表格最小高度
   * 默认：300
   */
  minHeight: StringNumberType.def(LINE_HEIGHT * 2),

  /**
   * 设置表格最d大高度
   * 默认：auto，依赖外层高度
   */
  maxHeight: StringNumberType.def('auto'),

  /**
   * 行高，可以为固定数值类型
   * 可以是函数，返回当前行的高度，返回值为数值类型
   */
  rowHeight: RowHeightFunctionNumberType.def(() => LINE_HEIGHT),

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
  thead: toType<Thead>('ITheadType', {}).def({
    color: IHeadColor.DEF1,
    height: LINE_HEIGHT,
    isShow: true,
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
  pagination: PropTypes.oneOfType([
    PropTypes.bool.def(false),
    PropTypes.object.def({}),
  ]).def(false),

  /**
   * 分页组件高度
   * 在设置了分页配置之后才会生效
   * 用于配置分页组件的高度，在不同项目中，分页组件高度会影响表格高度计算
   * 这里设置为可配置项，避免自计算导致的性能问题以及不确定性样式问题
   */
  paginationHeight: PropTypes.number.def(TB_FOOT_HEIGHT),

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
  settings: ITableSettings,

  /**
   * 行的 class 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style
   */
  rowClass: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.func,
  ]).def({}),

  /**
   * 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style
   */
  rowStyle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.func,
  ]).def({}),

  /**
   * 单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style
   */
  cellStyle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.func,
  ]).def({}),

  /**
   * 单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className
   */
  cellClass: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.func,
  ]).def({}),

  /**
   * 表格底部loading加载效果，可以配合表格scroll-bottom事件使用
   * 详细配置可参考bk-loading组件
   */
  scrollLoading: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).def(undefined),

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
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).def(TABLE_ROW_ATTRIBUTE.ROW_INDEX),

  /**
   * 当内容过长被隐藏时显示 tooltip, 此处为全局配置, 如果只配置此处，整个table都启用
   * column内部可以单个配置覆盖此配置
   */
  showOverflowTooltip: IOverflowTooltipPropType,

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
  // 对齐方式
  align: TableAlign,
  headerAlign: TableAlign,

  /**
   * 插入至表格第一行之前的内容容器样式
   * 默认样式为固定在第一行
   * 需要跟随滚动或者其他样式，可以通过此配置进行覆盖
   */
  prependStyle: PropTypes.style().def({}),
};
