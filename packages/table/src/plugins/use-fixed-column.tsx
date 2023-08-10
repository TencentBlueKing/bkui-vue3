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
import { computed } from 'vue';

import { resolveClassName } from '@bkui-vue/shared';

import { COLUMN_ATTRIBUTE, SCROLLY_WIDTH } from '../const';
import { GroupColumn, TablePropTypes } from '../props';
import { getColumnReactWidth } from '../utils';

/**
 * 固定列Hooks
 */
export default (props: TablePropTypes, colgroups: GroupColumn[], hasScrollY?) => {
  // const footHeight = computed(() => (props.pagination && props.data.length ? props.paginationHeight : 0));
  const resolveColumnClass = (column: GroupColumn, scrollX?, offsetRight?) => ({
    column_fixed: !!column.fixed,
    column_fixed_left: column.fixed !== 'right',
    column_fixed_right: column.fixed === 'right',
    shadow: column.fixed === 'right' ? (offsetRight - scrollX) > 2 :  scrollX > 0,
  });
  const resolveFixColPos = (column: GroupColumn) => (column.fixed === 'right' ? 'right' : 'left');
  const resolveFixOffset = {
    left: (ignoreFirst = true) => colgroups.filter(col =>  !col.isHidden && col.fixed && col.fixed !== 'right')
      .reduce((offset: number, curr: GroupColumn, index: number) => {
        const outOffset = ignoreFirst && (index === 0) ? offset : (offset + getColumnReactWidth(curr));
        return outOffset;
      }, 0),
    right: (ignoreFirst = true) => colgroups.filter(col =>  !col.isHidden && col.fixed === 'right')
      .reduce((offset: number, curr: GroupColumn, index: number) => {
        const outOffset = ignoreFirst && (index === 0) ? offset : (offset + getColumnReactWidth(curr));
        return outOffset;
      }, hasScrollY ? SCROLLY_WIDTH : 0),
  };

  const getPreColumnOffset = (fixedPos: string, column: GroupColumn, offset = 0) => {
    const sourceId = column[COLUMN_ATTRIBUTE.COL_UID];
    const opt = fixedPos === 'right' ? -1 : 1;
    const filterColumns = colgroups.filter(col => !col.isHidden);
    const { length } = filterColumns;
    let start = fixedPos === 'right' ? length * opt : 1;
    let preOffset = 0;

    for (start; ;) {
      start = start + -1 * opt;
      const index = Math.abs(start);
      const current = filterColumns[index];
      const curFixedPos = resolveFixColPos(current);
      const id = current[COLUMN_ATTRIBUTE.COL_UID];

      if (curFixedPos === fixedPos && sourceId !== id) {
        const width = getColumnReactWidth(current);
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
  const resolveFixedColumnStyle = (column: GroupColumn, hasScrollY = false) => {
    if (!column.fixed || column.isHidden) {
      return {};
    }
    const fixedOffset: any = {
      left: 0,
      right: hasScrollY ? SCROLLY_WIDTH : 0,
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

  const fixedColumns = computed(() => {
    const colPosExist = {
      left: false,
      right: false,
    };

    return colgroups.filter(col => !col.isHidden && col.fixed).map((col) => {
      const colPos = resolveFixColPos(col);
      const isExist = colPosExist[colPos];
      colPosExist[colPos] = true;
      return { isExist, colPos, column: col };
    });
  });

  const fixedWrapperClass = resolveClassName('table-fixed');

  return {
    fixedWrapperClass,
    resolveFixedColumnStyle,
    fixedColumns,
    resolveColumnStyle,
    resolveColumnClass,
  };
};
