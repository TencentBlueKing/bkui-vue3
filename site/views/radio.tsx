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

import { defineComponent, ref, watch } from 'vue';

import { BkRadio, BkRadioButton, BkRadioGroup } from '@bkui-vue/radio';
export default defineComponent({
  name: 'SiteRadio',
  setup() {
    const radioValue = ref('test');

    const radioGroupValue = ref('test3');

    function handleRadioChang(value: any): void {
      radioValue.value = value;
      console.log('from radio app change == ', value);
    }

    const handleRadioGroupChang = (value: any) =>  {
      radioGroupValue.value = value;
    };

    watch(radioValue, () => {
      console.log('from watch rdios == ', radioValue);
    });
    watch(radioGroupValue, () => {
      console.log('from watch rdios group == ', radioGroupValue);
    });

    return {
      radioValue,
      radioGroupValue,
      handleRadioChang,
      handleRadioGroupChang,
    };
  },
  render() {
    return (
      <div>
        <div style="margin: 20px auto;">
          <BkRadioGroup v-model={this.radioGroupValue} onChange={this.handleRadioGroupChang}>
            <BkRadio label="test1" disabled />
            <BkRadio label="test2" />
            <BkRadio label="test3" disabled checked />
            <BkRadio label="test4" />
            <BkRadio label="test5" checked>slosdssdst name</BkRadio>
          </BkRadioGroup>
        </div>
        <div style="margin: 20px auto;">
          <BkRadioButton modelValue={this.radioValue} onChange={this.handleRadioChang} label="test11"
            checked disabled />
          <BkRadioButton modelValue={this.radioValue} onChange={this.handleRadioChang} label="test22" />
          <BkRadioButton modelValue={this.radioValue} onChange={this.handleRadioChang} label="test33" disabled />
          <BkRadioButton modelValue={this.radioValue} checked onChange={this.handleRadioChang} label="test44" />
          <BkRadioButton modelValue={this.radioValue} onChange={this.handleRadioChang} label="test55">
            slot name
          </BkRadioButton>
          <BkRadioButton checked label="test checked" />
        </div>
      </div>
    );
  },
});
