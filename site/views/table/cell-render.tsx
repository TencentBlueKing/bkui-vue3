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
import { defineComponent, reactive, ref } from 'vue';

import { DATA_FIX_COLUMNS, DATA_TABLE } from './options';

export default defineComponent({
  components: {},
  setup() {
    const tableData = ref([...DATA_TABLE]);
    const pagination = reactive({ count: DATA_TABLE.length, limit: 10 });

    const renderCell = ({ row, column }) => <div style="position: relative;">{row[column.field]}</div>;

    const renderTh = (column, index) => (
      <bk-popover content={`${index}-xxxxxxxx`}>
        <span>{column.field ?? index}</span>
      </bk-popover>
    );

    const columns = [...DATA_FIX_COLUMNS].map((col: any, index: number) => ({
      ...col,
      label: [0, 1].includes(index) ? renderTh : (col: any) => col.field,
      render: [1, 2, 3, 4].includes(index) ? renderCell : undefined,
    }));

    return {
      renderCell,
      renderTh,
      pagination,
      tableData,
      columns,
    };
  },

  render() {
    return (
      <div style="height: 300px; width: 100%;">
        <bk-table columns={this.columns} data={this.tableData} pagination={this.pagination} settings={true} />
      </div>
    );
  },
});
