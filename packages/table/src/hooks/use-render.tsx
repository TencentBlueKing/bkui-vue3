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

import { computed, CSSProperties, onUnmounted, SetupContext } from 'vue';

import { useLocale } from '@bkui-vue/config-provider';
import Pagination from '@bkui-vue/pagination';
import { v4 as uuidv4 } from 'uuid';

import BodyEmpty from '../components/body-empty';
import TableCell from '../components/table-cell';
import TableRow from '../components/table-row';
import { COLUMN_ATTRIBUTE, TABLE_ROW_ATTRIBUTE } from '../const';
import { EMIT_EVENTS } from '../events';
import { Column, TablePropTypes } from '../props';
import {
  formatPropAsArray,
  resolveCellSpan,
  resolveColumnSpan,
  resolveHeadConfig,
  resolveNumberOrStringToPix,
  resolvePropVal,
  resolveWidth,
} from '../utils';
import useCell from './use-cell';
import { UseColumns } from './use-columns';
import useHead from './use-head';
import { UsePagination } from './use-pagination';
import { UseRows } from './use-rows';
import useShiftKey from './use-shift-key';
type RenderType = {
  props: TablePropTypes;
  ctx: SetupContext;
  columns: UseColumns;
  rows: UseRows;
  pagination: UsePagination;
};
export default ({ props, ctx, columns, rows, pagination }: RenderType) => {
  const t = useLocale('table');

  const uuid = uuidv4();

  let dragEvents = {};

  const multiShiftKey = useShiftKey(props);

  /**
   * 渲染table colgroup
   * @returns
   */
  const renderColgroup = () => {
    return (
      <colgroup>
        {(columns.visibleColumns || []).map((column: Column, _index: number) => {
          const width: number | string = `${resolveWidth(columns.getColumnOrderWidth(column))}`.replace(/px$/i, '');

          const minWidth = columns.getColumnAttribute(column, COLUMN_ATTRIBUTE.COL_MIN_WIDTH);
          return (
            <col
              style={{
                width: resolveNumberOrStringToPix(width, 'auto'),
                minWidth: resolveNumberOrStringToPix(minWidth as string, 'auto'),
              }}
            ></col>
          );
        })}
      </colgroup>
    );
  };

  /**
   * 渲染Table Header
   * @returns
   */
  const renderHeader = () => {
    const config = resolveHeadConfig(props);
    const rowStyle: CSSProperties = {
      // @ts-ignore:next-line
      '--row-height': `${resolvePropVal(config, 'height', ['thead'])}px`,
      backgroundColor: props.thead.color,
    };

    return (
      <>
        <thead style={rowStyle}>
          {columns.columnGroup.map((cols, rowIndex) => (
            <tr>
              {cols.map((column, index: number) => {
                if (columns.isHiddenColumn(column)) {
                  return null;
                }

                const { getTH } = useHead({ props, ctx, columns, column, index, rows, rowIndex });
                return getTH();
              })}
            </tr>
          ))}
        </thead>
      </>
    );
  };

  const renderColumns = () => {
    if (!props.showHead) {
      return null;
    }
    return (
      <table
        cellpadding={0}
        cellspacing={0}
      >
        {renderColgroup()}
        {renderHeader()}
      </table>
    );
  };

  /** **************************************** Rows Render ******************************* **/
  const renderAppendLastRow = () => {
    const rowId = 'append-last-row';
    const rowStyle = [
      ...formatPropAsArray(props.rowStyle, []),
      {
        '--row-height': `${getRowHeight(null, null, 'append-last-row')}px`,
      },
    ];
    if (props.appendLastRow.type === 'default') {
      if (ctx.slots.appendLastRow) {
        return (
          <TableRow key={rowId}>
            <tr
              key={rowId}
              style={rowStyle}
            >
              <td colspan={columns.visibleColumns.length}>
                {props.appendLastRow.cellRender?.(null, null) ?? ctx.slots.appendLastRow()}
              </td>
            </tr>
          </TableRow>
        );
      }

      return;
    }

    if (props.appendLastRow.type === 'summary') {
      return (
        <TableRow key={rowId}>
          <tr
            key={rowId}
            style={rowStyle}
          >
            {columns.visibleColumns.map((column, index) => (
              <td>
                <TableCell>{props.appendLastRow.cellRender?.(column, index) ?? column.field ?? column.prop}</TableCell>
              </td>
            ))}
          </tr>
        </TableRow>
      );
    }
  };

  /**
   * 渲染Table Body
   * @returns
   */
  const renderRows = (dataList: Record<string, object>[]) => {
    let preRow = {};
    const rowSpanMap = new WeakMap();
    const needRowSpan = columns.needRowSpan.value;

    return (
      <tbody>
        {dataList.map((row: Record<string, object>, rowIndex: number) => {
          const result = getRowRender(row, rowIndex, preRow, dataList, rowSpanMap, needRowSpan);
          preRow = row;
          return result;
        })}
        {renderAppendLastRow()}
      </tbody>
    );
  };

  const getRowHeight = rows.getRowHeight;

  const setDragEvents = (events: Record<string, () => void>) => {
    dragEvents = events;
  };

  /**
   * 渲染Table主体
   * @param rows 表格数据
   * @returns
   */
  const renderTBody = (list?) => {
    const dataList = list ?? rows.pageRowList;
    const localEmptyText = computed(() => {
      if (props.emptyText === undefined) {
        return t.value.emptyText;
      }
      return props.emptyText;
    });

    if (!dataList.length) {
      return (
        ctx.slots.empty?.() ?? (
          <BodyEmpty
            emptyText={localEmptyText.value}
            filterList={dataList}
            list={props.data}
          />
        )
      );
    }

    return (
      <table
        cellpadding={0}
        cellspacing={0}
        data-table-uuid={uuid}
      >
        {renderColgroup()}
        {renderRows(dataList)}
      </table>
    );
  };

  /**
   * table row click handle
   * @param e
   * @param row
   * @param index
   * @param rows
   */
  const handleRowClick = (
    e: MouseEvent,
    row: Record<string, object>,
    index: number,
    rows: Record<string, object>[],
  ) => {
    const tagName = (e.target as HTMLElement)?.tagName;
    // span标签中嵌套了input标签产生冒泡，会先后都触发一次click事件, 所以会调用两遍
    if (tagName === 'INPUT') {
      return;
    }
    ctx.emit(EMIT_EVENTS.ROW_CLICK, e, row, index, rows);
  };

  /**
   * table row click handle
   * @param e
   * @param row
   * @param index
   * @param rows
   */
  const handleRowDblClick = (
    e: MouseEvent,
    row: Record<string, object>,
    index: number,
    rows: Record<string, object>[],
  ) => {
    ctx.emit(EMIT_EVENTS.ROW_DBL_CLICK, e, row, index, rows);
  };

  const handleRowEnter = (
    e: MouseEvent,
    row: Record<string, object>,
    index: number,
    rows: Record<string, object>[],
  ) => {
    ctx.emit(EMIT_EVENTS.ROW_MOUSE_ENTER, e, row, index, rows);
  };

  const handleRowLeave = (
    e: MouseEvent,
    row: Record<string, object>,
    index: number,
    rows: Record<string, object>[],
  ) => {
    ctx.emit(EMIT_EVENTS.ROW_MOUSE_LEAVE, e, row, index, rows);
  };

  const getRowSpanConfig = (
    row: Record<string, object>,
    rowIndex,
    preRow: Record<string, object>,
    col: Column,
    store: WeakMap<object, WeakMap<Column, { skipRowLen: number; skipRow: boolean }>>,
  ) => {
    if (!store.has(row)) {
      store.set(row, new WeakMap());
    }

    if (!store.get(row).has(col)) {
      store.get(row).set(col, { skipRowLen: 0, skipRow: false });
    }

    let { skipRowLen = 0 } = store.get(preRow)?.get(col) ?? {};
    let skipRow = false;
    const rowspan = resolveColumnSpan(col, null, row, rowIndex, 'rowspan');

    if (skipRowLen > 1) {
      skipRowLen = skipRowLen - 1;
      skipRow = true;
    } else {
      if (rowspan > 1) {
        skipRowLen = rowspan;
        skipRow = false;
      }
    }

    Object.assign(store.get(row).get(col), { skipRowLen, skipRow });
    return { skipRowLen, skipRow };
  };

  const getRowRender = (
    row: Record<string, object>,
    rowIndex: number,
    preRow: Record<string, object>,
    rowList,
    rowSpanMap,
    needRowSpan,
    isChild = false,
  ) => {
    const rowLength = rowList.length;
    const rowStyle = [
      ...formatPropAsArray(props.rowStyle, [row, rowIndex]),
      {
        '--row-height': `${getRowHeight(row, rowIndex)}px`,
      },
    ];

    const rowClass = [
      ...formatPropAsArray(props.rowClass, [row, rowIndex]),
      `hover-${props.rowHover}`,
      rowIndex % 2 === 1 && props.stripe ? 'stripe-row' : '',
    ];
    const rowId = rows.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_UID);

    return [
      <TableRow key={rowId}>
        <tr
          key={rowId}
          // @ts-ignore
          style={rowStyle}
          class={rowClass}
          data-row-index={rowIndex}
          draggable={!!props.rowDraggable}
          onClick={e => handleRowClick(e, row, rowIndex, rowList)}
          onDblclick={e => handleRowDblClick(e, row, rowIndex, rowList)}
          onMouseenter={e => handleRowEnter(e, row, rowIndex, rowList)}
          onMouseleave={e => handleRowLeave(e, row, rowIndex, rowList)}
          {...dragEvents}
        >
          {columns.visibleColumns.map((column: Column, index: number) => {
            const cellStyle = [
              columns.getFixedStlye(column),
              ...formatPropAsArray(props.cellStyle, [column, index, row, rowIndex]),
            ];

            const { colspan, rowspan } = resolveCellSpan(column, index, row, rowIndex);
            const { skipCol } = columns.getColumnAttribute(column, COLUMN_ATTRIBUTE.COL_SPAN) as {
              skipCol: boolean;
            };

            const { skipRow } =
              needRowSpan && !isChild
                ? getRowSpanConfig(row, rowIndex, preRow, column, rowSpanMap)
                : { skipRow: false };

            const tdCtxClass = {
              'expand-cell': column.type === 'expand',
            };

            if (!skipRow && !skipCol) {
              const cellClass = [
                columns.getColumnClass(column, index),
                columns.getColumnCustomClass(column, row),
                column.align || props.align,
                ...formatPropAsArray(props.cellClass, [column, index, row, rowIndex]),
                {
                  'expand-row': rows.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_EXPAND),
                  'is-last': rowIndex + rowspan >= rowLength,
                },
              ];

              const columnKey = `${rowId}_${index}`;
              const cellKey = `${rowId}_${index}_cell`;
              const { renderCell } = useCell({
                props,
                rows,
                ctx,
                columns,
                row,
                index: rowIndex,
                column,
                isChild,
                multiShiftKey,
              });

              const handleEmit = (event, type: string) => {
                const args = {
                  event,
                  row,
                  column,
                  cell: {
                    getValue: () => renderCell(),
                  },
                  rowIndex,
                  columnIndex: index,
                };
                ctx.emit(type, args);
              };

              return (
                <td
                  key={columnKey}
                  style={cellStyle}
                  class={cellClass}
                  colspan={colspan}
                  data-id={columnKey}
                  rowspan={rowspan}
                  onClick={event => handleEmit(event, EMIT_EVENTS.CELL_CLICK)}
                  onDblclick={event => handleEmit(event, EMIT_EVENTS.CELL_DBL_CLICK)}
                >
                  <TableCell
                    key={cellKey}
                    class={tdCtxClass}
                    column={column}
                    data-id={cellKey}
                    intersectionObserver={props.intersectionObserver}
                    isExpandChild={isChild}
                    observerResize={props.observerResize}
                    parentSetting={props.showOverflowTooltip}
                    row={row}
                  >
                    {renderCell()}
                  </TableCell>
                </td>
              );
            }

            return null;
          })}
        </tr>
      </TableRow>,
      renderExpandRow(row, rowClass, rowIndex),
    ];
  };

  const renderExpandRow = (row: Record<string, object>, rowClass: Record<string, object>[], _rowIndex?) => {
    const isExpand = rows.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_EXPAND);
    if (isExpand) {
      const resovledClass = [...rowClass, { row_expend: true }];

      const rowId = rows.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_UID);
      const rowKey = `${rowId}_expand`;
      if (Array.isArray(row.children)) {
        return row.children.map((child, childIndex) => getRowRender(child, childIndex, {}, row, {}, false, true));
      }

      return (
        <TableRow key={rowKey}>
          <tr class={resovledClass}>
            <td
              colspan={columns.visibleColumns.length}
              rowspan={1}
            >
              {ctx.slots.expandRow?.(row) ?? <div class='expand-cell-ctx'>Expand Row</div>}
            </td>
          </tr>
        </TableRow>
      );
    }
  };

  const handlePageLimitChange = (limit: number) => {
    pagination.setPagination({ limit });
    ctx.emit(EMIT_EVENTS.PAGE_LIMIT_CHANGE, limit);
  };

  const handlePageChange = (current: number) => {
    if (typeof props.pagination === 'object' && current !== pagination.options.current) {
      pagination.setPagination({ current, value: current });
      ctx.emit(EMIT_EVENTS.PAGE_VALUE_CHANGE, current);
      return;
    }

    if (typeof props.pagination === 'boolean' && props.pagination !== false) {
      ctx.emit(EMIT_EVENTS.PAGE_VALUE_CHANGE, current);
    }
  };

  const renderTFoot = () => {
    if (pagination.isShowPagination.value) {
      return (
        <Pagination
          style='width: 100%;'
          {...pagination.options}
          modelValue={pagination.options.current}
          onChange={current => handlePageChange(current)}
          onLimitChange={limit => handlePageLimitChange(limit)}
        />
      );
    }
  };

  onUnmounted(() => {
    multiShiftKey.removeMultiCheckedEvents();
  });

  return {
    renderColumns,
    renderTBody,
    renderTFoot,
    setDragEvents,
  };
};
