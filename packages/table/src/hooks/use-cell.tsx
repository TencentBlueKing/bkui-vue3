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

import { SetupContext, toRaw, unref } from 'vue';

import Checkbox from '@bkui-vue/checkbox';
import { DownShape, GragFill, RightShape } from '@bkui-vue/icon';
import { isEmpty } from 'lodash';

import { COLUMN_ATTRIBUTE, TABLE_ROW_ATTRIBUTE } from '../const';
import { EMIT_EVENTS } from '../events';
import { Column, TablePropTypes } from '../props';
import { getRowText, isRowSelectEnable, resolvePropVal } from '../utils';
import { UseColumns } from './use-columns';
import { UseRows } from './use-rows';
import { UseMultiShiftKey } from './use-shift-key';
type CellRenderArgsType = {
  props: TablePropTypes;
  rows: UseRows;
  ctx: SetupContext;
  columns: UseColumns;
  row: Record<string, object>;
  index: number;
  column: Column;
  isChild: boolean;
  multiShiftKey: UseMultiShiftKey;
};
export default ({
  props,
  rows,
  ctx,
  columns,
  row,
  index,
  column,
  isChild = false,
  multiShiftKey,
}: CellRenderArgsType) => {
  const { isShiftKeyDown, getStore, setStore, setStoreStart, clearStoreStart } = multiShiftKey;
  const renderCheckboxColumn = () => {
    const handleChecked = (value: boolean, event: Event) => {
      event.stopImmediatePropagation();
      event.preventDefault();
      event.stopPropagation();

      if (!isShiftKeyDown.value) {
        if (value) {
          setStoreStart(row, index);
        } else {
          clearStoreStart();
        }
      }

      rows.setRowSelection(row, value);

      columns.setColumnAttribute(column, COLUMN_ATTRIBUTE.SELECTION_INDETERMINATE, rows.getRowIndeterminate());
      columns.setColumnAttribute(column, COLUMN_ATTRIBUTE.SELECTION_VAL, rows.getRowCheckedAllValue());

      ctx.emit(EMIT_EVENTS.ROW_SELECT, { row, index, checked: value, data: props.data });
      ctx.emit(EMIT_EVENTS.ROW_SELECT_CHANGE, { row, index, checked: value, data: props.data });
    };

    const beforeRowChange = () => {
      if (isShiftKeyDown.value) {
        const result = setStore(row, index);
        if (result) {
          const { start, end } = getStore();
          const startIndex = start.index < end.index ? start.index : end.index;
          const endIndex = start.index < end.index ? end.index : start.index;

          (rows.pageRowList.slice(startIndex, endIndex + 1) ?? []).forEach(item => {
            const isRowEnabled = isRowSelectEnable(props, { row, index, isCheckAll: false });
            isRowEnabled && rows.setRowSelection(item, true);
          });
        }

        ctx.emit(EMIT_EVENTS.ROW_SELECT, { row, index, checked: true, data: props.data, isShiftKeyDown: true });
        ctx.emit(EMIT_EVENTS.ROW_SELECT_CHANGE, {
          row,
          index,
          checked: true,
          data: props.data,
          isShiftKeyDown: true,
        });

        return Promise.resolve(!result);
      }

      return Promise.resolve(true);
    };

    const indeterminate = rows.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION_INDETERMINATE);
    const isChecked = rows.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION);
    const isEnable = isRowSelectEnable(props, { row, index, isCheckAll: false });

    return (
      <Checkbox
        beforeChange={beforeRowChange}
        disabled={!isEnable}
        indeterminate={indeterminate as boolean}
        modelValue={isChecked}
        onChange={handleChecked}
      />
    );
  };

  const isEmptyCellText = cellText => {
    if (Array.isArray(props.isEmptyCell)) {
      return props.isEmptyCell.some(item => item === cellText);
    }

    if (typeof props.isEmptyCell === 'function') {
      return props.isEmptyCell({ cellText, row, column });
    }

    return isEmpty(cellText);
  };

  /**
   * 渲染表格Cell内容
   * @param row 当前行
   * @param column 当前列
   * @param index 当前列
   * @param rows 当前列
   * @returns
   */
  const renderCell = () => {
    const defaultFn = () => {
      const type = resolvePropVal(column, 'type', [column, row]);
      if (type === 'index') {
        return rows.getRowAttribute(toRaw(row), TABLE_ROW_ATTRIBUTE.ROW_INDEX);
      }

      const key = resolvePropVal(column, 'field', [column, row]);
      const cell = getRowText(row, key);
      if (typeof column.render === 'function') {
        return renderCellCallbackFn();
      }
      if (typeof cell === 'boolean' || typeof cell === 'number') {
        return `${cell}`;
      }

      if (typeof cell === 'object' && cell !== null) {
        return JSON.stringify(unref(cell));
      }

      if (isEmptyCellText(cell)) {
        const { emptyCellText } = props;
        if (emptyCellText) {
          if (typeof emptyCellText === 'function') {
            return emptyCellText({ row, column, index });
          }
          return emptyCellText;
        }
      }

      return cell;
    };

    const renderFn = {
      expand: () => (isChild ? '' : renderExpandColumn()),
      selection: () => renderCheckboxColumn(),
      drag: renderDraggableCell,
    };

    return renderFn[column.type]?.(row, column, index, rows) ?? defaultFn();
  };

  const renderCellCallbackFn = () => {
    const cell = getRowText(row, resolvePropVal(column, 'field', [column, row]));
    const data = row;
    return (column.render as (...args) => void)({ cell, data, row, column, index, rows: rows.tableRowList.value });
  };

  const getExpandCell = () => {
    const isExpand = rows.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_EXPAND);
    const icon = isExpand ? <DownShape></DownShape> : <RightShape></RightShape>;

    return <span>{[icon, ctx.slots.expandContent?.(row) ?? '']}</span>;
  };

  const handleRowExpandClick = (e: MouseEvent) => {
    rows.setRowExpand(row, !rows.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_EXPAND));
    ctx.emit(EMIT_EVENTS.ROW_EXPAND_CLICK, { row, column, index, rows: rows.tableRowList.value, e });
  };

  const renderExpandColumn = () => {
    const renderExpandSlot = () => {
      if (typeof column.render === 'function') {
        return renderCellCallbackFn();
      }

      return ctx.slots.expandCell?.({ row, column, index, rows }) ?? getExpandCell();
    };

    return (
      <span
        class='expand-btn-action'
        onClick={(e: MouseEvent) => handleRowExpandClick(e)}
      >
        {renderExpandSlot()}
      </span>
    );
  };

  const renderDraggableCell = () => {
    const renderFn = props.rowDraggable?.render ?? props.rowDraggable;
    if (typeof renderFn === 'function') {
      return renderFn(row, column, index, rows.tableRowList.value);
    }

    const fontSize = props.rowDraggable?.fontSize ?? '14px';
    const fontIcon = props.rowDraggable?.icon ?? (
      <GragFill
        style={`'--font-size: ${fontSize};'`}
        class='drag-cell'
      ></GragFill>
    );

    return fontIcon;
  };

  return { renderCell };
};
