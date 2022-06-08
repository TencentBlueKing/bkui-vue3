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
import { defineComponent } from 'vue';

// import { formatPropAsArray } from '../utils';

export default defineComponent({
  props: {
    // row:
  },
  setup() {
    // const getRowHeight = (row?: any, rowIndex?: number) => {
    //   const { size, height } = this.setting;
    //   if (height !== null && height !== undefined) {
    //     return resolvePropVal(this.setting, 'height', ['tbody', row, rowIndex, size]);
    //   }
    //   return resolvePropVal(this.props, 'rowHeight', ['tbody', row, rowIndex]);
    // };
    // const rowStyle = [
    //   ...formatPropAsArray(this.props.rowStyle, [row, rowIndex, this]),
    //   {
    //     '--row-height': `${getRowHeight(row, rowIndex)}px`,
    //   },
    // ];

    // const rowClass = [
    //   ...formatPropAsArray(this.props.rowClass, [row, rowIndex, this]),
    // ];

    // const { resolveFixedColumnStyle,  fixedoffset } = getFixedColumnStyleResolve();
  },
  render() {
    return <div></div>;
    //     return <tr
    //     // @ts-ignore
    //     style={rowStyle}
    //     class={rowClass}
    //     key={row[TABLE_ROW_ATTRIBUTE.ROW_UID]}
    //     onClick={ e => this.handleRowClick(e, row, rowIndex, rows)}
    //     onDblclick={e => this.handleRowDblClick(e, row, rowIndex, rows)}
    //   >
    //   {
    //     this.filterColgroups.map((column: Column, index: number) => {
    //       const cellStyle = [
    //         resolveFixedColumnStyle(column, fixedoffset),
    //         ...formatPropAsArray(this.props.cellStyle, [column, index, row, rowIndex, this]),
    //       ];

    //       const cellClass = [
    //         this.getColumnClass(column, index),
    //         ...formatPropAsArray(this.props.cellClass, [column, index, row, rowIndex, this]),
    //         { 'expand-row': row[TABLE_ROW_ATTRIBUTE.ROW_EXPAND] },
    //       ];

    //       const tdCtxClass = {
    //         cell: true,
    //         'expand-cell': column.type === 'expand',
    //       };

    //       const cellKey = `__CELL_${rowIndex}_${index}`;
    //       return <td
    //       key={cellKey}
    //       class={cellClass}
    //       style={cellStyle}
    //       colspan={1} rowspan={1}>
    //       <div class={tdCtxClass} >{ this.renderCell(row, column, rowIndex, rows) }</div>
    //     </td>;
    //     })
    //   }
    // </tr>;
  },
});
