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


import Pagination from '@bkui-vue/pagination';
import { classes, random } from '@bkui-vue/shared';

import { EVENTS } from './const';
import BodyEmpty from './plugins/body-empty';
import HeadFilter from './plugins/head-filter';
import HeadSort from './plugins/head-sort';
import { TablePlugins } from './plugins/index';
import Settings from './plugins/settings';
import useFixedColumn from './plugins/use-fixed-column';
import { Column, GroupColumn, IColumnActive, IReactiveProp, TablePropTypes } from './props';
import { formatPropAsArray, getColumnReactWidth, getRowText, resolveHeadConfig, resolvePropVal, resolveWidth } from './utils';


export default class TableRender {
  props: TablePropTypes;
  context;
  reactiveProp: any;
  colgroups: GroupColumn[];
  uuid: string;
  events: Map<string, any[]>;
  public plugins: TablePlugins;
  constructor(props, ctx, reactiveProp: IReactiveProp, colgroups: GroupColumn[]) {
    this.props = props;
    this.context = ctx;
    this.reactiveProp = reactiveProp;
    this.colgroups = colgroups;
    this.plugins = new TablePlugins(props, ctx);
    this.uuid = random(8);
    this.events = new Map<string, any[]>();
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
      if (checked.length) {
        this.colgroups.forEach((col: GroupColumn) => {
          col.isHidden = !(checked ?? []).includes(resolvePropVal(col, 'field', [col]));
        });
      }
      this.emitEvent(EVENTS.ON_SETTING_CHANGE, [arg]);
    };

    return [
      this.props.settings
        ? <Settings class="table-head-settings"
            settings={ this.props.settings }
            columns={this.props.columns}
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
    if (!rows.length) {
      return this.context.slots.empty?.() ?? <BodyEmpty
      filterList={rows}
      list={ this.props.data }
      emptyText={ this.props.emptyText }/>;
    }

    return <table cellpadding={0} cellspacing={0}>
      { this.renderColGroup() }
      { this.renderTBody(rows) }
    </table>;
  }

  public renderTableFooter(options: any) {
    return <Pagination { ...options }
    modelValue={options.current}
    onLimitChange={ limit => this.handlePageLimitChange(limit) }
    onChange={ current => this.hanlePageChange(current) }></Pagination>;
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
   * @param wartcher
   */
  public on(eventName: string, wartcher: Function) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    this.events.get(eventName).push(wartcher);
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
      this.events.get(eventName).forEach((evet: any) => {
        if (typeof evet === 'function') {
          Reflect.apply(evet, this, args);
        }
      });
    }
  }

  private handlePageLimitChange(limit: number) {
    Object.assign(this.props.pagination, { limit });
    this.context.emit('pageLimitChange', limit);
  }

  private hanlePageChange(current: number) {
    Object.assign(this.props.pagination, { current, value: current });
    this.context.emit('pageValueChange', current);
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
  private handleColumnHeadClick(index: number) {
    if (this.props.columnPick !== 'disabled') {
      this.setColumnActive(index, this.props.columnPick === 'single');
      this.context.emit('column-pick', this.propActiveCols);
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
     * @param e 鼠标事件
     * @param column 当前列
     * @param index 当前列index
     * @param type 排序类型
     */
    const hanldeSortClick = (sortFn: any, type: string) => {
      this.emitEvent(EVENTS.ON_SORT_BY_CLICK, [{ sortFn, column, index, type }]);
    };
    return <HeadSort column={column} onChange={ hanldeSortClick }/>;
  }

  private getFilterCell(column: Column, index: number) {
    const handleFilterChange = (checked: any[], filterFn: Function) => {
      const filterFn0 = (row: any, index: number) => filterFn(checked, row, index);
      this.emitEvent(EVENTS.ON_FILTER_CLICK, [{ filterFn: filterFn0, checked, column, index }]);
    };
    return <HeadFilter column={ column } height={ this.props.headHeight }
    onChange={ handleFilterChange }/>;
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


    /**
     * table head cell render
     * @param column
     * @param index
     * @returns
     */
    const renderHeadCell = (column: Column, index: number) => {
      const cells = [];
      if (column.sort) {
        cells.push(this.getSortCell(column, index));
      }

      if (column.filter) {
        cells.push(this.getFilterCell(column, index));
      }

      if (typeof cellFn === 'function') {
        cells.unshift(cellFn(column, index));
        return cells;
      }

      cells.unshift(resolvePropVal(column, 'label', [column, index]));
      return cells;
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

    const { getFixedColumnStyleResolve } = useFixedColumn(this.props, this.colgroups);
    const { resolveFixedColumnStyle, fixedoffset } = getFixedColumnStyleResolve();
    // @ts-ignore:next-line
    return <thead style={rowStyle}>
        <tr>
        {
          this.filterColgroups.map((column: Column, index: number) => <th colspan={1} rowspan={1}
          class={ this.getHeadColumnClass(column, index) }
          style = { resolveFixedColumnStyle(column, fixedoffset) }
          onClick={ () => this.handleColumnHeadClick(index) }
          { ...resolveEventListener(column) }>
            <div class="cell">{ renderHeadCell(column, index) }</div>
          </th>)
        }
        </tr>
      </thead>;
  }

  /**
   * 渲染Table Body
   * @returns
   */
  private renderTBody(rows: any[]) {
    const { getFixedColumnStyleResolve } = useFixedColumn(this.props, this.colgroups);

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
        ];

        const { resolveFixedColumnStyle,  fixedoffset } = getFixedColumnStyleResolve();

        return <tr
          // @ts-ignore
          style={rowStyle}
          class={rowClass}
          onClick={ e => this.handleRowClick(e, row, rowIndex, rows)}
          onDblclick={e => this.handleRowDblClick(e, row, rowIndex, rows)}
        >
        {
          this.filterColgroups.map((column: Column, index: number) => {
            const cellStyle = [
              resolveFixedColumnStyle(column, fixedoffset),
              ...formatPropAsArray(this.props.cellStyle, [column, index, row, rowIndex, this]),
            ];

            const cellClass = [
              this.getColumnClass(column, index),
              ...formatPropAsArray(this.props.cellClass, [column, index, row, rowIndex, this]),
            ];
            return <td
            class={cellClass}
            style={cellStyle}
            colspan={1} rowspan={1}>
            <div class="cell" >{ this.renderCell(row, column, rowIndex, rows) }</div>
          </td>;
          })
        }
      </tr>;
      })
    }
  </tbody>;
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
    this.context.emit('rowClick', e, row, index, rows, this);
  }

  /**
   * table row click handle
   * @param e
   * @param row
   * @param index
   * @param rows
   */
  private handleRowDblClick(e: MouseEvent, row: any, index: number, rows: any) {
    this.context.emit('rowDblClick', e, row, index, rows, this);
  }

  /**
   * 渲染表格Cell内容
   * @param row 当前行
   * @param column 当前列
   * @returns
   */
  private renderCell(row: any, column: Column, index: number, rows: any[]) {
    const cell = getRowText(row, resolvePropVal(column, 'field', [column, row]), column);
    if (typeof column.render === 'function') {
      return column.render(cell, row, index, rows);
    }

    return cell;
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

          const width = `${resolveWidth(getColumnReactWidth(column))}`.replace(/px$/i, '');
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
