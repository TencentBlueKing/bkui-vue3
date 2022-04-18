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
import { SetupContext } from 'vue';

import Pagination from '@bkui-vue/pagination';
import { classes } from '@bkui-vue/shared';

import { TablePlugins } from './plugins/index';
import { Column, GroupColumn, IColumnActive, IReactiveProp, TablePropTypes } from './props';
import { resolvePropVal, resolveWidth } from './utils';

export default class TableRender {
  props: TablePropTypes;
  context: SetupContext;
  reactiveProp: any;
  colgroups: GroupColumn[];
  public plugins: TablePlugins;
  constructor(props: TablePropTypes, ctx: SetupContext, reactiveProp: IReactiveProp, colgroups: GroupColumn[]) {
    this.props = props;
    this.context = ctx;
    this.reactiveProp = reactiveProp;
    this.colgroups = colgroups;
    this.plugins = new TablePlugins(props, ctx);
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
    return <table cellpadding={0} cellspacing={0}>
        { this.renderColGroup() }
        { this.renderHeader() }
        {/* { this.renderTBody(rows) } */}
      </table>;
  }

  /**
   * 渲染Table主体
   * @param activeColumns 当前选中的列
   * @returns
   */
  public renderTableBodySchema(rows: any[]) {
    return <table cellpadding={0} cellspacing={0}>
      { this.renderColGroup() }
      {/* { this.renderHeader() } */}
      { this.renderTBody(rows) }
    </table>;
  }

  public renderTableFooter(options: any) {
    return <Pagination { ...options }
    modelValue={options.current}
    onLimitChange={ limit => this.handlePageLimitChange(limit) }
    onChange={ current => this.hanlePageChange(current) }></Pagination>;
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
   * 渲染Table Header
   * @returns
   */
  private renderHeader() {
    const rowStyle = {
      '--row-height': `${resolvePropVal(this.props, 'headHeight', ['thead'])}px`,
    };
    // @ts-ignore:next-line
    return <thead style={rowStyle}>
        <tr>
        {
          this.props.columns.map((column: Column, index: number) => <th colspan={1} rowspan={1}
          class={ classes({
            active: this.isColActive(index),
          }) }
          onClick={ () => this.handleColumnHeadClick(index) }>
            <div class="cell">{ resolvePropVal(column, 'label', [column]) }</div>
          </th>)
        }
        </tr>
      </thead>;
  }

  /**
   * 渲染Table Body
   * @returns
   */
  private renderTBody(rows: any) {
    return <tbody>
    {
      rows.map((row: any, index: number) => {
        const rowStyle = {
          '--row-height': `${resolvePropVal(this.props, 'rowHeight', ['tbody', row, index])}px`,
        };

        // @ts-ignore:next-line
        return <tr
          style={rowStyle}
          onClick={ e => this.handleRowClick(e, row, index, rows)}
          onDblclick={e => this.handleRowDblClick(e, row, index, rows)}
        >
        {
          this.props.columns.map((column: Column) => <td colspan={1} rowspan={1}>
          <div class="cell">{ this.renderCell(row, column, index, rows) }</div>
        </td>)
        }
      </tr>;
      })
    }
  </tbody>;
  }

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
    const cell = row[resolvePropVal(column, 'field', [column, row])];
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
        (this.colgroups || []).map((column: GroupColumn, index: number) => {
          const colCls = classes({
            active: this.isColActive(index),
          });
          const colStyle = {
            width: resolveWidth(column.calcWidth),
          };
          return <col class={ colCls } style={ colStyle }></col>;
        })
      }
      </colgroup>;
  }
}
