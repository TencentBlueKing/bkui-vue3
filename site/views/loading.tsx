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

import BkButton from '@bkui-vue/button';
import { Help } from '@bkui-vue/icon';
import { BkLoading, BkLoadingMode, BkLoadingSize } from '@bkui-vue/loading';
import BkPagination from '@bkui-vue/pagination';

// BkLoading.setDefaultIndicator(<span style="font-size: 14px;"><Help /></span>);

export default defineComponent({
  name: 'SiteLoading',
  setup() {
    const loading = ref(true);
    function handleChange() {
      loading.value = !loading.value;
    }
    const current = ref(1);
    function handleCurrent(v) {
      console.log('handleCurrent', v);
      current.value = v;
    }
    console.log(current.value);
    return {
      loading,
      current,
      handleChange,
      handleCurrent,
    };
  },
  render() {
    return (
      <div>
        <BkButton onClick={this.handleChange}>change loading</BkButton>
        <BkLoading loading title="normal loading" mode={BkLoadingMode.Spin} />
        <BkLoading loading title="small loading" mode={BkLoadingMode.Spin} />
        <BkLoading loading title="large loading" mode={BkLoadingMode.Spin} size={BkLoadingSize.Large} />
        <BkLoading loading style="font-size:40px; margin:0 10px;" title="customIndicator" indicator={Help}></BkLoading>
        <BkLoading title="loading" loading={this.loading} theme='primary'>
          <div style="height: 300px; display: flex; align-items:center; justify-content: center;">
            <BkPagination
              onUpdate:modelValue={this.handleCurrent}
              v-model={this.current}
              count={30}
              limit={10}
              showTotalCount={false}
            />
          </div>
        </BkLoading>
        <BkLoading loading title="small loading" size={BkLoadingSize.Small} />
        <BkLoading loading title="large loading" size={BkLoadingSize.Large} />
        <BkLoading loading />
      </div>
    );
  },
});
