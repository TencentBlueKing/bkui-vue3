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

import BkSwitcher from '@bkui-vue/switcher';

export default defineComponent({
  name: 'SiteSwitcher',
  setup() {
    const demo1 = ref(false);
    const demo2 = ref(true);
    const demo3 = ref(1);
    const handleChange = (val) => {
      demo2.value = val;
    };
    const showDemo = (val) => {
      console.log(val, demo3.value);
    };
    return {
      demo1,
      demo2,
      demo3,
      showDemo,
      handleChange,
    };
  },
  render() {
    return (
      <div style="margin-top: 20px">
        <div class="switcher">
        <div style='margin-bottom: 10px;'>
            <BkSwitcher v-model={this.demo1}></BkSwitcher>
            <BkSwitcher v-model={this.demo1} show-text on-text='测试' off-text='测'></BkSwitcher>
            <BkSwitcher value={this.demo2} show-text onChange={this.handleChange}></BkSwitcher>
        </div>
        <div style='margin-bottom: 10px;'>
            <BkSwitcher v-model={this.demo1} size="large" show-text is-outline={true}></BkSwitcher>
            <BkSwitcher v-model={this.demo1} show-text is-square={true}></BkSwitcher>
            <BkSwitcher value={this.demo2} onChange={this.handleChange} size="small"></BkSwitcher>
            <BkSwitcher v-model={this.demo1} size="small" show-text></BkSwitcher>
        </div>
        <div style='margin-bottom: 10px;'>
            <BkSwitcher v-model={this.demo1} theme="success"></BkSwitcher>
            <BkSwitcher v-model={this.demo1} theme="primary"></BkSwitcher>
        </div>
        <div style='margin-bottom: 10px;'>
            <BkSwitcher v-model={this.demo1} theme="success" disabled={true}></BkSwitcher>
            <BkSwitcher v-model={this.demo1} theme="primary" disabled={true}></BkSwitcher>
            <BkSwitcher v-model={this.demo2} theme="primary" disabled={true}></BkSwitcher>
            <BkSwitcher v-model={this.demo3} true-value={1} false-value={2} onChange={this.showDemo}></BkSwitcher>
        </div>
        </div>
      </div>
    );
  },
});
