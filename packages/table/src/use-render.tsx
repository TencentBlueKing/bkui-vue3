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
 * Permission is hereby granted, free of charge, to any person obtaining a copy of software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

import { v4 as uuidv4 } from 'uuid';
import { computed, CSSProperties, nextTick, SetupContext, unref } from 'vue';

import BkCheckbox from '@bkui-vue/checkbox';
import { useLocale } from '@bkui-vue/config-provider';
import { DownShape, RightShape } from '@bkui-vue/icon';
import Pagination from '@bkui-vue/pagination';
import { classes } from '@bkui-vue/shared';

import TableCell from './components/table-cell';
import TableRow from './components/table-row';
import {
  COLUMN_ATTRIBUTE,
  DEF_COLOR,
  IHeadColor,
  NEED_COL_ROW_SPAN,
  SCROLLY_WIDTH,
  TABLE_ROW_ATTRIBUTE,
} from './const';
import { EMIT_EVENTS } from './events';
import BodyEmpty from './plugins/body-empty';
import Settings from './plugins/settings';
import useFixedColumn from './plugins/use-fixed-column';
import useHeadCell from './plugins/use-head-cell';
import { Column, Settings as ISettings, TablePropTypes } from './props';
import { ITableResponse } from './use-attributes';
import {
  formatPropAsArray,
  getRowKeyNull,
  getRowText,
  isRowSelectEnable,
  resolveCellSpan,
  resolveColumnSpan,
  resolveHeadConfig,
  resolveNumberOrStringToPix,
  resolvePropVal,
  resolveWidth,
} from './utils';

export default (
  props: TablePropTypes,
  context: SetupContext<any>,
  tableResp: ITableResponse,
  styleRef,
  head,
  root,
  resetTableHeight,
) => {
  const t = useLocale('table');

  const uuid = uuidv4();

  const formatData = computed(() => tableResp.formatData);

  const columns = computed(() => formatData.value.columns);

  const settings = computed(() => formatData.value.settings);
  // const activeSortIndex = ref(null);

  /**
   * 过滤当前可渲染的列
   */
  const filterColGroups = computed(() =>
    columns.value.filter((col: Column) => !tableResp.getColumnAttribute(col, COLUMN_ATTRIBUTE.IS_HIDDEN)),
  );

  /**
   * 渲染Table Head
   */
  const renderTableHeadSchema = () => {
    const { isShow = true } = resolveHeadConfig(props);
    if (!isShow) {
      return null;
    }

    const handleSettingsChanged = (arg: any) => {
      const { checked = [], size, height, fields } = arg;
      tableResp.updateSettings(arg);
      tableResp.setColumnAttributeBySettings(props.settings as ISettings, checked);
      if (checked.length) {
        nextTick(() => {
          resetTableHeight(root.value);
        });
      }

      context.emit(EMIT_EVENTS.SETTING_CHANGE, { checked, size, height, fields });
    };

    return [
      props.settings ? (
        <Settings
          class='table-head-settings'
          settings={props.settings}
          columns={columns.value as Column[]}
          onChange={handleSettingsChanged}
        >
          {context.slots.setting?.()}
        </Settings>
      ) : (
        ''
      ),
      <table
        cellpadding={0}
        cellspacing={0}
      >
        {renderColGroup()}
        {renderHeader()}
      </table>,
    ];
  };

  /**
   * 渲染Table主体
   * @param rows 表格数据
   * @returns
   */
  const renderTableBodySchema = (rows: any[]) => {
    const localEmptyText = computed(() => {
      if (props.emptyText === undefined) {
        return t.value.emptyText;
      }
      return props.emptyText;
    });

    if (!rows.length) {
      return (
        context.slots.empty?.() ?? (
          <BodyEmpty
            filterList={rows}
            list={props.data}
            emptyText={localEmptyText.value}
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
        {renderColGroup()}
        {renderTBody(rows)}
      </table>
    );
  };

  const renderTableFooter = (options: any) => {
    return (
      <Pagination
        style='width: 100%;'
        {...options}
        modelValue={options.current}
        onLimitChange={limit => handlePageLimitChange(limit)}
        onChange={current => handlePageChange(current)}
      />
    );
  };

  const getRowHeight = (row?: any, rowIndex?: number) => {
    const { size, height } = settings.value;
    if (height !== null && height !== undefined) {
      return resolvePropVal(settings.value, 'height', ['tbody', row, rowIndex, size]);
    }

    return resolvePropVal(props, 'rowHeight', ['tbody', row, rowIndex]);
  };

  const handlePageLimitChange = (limit: number) => {
    Object.assign(props.pagination, { limit });
    context.emit(EMIT_EVENTS.PAGE_LIMIT_CHANGE, limit);
  };

  const handlePageChange = (current: number) => {
    Object.assign(props.pagination, { current, value: current });
    context.emit(EMIT_EVENTS.PAGE_VALUE_CHANGE, current);
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

    const { resolveFixedColumnStyle } = useFixedColumn(props, tableResp, head);

    const getScrollFix = () => {
      if (styleRef.value.hasScrollY) {
        const fixStyle = {
          width: `${SCROLLY_WIDTH + 2}px`,
          right: '-1px',
        };
        return (
          <th
            style={fixStyle}
            class='column_fixed'
          ></th>
        );
      }
    };

    return (
      <>
        <thead style={rowStyle}>
          <TableRow>
            <tr>
              {filterColGroups.value.map((column, index: number) => {
                const { getTH } = useHeadCell(props, context, column, tableResp);
                const headStyle = Object.assign({}, resolveFixedColumnStyle(column, styleRef.value.hasScrollY), {
                  '--background-color': DEF_COLOR[props.thead?.color ?? IHeadColor.DEF1],
                });

                const classList = [
                  getHeadColumnClass(column, index),
                  getColumnCustomClass(column),
                  column.align || props.headerAlign || props.align,
                ];
                return getTH(classList, headStyle, index);
              })}
              {getScrollFix()}
            </tr>
          </TableRow>
        </thead>
      </>
    );
  };

  /**
   * 获取用户自定义class
   * @param column
   * @param row
   * @private
   */
  const getColumnCustomClass = (column, row?: any) => {
    const rowClass = column.className;
    if (rowClass) {
      if (typeof rowClass === 'function') {
        return rowClass(row);
      }
      if (typeof rowClass === 'string') {
        return rowClass;
      }
    }
    return '';
  };

  const getRowSpanConfig = (row: any, index, preRow: any, col: Column, store: WeakMap<Object, any>) => {
    if (!store.has(row)) {
      store.set(row, new WeakMap());
    }

    if (!store.get(row).has(col)) {
      store.get(row).set(col, { skipRowLen: 0, skipRow: false });
    }

    let { skipRowLen = 0 } = store.get(preRow)?.get(col) ?? {};
    let skipRow = false;
    const rowspan = resolveColumnSpan(col, null, row, index, 'rowspan');

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
  /**
   * 渲染Table Body
   * @returns
   */
  const renderTBody = (rows: any[]) => {
    let preRow = {};
    const rowSpanMap = new WeakMap();
    const needRowSpan = tableResp.getRowAttribute(NEED_COL_ROW_SPAN, TABLE_ROW_ATTRIBUTE.ROW_SPAN);

    return (
      <tbody>
        {rows.map((row: any, rowIndex: number) => {
          const result = getRowRender(row, rowIndex, preRow, rows, rowSpanMap, needRowSpan);
          preRow = row;
          return result;
        })}
      </tbody>
    );
  };
  const { resolveFixedColumnStyle } = useFixedColumn(props, tableResp, head);
  const getRowRender = (row: any, rowIndex: number, preRow: any, rows, rowSpanMap, needRowSpan, isChild = false) => {
    const rowLength = rows.length;
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
    return [
      <TableRow>
        <tr
          // @ts-ignore
          style={rowStyle}
          class={rowClass}
          key={getRowKeyNull(row, props, rowIndex)}
          onClick={e => handleRowClick(e, row, rowIndex, rows)}
          onDblclick={e => handleRowDblClick(e, row, rowIndex, rows)}
          onMouseenter={e => handleRowEnter(e, row, rowIndex, rows)}
          onMouseleave={e => handleRowLeave(e, row, rowIndex, rows)}
        >
          {filterColGroups.value.map((column: Column, index: number) => {
            const cellStyle = [
              resolveFixedColumnStyle(column),
              ...formatPropAsArray(props.cellStyle, [column, index, row, rowIndex]),
            ];

            const { colspan, rowspan } = resolveCellSpan(column, index, row, rowIndex);
            const { skipCol } = tableResp.getColumnAttribute(column, COLUMN_ATTRIBUTE.COL_SPAN) as {
              skipCol: boolean;
            };

            const { skipRow } =
              needRowSpan && !isChild ? getRowSpanConfig(row, index, preRow, column, rowSpanMap) : { skipRow: false };

            const tdCtxClass = {
              'expand-cell': column.type === 'expand',
            };

            if (!skipRow && !skipCol) {
              const cellClass = [
                getColumnClass(column, index),
                getColumnCustomClass(column, row),
                column.align || props.align,
                ...formatPropAsArray(props.cellClass, [column, index, row, rowIndex]),
                {
                  'expand-row': tableResp.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_EXPAND),
                  'is-last': rowIndex + rowspan >= rowLength,
                },
              ];

              const handleEmit = (event, type: string) => {
                const args = {
                  event,
                  row,
                  column,
                  cell: {
                    getValue: () => renderCell(row, column, rowIndex, rows, isChild),
                  },
                  rowIndex,
                  columnIndex: index,
                };
                context.emit(type, args);
              };

              return (
                <td
                  class={cellClass}
                  style={cellStyle}
                  colspan={colspan}
                  rowspan={rowspan}
                  onClick={event => handleEmit(event, EMIT_EVENTS.CELL_CLICK)}
                  onDblclick={event => handleEmit(event, EMIT_EVENTS.CELL_DBL_CLICK)}
                >
                  <TableCell
                    class={tdCtxClass}
                    column={column}
                    row={row}
                    parentSetting={props.showOverflowTooltip}
                    observerResize={props.observerResize}
                  >
                    {renderCell(row, column, rowIndex, rows, isChild)}
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

  const renderExpandRow = (row: any, rowClass: any[], _rowIndex?) => {
    const isExpand = tableResp.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_EXPAND);
    if (isExpand) {
      const resovledClass = [...rowClass, { row_expend: true }];

      const rowId = tableResp.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_UID);
      const rowKey = `${rowId}_expand`;
      if (Array.isArray(row.children)) {
        return row.children.map((child, childIndex) => getRowRender(child, childIndex, {}, row, {}, false, true));
      }

      return (
        <TableRow key={rowKey}>
          <tr class={resovledClass}>
            <td
              colspan={filterColGroups.value.length}
              rowspan={1}
            >
              {context.slots.expandRow?.(row) ?? <div class='expand-cell-ctx'>Expand Row</div>}
            </td>
          </tr>
        </TableRow>
      );
    }
  };

  const getColumnClass = (column: Column, colIndex: number) => ({
    [`${uuid}-column-${colIndex}`]: false,
    column_fixed: !!column.fixed,
    column_fixed_left: !!column.fixed,
    column_fixed_right: column.fixed === 'right',
    ...(column.className ? { [`${column.className}`]: true } : {}),
  });

  const getHeadColumnClass = (column: Column, colIndex: number) => ({
    ...getColumnClass(column, colIndex),
  });

  /**
   * table row click handle
   * @param e
   * @param row
   * @param index
   * @param rows
   */
  const handleRowClick = (e: MouseEvent, row: any, index: number, rows: any) => {
    context.emit(EMIT_EVENTS.ROW_CLICK, e, row, index, rows);
  };

  /**
   * table row click handle
   * @param e
   * @param row
   * @param index
   * @param rows
   */
  const handleRowDblClick = (e: MouseEvent, row: any, index: number, rows: any) => {
    context.emit(EMIT_EVENTS.ROW_DBL_CLICK, e, row, index, rows);
  };

  const handleRowEnter = (e: MouseEvent, row: any, index: number, rows: any) => {
    context.emit(EMIT_EVENTS.ROW_MOUSE_ENTER, e, row, index, rows);
  };

  const handleRowLeave = (e: MouseEvent, row: any, index: number, rows: any) => {
    context.emit(EMIT_EVENTS.ROW_MOUSE_LEAVE, e, row, index, rows);
  };

  const getExpandCell = (row: any) => {
    const isExpand = tableResp.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_EXPAND);
    const icon = isExpand ? <DownShape></DownShape> : <RightShape></RightShape>;

    return <span>{[icon, context.slots.expandContent?.(row) ?? '']}</span>;
  };

  const handleRowExpandClick = (row: any, column: Column, index: number, rows: any[], e: MouseEvent) => {
    tableResp.setRowExpand(row, !tableResp.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_EXPAND));
    context.emit(EMIT_EVENTS.ROW_EXPAND_CLICK, { row, column, index, rows, e });
  };

  const renderCellCallbackFn = (row: any, column: Column, index: number, rows: any[]) => {
    const cell = getRowText(row, resolvePropVal(column, 'field', [column, row]));
    const data = row;
    return (column.render as Function)({ cell, data, row, column, index, rows });
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
      <BkCheckbox
        onChange={handleChecked}
        disabled={!isEnable}
        modelValue={isChecked}
        indeterminate={indeterminate as boolean}
      />
    );
  };

  const renderExpandColumn = (row: any, column: Column, index: number, rows: any[]) => {
    const renderExpandSlot = () => {
      if (typeof column.render === 'function') {
        return renderCellCallbackFn(row, column, index, rows);
      }

      return context.slots.expandCell?.({ row, column, index, rows }) ?? getExpandCell(row);
    };

    return (
      <span
        class='expand-btn-action'
        onClick={(e: MouseEvent) => handleRowExpandClick(row, column, index, rows, e)}
      >
        {renderExpandSlot()}
      </span>
    );
  };

  /**
   * 渲染表格Cell内容
   * @param row 当前行
   * @param column 当前列
   * @param index 当前列
   * @param rows 当前列
   * @returns
   */
  const renderCell = (row: any, column: Column, index: number, rows: any[], isChild = false) => {
    const defaultFn = () => {
      const type = resolvePropVal(column, 'type', [column, row]);
      if (type === 'index') {
        return tableResp.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_INDEX);
      }

      const key = resolvePropVal(column, 'field', [column, row]);
      const cell = getRowText(row, key);
      if (typeof column.render === 'function') {
        return renderCellCallbackFn(row, column, index, rows);
      }
      if (typeof cell === 'boolean') {
        return String(cell);
      }
      if (!cell && typeof cell !== 'number') {
        const { emptyCellText } = props;
        if (emptyCellText) {
          if (typeof emptyCellText === 'function') {
            return emptyCellText(row, column, index, rows);
          }
          return emptyCellText;
        }
      }
      if (typeof cell === 'object') {
        return JSON.stringify(unref(cell));
      }
      return cell;
    };

    const renderFn = {
      expand: (row, column, index, rows) => (isChild ? '' : renderExpandColumn(row, column, index, rows)),
      selection: (row, _column, index, _rows) => renderCheckboxColumn(row, index),
    };

    return renderFn[column.type]?.(row, column, index, rows) ?? defaultFn();
  };

  /**
   * 判定指定列是否为选中状态
   * @param colIndex 指定列Index
   * @returns
   */
  // const isColActive = (colIndex: number) =>  {
  //   return (
  //     props.columnPick !== 'disabled' &&
  //     propActiveCols.some((col: IColumnActive) => col.index === colIndex && col.active)
  //   );
  // }

  /**
   * 渲染表格Col分组
   * @returns
   */
  const renderColGroup = () => {
    return (
      <colgroup>
        {(filterColGroups.value || []).map((column: Column, _index: number) => {
          const colCls = classes({
            // active: isColActive(index),
          });

          const width: string | number = `${resolveWidth(tableResp.getColumnOrderWidth(column))}`.replace(/px$/i, '');

          const minWidth = tableResp.getColumnAttribute(column, COLUMN_ATTRIBUTE.COL_MIN_WIDTH);
          return (
            <col
              class={colCls}
              width={width}
              style={{ minWidth: resolveNumberOrStringToPix(minWidth as string, 'auto') }}
            ></col>
          );
        })}
      </colgroup>
    );
  };

  return {
    renderTableHeadSchema,
    renderTableBodySchema,
    renderTableFooter,
  };
};
