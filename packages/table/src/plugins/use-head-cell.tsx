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
import { computed, ref, SetupContext, unref } from 'vue';

import Checkbox from '@bkui-vue/checkbox';

import TableCell from '../components/table-cell';
import { CHECK_ALL_OBJ, COLUMN_ATTRIBUTE, SORT_OPTION, TABLE_ROW_ATTRIBUTE } from '../const';
import { EMIT_EVENTS } from '../events';
import { Column } from '../props';
import { ITableResponse } from '../use-attributes';
import { getNextSortType, getSortFn, isRowSelectEnable, resolveHeadConfig, resolvePropVal } from '../utils';

import HeadFilter from './head-filter';
import HeadSort from './head-sort';

export default (props, context: SetupContext<any>, column: Column, tableResp: ITableResponse) => {
  const nextSort = ref(tableResp.formatData.columnSchema.get(column)?.[COLUMN_ATTRIBUTE.COL_SORT_TYPE]);
  const active = computed(() => {
    return tableResp.formatData.columnSchema.get(column)?.[COLUMN_ATTRIBUTE.COL_SORT_ACTIVE] ?? false;
  });

  const resolveEventListener = (col: Column) => {
    const listeners = tableResp.getColumnAttribute(col, COLUMN_ATTRIBUTE.LISTENERS) as Map<string, any>;

    if (!listeners) {
      return {};
    }

    return Array.from(listeners?.keys()).reduce((handle: any, key: string) => {
      const eventName = key.split('_').slice(-1)[0];
      return Object.assign(handle, {
        [eventName]: (e: MouseEvent) => {
          listeners.get(key).forEach((fn: Function) => Reflect.apply(fn, this, [e, col]));
        },
      });
    }, {});
  };

  const getSortFnByColumn = (column: Column, fn, a, b) => {
    if (column.type === 'index') {
      return fn(
        tableResp.getRowAttribute(a, TABLE_ROW_ATTRIBUTE.ROW_INDEX),
        tableResp.getRowAttribute(b, TABLE_ROW_ATTRIBUTE.ROW_INDEX),
      );
    }

    return fn(a, b);
  };

  /**
   * 点击选中一列事件
   * @param index 当前选中列Index
   * @param column 当前选中列
   */
  const handleColumnHeadClick = (index: number, column: Column) => {
    if (tableResp.getColumnAttribute(column, COLUMN_ATTRIBUTE.COL_IS_DRAG)) {
      return;
    }

    if (column.sort && !column.filter) {
      const type = tableResp.getColumnAttribute(column, COLUMN_ATTRIBUTE.COL_SORT_TYPE) as string;
      nextSort.value = getNextSortType(type);

      const sortFn = (a, b) => getSortFnByColumn(column, getSortFn(column, nextSort.value, props.sortValFormat), a, b);
      tableResp.setColumnAttribute(column, COLUMN_ATTRIBUTE.COL_SORT_TYPE, nextSort.value);
      tableResp.setColumnAttribute(column, COLUMN_ATTRIBUTE.COL_SORT_FN, sortFn);
      tableResp.setColumnSortActive(column, true);
      tableResp.sortData(column);
      context.emit(EMIT_EVENTS.COLUMN_SORT, { column: unref(column), index, type: nextSort.value });
    }
  };

  const handleColCellClick = index => {
    handleColumnHeadClick(index, column);
  };

  const renderCheckboxColumn = (row: any, index: number | null, isAll = false) => {
    const handleChecked = value => {
      if (isAll) {
        tableResp.setRowSelectionAll(value);
        context.emit(EMIT_EVENTS.ROW_SELECT_ALL, { checked: value, data: props.data });
        return;
      }

      tableResp.setRowSelection(row, value);
      context.emit(EMIT_EVENTS.ROW_SELECT, { row, index, checked: value, data: props.data });
      context.emit(EMIT_EVENTS.ROW_SELECT_CHANGE, { row, index, checked: value, data: props.data });
    };

    const indeterminate = tableResp.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION_INDETERMINATE);
    const isChecked = tableResp.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION);
    const isEnable = isRowSelectEnable(props, { row, index, isCheckAll: isAll });

    return (
      <Checkbox
        onChange={handleChecked}
        disabled={!isEnable}
        modelValue={isChecked}
        indeterminate={indeterminate as boolean}
      />
    );
  };

  /**
   * 获取排序设置表头
   * @param column 当前渲染排序列
   * @param index 排序列所在index
   * @returns
   */
  const getSortCell = (column: Column, index: number) => {
    /**
     * 点击排序事件
     * @param sortFn 排序函数
     * @param type 排序类型
     */
    const handleSortClick = (sortFn: (a, b) => number | boolean, type: string) => {
      const fn = (a, b) => getSortFnByColumn(column, sortFn, a, b);
      tableResp.setColumnAttribute(column, COLUMN_ATTRIBUTE.COL_SORT_TYPE, type);
      tableResp.setColumnAttribute(column, COLUMN_ATTRIBUTE.COL_SORT_FN, fn);
      tableResp.sortData(column);
      tableResp.setColumnSortActive(column, true);
      context.emit(EMIT_EVENTS.COLUMN_SORT, { column, index, type });
    };

    // 如果是独立的，则只高亮当前排序
    return (
      <HeadSort
        column={column as Column}
        defaultSort={active.value ? nextSort.value : SORT_OPTION.NULL}
        onChange={handleSortClick}
        active={active.value}
        sortValFormat={props.sortValFormat}
      />
    );
  };

  const getFilterCell = (column: Column, index: number) => {
    const handleFilterChange = (checked: any[], filterFn: Function) => {
      const filterFn0 = (row: any, index: number) => filterFn(checked, row, index);
      tableResp.setColumnAttribute(column, COLUMN_ATTRIBUTE.COL_FILTER_FN, filterFn0);
      tableResp.filter();
      context.emit(EMIT_EVENTS.COLUMN_FILTER, { checked, column: unref(column), index });
    };

    const filterSave = (values: any[]) => {
      context.emit(EMIT_EVENTS.COLUMN_FILTER_SAVE, { column, values });
    };

    return (
      <HeadFilter
        column={column as Column}
        height={props.headHeight}
        onChange={handleFilterChange}
        onFilterSave={filterSave}
      />
    );
  };

  const config = resolveHeadConfig(props);
  const { cellFn } = config;
  const getHeadCellText = (column, index) => {
    if (typeof cellFn === 'function') {
      return cellFn(column, index);
    }

    if (typeof column.renderHead === 'function') {
      return column.renderHead(column, index);
    }

    return resolvePropVal(column, 'label', [column, index]);
  };

  /**
   * table head cell render
   * @param column
   * @param index
   * @returns
   */
  const renderHeadCell = (column: Column, index: number) => {
    if (column.type === 'selection') {
      return [renderCheckboxColumn(CHECK_ALL_OBJ, null, true)];
    }

    const cells = [];
    if (column.sort) {
      cells.push(getSortCell(column, index));
    }

    if (column.filter) {
      cells.push(getFilterCell(column, index));
    }

    const cellText = getHeadCellText(column, index);
    cells.unshift(<span class='head-text'>{cellText}</span>);

    const showTitle = typeof cellText === 'string' ? cellText : undefined;

    const headClass = { 'has-sort': !!column.sort, 'has-filter': !!column.filter };

    return (
      <TableCell
        class={headClass}
        title={showTitle}
        observerResize={props.observerResize}
        resizerWay={props.resizerWay}
        isHead={true}
        column={column as Column}
        parentSetting={props.showOverflowTooltip}
        headExplain={resolvePropVal(column.explain, 'head', [column])}
      >
        {cells}
      </TableCell>
    );
  };

  const getTH = (classList, style, index) => {
    return (
      <th
        colspan={1}
        rowspan={1}
        data-id={tableResp.getColumnId(column)}
        class={classList}
        style={style}
        onClick={() => handleColCellClick(index)}
        {...resolveEventListener(column)}
      >
        {renderHeadCell(column, index)}
      </th>
    );
  };

  return { getTH };
};
