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

import { BkPagination } from '@bkui-vue/pagination';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'Pagination',
  setup() {
    const current = ref(1);
    const count = ref(100);

    const handleCount = () => {
      count.value = count.value + 100;
    };

    const handleCurrent = () => {
      current.value = current.value + 1;
    };

    return {
      current,
      count,
      handleCount,
      handleCurrent,
    };
  },
  render() {
    return (
      <div>
        <div style="margin: 20px auto;">
          <button onClick={this.handleCount}>count</button>
          <button onClick={this.handleCurrent}>current</button>
        </div>
        <div style="margin: 20px auto;">
          <BkPagination count={this.count} limit={10} disabled />
        </div>
        <div style="margin: 20px auto;">
          <BkPagination count={this.count} limit={10} prevText="上一页" size="small" />
        </div>
        <div style="margin: 20px auto;">
          <BkPagination count={this.count} limit={10} nextText="下一页" />
        </div>
        <div style="margin: 20px auto;">
          <BkPagination count={this.count} limit={10} disabled />
        </div>
        <div style="margin: 20px auto;">
          <BkPagination count={this.count} limit={10} align="center" />
        </div>
        <div style="margin: 20px auto;">
          <BkPagination count={this.count} limit={10} align="right" layout={['list', 'limit', 'total']} />
        </div>
        <div style="margin: 20px auto;">
          <BkPagination v-model={this.current} count={this.count} limit={10} disabled />

        </div>
        <div style="margin: 20px auto;">
          <BkPagination v-model={this.current} count={this.count} limit={10} showTotalCount={false} />

        </div>
        <div style="margin: 20px auto;">
          <BkPagination v-model={this.current} count={this.count} limit={10} showLimit={false} />
        </div>
      </div>
    );
  },
});
