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
import { reactive, ref } from 'vue';

import { v4 as uuidv4 } from 'uuid';

import { CHECK_ALL_OBJ, IEmptyObject, LINE_HEIGHT, NEED_COL_ROW_SPAN, TABLE_ROW_ATTRIBUTE } from '../const';
import { TablePropTypes } from '../props';
import { getRawData, getRowId, getRowValue, isRowSelectEnable, resolvePropVal } from '../utils';

const useRows = (props: TablePropTypes) => {
  const tableRowSchema = reactive(new WeakMap());

  /**
   * 全量数据
   */
  const tableRowList = ref([]);

  /**
   * 分页数据
   * 当前页数据
   * 当前页数据作为渲染数据
   */
  const pageRowList = reactive([]);

  /**
   * 判定当前行是否选中
   * @param row
   */
  const isRowSelected = row => {
    if (!props.isRowSelectEnable) {
      return false;
    }

    if (typeof props.isSelectedFn === 'function') {
      return props.isSelectedFn(getSelectionRowArgs(row));
    }

    if (Array.isArray(props.checked)) {
      return props.checked.some(item => {
        if (typeof item !== 'object') {
          if (props.selectionKey.length && Object.prototype.hasOwnProperty.call(row, props.selectionKey)) {
            return getRowValue(row, props.selectionKey) === item;
          }

          console.warn('props.selectionKey is undefined or null or empty');
          return false;
        }

        return getRawData(item) === getRawData(row);
      });
    }

    return false;
  };

  const getSelfRowHeight = (row?: Record<string, object>, rowIndex?: number, type?: string) => {
    if (typeof props.rowHeight === 'function' || /^\d+/.test(`${props.rowHeight}`)) {
      return resolvePropVal(props, 'rowHeight', [
        {
          index: rowIndex,
          type: type ?? 'tbody',
          row,
        },
      ]);
    }

    return LINE_HEIGHT;
  };

  /**
   * 格式化传入数据配置
   * @param data
   */
  const formatDataSchema = () => {
    let hasSelectedRow = false;
    let hasUnSelectedRow = false;
    tableRowList.value.forEach((item, index) => {
      const row = getRawData(item);
      let rowId = getRowId(row, uuidv4(), props);
      const isSelected = isRowSelected(row);
      if (isSelected) {
        hasSelectedRow = true;
      } else {
        hasUnSelectedRow = true;
      }

      if (!tableRowSchema.has(row)) {
        tableRowSchema.set(row, {
          [TABLE_ROW_ATTRIBUTE.ROW_EXPAND]: false,
          [TABLE_ROW_ATTRIBUTE.ROW_SELECTION]: isSelected,
          [TABLE_ROW_ATTRIBUTE.ROW_UID]: rowId,
          [TABLE_ROW_ATTRIBUTE.ROW_INDEX]: index + 1,
          [TABLE_ROW_ATTRIBUTE.ROW_SELECTION_INDETERMINATE]: false,
        });
      }

      // 当传入的data改变时，更新相关属性
      // ROW_EXPAND & ROW_SELECTION & ROW_UID 不做更新
      const target = tableRowSchema.get(row);
      rowId = target[TABLE_ROW_ATTRIBUTE.ROW_UID];
      target[TABLE_ROW_ATTRIBUTE.ROW_INDEX] = index + 1;
      target[TABLE_ROW_ATTRIBUTE.ROW_HEIGHT] = getSelfRowHeight(item, index);
    });

    tableRowSchema.set(CHECK_ALL_OBJ, {
      [TABLE_ROW_ATTRIBUTE.ROW_SELECTION]: hasSelectedRow,
      [TABLE_ROW_ATTRIBUTE.ROW_SELECTION_INDETERMINATE]: hasSelectedRow && hasUnSelectedRow,
    });
  };

  const getSelectionRowArgs = (row, index?) => {
    return {
      row,
      index: index ?? getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_INDEX),
      isSelectAll: getRowAttribute(CHECK_ALL_OBJ, TABLE_ROW_ATTRIBUTE.ROW_SELECTION),
    };
  };

  const getRowAttribute = (item: IEmptyObject | object, attrName: string) => {
    return tableRowSchema.get(item)?.[attrName];
  };

  const setTableIsNeedRowSpan = (val: boolean) => {
    tableRowSchema.set(NEED_COL_ROW_SPAN, {
      [TABLE_ROW_ATTRIBUTE.ROW_SPAN]: val,
    });
  };

  const isRowChecked = (row: Record<string, unknown>, index: number) => {
    if (isRowSelectEnable(props, { row, index })) {
      return getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION);
    }

    return true;
  };

  const toggleRowSelection = (row: Record<string, unknown>) => {
    if (typeof props.isSelectedFn === 'function') {
      setRowSelection(row, props.isSelectedFn(getSelectionRowArgs(row)));
      return;
    }

    setRowSelection(row, !getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION));
  };

  const toggleAllSelection = (value?: boolean) => {
    const val = value ?? !isCheckedAll();
    tableRowSchema.set(CHECK_ALL_OBJ, {
      [TABLE_ROW_ATTRIBUTE.ROW_SELECTION]: val,
      [TABLE_ROW_ATTRIBUTE.ROW_SELECTION_INDETERMINATE]: false,
    });

    if (props.acrossAll) {
      tableRowList.value.forEach((row, index) => setRowSelection(row, val, index));
      return;
    }

    pageRowList.forEach((row, index) => setRowSelection(row, val, index));
  };

  /**
   * 是否数据全选
   */
  const isCheckedAll = () => {
    if (props.acrossAll) {
      return tableRowList.value.every((row, index) => isRowChecked(row, index));
    }

    return pageRowList.every((row, index) => isRowChecked(row, index));
  };

  /**
   * 是否有选中的数据
   */
  const hasCheckedRow = () => {
    if (props.acrossAll) {
      return tableRowList.value.some(row => getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION));
    }

    return pageRowList.some(row => getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION));
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

  const getRowIndeterminate = () => {
    return getRowAttribute(CHECK_ALL_OBJ, TABLE_ROW_ATTRIBUTE.ROW_SELECTION_INDETERMINATE);
  };

  const getRowCheckedAllValue = () => {
    return getRowAttribute(CHECK_ALL_OBJ, TABLE_ROW_ATTRIBUTE.ROW_SELECTION);
  };

  const setRowHeight = (height: number, row?) => {
    if (row) {
      setRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_HEIGHT, height);
      return;
    }

    tableRowList.value.forEach(row => setRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_HEIGHT, height));
  };

  const getRowHeight = (row?, index?, type?): number => {
    if (row) {
      return getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_HEIGHT);
    }

    return getSelfRowHeight(row, index, type);
  };

  /**
   * 设置列属性
   * @param row
   * @param attrName
   * @param attrValue
   */
  const setRowAttribute = (item: Record<string, unknown>, attrName: string, attrValue: boolean | number | string) => {
    const row = getRawData(item);
    const target = tableRowSchema.get(row);
    if (target && Object.prototype.hasOwnProperty.call(target, attrName)) {
      target[attrName] = attrValue;
    }
  };

  /**
   * 设置当前行是否选中
   * @param row
   * @param isSelected
   */
  const setRowSelection = (row: Record<string, unknown>, isSelected: boolean, index?: number) => {
    let value = isSelected;
    if (typeof props.isSelectedFn === 'function') {
      value = props.isSelectedFn(getSelectionRowArgs(row, index));
    }

    if (isRowSelectEnable(props, { row, index: index ?? getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_INDEX) })) {
      setRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION, value);
    }
    setRowIndeterminate();
  };

  /**
   * 设置Row Index
   * @param row
   * @param index
   */
  const setRowIndex = (row: Record<string, unknown>, index: number) => {
    setRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_INDEX, index);
  };

  /**
   *  设置当前行是否展开
   * @param row
   * @param isExpand
   */
  const setRowExpand = (row: Record<string, unknown>, isExpand: boolean) => {
    setRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_EXPAND, isExpand);
  };

  /**
   * 分批渲染数据
   * @param rowList
   * @returns
   */
  const batchPushRowList = (rowList: Record<string, unknown>[]) => {
    let startIndex = 0;
    const size = 50;
    const batchPushItem = () => {
      const endIndex = startIndex + size;
      pageRowList.push(...rowList.slice(startIndex, endIndex));

      if (endIndex < rowList.length) {
        startIndex = endIndex;
        setTimeout(() => {
          batchPushItem();
        });
      }
    };

    if (rowList.length > size) {
      batchPushItem();
      return;
    }

    pageRowList.push(...rowList);
  };

  const setPageRowList = (rowList: Record<string, unknown>[]) => {
    pageRowList.length = 0;
    batchPushRowList(rowList);
  };

  const clearSelection = () => {
    tableRowList.value.forEach(row => setRowSelection(row, false));
  };

  const changePageRowIndex = (sourceIndex, targetIndex) => {
    const copy = pageRowList[sourceIndex];
    pageRowList.splice(targetIndex, 0, copy);
    const resolvedIndex = sourceIndex < targetIndex ? sourceIndex : sourceIndex + 1;
    pageRowList.splice(resolvedIndex, 1);
  };

  const setAllRowExpand = (value?: boolean) => {
    tableRowList.value.forEach(row => setRowExpand(row, value ?? true));
  };

  /**
   * 获取选中行数据
   */
  const getRowSelection = () =>
    tableRowList.value.filter(row => getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION));

  const setTableRowList = (data: unknown[]) => {
    tableRowList.value.length = 0;
    tableRowList.value.push(...data);
    formatDataSchema();
  };

  const getCurrentPageRowsHeight = () => {
    return pageRowList.reduce((out, row) => {
      return out + getRowHeight(row);
    }, 0);
  };

  return {
    setRowIndex,
    setRowExpand,
    isRowChecked,
    setPageRowList,
    setTableRowList,
    clearSelection,
    formatDataSchema,
    toggleRowSelection,
    setRowSelectionAll,
    setRowSelection,
    setAllRowExpand,
    setRowHeight,
    setTableIsNeedRowSpan,
    getRowAttribute,
    getRowSelection,
    getRowIndeterminate,
    getRowCheckedAllValue,
    getCurrentPageRowsHeight,
    changePageRowIndex,
    toggleAllSelection,
    getRowHeight,
    tableRowList,
    tableRowSchema,
    pageRowList,
  };
};

export type UseRows = ReturnType<typeof useRows>;
export default useRows;
