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
import { defineComponent, ref } from 'vue';
import Slider from '@bkui-vue/slider';

export default defineComponent({
  name: 'Slider',
  setup() {
    const value = ref(0);
    const value1 = ref(35);
    const value3 = ref([5, 20]);
    const value4 = ref(20);
    const value5 = ref(0);
    const value6 = ref(20);
    const value7 = ref(10);
    const value8 = ref(10);
    const value9 = ref([5, 20]);
    const value10 = ref(10);
    const value11 = ref(20);
    const value12 = ref(20);
    const customContent = {
      0: {
        label: '糟糕',
      },
      20: {
        label: '一般',
      },
      40: {
        label: '还行',
        tip: '还行勉勉强强',
      },
      60: {
        label: '满意',
      },
      80: {
        label: '很好',
      },
      100: {
        label: '非常满意',
      },
    };
    return () => (
      <div style={{ padding: '20px' }}>
        <div style={{ marginTop: '30px', color: '#2dcb56' }}>{value.value}</div>
        <Slider v-model={value.value}></Slider>
        <div style={{ marginTop: '30px', color: '#2dcb56' }}>{value1.value}</div>
        <Slider v-model={value1.value} disable></Slider>
        <div style={{ marginTop: '30px', color: '#2dcb56' }}>{value3.value.join(',')}</div>
        <Slider v-model={value3.value} range></Slider>
        <div style={{ marginTop: '30px', color: '#2dcb56' }}>{value4.value}</div>
        <Slider v-model={value4.value} showBetweenLabel maxValue={500}></Slider>
        <div style={{ marginTop: '30px', color: '#2dcb56' }}>{value5.value}</div>
        <Slider v-model={value5.value} step={5} showInterval showButtonLabel></Slider>
        <div style={{ marginTop: '30px', color: '#2dcb56' }}>{value6.value}</div>
        <Slider v-model={value6.value} step={10} showInterval showIntervalLabel></Slider>
        <div style={{ marginTop: '30px', color: '#2dcb56' }}>{value7.value}</div>
        <Slider v-model={value7.value} step={10} showInterval showIntervalLabel formatterLabel={(value: number) => `${value}%`}></Slider>
        <div style={{ marginTop: '30px', color: '#2dcb56' }}>{value8.value}</div>
        <Slider v-model={value8.value} showInput showButtonLabel></Slider>
        <div style={{ marginTop: '30px', color: '#2dcb56' }}>{value9.value.join(',')}</div>
        <Slider v-model={value9.value} showInput range></Slider>
        <div style={{ marginTop: '30px', color: '#2dcb56' }}>{value10.value}</div>
        <Slider v-model={value10.value} vertical></Slider>
        <div style={{ marginTop: '30px', color: '#2dcb56' }}>{value11.value}</div>
        <Slider v-model={value11.value} vertical formatterLabel={(value: number) => `${value}℃`} showIntervalLabel
          showInterval step={20}></Slider>
        <div style={{ marginTop: '30px', color: '#2dcb56' }}>{value12.value}</div>
        <Slider v-model={value12.value} customContent={customContent} step={20}></Slider>
      </div>
    );
  },
});
