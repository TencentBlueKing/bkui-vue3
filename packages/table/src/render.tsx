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
import { computed, ComputedRef, CSSProperties, Ref, ref, SetupContext, unref } from 'vue';

import BkCheckbox from '@bkui-vue/checkbox';
import { DownShape, RightShape } from '@bkui-vue/icon';
import type { Language } from '@bkui-vue/locale';
import Pagination from '@bkui-vue/pagination';
import { classes } from '@bkui-vue/shared';

import TableCell from './components/table-cell';
import TableRow from './components/table-row';
import {
  CHECK_ALL_OBJ,
  COLUMN_ATTRIBUTE,
  DEF_COLOR,
  IHeadColor,
  SCROLLY_WIDTH,
  SORT_OPTION,
  TABLE_ROW_ATTRIBUTE,
} from './const';
import { EMIT_EVENTS, EVENTS } from './events';
import { TablePlugins } from './plugins';
import BodyEmpty from './plugins/body-empty';
import HeadFilter from './plugins/head-filter';
import HeadSort from './plugins/head-sort';
import Settings from './plugins/settings';
import useFixedColumn from './plugins/use-fixed-column';
import { Column, Settings as ISettings, TablePropTypes } from './props';
import { ITableFormatData, ITableResponse } from './use-attributes';
import {
  formatPropAsArray,
  getNextSortType,
  getRowKeyNull,
  getRowText,
  getSortFn,
  isRowSelectEnable,
  resolveCellSpan,
  resolveHeadConfig,
  resolveNumberOrStringToPix,
  resolvePropVal,
  resolveWidth,
} from './utils';

export default class TableRender {
  props: TablePropTypes;
  context: SetupContext;
  tableResp: ITableResponse;
  uuid: string;
  events: Map<string, any[]>;
  styleRef: ComputedRef<{
    hasScrollY: boolean;
  }>;
  t: ComputedRef<Language['table']>;
  activeSortIndex: Ref<number>;
  public plugins: TablePlugins;

  constructor(props, ctx, tableResp: ITableResponse, styleRef, t: ComputedRef<Language['table']>) {
    this.props = props;
    this.context = ctx;
    this.tableResp = tableResp;
    this.plugins = new TablePlugins(props, ctx);
    this.uuid = uuidv4();
    this.events = new Map<string, any[]>();
    this.styleRef = styleRef;
    this.t = t;
    this.activeSortIndex = ref(-1);
  }

  get formatData(): ITableFormatData {
    return this.tableResp.formatData;
  }

  get columns() {
    return this.formatData.columns;
  }

  /**
   * 渲染Table Head
   */
  public renderTableHeadSchema() {
    const { isShow = true } = resolveHeadConfig(this.props);
    if (!isShow) {
      return null;
    }

    const handleSettingsChanged = (arg: any) => {
      const { checked = [], size, height } = arg;
      this.formatData.settings.size = size;
      this.formatData.settings.height = height;

      if (checked.length) {
        this.tableResp.setColumnAttributeBySettings(this.props.settings as ISettings, checked);
      }
      this.emitEvent(EVENTS.ON_SETTING_CHANGE, [arg]);
    };

    return [
      this.props.settings ? (
        <Settings
          class='table-head-settings'
          settings={this.props.settings}
          columns={this.columns as Column[]}
          rowHeight={this.props.rowHeight as unknown as number}
          onChange={handleSettingsChanged}
        >
          {this.context.slots.setting?.()}
        </Settings>
      ) : (
        ''
      ),
      <table
        cellpadding={0}
        cellspacing={0}
      >
        {this.renderColGroup()}
        {this.renderHeader()}
      </table>,
    ];
  }

  /**
   * 渲染Table主体
   * @param rows 表格数据
   * @returns
   */
  public renderTableBodySchema(rows: any[]) {
    const localEmptyText = computed(() => {
      if (this.props.emptyText === undefined) {
        return this.t.value.emptyText;
      }
      return this.props.emptyText;
    });

    if (!rows.length) {
      return (
        this.context.slots.empty?.() ?? (
          <BodyEmpty
            filterList={rows}
            list={this.props.data}
            emptyText={localEmptyText.value}
          />
        )
      );
    }

    return (
      <table
        cellpadding={0}
        cellspacing={0}
        data-table-uuid={this.uuid}
      >
        {this.renderColGroup()}
        {this.renderTBody(rows)}
      </table>
    );
  }

  public renderTableFooter(options: any) {
    return (
      <Pagination
        style='width: 100%;'
        {...options}
        modelValue={options.current}
        onLimitChange={limit => this.handlePageLimitChange(limit)}
        onChange={current => this.handlePageChange(current)}
      />
    );
  }

  public getRowHeight = (row?: any, rowIndex?: number) => {
    const { size, height } = this.formatData.settings;
    if (height !== null && height !== undefined) {
      return resolvePropVal(this.formatData.settings, 'height', ['tbody', row, rowIndex, size]);
    }

    return resolvePropVal(this.props, 'rowHeight', ['tbody', row, rowIndex]);
  };

  /**
   * 注册监听事件
   * @param eventName
   * @param watcher
   */
  public on(eventName: string, watcher: Function) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    this.events.get(eventName).push(watcher);
    return this;
  }

  public destroy() {
    this.events.clear();
    this.events = null;
  }

  /**
   * 派发事件
   * @param eventName
   * @param args
   */
  private emitEvent(eventName: string, args: any[]) {
    if (this.events.has(eventName)) {
      this.events.get(eventName).forEach((event: any) => {
        if (typeof event === 'function') {
          Reflect.apply(event, this, args);
        }
      });
    }
  }

  private handlePageLimitChange(limit: number) {
    Object.assign(this.props.pagination, { limit });
    this.context.emit(EMIT_EVENTS.PAGE_LIMIT_CHANGE, limit);
  }

  private handlePageChange(current: number) {
    Object.assign(this.props.pagination, { current, value: current });
    this.context.emit(EMIT_EVENTS.PAGE_VALUE_CHANGE, current);
  }

  /**
   * 指定列选中状态
   * @param index 指定选中的列Index
   * @param single 是否重置其他列，当只允许选中一列的情况下需要先重置
   */
  // private setColumnActive(column: Column, single = false) {
  //   const col = this.propActiveCols.find((item: IColumnActive) => item.index === index);
  //   Object.assign(col, { active: !col.active });

  //   if (single) {
  //     this.propActiveCols
  //       .filter((item: IColumnActive) => item.index !== index && item.active)
  //       .forEach((col: IColumnActive) => {
  //         Object.assign(col, { active: false });
  //       });
  //   }
  // }

  private getSortFnByColumn(column: Column, fn, a, b) {
    if (column.type === 'index') {
      return fn(
        this.tableResp.getRowAttribute(a, TABLE_ROW_ATTRIBUTE.ROW_INDEX),
        this.tableResp.getRowAttribute(b, TABLE_ROW_ATTRIBUTE.ROW_INDEX),
      );
    }

    return fn(a, b);
  }

  /**
   * 点击选中一列事件
   * @param index 当前选中列Index
   * @param column 当前选中列
   */
  private handleColumnHeadClick(index: number, column: Column) {
    // if (this.props.columnPick !== 'disabled') {
    //   this.setColumnActive(index, this.props.columnPick === 'single');
    //   this.context.emit(EMIT_EVENTS.COLUMN_PICK, this.propActiveCols);
    // }

    if (this.tableResp.getColumnAttribute(column, COLUMN_ATTRIBUTE.COL_IS_DRAG)) {
      return;
    }

    if (column.sort && !column.filter) {
      const type = this.tableResp.getColumnAttribute(column, COLUMN_ATTRIBUTE.COL_SORT_TYPE) as string;
      const nextSort = getNextSortType(type);

      const sortFn = (a, b) => this.getSortFnByColumn(column, getSortFn(column, nextSort), a, b);
      this.tableResp.setColumnAttribute(column, COLUMN_ATTRIBUTE.COL_SORT_TYPE, nextSort);
      this.tableResp.setColumnAttribute(column, COLUMN_ATTRIBUTE.COL_SORT_FN, sortFn);
      this.tableResp.sortData(column);
      this.context.emit(EMIT_EVENTS.COLUMN_SORT, { column: unref(column), index, type: nextSort });
    }
  }

  /**
   * 获取排序设置表头
   * @param column 当前渲染排序列
   * @param index 排序列所在index
   * @returns
   */
  private getSortCell(column: Column, index: number) {
    /**
     * 点击排序事件
     * @param sortFn 排序函数
     * @param type 排序类型
     */
    const handleSortClick = (sortFn: (a, b) => number | boolean, type: string) => {
      const fn = (a, b) => this.getSortFnByColumn(column, sortFn, a, b);
      this.tableResp.setColumnAttribute(column, COLUMN_ATTRIBUTE.COL_SORT_TYPE, type);
      this.tableResp.setColumnAttribute(column, COLUMN_ATTRIBUTE.COL_SORT_FN, fn);
      this.tableResp.sortData(column);
      this.context.emit(EMIT_EVENTS.COLUMN_SORT, { column, index, type });
    };

    const nextSort = this.tableResp.getColumnAttribute(column, COLUMN_ATTRIBUTE.COL_SORT_TYPE) as SORT_OPTION;

    return (
      <HeadSort
        column={column as Column}
        defaultSort={nextSort}
        onChange={handleSortClick}
      />
    );
  }

  private getFilterCell(column: Column, index: number) {
    const handleFilterChange = (checked: any[], filterFn: Function) => {
      const filterFn0 = (row: any, index: number) => filterFn(checked, row, index);
      this.tableResp.setColumnAttribute(column, COLUMN_ATTRIBUTE.COL_FILTER_FN, filterFn0);
      this.tableResp.filter();
      this.context.emit(EMIT_EVENTS.COLUMN_FILTER, { checked, column: unref(column), index });
    };

    const filterSave = (values: any[]) => {
      this.context.emit(EMIT_EVENTS.COLUMN_FILTER_SAVE, { column, values });
    };

    return (
      <HeadFilter
        column={column as Column}
        height={this.props.headHeight}
        onChange={handleFilterChange}
        onFilterSave={filterSave}
      />
    );
  }

  /**
   * 渲染Table Header
   * @returns
   */
  private renderHeader() {
    const config = resolveHeadConfig(this.props);
    const { cellFn } = config;
    const rowStyle: CSSProperties = {
      // @ts-ignore:next-line
      '--row-height': `${resolvePropVal(config, 'height', ['thead'])}px`,
      backgroundColor: this.props.thead.color,
    };

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
        return this.renderCheckboxColumn(CHECK_ALL_OBJ, null, true);
      }

      const cells = [];
      if (column.sort) {
        cells.push(this.getSortCell(column, index));
      }

      if (column.filter) {
        cells.push(this.getFilterCell(column, index));
      }

      const cellText = getHeadCellText(column, index);
      cells.unshift(<span class='head-text'>{cellText}</span>);

      const showTitle = typeof cellText === 'string' ? cellText : undefined;

      const headClass = { 'has-sort': !!column.sort, 'has-filter': !!column.filter };

      return (
        <TableCell
          class={headClass}
          title={showTitle}
          observerResize={this.props.observerResize}
          resizerWay={this.props.resizerWay}
          isHead={true}
          column={column as Column}
          parentSetting={this.props.showOverflowTooltip}
          headExplain={resolvePropVal(column.explain, 'head', [column])}
        >
          {cells}
        </TableCell>
      );
    };

    const resolveEventListener = (col: Column) => {
      const listeners = this.tableResp.getColumnAttribute(col, COLUMN_ATTRIBUTE.LISTENERS) as Map<string, any>;

      if (!listeners) {
        return {};
      }

      return Array.from(listeners?.keys()).reduce((handle: any, key: string) => {
        const eventName = key.split('_').slice(-1)[0];
        return Object.assign(handle, {
          [eventName]: (e: MouseEvent) => {
            listeners.get(key).forEach((fn: Function) => Reflect.apply(fn, this, [e, col, this]));
          },
        });
      }, {});
    };

    const { resolveFixedColumnStyle } = useFixedColumn(this.props, this.tableResp);

    const getScrollFix = () => {
      if (this.styleRef.value.hasScrollY) {
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
              {this.filterColGroups.map((column, index: number) => {
                const headStyle = Object.assign({}, resolveFixedColumnStyle(column, this.styleRef.value.hasScrollY), {
                  '--background-color': DEF_COLOR[this.props.thead?.color ?? IHeadColor.DEF1],
                });
                return (
                  <th
                    colspan={1}
                    rowspan={1}
                    class={[
                      this.getHeadColumnClass(column, index),
                      this.getColumnCustomClass(column),
                      column.align || this.props.headerAlign || this.props.align,
                    ]}
                    style={headStyle}
                    onClick={() => this.handleColumnHeadClick(index, column)}
                    {...resolveEventListener(column)}
                  >
                    {renderHeadCell(column as Column, index)}
                  </th>
                );
              })}
              {getScrollFix()}
            </tr>
          </TableRow>
        </thead>
      </>
    );
  }

  /**
   * 获取用户自定义class
   * @param column
   * @param row
   * @private
   */
  private getColumnCustomClass(column, row?: any) {
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
  }

  /**
   * 渲染Table Body
   * @returns
   */
  private renderTBody(rows: any[]) {
    const { resolveFixedColumnStyle } = useFixedColumn(this.props, this.tableResp);
    const rowLength = rows.length;
    return (
      <tbody>
        {rows.map((row: any, rowIndex: number) => {
          const rowStyle = [
            ...formatPropAsArray(this.props.rowStyle, [row, rowIndex, this]),
            {
              '--row-height': `${this.getRowHeight(row, rowIndex)}px`,
            },
          ];

          const rowClass = [
            ...formatPropAsArray(this.props.rowClass, [row, rowIndex, this]),
            `hover-${this.props.rowHover}`,
            rowIndex % 2 === 1 && this.props.stripe ? 'stripe-row' : '',
          ];

          return [
            <TableRow>
              <tr
                // @ts-ignore
                style={rowStyle}
                class={rowClass}
                key={getRowKeyNull(row, this.props, rowIndex)}
                onClick={e => this.handleRowClick(e, row, rowIndex, rows)}
                onDblclick={e => this.handleRowDblClick(e, row, rowIndex, rows)}
                onMouseenter={e => this.handleRowEnter(e, row, rowIndex, rows)}
                onMouseleave={e => this.handleRowLeave(e, row, rowIndex, rows)}
              >
                {this.filterColGroups.map((column: Column, index: number) => {
                  const cellStyle = [
                    resolveFixedColumnStyle(column),
                    ...formatPropAsArray(this.props.cellStyle, [column, index, row, rowIndex, this]),
                  ];

                  const tdCtxClass = {
                    'expand-cell': column.type === 'expand',
                  };

                  const { colspan, rowspan } = resolveCellSpan(column, index, row, rowIndex);
                  const skipOption = this.tableResp.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SKIP_CFG);
                  const columnIdKey = this.tableResp.getColumnAttribute(column, COLUMN_ATTRIBUTE.COL_UID);
                  const { skipRow = false, skipCol = false } = skipOption?.[columnIdKey as string] ?? {};

                  if (!skipRow && !skipCol) {
                    const cellClass = [
                      this.getColumnClass(column, index),
                      this.getColumnCustomClass(column, row),
                      column.align || this.props.align,
                      ...formatPropAsArray(this.props.cellClass, [column, index, row, rowIndex, this]),
                      {
                        'expand-row': this.tableResp.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_EXPAND),
                        'is-last': rowIndex + rowspan >= rowLength,
                      },
                    ];

                    const handleEmit = (event, type: string) => {
                      const args = {
                        event,
                        row,
                        column,
                        cell: {
                          getValue: () => this.renderCell(row, column, rowIndex, rows),
                        },
                        rowIndex,
                        columnIndex: index,
                      };
                      this.context.emit(type, args);
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
                          parentSetting={this.props.showOverflowTooltip}
                          observerResize={this.props.observerResize}
                        >
                          {this.renderCell(row, column, rowIndex, rows)}
                        </TableCell>
                      </td>
                    );
                  }

                  return null;
                })}
              </tr>
            </TableRow>,
            this.renderExpandRow(row, rowClass, rowIndex),
          ];
        })}
      </tbody>
    );
  }

  private renderExpandRow(row: any, rowClass: any[], _rowIndex?) {
    const isExpand = this.tableResp.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_EXPAND);
    if (isExpand) {
      const resovledClass = [...rowClass, { row_expend: true }];

      const rowId = this.tableResp.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_UID);
      const rowKey = `${rowId}_expand`;
      return (
        <TableRow key={rowKey}>
          <tr class={resovledClass}>
            <td
              colspan={this.filterColGroups.length}
              rowspan={1}
            >
              {this.context.slots.expandRow?.(row) ?? <div class='expand-cell-ctx'>Expand Row</div>}
            </td>
          </tr>
        </TableRow>
      );
    }
  }

  private getColumnClass = (column: Column, colIndex: number) => ({
    [`${this.uuid}-column-${colIndex}`]: true,
    column_fixed: !!column.fixed,
    column_fixed_left: !!column.fixed,
    column_fixed_right: column.fixed === 'right',
    [`${column.className}`]: true,
  });

  private getHeadColumnClass = (column: Column, colIndex: number) => ({
    ...this.getColumnClass(column, colIndex),
  });

  /**
   * table row click handle
   * @param e
   * @param row
   * @param index
   * @param rows
   */
  private handleRowClick(e: MouseEvent, row: any, index: number, rows: any) {
    this.context.emit(EMIT_EVENTS.ROW_CLICK, e, row, index, rows, this);
  }

  /**
   * table row click handle
   * @param e
   * @param row
   * @param index
   * @param rows
   */
  private handleRowDblClick(e: MouseEvent, row: any, index: number, rows: any) {
    this.context.emit(EMIT_EVENTS.ROW_DBL_CLICK, e, row, index, rows, this);
  }

  private handleRowEnter(e: MouseEvent, row: any, index: number, rows: any) {
    this.context.emit(EMIT_EVENTS.ROW_MOUSE_ENTER, e, row, index, rows, this);
  }

  private handleRowLeave(e: MouseEvent, row: any, index: number, rows: any) {
    this.context.emit(EMIT_EVENTS.ROW_MOUSE_LEAVE, e, row, index, rows, this);
  }

  private getExpandCell(row: any) {
    const isExpand = this.tableResp.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_EXPAND);
    return isExpand ? <DownShape></DownShape> : <RightShape></RightShape>;
  }

  private handleRowExpandClick(row: any, column: Column, index: number, rows: any[], e: MouseEvent) {
    this.tableResp.setRowExpand(row, !this.tableResp.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_EXPAND));
    this.context.emit(EMIT_EVENTS.ROW_EXPAND_CLICK, { row, column, index, rows, e });
  }

  private renderCellCallbackFn(row: any, column: Column, index: number, rows: any[]) {
    const cell = getRowText(row, resolvePropVal(column, 'field', [column, row]));
    const data = row;
    return (column.render as Function)({ cell, data, row, column, index, rows });
  }

  private renderCheckboxColumn(row: any, index: number | null, isAll = false) {
    const handleChecked = value => {
      if (isAll) {
        this.tableResp.setRowSelectionAll(value);
        this.context.emit(EMIT_EVENTS.ROW_SELECT_ALL, { checked: value, data: this.props.data });
        return;
      }

      this.tableResp.setRowSelection(row, value);
      this.context.emit(EMIT_EVENTS.ROW_SELECT, { row, index, checked: value, data: this.props.data });
    };

    const indeterminate = this.tableResp.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION_INDETERMINATE);
    const isChecked = this.tableResp.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_SELECTION);
    const isEnable = isRowSelectEnable(this.props, { row, index, isCheckAll: isAll });

    return (
      <BkCheckbox
        onChange={handleChecked}
        disabled={!isEnable}
        modelValue={isChecked}
        indeterminate={indeterminate as boolean}
      />
    );
  }

  private renderExpandColumn(row: any, column: Column, index: number, rows: any[]) {
    const renderExpandSlot = () => {
      if (typeof column.render === 'function') {
        return this.renderCellCallbackFn(row, column, index, rows);
      }

      return this.context.slots.expandCell?.({ row, column, index, rows }) ?? this.getExpandCell(row);
    };

    return (
      <span
        class='expand-btn-action'
        onClick={(e: MouseEvent) => this.handleRowExpandClick(row, column, index, rows, e)}
      >
        {renderExpandSlot()}
      </span>
    );
  }

  /**
   * 渲染表格Cell内容
   * @param row 当前行
   * @param column 当前列
   * @param index 当前列
   * @param rows 当前列
   * @returns
   */
  private renderCell(row: any, column: Column, index: number, rows: any[]) {
    const defaultFn = () => {
      const type = resolvePropVal(column, 'type', [column, row]);
      if (type === 'index') {
        return this.tableResp.getRowAttribute(row, TABLE_ROW_ATTRIBUTE.ROW_INDEX);
      }

      const key = resolvePropVal(column, 'field', [column, row]);
      const cell = getRowText(row, key);
      if (typeof column.render === 'function') {
        return this.renderCellCallbackFn(row, column, index, rows);
      }
      if (typeof cell === 'boolean') {
        return String(cell);
      }
      if (!cell && typeof cell !== 'number') {
        const { emptyCellText } = this.props;
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
      expand: (row, column, index, rows) => this.renderExpandColumn(row, column, index, rows),
      selection: (row, _column, index, _rows) => this.renderCheckboxColumn(row, index),
    };

    return renderFn[column.type]?.(row, column, index, rows) ?? defaultFn();
  }

  /**
   * 判定指定列是否为选中状态
   * @param colIndex 指定列Index
   * @returns
   */
  // private isColActive(colIndex: number) {
  //   return (
  //     this.props.columnPick !== 'disabled' &&
  //     this.propActiveCols.some((col: IColumnActive) => col.index === colIndex && col.active)
  //   );
  // }

  /**
   * 渲染表格Col分组
   * @returns
   */
  private renderColGroup() {
    return (
      <colgroup>
        {(this.filterColGroups || []).map((column: Column, _index: number) => {
          const colCls = classes({
            // active: this.isColActive(index),
          });

          const width: string | number = `${resolveWidth(this.tableResp.getColumnOrderWidth(column))}`.replace(
            /px$/i,
            '',
          );

          const minWidth = this.tableResp.getColumnAttribute(column, COLUMN_ATTRIBUTE.COL_MIN_WIDTH);
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
  }

  /**
   * 过滤当前可渲染的列
   */
  private get filterColGroups() {
    return this.formatData.columns.filter(
      (col: Column) => !this.tableResp.getColumnAttribute(col, COLUMN_ATTRIBUTE.IS_HIDDEN),
    );
  }
}
