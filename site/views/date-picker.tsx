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

import { BkButton } from '@bkui-vue/button';
import BKDatePicker from '@bkui-vue/date-picker';
import { defineComponent, reactive, toRefs } from 'vue';

export default defineComponent({
  name: 'SiteDatePicker',
  setup() {
    const shortcuts = [
      {
        text: '今天',
        value() {
          const end = new Date();
          const start = new Date();
          return [start, end];
        },
        onClick: (picker) => {
          console.error(picker);
        },
      },
      {
        text: '近7天',
        value() {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          return [start, end];
        },
      },
    ];

    function ddd() {
      console.error(state.dateValue);
      console.error(state.dateValueArr);
    }

    const state = reactive({
      dateValue: '2021-12-23',
      // dateValueArr: ['2021-12-21', '2021-12-23'],
      dateValueArr: [new Date(), new Date()],
    });

    return {
      ...toRefs(state),
      shortcuts,
      ddd,
    };
  },
  render() {
    // const testHeader = <div>
    //   <div class="title">testHeader</div>
    // </div>;
    return (
      <div style="padding: 26px 20px 20px 20px;">
        {/* <div style="background-color: aliceblue; margin-bottom: 30px; height: 800px"></div> */}
        {/* <BKDatePicker shortcuts={this.shortcuts} fontSize="medium" v-slots={
          {
            header: () => (<>header slot</>),
          }
        }></BKDatePicker> */}
        <BKDatePicker v-model={this.dateValue} appendToBody={false}>{{
          // header: () => (<>header slot</>),
          // header: () => testHeader,
        }}</BKDatePicker>
        <div style="height: 20px;"></div>
        <BKDatePicker v-model={this.dateValueArr} appendToBody={false} type="daterange">{{
          // header: () => (<>header slot</>),
          // header: () => testHeader,
        }}</BKDatePicker>
        <BkButton style="margin-left: 20px;" onClick={this.ddd} >getValue</BkButton>
        <div style="background-color: aliceblue; margin-top: 30px; height: 800px"></div>
      </div>
    );
  },
});
