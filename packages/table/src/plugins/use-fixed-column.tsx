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
import { reactive, Ref } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';

import { SCROLLY_WIDTH } from '../const';
import { Column, TablePropTypes } from '../props';
import { ITableResponse } from '../use-attributes';

/**
 * 固定列Hooks
 */
export default (props: TablePropTypes, tableResp: ITableResponse, head?: Ref<HTMLElement>) => {
  const { formatData, isHiddenColumn, getColumnId, getColumnOrderWidth } = tableResp;
  const resolveColumnClass = (column: Column, scrollX?, offsetRight?) => ({
    column_fixed: !!column.fixed,
    column_fixed_left: column.fixed !== 'right',
    column_fixed_right: column.fixed === 'right',
    shadow: column.fixed === 'right' ? offsetRight - scrollX > 2 : scrollX > 0,
  });
  const getColumnWidth = (col: Column) => {
    const width = getColumnOrderWidth(col);
    if (/^\d+/.test(`${width}`)) {
      return width;
    }

    const id = tableResp.getColumnId(col);
    const query = `[data-id="${id}"]`;
    const target = (head?.value?.querySelector(query) as HTMLElement) ?? { offsetWidth: 0 };
    return target?.offsetWidth ?? 0;
  };

  const resolveFixColPos = (column: Column) => (column.fixed === 'right' ? 'right' : 'left');
  const resolveFixOffset = {
    left: (ignoreFirst = true) =>
      formatData.columns
        .filter(col => !isHiddenColumn(col) && col.fixed && col.fixed !== 'right')
        .reduce((offset: number, curr: Column, index: number) => {
          const colWidth = getColumnWidth(curr);
          const outOffset = ignoreFirst && index === 0 ? offset : offset + colWidth;
          return outOffset;
        }, 0),
    right: (ignoreFirst = true) =>
      formatData.columns
        .filter(col => !isHiddenColumn(col) && col.fixed === 'right')
        .reduce((offset: number, curr: Column, index: number) => {
          const outOffset = ignoreFirst && index === 0 ? offset : offset + getColumnWidth(curr);
          return outOffset;
        }, 0),
  };

  const getPreColumnOffset = (fixedPos: string, column: Column, offset = 0) => {
    const sourceId = getColumnId(column);
    const opt = fixedPos === 'right' ? -1 : 1;
    const filterColumns = formatData.columns.filter(col => !isHiddenColumn(col));
    const { length } = filterColumns;
    let start = fixedPos === 'right' ? length * opt : 1;
    let preOffset = 0;

    for (start; ; ) {
      start = start + -1 * opt;
      const index = Math.abs(start);
      const current = filterColumns[index];
      const curFixedPos = resolveFixColPos(current);
      const id = getColumnId(current);

      if (curFixedPos === fixedPos && sourceId !== id) {
        const width = getColumnOrderWidth(current) as number;
        preOffset = preOffset + width;
      }

      if (sourceId === id) {
        break;
      }
    }

    return preOffset + offset;
  };

  /**
   * 用于解析固定列偏移位置
   * @param column 当前需要计算的列
   * @param hasScrollY 是否有纵向滚动条
   * @returns
   */
  const resolveFixedColumnStyle = (column: Column, hasScrollY = false) => {
    if (!column.fixed || isHiddenColumn(column)) {
      return {};
    }
    const fixedOffset: any = {
      left: 0,
      right: hasScrollY ? SCROLLY_WIDTH : -1,
    };
    const fixedPos = resolveFixColPos(column);
    fixedOffset[fixedPos] = getPreColumnOffset(fixedPos, column, fixedOffset[fixedPos]);

    return {
      [fixedPos]: `${fixedOffset[fixedPos]}px`,
    };
  };

  const resolveColumnStyle = (colPos: string) => ({
    width: `${resolveFixOffset[colPos](false)}px`,
    backgroundColor: props.thead.color,
    bottom: '0px',
  });

  const fixedColumns = reactive([]);

  const resolveFixedColumns = tableOffsetRight => {
    const colPosExist = {
      left: false,
      right: false,
    };

    const result = formatData.columns
      .filter(column => !isHiddenColumn(column) && column.fixed)
      .map(column => {
        const colPos = resolveFixColPos(column);
        const isExist = colPosExist[colPos];
        colPosExist[colPos] = true;
        const className = resolveColumnClass(column, tableResp.formatData.layout.translateX, tableOffsetRight);
        const style = resolveColumnStyle(colPos);
        return { isExist, colPos, column, className, style };
      });
    fixedColumns.length = 0;
    fixedColumns.push(...result);
  };

  const updateFixClass = tableOffsetRight => {
    fixedColumns.forEach(item => {
      const className = resolveColumnClass(item.column, tableResp.formatData.layout.translateX, tableOffsetRight);
      Object.assign(item.className, className);
    });
  };

  const { resolveClassName } = usePrefix();
  const fixedWrapperClass = resolveClassName('table-fixed');

  return {
    fixedWrapperClass,
    resolveFixedColumnStyle,
    resolveFixedColumns,
    fixedColumns,
    resolveColumnStyle,
    resolveColumnClass,
    updateFixClass,
  };
};
