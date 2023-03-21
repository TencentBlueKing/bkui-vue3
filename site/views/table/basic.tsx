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
import { Table } from 'bkui-vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseTable',
  render() {
    return (
      <Table
        virtualEnabled={true}
        columns={[
          {
            field: 'biz_id',
            label: 'demo',
            fixed: false,
            sort: true,
            filter: {
              list: [
                {
                  text: '100141',
                  value: '100141',
                },
                {
                  text: '100325',
                  value: '100325',
                },
                {
                  text: '100376',
                  value: '100376',
                },
                {
                  text: '100378',
                  value: '100378',
                },
                {
                  text: '100387',
                  value: '100387',
                },
                {
                  text: '100391',
                  value: '100391',
                },
                {
                  text: '100566',
                  value: '100566',
                },
                {
                  text: '100738',
                  value: '100738',
                },
                {
                  text: '1019',
                  value: '1019',
                },
                {
                  text: '105',
                  value: '105',
                },
                {
                  text: '120',
                  value: '120',
                },
                {
                  text: '139',
                  value: '139',
                },
                {
                  text: '199',
                  value: '199',
                },
                {
                  text: '236',
                  value: '236',
                },
                {
                  text: '359',
                  value: '359',
                },
                {
                  text: '555',
                  value: '555',
                },
                {
                  text: '706',
                  value: '706',
                },
                {
                  text: '883',
                  value: '883',
                },
                {
                  text: '943',
                  value: '943',
                },
                {
                  text: '998',
                  value: '998',
                },
              ],
              btnSave: true,
              btnReset: true,
            },
            width: '',
            minWidth: 0,
            render: ({ cell }) => (
                <div
                  class={'flex-row align-items-center'}
                  style={{
                    height: '100%',
                  }}
                >
                  {cell}
                </div>
            ),
          },
          {
            field: 'COUNT(visitor_group)',
            label: 'COUNT(visitor_group)',
            fixed: false,
            sort: true,
            filter: {
              list: [
                {
                  text: 2,
                  value: 2,
                },
                {
                  text: 37,
                  value: 37,
                },
                {
                  text: 4,
                  value: 4,
                },
                {
                  text: 8,
                  value: 8,
                },
                {
                  text: 5,
                  value: 5,
                },
                {
                  text: 7,
                  value: 7,
                },
                {
                  text: 138,
                  value: 138,
                },
                {
                  text: 1,
                  value: 1,
                },
                {
                  text: 50,
                  value: 50,
                },
                {
                  text: 89,
                  value: 89,
                },
                {
                  text: 68,
                  value: 68,
                },
                {
                  text: 3,
                  value: 3,
                },
                {
                  text: 13,
                  value: 13,
                },
                {
                  text: 11,
                  value: 11,
                },
                {
                  text: 45,
                  value: 45,
                },
                {
                  text: 36,
                  value: 36,
                },
              ],
              btnSave: true,
              btnReset: true,
            },
            width: '',
            minWidth: 0,
          },
        ]}
        data={[
          {
            'COUNT(visitor_group)': 2,
            biz_id: '100141',
            _unique_metric_: '100141',
          },
          {
            'COUNT(visitor_group)': 37,
            biz_id: '100325',
            _unique_metric_: '100325',
          },
          {
            'COUNT(visitor_group)': 2,
            biz_id: '100376',
            _unique_metric_: '100376',
          },
          {
            'COUNT(visitor_group)': 4,
            biz_id: '100378',
            _unique_metric_: '100378',
          },
          {
            'COUNT(visitor_group)': 8,
            biz_id: '100387',
            _unique_metric_: '100387',
          },
          {
            'COUNT(visitor_group)': 5,
            biz_id: '100391',
            _unique_metric_: '100391',
          },
          {
            'COUNT(visitor_group)': 7,
            biz_id: '100566',
            _unique_metric_: '100566',
          },
          {
            'COUNT(visitor_group)': 137,
            biz_id: '100738',
            _unique_metric_: '100738',
          },
          {
            'COUNT(visitor_group)': 1,
            biz_id: '1019',
            _unique_metric_: '1019',
          },
          {
            'COUNT(visitor_group)': 50,
            biz_id: '105',
            _unique_metric_: '105',
          },
          {
            'COUNT(visitor_group)': 89,
            biz_id: '120',
            _unique_metric_: '120',
          },
          {
            'COUNT(visitor_group)': 68,
            biz_id: '139',
            _unique_metric_: '139',
          },
          {
            'COUNT(visitor_group)': 8,
            biz_id: '199',
            _unique_metric_: '199',
          },
          {
            'COUNT(visitor_group)': 1,
            biz_id: '236',
            _unique_metric_: '236',
          },
          {
            'COUNT(visitor_group)': 3,
            biz_id: '359',
            _unique_metric_: '359',
          },
          {
            'COUNT(visitor_group)': 13,
            biz_id: '555',
            _unique_metric_: '555',
          },
          {
            'COUNT(visitor_group)': 3,
            biz_id: '706',
            _unique_metric_: '706',
          },
          {
            'COUNT(visitor_group)': 11,
            biz_id: '883',
            _unique_metric_: '883',
          },
          {
            'COUNT(visitor_group)': 45,
            biz_id: '943',
            _unique_metric_: '943',
          },
          {
            'COUNT(visitor_group)': 36,
            biz_id: '998',
            _unique_metric_: '998',
          },
        ]}
        columnSort={data => console.log(data)}
      />
    );
  },
});
