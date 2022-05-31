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

import { GroupColumn } from '../props';
import { getColumnReactWidth } from '../utils';

/**
 * 固定列Hooks
 */
export default (props, colgroups: GroupColumn[]) => {
  const footHeight = computed(() => (props.pagination && props.data.length ? 40 : 0));
  const resolveColumnClass = (column: GroupColumn) => ({
    column_fixed: !!column.fixed,
    column_fixed_left: column.fixed !== 'right',
    column_fixed_right: column.fixed === 'right',
  });

  const resolveFixColPos = (column: GroupColumn) => (column.fixed === 'right' ? 'right' : 'left');
  const resolveFixOffset = {
    left: (ignoreFirst = true) => colgroups.filter(col =>  col.fixed && col.fixed !== 'right')
      .reduce((offset: number, curr: GroupColumn, index: number) => {
        const outOffset = ignoreFirst && (index === 0) ? offset : (offset + getColumnReactWidth(curr));
        return outOffset;
      }, 0),
    right: (ignoreFirst = true) => colgroups.filter(col =>  col.fixed === 'right')
      .reduce((offset: number, curr: GroupColumn, index: number) => {
        const outOffset = ignoreFirst && (index === 0) ? offset : (offset + getColumnReactWidth(curr));
        return outOffset;
      }, 0),
  };
  const reolveFixRightOffset = resolveFixOffset.right;

  const getFixedColumnStyleResolve = () => {
    const resolveFixedColumnStyle = (column: GroupColumn, fixedoffset) => {
      if (!column.fixed) {
        return {};
      }

      const fixedPos = resolveFixColPos(column);
      const opt = fixedPos === 'right' ? -1 : 1;
      const offsetX = `${fixedoffset[fixedPos]}px`;
      fixedoffset[fixedPos] = fixedoffset[fixedPos] + getColumnReactWidth(column) * opt;
      return {
        [fixedPos]: offsetX,
      };
    };

    const rightOffsetWidth = reolveFixRightOffset(true);

    const fixedoffset: any = {
      left: 0,
      right: rightOffsetWidth,
    };

    return {
      fixedoffset,
      resolveFixedColumnStyle,
    };
  };

  const renderFixedColumns = () => {
    const resolveColumnStyle = (colPos: string) => ({
      width: `${resolveFixOffset[colPos](false)}px`,
      bottom: `${footHeight.value}px`,
    });
    const colPosExist = {
      left: false,
      right: false,
    };
    return colgroups.filter(col => !col.isHidden && col.fixed)
      .map((col) => {
        const colPos = resolveFixColPos(col);
        const isExist = colPosExist[colPos];
        colPosExist[colPos] = true;
        return isExist ? '' : <div
          class={ resolveColumnClass(col) }
          style={ resolveColumnStyle(colPos) }></div>;
      });
  };

  const fixedWrapperClass = resolveClassName('table-fixed');

  return {
    renderFixedColumns,
    fixedWrapperClass,
    getFixedColumnStyleResolve,
  };
};
