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
import { reactive, watch } from 'vue';

import { ITableColumn } from './components/table-column';
import { SORT_OPTION } from './const';
import { Column, IColSortBehavior, ISortShape, TablePropTypes } from './props';

/**
 * 渲染column settings
 * @param props: TablePropTypes
 * @param targetColumns 解析之后的column配置（主要用来处理通过<bk-column>配置的数据结构）
 */
export default (props: TablePropTypes, targetColumns: ITableColumn[]) => {
  const resolvedColumns = reactive(props.columns ?? []);

  const initColumns = (column: ITableColumn[], remove = false) => {
    let resolveColumns: ITableColumn[] = [];

    if (!Array.isArray(column)) {
      resolveColumns = [column];
    } else {
      resolveColumns = column;
    }

    if (!remove) {
      resolveColumns.forEach(col => {
        const index = targetColumns.findIndex(tc => tc.label === col.label && tc.field === col.field);
        if (index >= 0) {
          Object.assign(targetColumns[index], col);
        } else {
          targetColumns.push(col);
        }
      });

      targetColumns.sort((col1, col2) => col1.index - col2.index);
    } else {
      resolveColumns.forEach(col => {
        const matchColIndex = targetColumns.findIndex(c => c.label === col.label && c.field === col.field);
        if (matchColIndex >= 0) {
          targetColumns.splice(matchColIndex, 1);
        }
      });
    }

    resolvedColumns.length = 0;
    resolvedColumns.push(...(targetColumns as Column[]));
  };

  watch(
    () => [props.columns],
    () => {
      resolvedColumns.length = 0;
      resolvedColumns.push(...props.columns);
    },
  );

  const getColumns = () => {
    return resolvedColumns;
  };

  const getActiveColumn = () => {
    if (props.colSortBehavior === IColSortBehavior.independent) {
      const filters = [SORT_OPTION.ASC, SORT_OPTION.DESC];
      // @ts-ignore
      return getColumns().filter(col => filters.includes((col.sort as ISortShape)?.value))?.[0];
    }
    return null;
  };

  return {
    initColumns,
    getColumns,
    getActiveColumn,
    columns: resolvedColumns,
  };
};
