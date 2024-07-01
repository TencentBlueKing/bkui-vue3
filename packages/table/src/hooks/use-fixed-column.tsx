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
import { computed, reactive } from 'vue';

import { TablePropTypes } from '../props';
import { UseColumns } from './use-columns';

/**
 * 固定列Hooks
 */
export default (_props: TablePropTypes, columns: UseColumns) => {
  const fixedLeftColumns = computed(() =>
    columns.visibleColumns.filter(column => !!column.fixed && column.fixed !== 'right'),
  );

  const fixedRightColumns = computed(() =>
    columns.visibleColumns.filter(column => !!column.fixed && column.fixed === 'right'),
  );

  const fixedLeftStyle = reactive({ left: 0, width: '0' });

  const fixedRightStyle = reactive({ right: 0, width: '0' });

  const resolveFixedColumnStyle = () => {
    let right = 0;
    const { length } = fixedRightColumns.value;
    for (let i = length - 1; i >= 0; i--) {
      const col = fixedRightColumns.value[i];
      const width = columns.getColumnWidth(col);
      columns.setColumnRect(col, { right, width });
      columns.setFixedStyle(col, { right: `${right}px` });
      right = right + width;
    }

    let left = 0;
    fixedLeftColumns.value.forEach(col => {
      const width = columns.getColumnWidth(col);
      columns.setColumnRect(col, { left, width });
      columns.setFixedStyle(col, { left: `${left}px` });
      left = left + width;
    });
    fixedLeftStyle.width = `${left}px`;
    fixedRightStyle.width = `${right}px`;
  };

  const getFixedLeft = () => {
    if (fixedLeftColumns.value.length > 0) {
      return (
        <div
          style={fixedLeftStyle}
          class='column_fixed column_fixed_left'
        ></div>
      );
    }

    return null;
  };

  const getFixedRight = () => {
    if (fixedRightColumns.value.length > 0) {
      return (
        <div
          style={fixedRightStyle}
          class='column_fixed column_fixed_right'
        ></div>
      );
    }
  };

  const renderFixedRows = () => {
    return [getFixedLeft(), getFixedRight()];
  };

  return {
    renderFixedRows,
    resolveFixedColumnStyle,
  };
};
