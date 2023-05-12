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
import type { ComputedRef } from 'vue';
import { computed } from 'vue';

import BkCheckbox from '@bkui-vue/checkbox';
import { DownShape, RightShape } from '@bkui-vue/icon';
import type { Language } from '@bkui-vue/locale';
import Pagination from '@bkui-vue/pagination';
import { classes } from '@bkui-vue/shared';

import TableCell from './components/table-cell';
import TableRow from './components/table-row';
import { COLUMN_ATTRIBUTE, EMIT_EVENTS, EVENTS, SCROLLY_WIDTH, TABLE_ROW_ATTRIBUTE } from './const';
import BodyEmpty from './plugins/body-empty';
import HeadFilter from './plugins/head-filter';
import HeadSort from './plugins/head-sort';
import { TablePlugins } from './plugins/index';
import Settings from './plugins/settings';
import useFixedColumn from './plugins/use-fixed-column';
import { Column, GroupColumn, IColumnActive, IReactiveProp, TablePropTypes } from './props';
import { formatPropAsArray, getColumnReactWidth, getColumnSourceData, getNextSortType, getRowId, getRowSourceData, getRowText, getSortFn, isColumnHidden, isRowSelectEnable, resolveCellSpan, resolveHeadConfig, resolvePropVal, resolveWidth } from './utils';

export default class TableRender {
  props: TablePropTypes;
  context;
  reactiveProp: any;
  colgroups: GroupColumn[];
  uuid: string;
  events: Map<string, any[]>;
  styleRef: ComputedRef<{
    hasScrollY: boolean;
  }>;
  t: ComputedRef<Language['table']>;
  public plugins: TablePlugins;
  constructor(props, ctx, reactiveProp: IReactiveProp, colgroups: GroupColumn[], styleRef, t: ComputedRef<Language['table']>) {
    this.props = props;
    this.context = ctx;
    this.reactiveProp = reactiveProp;
    this.colgroups = colgroups;
    this.plugins = new TablePlugins(props, ctx);
    this.uuid = uuidv4();
    this.events = new Map<string, any[]>();
    this.styleRef = styleRef;
    this.t = t;
  }

  get propActiveCols(): IColumnActive[] {
    return this.reactiveProp.activeColumns;
  }

  /**
   * 渲染Table Head
   * @param activeColumns 当前选中的列
   * @returns
   */
  public renderTableHeadSchema() {
    const { isShow = true } = resolveHeadConfig(this.props);
    if (!isShow) {
      return null;
    }

    const handleSettingsChanged = (arg: any) => {
      const { checked = [], size, height } = arg;
      this.reactiveProp.setting.size = size;
      this.reactiveProp.setting.height = height;
      const settingFields = (this.props.settings as any)?.fields || [];
      if (checked.length) {
        this.colgroups.forEach((col: GroupColumn) => {
          col.isHidden = isColumnHidden(settingFields, col, checked);
        });
      }
      this.emitEvent(EVENTS.ON_SETTING_CHANGE, [arg]);
    };

    return [
      this.props.settings
        ? <Settings class="table-head-settings"
            settings={ this.reactiveProp.settings }
            columns={this.colgroups}
            rowHeight={ this.props.rowHeight }
            onChange={ handleSettingsChanged }/>
        : '',
      <table cellpadding={0} cellspacing={0}>
        { this.renderColGroup() }
        { this.renderHeader() }
      </table>,
    ];
  }

  /**
   * 渲染Table主体
   * @param activeColumns 当前选中的列
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
      return this.context.slots.empty?.() ?? <BodyEmpty
      filterList={rows}
      list={ this.props.data }
      emptyText={ localEmptyText.value }/>;
    }

    return <table cellpadding={0} cellspacing={0} data-table-uuid={this.uuid}>
      { this.renderColGroup() }
      { this.renderTBody(rows) }
    </table>;
  }

  public renderTableFooter(options: any) {
    return <Pagination { ...options }
    modelValue={options.current}
    onLimitChange={ limit => this.handlePageLimitChange(limit) }
    onChange={ current => this.handlePageChange(current) }></Pagination>;
  }

  public getRowHeight = (row?: any, rowIndex?: number) => {
    const { size, height } = this.setting;
    if (height !== null && height !== undefined) {
      return resolvePropVal(this.setting, 'height', ['tbody', row, rowIndex, size]);
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
  private setColumnActive(index: number, single = false) {
    const col = this.propActiveCols.find((item: IColumnActive) => item.index === index);
    Object.assign(col, { active: !col.active });

    if (single) {
      this.propActiveCols.filter((item: IColumnActive) => item.index !== index && item.active)
        .forEach((col: IColumnActive) => {
          Object.assign(col, { active: false });
        });
    }
  }

  /**
   * 点击选中一列事件
   * @param index 当前选中列Index
   */
  private handleColumnHeadClick(index: number, column: Column) {
    if (this.props.columnPick !== 'disabled') {
      this.setColumnActive(index, this.props.columnPick === 'single');
      this.context.emit(EMIT_EVENTS.COLUMN_PICK, this.propActiveCols);
    }

    if (column.sort && !column.filter) {
      const columnName = resolvePropVal(column, ['field', 'type'], [column, index]);
      const nextSort = getNextSortType(this.reactiveProp.defaultSort[columnName]);
      Object.assign(this.reactiveProp.defaultSort, { [columnName]: nextSort });
      const sortFn = getSortFn(column, nextSort);
      this.emitEvent(EVENTS.ON_SORT_BY_CLICK, [{ sortFn, column, index, type: nextSort }]);
    }
  }

  /**
   * 获取排序设置表头
   * @param column 当前渲染排序列
   * @param index 排序列所在index
   * @returns
   */
  private getSortCell(column: Column, index: number) {
    const columnName = resolvePropVal(column, ['field', 'type'], [column, index]);
    /**
     * 点击排序事件
     * @param e 鼠标事件
     * @param column 当前列
     * @param index 当前列index
     * @param type 排序类型
     */
    const handleSortClick = (sortFn: any, type: string) => {
      Object.assign(this.reactiveProp.defaultSort, { [columnName]: type });
      this.emitEvent(EVENTS.ON_SORT_BY_CLICK, [{ sortFn, column, index, type }]);
    };

    const nextSort = this.reactiveProp.defaultSort[columnName];
    return <HeadSort column={column} defaultSort={ nextSort } onChange={ handleSortClick }/>;
  }

  private getFilterCell(column: Column, index: number) {
    const handleFilterChange = (checked: any[], filterFn: Function) => {
      const filterFn0 = (row: any, index: number) => filterFn(checked, row, index);
      this.emitEvent(EVENTS.ON_FILTER_CLICK, [{ filterFn: filterFn0, checked, column, index }]);
    };

    const filterSave = (values: any[]) => {
      this.context.emit(EMIT_EVENTS.COLUMN_FILTER_SAVE, { column, values });
    };

    return <HeadFilter column={ column } height={ this.props.headHeight }
    onChange={ handleFilterChange }
    onFilterSave={ filterSave }/>;
  }

  /**
   * 渲染Table Header
   * @returns
   */
  private renderHeader() {
    const config = resolveHeadConfig(this.props);
    const { cellFn } =  config;
    const rowStyle = {
      '--row-height': `${resolvePropVal(config, 'height', ['thead'])}px`,
    };

    const getHeadCellText = (column, index) => {
      if (typeof cellFn === 'function') {
        return cellFn(column, index);
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
        const selectAll = this.reactiveProp.rowActions.get(TABLE_ROW_ATTRIBUTE.ROW_SELECTION_ALL);
        return this.renderCheckboxColumn({
          [TABLE_ROW_ATTRIBUTE.ROW_SELECTION]: !!selectAll,
        }, 0, true);
      }

      const cells = [];
      if (column.sort) {
        cells.push(this.getSortCell(column, index));
      }

      if (column.filter) {
        cells.push(this.getFilterCell(column, index));
      }

      const cellText = getHeadCellText(column, index);
      cells.unshift(<span class="head-text">{ cellText }</span>);

      const showTitle = typeof cellText === 'string' ? cellText : undefined;
      return (
        <TableCell
          title={ showTitle }
          observerResize={this.props.observerResize}
          resizerWay={this.props.resizerWay}
        >
          { cells }
        </TableCell>
      );
    };

    const resolveEventListener = (col: GroupColumn) => Array.from(col.listeners.keys())
      .reduce((handle: any, key: string) => {
        const eventName = key.split('_').slice(-1)[0];
        return Object.assign(handle, {
          [eventName]: (e: MouseEvent) => {
            col.listeners.get(key).forEach((fn: Function) => Reflect.apply(fn, this, [e, col, this]));
          },
        });
      }, {});

    const { resolveFixedColumnStyle } = useFixedColumn(this.props, this.colgroups);

    const getScrollFix = () => {
      if (this.styleRef.value.hasScrollY) {
        const fixStyle = {
          width: `${SCROLLY_WIDTH + 2}px`,
          right: '-1px',
        };
        return <th style={ fixStyle } class="column_fixed"></th>;
      }
    };

    // @ts-ignore:next-line
    return <thead style={rowStyle}>
      <TableRow>
          <tr>
          {
            this.filterColgroups.map((column: Column, index: number) => <th colspan={1} rowspan={1}
              class={ this.getHeadColumnClass(column, index) }
              style = { resolveFixedColumnStyle(column, this.styleRef.value.hasScrollY) }
              onClick={ () => this.handleColumnHeadClick(index, column) }
              { ...resolveEventListener(column) }>
                { renderHeadCell(column, index) }
              </th>)
          }
          { getScrollFix() }
          </tr>
        </TableRow>
      </thead>;
  }

  /**
   * 渲染Table Body
   * @returns
   */
  private renderTBody(rows: any[]) {
    const { resolveFixedColumnStyle } = useFixedColumn(this.props, this.colgroups);
    const rowLength = rows.length;
    return <tbody>
    {
      rows.map((row: any, rowIndex: number) => {
        const rowStyle = [
          ...formatPropAsArray(this.props.rowStyle, [row, rowIndex, this]),
          {
            '--row-height': `${this.getRowHeight(row, rowIndex)}px`,
          },
        ];

        const rowClass = [
          ...formatPropAsArray(this.props.rowClass, [row, rowIndex, this]),
          `hover-${this.props.rowHover}`,
        ];

        const rowKey = getRowId(row, rowIndex, this.props);
        return [
          <TableRow key={rowKey}>
            <tr
              // @ts-ignore
              style={rowStyle}
              class={rowClass}
              onClick={ e => this.handleRowClick(e, row, rowIndex, rows)}
              onDblclick={e => this.handleRowDblClick(e, row, rowIndex, rows)}
            >
            {
              this.filterColgroups.map((column: Column, index: number) => {
                const cellStyle = [
                  resolveFixedColumnStyle(column),
                  ...formatPropAsArray(this.props.cellStyle, [column, index, row, rowIndex, this]),
                ];

                const tdCtxClass = {
                  'expand-cell': column.type === 'expand',
                };

                const cellKey = `__CELL_${rowIndex}_${index}`;
                const { colspan, rowspan } = resolveCellSpan(column, index, row, rowIndex);
                const skipRowKey = TABLE_ROW_ATTRIBUTE.ROW_SKIP_CFG;
                const columnIdKey = column[COLUMN_ATTRIBUTE.COL_UID];
                const { skipRow = false, skipCol = false } = row[skipRowKey]?.[columnIdKey] ?? {};

                if (!skipRow && !skipCol) {
                  const cellClass = [
                    this.getColumnClass(column, index),
                    ...formatPropAsArray(this.props.cellClass, [column, index, row, rowIndex, this]),
                    { 'expand-row': row[TABLE_ROW_ATTRIBUTE.ROW_EXPAND], 'is-last': rowIndex + rowspan >= rowLength },
                  ];

                  const handleEmit = (event, type: string) => {
                    const args = {
                      event,
                      row: getRowSourceData(row),
                      column: getColumnSourceData(column),
                      cell: {
                        getValue: () => this.renderCell(row, column, rowIndex, rows),
                      },
                      rowIndex,
                      columnIndex: index,
                    };
                    this.context.emit(type, args);
                  };

                  return <td class={cellClass}
                    style={cellStyle}
                    key={cellKey}
                    colspan={ colspan } rowspan={ rowspan }
                    onClick={ event =>  handleEmit(event, EMIT_EVENTS.CELL_CLICK)}
                    onDblclick = { event =>  handleEmit(event, EMIT_EVENTS.CELL_DBL_CLICK)}>
                    <TableCell
                      class={tdCtxClass}
                      column={ column }
                      row={ row }
                      parentSetting={ this.props.showOverflowTooltip }
                      observerResize={this.props.observerResize}
                    >
                      { this.renderCell(row, column, rowIndex, rows) }
                    </TableCell>
                  </td>;
                }

                return null;
              })
            }
          </tr>
          </TableRow>,
          this.renderExpandRow(row, rowClass, rowIndex),
        ];
      })
    }
  </tbody>;
  }

  private renderExpandRow(row: any, rowClass: any[], rowIndex: number) {
    const isExpand = !!row[TABLE_ROW_ATTRIBUTE.ROW_EXPAND];
    if (isExpand) {
      const resovledClass = [
        ...rowClass,
        { row_expend: true },
      ];

      const rowId = getRowId(row, rowIndex, this.props);
      const rowKey =  `${rowId}_expand`;
      return <TableRow key={rowKey}>
        <tr class={resovledClass}>
          <td colspan={ this.filterColgroups.length } rowspan={1}>
            { this.context.slots.expandRow?.(getRowSourceData(row)) ?? <div class='expand-cell-ctx'>Expand Row</div> }
          </td>
        </tr>
      </TableRow>;
    }
  }

  private getColumnClass = (column: Column, colIndex: number) => ({
    [`${this.uuid}-column-${colIndex}`]: true,
    column_fixed: !!column.fixed,
    column_fixed_left: !!column.fixed,
    column_fixed_right: column.fixed === 'right',
  });

  private getHeadColumnClass = (column: Column, colIndex: number) => ({
    ...this.getColumnClass(column, colIndex),
    active: this.isColActive(colIndex),
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

  private getExpandCell(row: any) {
    const isExpand = !!row[TABLE_ROW_ATTRIBUTE.ROW_EXPAND];
    return isExpand ? <DownShape></DownShape> : <RightShape></RightShape>;
  }

  private handleRowExpandClick(row: any, column: Column, index: number, rows: any[], e: MouseEvent) {
    this.emitEvent(EVENTS.ON_ROW_EXPAND_CLICK, [{ row, column, index, rows, e }]);
  }

  private renderCellCallbackFn(row: any, column: Column, index: number, rows: any[]) {
    const cell = getRowText(row, resolvePropVal(column, 'field', [column, row]), column);
    const attrIndex = row[TABLE_ROW_ATTRIBUTE.ROW_INDEX];
    const rowIndex = typeof attrIndex === 'number' ? attrIndex : index;
    const data = this.props.data[rowIndex];
    return (column.render as Function)({ cell, data, row, column, index, rows });
  }

  private renderCheckboxColumn(row: any, index: number, isAll = false) {
    const handleChecked = (value) => {
      this.emitEvent(EVENTS.ON_ROW_CHECK, [{ row, index, isAll, value }]);
    };

    const indeterminate = isAll && !!this.reactiveProp.rowActions.get(TABLE_ROW_ATTRIBUTE.ROW_SELECTION_INDETERMINATE);
    const isEnable = isRowSelectEnable(this.props, { row, index, isCheckAll: isAll });

    return <BkCheckbox onChange={ handleChecked }
      disabled={ !isEnable }
      modelValue={ row[TABLE_ROW_ATTRIBUTE.ROW_SELECTION] }
      indeterminate = { indeterminate }></BkCheckbox>;
  }

  private renderExpandColumn(row: any, column: Column, index: number, rows: any[]) {
    const renderExpandSlot = () => {
      if (typeof column.render === 'function') {
        return this.renderCellCallbackFn(row, column, index, rows);
      }

      return this.context.slots.expandCell?.({ row, column, index, rows }) ?? this.getExpandCell(row);
    };

    return <span class="expand-btn-action" onClick={ (e: MouseEvent) => this.handleRowExpandClick(row, column, index, rows, e) }>
      { renderExpandSlot() }
      </span>;
  }

  /**
   * 渲染表格Cell内容
   * @param row 当前行
   * @param column 当前列
   * @returns
   */
  private renderCell(row: any, column: Column, index: number, rows: any[]) {
    const defaultFn = () => {
      const cell = getRowText(row, resolvePropVal(column, 'field', [column, row]), column);
      if (typeof column.render === 'function') {
        return this.renderCellCallbackFn(row, column, index, rows);
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
  private isColActive(colIndex: number) {
    return this.props.columnPick !== 'disabled'
    && this.propActiveCols.some((col: IColumnActive) => col.index === colIndex && col.active);
  }


  /**
 * 渲染表格Col分组
 * @returns
 */
  private renderColGroup() {
    return <colgroup>
      {
        (this.filterColgroups || []).map((column: GroupColumn, index: number) => {
          const colCls = classes({
            active: this.isColActive(index),
          });

          const width: string | number = `${resolveWidth(getColumnReactWidth(column))}`.replace(/px$/i, '');
          return <col class={ colCls } width={ width }></col>;
        })
      }
      </colgroup>;
  }

  /**
   * 过滤当前可渲染的列
   */
  private get filterColgroups() {
    return this.colgroups.filter((col: GroupColumn) => !col.isHidden);
  }

  /**
   * 当前Table Setting
   */
  private get setting() {
    return this.reactiveProp.setting;
  }
}
