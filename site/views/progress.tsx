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

import BkProgress from '@bkui-vue/progress';
import BkButton from '@bkui-vue/button';

export default defineComponent({
  name: 'SiteProgress',
  setup() {
    const percent = ref(0);
    const handleClick = () => {
      percent.value += 20;
    };
    return {
      handleClick,
      percent,
    };
  },
  render() {
    return (
      <div style="margin-top: 20px">
        <BkButton onClick={this.handleClick}>增加进度</BkButton>
        <div class="progress">
          <div style='margin-bottom: 10px;'>
              <BkProgress percent={this.percent} color='yellow'>
                12
              </BkProgress>
          </div>
          <div style='margin-bottom: 10px;'>
              <BkProgress percent={28}></BkProgress>
          </div>
          <div style='margin-bottom: 10px;'>
              <BkProgress theme="warning" percent={46}></BkProgress>
          </div>
          <div style='margin-bottom: 10px;'>
              <BkProgress theme="danger" percent={73}></BkProgress>
          </div>
          <div style='margin-bottom: 10px;'>
              <BkProgress theme="success" percent={9}></BkProgress>
          </div>
          <div style='margin-bottom: 10px;'>
              <BkProgress size="small" percent={0}></BkProgress>
          </div>
          <div style='margin-bottom: 10px;'>
              <BkProgress size="small" percent={28}></BkProgress>
          </div>
          <div style='margin-bottom: 10px;'>
              <BkProgress size="small" theme="warning" percent={46}></BkProgress>
          </div>
          <div style='margin-bottom: 10px;'>
              <BkProgress size="small" theme="danger" percent={73}></BkProgress>
          </div>
          <div style='margin-bottom: 10px;'>
              <BkProgress size="small" theme="success" percent={9}></BkProgress>
          </div>
          <div style='margin-bottom: 10px;'>
              <BkProgress size="large" percent={0}></BkProgress>
          </div>
          <div style='margin-bottom: 10px;'>
              <BkProgress size="large" percent={28}></BkProgress>
          </div>
          <div style='margin-bottom: 10px;'>
              <BkProgress size="large" theme="warning" percent={46}></BkProgress>
          </div>
          <div style='margin-bottom: 10px;'>
              <BkProgress size="large" theme="danger" percent={73}></BkProgress>
          </div>
          <div style='margin-bottom: 10px;'>
              <BkProgress size="large" theme="success" percent={9}></BkProgress>
          </div>
          <div style='margin-bottom: 10px;'>
              <BkProgress text-inside={true} strokeWidth={18} theme="success" percent={80}></BkProgress>
          </div>
          <div style='margin-bottom: 10px;'>
              <BkProgress text-inside={true} strokeWidth={18} percent={70}>
                121
              </BkProgress>
          </div>
          <div style='margin-bottom: 10px;'>
              <BkProgress text-inside={true} type="circle" percent={70}>
                121
              </BkProgress>
          </div>
          <div style='margin-bottom: 10px;'>
              <BkProgress text-inside={true} type="dashboard" percent={10} color='#f56c6c'>
                121
              </BkProgress>
          </div>
        </div>
      </div>
    );
  },
});
