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

import { BkBreadcrumb, BkBreadcrumbItem } from '@bkui-vue/breadcrumb';

export default defineComponent({
  name: 'SiteBreadcrumb',
  setup() {
    return {

    };
  },
  render() {
    return (
      <div style="margin-top: 20px">
        <div class="breadcrumb">
          <div style='margin-bottom: 10px;'>
            <BkBreadcrumb separator="|">
              <BkBreadcrumbItem to="/home">Home</BkBreadcrumbItem>
              <BkBreadcrumbItem>
                slot
              </BkBreadcrumbItem>
            </BkBreadcrumb>
          </div>
          <div>
          <div style="margin-bottom; 10px">
            <BkBreadcrumbItem separator="/">
              <BkBreadcrumbItem to="/home">Home</BkBreadcrumbItem>
              <BkBreadcrumbItem to="/home">Home1</BkBreadcrumbItem>
            </BkBreadcrumbItem>

            <BkBreadcrumb separator="|" >
              <BkBreadcrumbItem to="/switcher">
                switcher
              </BkBreadcrumbItem>
              <BkBreadcrumbItem to="/progress">
                progress
              </BkBreadcrumbItem>
            </BkBreadcrumb>
          </div>
          </div>
        </div>
      </div>
    );
  },
});
