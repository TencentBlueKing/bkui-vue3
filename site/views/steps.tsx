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

import { defineComponent, reactive } from 'vue';

import BkSteps from '@bkui-vue/steps';

export default defineComponent({
  name: 'SiteSteps',
  setup() {
    const state = reactive({
      objectSteps: [
        { title: '测试一', description: '这是描述' },
        { title: '测试二', description: '这是描述2' },
        { title: '测试三'  },
        { title: '测试四' },
      ],
      curStep: 2,
    });

    
    const stepChanged = (index: number) => {
      state.curStep = index;
    };

    // 步骤切换前的钩子函数，支持异步函数
    const beforeChangeFunc = (index: number) => {
      const promise = new Promise((reslove) => {
        setTimeout(() => {
        }, 1000);

        reslove(index);
      });
      promise.then((res) => {
        console.log('res', res);
      });
      return promise;
    };

    return {
      state,
      stepChanged,
      beforeChangeFunc,
    };
  },
  render() {
    // const stepsSlots = {
    //   1: () => <span><Eye /></span>,
    //   2: () => <span><Error /></span>,
    //   3: () => <span><Help /></span>,
    // };
    // {stepsSlots}
    return (
      <div style="height: 400px;">
        <BkSteps cur-step={this.state.curStep} status="error" controllable={true} theme="success" style={{ marginBottom: '40px' }}></BkSteps>
        <BkSteps cur-step={2}  theme="danger" style={{ marginBottom: '40px' }}></BkSteps>
        <BkSteps cur-step={2}  theme="warning" style={{ marginBottom: '40px' }} size="small"></BkSteps>
        <BkSteps controllable={true} onClick={this.stepChanged} beforeChange={this.beforeChangeFunc}
          direction="vertical" cur-step={this.state.curStep} steps={this.state.objectSteps} size="small">
        </BkSteps>
      </div>
    );
  },
});
