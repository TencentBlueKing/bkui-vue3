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
import {  reactive, watchEffect  } from 'vue';

import { ITableColumn } from '../components/table-column';
import { Column, IColumnActive, TablePropTypes } from '../props';
import useColumn from '../use-column';
import { resolveNumberToNumArray } from '../utils';
/**
 * 处理Props中的ActiveColumn，解析为统一的数组格式
 * @param props
 * @returns
 */
export const resolveActiveColumns = (props: TablePropTypes) => {
  if (props.columnPick !== 'disabled') {
    if (props.columnPick === 'multi') {
      return Array.isArray(props.activeColumn) ? props.activeColumn : resolveNumberToNumArray(props.activeColumn);
    }

    return Array.isArray(props.activeColumn)
      ? resolveNumberToNumArray(props.activeColumn[0])
      : resolveNumberToNumArray(props.activeColumn);
  }
  return [];
};

/**
 * table列处理模块
 * @param props
 * @returns
 */
export default (props: TablePropTypes, targetColumns: Column[]) => {
  let activeColumns = reactive([]);
  const { getColumns } = useColumn(props, targetColumns as ITableColumn[]);
  if (props.columnPick === 'disabled') {
    return { activeColumns };
  }

  const activeCols = reactive(resolveActiveColumns(props));
  const getActiveColumns = () => getColumns().map((col, index) => ({
    index,
    _column: col,
    active: activeCols.some((colIndex: number) => colIndex === index),
  }));

  watchEffect(() => {
    activeColumns = getActiveColumns();
    const cols = resolveActiveColumns(props);
    activeColumns.forEach((col: IColumnActive, index: number) => {
      Object.assign(col, {
        active: cols.some((colIndex: number) => colIndex === index),
      });
    });
  });

  return { activeColumns };
};
