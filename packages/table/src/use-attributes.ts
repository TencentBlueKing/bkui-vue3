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
import { v4 as uuidv4 } from 'uuid';
import { reactive } from 'vue';

import {
  CHECK_ALL_OBJ,
  COL_MIN_WIDTH,
  COLUMN_ATTRIBUTE,
  IEmptyObject,
  NEED_COL_ROW_SPAN,
  SETTING_SIZE,
  SORT_OPTION,
  TABLE_ROW_ATTRIBUTE,
} from './const';
import usePagination from './plugins/use-pagination';
import { Column, Field, IColSortBehavior, Settings, SortScope, TablePropTypes } from './props';
import {
  getRowId,
  getRowValue,
  isColumnHidden,
  isRowSelectEnable,
  resolveColumnSortProp,
  resolveColumnSpan,
} from './utils';

export type ITableFormatData = {
  data: any[];
  dataSchema: WeakMap<object, any>;
  columnSchema: WeakMap<object, any>;
  columns: Column[];
  settings: {
    size: string;
    height: number;
    fields: Field[];
    checked: string[];
  };
  layout: {
    bottom: number;
    hasScrollY: boolean;
    translateX: number;
    translateY: number;
  };
};

export type ITableResponse = {
  formatColumns: (columns: Column[]) => void;
  formatDataSchema: (data: any[]) => void;
  setRowSelection: (row: any, isSelected: boolean) => void;
  setRowExpand: (row: any, isExpand: boolean) => void;
  setRowIndex: (row: any, index: number) => void;
  setColumnAttribute: (
    col: Column,
    attrName: string,
    attrValue: ((...args) => boolean | number | void | string) | string | boolean | number,
  ) => void;
  setColumnAttributeBySettings: (settings: Settings, checkedVal?: string[]) => void;
  setAllColumnAttribute: (
    attrName: string,
    attrValue: ((...args) => boolean | number | void | string) | string | boolean | number,
  ) => void;
  getColumnAttribute: (col: Column, attributeName: string) => string | boolean | Record<string, any>;
  getColumnId: (col: Column) => string;
  getColumnOrderWidth: (column: Column, orders?: string[]) => number;
  isActiveColumn: (col: Column) => boolean;
  isHiddenColumn: (col: Column) => boolean;
  resolvePageData: (filterFn?: any, sortFn?: any, column?: Column, type?: string, sortScope?: SortScope) => void;
  resetStartEndIndex: () => void;
  toggleRowSelection: (row: any) => void;
  toggleAllSelection: (value?: boolean) => void;
  setAllRowExpand: (value?: boolean) => void;
  clearSelection: () => void;
  clearColumnSort: (reset?: boolean) => void;
  setColumnSortActive: (column: Column, active: boolean) => void;
  getRowAttribute: (row: any | IEmptyObject, attrName: string) => any;
  getRowSelection: () => any[];
  resolveColumnWidth: (root: HTMLElement, autoWidth?, offsetWidth?) => void;
  filter: () => void;
  sortData: (column: Column) => void;
  isCheckedAll: () => boolean;
  hasCheckedRow: () => boolean;
  setRowSelectionAll: (val: boolean) => void;
  setRowIndeterminate: () => void;
  updateSettings: (settings?: Settings, rowHeight?: number) => void;
  pageData: any[];
  localPagination: any;
  formatData: ITableFormatData;
};

export default (props: TablePropTypes): ITableResponse => {
  const getDefaultSettings = () => {
    const { size, fields = [], checked = [] } = props.settings as Settings;
    const height = SETTING_SIZE[size] ?? props.rowHeight ?? SETTING_SIZE.small;
    return { size, height, fields, checked };
  };

  const formatData: ITableFormatData = reactive({
    data: [...props.data],
    dataSchema: new WeakMap(),
    columns: [...props.columns],
    columnSchema: new WeakMap(),
    settings: getDefaultSettings(),
    layout: {
      hasScrollY: false,
      bottom: 0,
      translateX: 0,
      translateY: 0,
    },
  });

  const { pageData, localPagination, resolvePageData, multiFilter, sort, resetStartEndIndex } = usePagination(props);

  const updateSettings = (settings?: Settings, rowHeight?: number) => {
    if (settings) {
      const { size, fields = [], checked = [] } = settings;
      const height = rowHeight ?? SETTING_SIZE[size] ?? props.rowHeight ?? SETTING_SIZE.small;
      Object.assign(formatData.settings, { size, height, fields, checked });
      return;
    }

    if (rowHeight) {
      formatData.settings.height = rowHeight;
    }
  };

  const resolveMinWidth = (col: Column) => {
    if (/^\d+/.test(`${col.minWidth}`)) {
      return col.minWidth;
    }

    let minWidth = COL_MIN_WIDTH;
    if (col.sort) {
      minWidth = minWidth + 18;
    }

    if (col.filter) {
      minWidth = minWidth + 28;
    }
    return minWidth;
  };

  /**
   * Format columns
   * @param columns
   */
  const formatColumns = (columns: Column[]) => {
    formatData.columns.length = 0;
    formatData.columns.push(...columns);
    let skipColNum = 0;
    const needColSpan = neepColspanOrRowspan(['colspan']);
    (columns || []).forEach((col, index) => {
      const { skipCol, skipColumnNum, skipColLen } = needColSpan
        ? getColumnSpanConfig(col, index, skipColNum)
        : { skipCol: false, skipColumnNum: 0, skipColLen: 0 };

      skipColNum = skipColumnNum;
      if (!formatData.columnSchema.has(col)) {
        const { type, fn, scope, active } = resolveColumnSortProp(col, props);
        formatData.columnSchema.set(col, {
          [COLUMN_ATTRIBUTE.CALC_WIDTH]: undefined,
          [COLUMN_ATTRIBUTE.RESIZE_WIDTH]: undefined,
          [COLUMN_ATTRIBUTE.COL_MIN_WIDTH]: resolveMinWidth(col),
          [COLUMN_ATTRIBUTE.LISTENERS]: new Map(),
          [COLUMN_ATTRIBUTE.WIDTH]: col.width,
          [COLUMN_ATTRIBUTE.IS_HIDDEN]: isColumnHidden(formatData.settings.fields, col, formatData.settings.checked),
          [COLUMN_ATTRIBUTE.COL_SORT_TYPE]: type,
          [COLUMN_ATTRIBUTE.COL_SORT_FN]: fn,
          [COLUMN_ATTRIBUTE.COL_FILTER_FN]: undefined,
          [COLUMN_ATTRIBUTE.COL_FILTER_SCOPE]: undefined,
          [COLUMN_ATTRIBUTE.COL_SORT_SCOPE]: scope,
          [COLUMN_ATTRIBUTE.COL_SORT_ACTIVE]: active,
          [COLUMN_ATTRIBUTE.COL_IS_DRAG]: false,
          [COLUMN_ATTRIBUTE.COL_SPAN]: { skipCol, skipColumnNum, skipColLen },
          [COLUMN_ATTRIBUTE.COL_UID]: uuidv4(),
        });
      }

      Object.assign(formatData.columnSchema.get(col), {
        [COLUMN_ATTRIBUTE.COL_SPAN]: { skipCol, skipColumnNum, skipColLen },
        [COLUMN_ATTRIBUTE.COL_MIN_WIDTH]: resolveMinWidth(col),
      });
    });
  };

  const getColumnSpanConfig = (col: Column, index: number, skipColNum: number) => {
    let skipColumnNum = skipColNum;
    const colspan = resolveColumnSpan(col, index, null, null, 'colspan');
    const target = {
      skipCol: false,
      skipColLen: 0,
    };

    if (skipColumnNum > 0) {
      target.skipColLen = skipColumnNum;
      target.skipCol = true;
      skipColumnNum = skipColumnNum - 1;
    }

    if (colspan > 1) {
      target.skipColLen = colspan;
      skipColumnNum = colspan - 1;
    }

    return { ...target, skipColumnNum };
  };

  const getColumnFilterFn = (col: Column) => getColumnAttribute(col, COLUMN_ATTRIBUTE.COL_FILTER_FN);

  const filter = () => {
    const filterFnList = formatData.columns
      .filter(col => !isHiddenColumn(col) && typeof getColumnFilterFn(col) === 'function')
      .map(col => getColumnFilterFn(col));

    multiFilter(filterFnList);
  };

  /**
   * 按照指定列排序
   * @param column
   */
  const sortData = (column: Column) => {
    const fn = getColumnAttribute(column, COLUMN_ATTRIBUTE.COL_SORT_FN);
    const type = getColumnAttribute(column, COLUMN_ATTRIBUTE.COL_SORT_TYPE);
    const scope = getColumnAttribute(column, COLUMN_ATTRIBUTE.COL_SORT_SCOPE);

    if (type === SORT_OPTION.NULL) {
      resolvePageData();
      return;
    }

    sort(pageData, fn, column, type, scope);
  };

  /**
   * 清理列排序
   * @param reset 是否重置表格数据
   */
  const clearColumnSort = (reset = false) => {
    formatData.columns.forEach(col => {
      setColumnAttribute(col, COLUMN_ATTRIBUTE.COL_SORT_ACTIVE, false);
      setColumnAttribute(col, COLUMN_ATTRIBUTE.COL_FILTER_FN, undefined);
    });

    if (reset) {
      resolvePageData();
    }
  };

  /**
   * 遍历所有列 & 设置列属性
   * @param attributeName
   * @param value
   */
  const setAllColumnAttribute = (
    attributeName: string | string[],
    value: string | number | boolean | ((...args: any[]) => boolean | number | void | string),
  ) => {
    const attrNames = Array.isArray(attributeName) ? attributeName : [attributeName];
    const values = Array.isArray(value) ? value : [value];
    formatData.columns.forEach(col => {
      attrNames.forEach((name, index) => {
        setColumnAttribute(col, name, values[index]);
      });
    });
  };

  /**
   * 设置指定列是否激活排序
   * @param column
   * @param active
   */
  const setColumnSortActive = (column: Column, active: boolean) => {
    if (props.colSortBehavior === IColSortBehavior.independent) {
      formatData.columns.forEach(col => {
        setColumnAttribute(col, COLUMN_ATTRIBUTE.COL_SORT_ACTIVE, false);
      });
    }
    setColumnAttribute(column, COLUMN_ATTRIBUTE.COL_SORT_ACTIVE, active);
  };

  const isRowChecked = (row: any, index: number) => {
    if (isRowSelectEnable(props, { row, index })) {
      return getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION);
    }

    return true;
  };

  /**
   * 是否数据全选
   */
  const isCheckedAll = () => {
    if (props.acrossAll) {
      return formatData.data.every((row, index) => isRowChecked(row, index));
    }

    return pageData.every((row, index) => isRowChecked(row, index));
  };

  /**
   * 是否有选中的数据
   */
  const hasCheckedRow = () => {
    if (props.acrossAll) {
      return formatData.data.some(row => getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION));
    }

    return pageData.some(row => getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION));
  };

  /**
   * 当前列是否激活状态
   * @param col
   */
  const isActiveColumn = (col: Column) => {
    return formatData.columnSchema.get(col)?.[COLUMN_ATTRIBUTE.IS_HIDDEN] ?? false;
  };

  const ORDER_LIST = [COLUMN_ATTRIBUTE.RESIZE_WIDTH, COLUMN_ATTRIBUTE.CALC_WIDTH, COLUMN_ATTRIBUTE.WIDTH];

  /**
   * 获取当前列实际宽度
   * width props中设置的默认宽度
   * calcWidth 计算后的宽度
   * resizeWidth 拖拽重置之后的宽度
   * @param colmun 当前列配置
   * @param orders 获取宽度顺序
   * @returns
   */
  const getColumnOrderWidth = (col: Column, orders = ORDER_LIST): number => {
    const target = formatData.columnSchema.get(col) ?? {};
    return target[orders[0]] ?? target[orders[1]] ?? target[orders[2]];
  };

  /**
   * 指定列是否展示状态
   * @param col
   */
  const isHiddenColumn = (col: Column) => {
    return formatData.columnSchema.get(col)?.[COLUMN_ATTRIBUTE.IS_HIDDEN] ?? false;
  };

  /**
   * 获取列所在ID
   * @param col
   */
  const getColumnId = (col: Column) => {
    return formatData.columnSchema.get(col)?.[COLUMN_ATTRIBUTE.COL_UID];
  };

  /**
   * 设置表格列属性
   * @param col 当前列
   * @param attrName 设置属性
   * @param attrValue 属性值
   */
  const setColumnAttribute = (
    col: Column,
    attrName: string,
    attrValue: ((...args) => boolean | number | void | string) | string | boolean | number,
  ) => {
    const target = formatData.columnSchema.get(col);
    if (target && Object.prototype.hasOwnProperty.call(target, attrName)) {
      target[attrName] = attrValue;
    }
  };

  const setColumnAttributeBySettings = (settings: Settings, checkedVal?: string[]) => {
    const checked = checkedVal || settings.checked || [];
    const settingFields = settings.fields || [];

    formatData.columns.forEach(col => {
      setColumnAttribute(col, COLUMN_ATTRIBUTE.IS_HIDDEN, isColumnHidden(settingFields, col, checked));
    });
  };

  /**
   * 获取列配置属性值
   * @param col
   * @param attributeName
   */
  const getColumnAttribute = (col: Column | IEmptyObject, attributeName: string) => {
    return formatData.columnSchema.get(col)?.[attributeName];
  };

  /**
   * 判定当前行是否选中
   * @param row
   */
  const isRowSelected = row => {
    if (!props.isRowSelectEnable) {
      return false;
    }

    if (typeof props.isSelectedFn === 'function') {
      return props.isSelectedFn({ row });
    }

    if (Array.isArray(props.checked)) {
      return props.checked.some(item => {
        if (typeof item === 'string') {
          return getRowValue(row, item) === item;
        }

        return item === row;
      });
    }

    return false;
  };

  /**
   * 判定是否需要合并行或者列配置
   */
  const neepColspanOrRowspan = (attrs = ['rowspan', 'colspan']) =>
    formatData.columns.some(col => attrs.some(name => typeof col[name] === 'function' || /^\d$/.test(`${col[name]}`)));

  /**
   * 格式化传入数据配置
   * @param data
   */
  const formatDataSchema = (data: any[]) => {
    formatData.data.length = 0;
    formatData.data.push(...data);
    let hasSelectedRow = false;
    let hasUnSelectedRow = false;
    (data || []).forEach((row, index) => {
      let rowId = getRowId(row, uuidv4(), props);
      const isSelected = isRowSelected(row);
      if (isSelected) {
        hasSelectedRow = true;
      } else {
        hasUnSelectedRow = true;
      }

      if (!formatData.dataSchema.has(row)) {
        formatData.dataSchema.set(row, {
          [TABLE_ROW_ATTRIBUTE.ROW_EXPAND]: false,
          [TABLE_ROW_ATTRIBUTE.ROW_SELECTION]: isSelected,
          [TABLE_ROW_ATTRIBUTE.ROW_UID]: rowId,
          [TABLE_ROW_ATTRIBUTE.ROW_INDEX]: index + 1,
          [TABLE_ROW_ATTRIBUTE.ROW_SELECTION_INDETERMINATE]: false,
        });
      }

      // 当传入的data改变时，更新相关属性
      // ROW_EXPAND & ROW_SELECTION & ROW_UID 不做更新
      const target = formatData.dataSchema.get(row);
      rowId = target[TABLE_ROW_ATTRIBUTE.ROW_UID];
      target[TABLE_ROW_ATTRIBUTE.ROW_INDEX] = index + 1;
    });

    formatData.dataSchema.set(CHECK_ALL_OBJ, {
      [TABLE_ROW_ATTRIBUTE.ROW_SELECTION]: hasSelectedRow,
      [TABLE_ROW_ATTRIBUTE.ROW_SELECTION_INDETERMINATE]: hasSelectedRow && hasUnSelectedRow,
    });

    formatData.dataSchema.set(NEED_COL_ROW_SPAN, {
      [TABLE_ROW_ATTRIBUTE.ROW_SPAN]: neepColspanOrRowspan(['rowspan']),
    });
  };

  /**
   * 设置是否全选状态
   * @param val
   */
  const setRowSelectionAll = (val: boolean) => {
    toggleAllSelection(val);
  };

  /**
   * 设置全选状态是否半选
   */
  const setRowIndeterminate = () => {
    const checkedAll = isCheckedAll();
    setRowAttribute(CHECK_ALL_OBJ, TABLE_ROW_ATTRIBUTE.ROW_SELECTION, checkedAll);
    setRowAttribute(CHECK_ALL_OBJ, TABLE_ROW_ATTRIBUTE.ROW_SELECTION_INDETERMINATE, !checkedAll && hasCheckedRow());
  };

  /**
   * 设置列属性
   * @param row
   * @param attrName
   * @param attrValue
   */
  const setRowAttribute = (row: any, attrName: string, attrValue: string | boolean | number) => {
    const target = formatData.dataSchema.get(row);
    if (target && Object.prototype.hasOwnProperty.call(target, attrName)) {
      target[attrName] = attrValue;
    }
  };

  /**
   * 设置当前行是否选中
   * @param row
   * @param isSelected
   */
  const setRowSelection = (row: any, isSelected: boolean) => {
    let value = isSelected;
    if (typeof props.isSelectedFn === 'function') {
      value = props.isSelectedFn({ row });
    }

    if (isRowSelectEnable(props, { row })) {
      setRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION, value);
    }
    setRowIndeterminate();
  };

  /**
   * 设置Row Index
   * @param row
   * @param index
   */
  const setRowIndex = (row: any, index: number) => {
    setRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_INDEX, index);
  };

  /**
   *  设置当前行是否展开
   * @param row
   * @param isExpand
   */
  const setRowExpand = (row: any, isExpand: boolean) => {
    setRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_EXPAND, isExpand);
  };

  const getRowAttribute = (row: any | IEmptyObject, attrName: string) => {
    return formatData.dataSchema.get(row)?.[attrName];
  };

  const toggleRowSelection = (row: any) => {
    if (typeof props.isSelectedFn === 'function') {
      setRowSelection(row, props.isSelectedFn({ row }));
      return;
    }

    setRowSelection(row, !getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION));
  };

  const toggleAllSelection = (value?: boolean) => {
    const val = value ?? !isCheckedAll();
    if (props.acrossAll) {
      formatData.data.forEach(row => setRowSelection(row, val));
      return;
    }

    pageData.forEach(row => setRowSelection(row, val));
    formatData.dataSchema.set(CHECK_ALL_OBJ, {
      [TABLE_ROW_ATTRIBUTE.ROW_SELECTION]: val,
      [TABLE_ROW_ATTRIBUTE.ROW_SELECTION_INDETERMINATE]: false,
    });
  };

  const clearSelection = () => {
    formatData.data.forEach(row => setRowSelection(row, false));
  };

  const setAllRowExpand = (value?: boolean) => {
    formatData.data.forEach(row => setRowExpand(row, value ?? true));
  };

  /**
   * 根据Props Column配置计算并设置列宽度
   * @param root 当前根元素
   * @param autoWidth 自动填充宽度
   * @param offsetWidth 需要减掉的偏移量（滚动条|外层边框）
   */
  const resolveColumnWidth = (root: HTMLElement, autoWidth = COL_MIN_WIDTH, offsetWidth = 0) => {
    const { width } = root.getBoundingClientRect() || {};
    const availableWidth = width - offsetWidth;
    // 可用来平均的宽度
    let avgWidth = availableWidth;

    // 需要平均宽度的列数
    const avgColIndexList = [];

    const getMinWidth = (col: Column, computedWidth: number) => {
      const minWidth = getColumnAttribute(col, COLUMN_ATTRIBUTE.COL_MIN_WIDTH);
      if (minWidth === undefined) {
        if (computedWidth < COL_MIN_WIDTH) {
          return COL_MIN_WIDTH;
        }

        return computedWidth;
      }

      let calcMinWidth = computedWidth;
      if (/^\d+\.?\d*$/.test(`${minWidth}`)) {
        calcMinWidth = Number(minWidth);
      }

      if (/^\d+\.?\d*%$/.test(`${minWidth}`)) {
        calcMinWidth = (Number(minWidth) * availableWidth) / 100;
      }

      if (/^\d+\.?\d*px$/i.test(`${minWidth}`)) {
        calcMinWidth = Number(`${minWidth}`.replace(/px/i, ''));
      }

      return calcMinWidth;
    };

    /**
     * 根据Props Column配置计算并设置列宽度
     * @param col 当前Column设置
     * @param numWidth 计算宽度
     * @param resetAvgWidth 是否重置可用宽度
     */
    const resolveColNumberWidth = (col: Column, numWidth: number, resetAvgWidth = true) => {
      const minWidth = getMinWidth(col, numWidth);
      const computedWidth = numWidth < minWidth ? minWidth : numWidth;
      Object.assign(col, { calcWidth: computedWidth });
      if (resetAvgWidth) {
        avgWidth = avgWidth - computedWidth;
        if (avgWidth < 0) {
          avgWidth = 0;
        }
      }
    };

    formatData.columns.forEach((col: Column, index: number) => {
      if (!isHiddenColumn(col)) {
        const order = ['resizeWidth', 'width'];
        const colWidth = String(getColumnOrderWidth(col, order));
        let isAutoWidthCol = true;
        if (/^\d+\.?\d*(px)?$/.test(colWidth)) {
          const numWidth = Number(colWidth.replace('px', ''));
          resolveColNumberWidth(col, numWidth);
          isAutoWidthCol = false;
        }

        if (/^\d+\.?\d*%$/.test(colWidth)) {
          let perWidth = autoWidth;
          if (avgWidth > 0) {
            const percent = Number(colWidth.replace('%', ''));
            perWidth = (avgWidth * percent) / 100;
          }

          resolveColNumberWidth(col, perWidth);
          isAutoWidthCol = false;
        }

        if (isAutoWidthCol) {
          avgColIndexList.push(index);
        }
      }
    });

    // 自适应宽度计算
    if (avgColIndexList.length > 0) {
      let autoAvgWidth = autoWidth;
      if (avgWidth > 0) {
        avgColIndexList.forEach((idx, index) => {
          autoAvgWidth = avgWidth / (avgColIndexList.length - index);
          resolveColNumberWidth(formatData.columns[idx], autoAvgWidth, false);
          const calcWidth = getColumnAttribute(formatData.columns[idx], COLUMN_ATTRIBUTE.CALC_WIDTH);
          avgWidth = avgWidth - calcWidth;
        });
      } else {
        avgColIndexList.forEach(idx => {
          const calcWidth = getMinWidth(formatData.columns[idx], COL_MIN_WIDTH);
          setColumnAttribute(formatData.columns[idx], COLUMN_ATTRIBUTE.CALC_WIDTH, calcWidth);
        });
      }
    }
  };

  /**
   * 获取选中行数据
   */
  const getRowSelection = () => formatData.data.filter(row => getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION));

  return {
    formatColumns,
    formatDataSchema,
    setRowSelection,
    setRowExpand,
    setRowIndex,
    setColumnAttribute,
    setColumnAttributeBySettings,
    setColumnSortActive,
    setRowSelectionAll,
    setRowIndeterminate,
    setAllColumnAttribute,
    getColumnAttribute,
    getColumnId,
    getColumnOrderWidth,
    getRowSelection,
    resolveColumnWidth,
    isActiveColumn,
    isHiddenColumn,
    resolvePageData,
    resetStartEndIndex,
    toggleAllSelection,
    setAllRowExpand,
    clearSelection,
    clearColumnSort,
    toggleRowSelection,
    getRowAttribute,
    filter,
    sortData,
    isCheckedAll,
    hasCheckedRow,
    updateSettings,
    pageData,
    localPagination,
    formatData,
  };
};
