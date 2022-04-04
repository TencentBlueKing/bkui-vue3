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

import BkTable from '@bkui-vue/table';
import BkButton from '@bkui-vue/button';
import { BkCheckbox, BkCheckboxGroup } from '@bkui-vue/checkbox';

export default defineComponent({
  name: 'BasicTable',
  setup() {
    const tableData = reactive([
      {
        ip: '192.168.0.1',
        source: 'QQ',
        status: '创建中',
        create_time: '2018-05-25 15:02:24',
        children: [
          {
            name: '用户管理',
            count: '23',
            creator: 'person2',
            create_time: '2017-10-10 11:12',
            desc: '用户管理',
          },
          {
            name: '模块管理',
            count: '2',
            creator: 'person1',
            create_time: '2017-10-10 11:12',
            desc: '无数据测试',
          },
        ],
      },
      {
        ip: '192.168.0.2',
        source: '微信',
        status: '正常',
        create_time: '2018-05-25 15:02:24',
        children: [
          {
            name: '用户管理',
            count: '23',
            creator: 'person2',
            create_time: '2017-10-10 11:12',
            desc: '用户管理',
          },
          {
            name: '模块管理',
            count: '2',
            creator: 'person1',
            create_time: '2017-10-10 11:12',
            desc: '无数据测试',
          },
        ],
      },
      {
        ip: '192.168.0.3',
        source: 'QQ',
        status: '创建中',
        create_time: '2018-05-25 15:02:24',
        children: [
          {
            name: '用户管理',
            count: '23',
            creator: 'person2',
            create_time: '2017-10-10 11:12',
            desc: '用户管理',
          },
          {
            name: '模块管理',
            count: '2',
            creator: 'person1',
            create_time: '2017-10-10 11:12',
            desc: '无数据测试',
          },
        ],
      },
    ]);

    const columns = reactive([
      {
        label: '名称/内网IP',
        field: 'ip',
      },
      {
        label: '来源',
        field: 'source',
      },
      {
        label: '创建时间',
        field: 'create_time',
      },
      {
        label: '状态',
        field: 'status',
      },
    ]);

    const randomRows = reactive([{
      ip: '192.168.0.2',
      source: '微信',
      status: '正常',
      create_time: new Date().toLocaleString(),
    }]);

    const handleAppendRow = () => {
      tableData.push({
        ip: '192.168.0.2',
        source: '微信',
        status: '正常',
        create_time: new Date().toLocaleString(),
        children: [],
      });

      columns.push({
        label: '状态',
        field: 'status',
      });
    };

    const activeColumn: number[] = reactive([]);
    const refColumnPick = ref('disabled');
    const columnPick = reactive(refColumnPick);
    const refIndex = ref(2);
    const activeIndex = reactive(refIndex);
    const columnPicks = reactive(['multi', 'single', 'disabled']);
    const handleRandomColumn = () => {
      if (activeIndex.value > 0) {
        activeIndex.value = activeIndex.value - 1;
      } else {
        activeIndex.value = 2;
        activeColumn.splice(0, activeColumn.length);
      }
      columnPick.value = columnPicks[activeIndex.value];
      const cols = activeIndex.value === 0
        ? [Math.floor(Math.random() * columns.length), Math.floor(Math.random() * columns.length)]
        : [Math.floor(Math.random() * columns.length)];
      activeColumn.splice(0, activeColumn.length, ...cols);
    };

    const handleRandomRows = () => {
      randomRows.splice(0, randomRows.length, ...new Array(Math.ceil(Math.random() * 9000) + 1000).fill('')
        .map((_, index: number) => ({
          ip: `${index}--192.168.0.x`,
          source: `${index}_QQ`,
          status: '创建中',
          create_time: `2018-05-25 15:02:24.${index}`,
        })));
    };

    const isNumberRow = reactive(ref(true));

    const rowHeight = () => (isNumberRow.value ? 40 : Math.random() * 30 + 40);

    const handleRandomRowHeight = () => {
      isNumberRow.value = !isNumberRow.value;
    };

    const checkboxGroupValue = ref(['row']);

    return {
      columns,
      tableData,
      handleAppendRow,
      handleRandomColumn,
      handleRandomRows,
      handleRandomRowHeight,
      activeColumn,
      columnPick,
      randomRows,
      rowHeight,
      checkboxGroupValue,
    };
  },
  render() {
    return (
      <div style='padding: 15px'>
          <BkButton onClick={ this.handleRandomRowHeight }>固定行高|自定义每行行高</BkButton>
          <BkButton onClick={ this.handleRandomColumn }>单列\多列\禁用列选中（{ this.columnPick }）</BkButton>
          <BkButton onClick={ this.handleAppendRow }>追加数据|改变列</BkButton>
          <div style='padding: 15px 0'>
            边框设置(默认为row)
            <BkCheckboxGroup v-model={this.checkboxGroupValue}>
              <BkCheckbox label="none" />
              <BkCheckbox label="row" disabled/>
              <BkCheckbox label="col" />
              <BkCheckbox label="outer" />
            </BkCheckboxGroup>
          </div>
        <div style='height: 300px; '>
          <BkTable columns={ this.columns }
          data={ this.tableData }
          rowHeight={ this.rowHeight }
          columnPick={ this.columnPick }
          border={this.checkboxGroupValue}
          activeColumn={ this.activeColumn }
          ref='tableBasic'></BkTable>
        </div>
        <div style='padding: 15px 0'>大数据量启用虚拟渲染----<BkButton onClick={ this.handleRandomRows }>随机1000-9999行数据</BkButton>----Length: {`${this.randomRows.length}`}</div>
        <div style='height: 500px;'>
          <BkTable columns={ this.columns }
          data={ this.randomRows }
          rowHeight={this.rowHeight}
          virtualEnabled={true}
          border={this.checkboxGroupValue}
          columnPick={ this.columnPick }
          activeColumn={ this.activeColumn }
          ref='tableVirtual'></BkTable>
        </div>
      </div>
    );
  },
});
