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

import BkButton from '@bkui-vue/button';
import { bkTooltips } from '@bkui-vue/directives';

export default defineComponent({
  name: 'SiteTooltips',
  directives: {
    bkTooltips,
  },
  setup() {
    const leftContent = {
      arrow: true,
      disabled: false,
      trigger: 'hover',
      theme: 'dark',
      content: '提示信息',
      showOnInit: false,
      placement: 'left',
      distance: 8,
      onShow: () => {
        console.log('onshow');
      },
      onHide: () => {
        console.log('onHide');
      },
    };

    const rightContent = Object.assign({}, leftContent, { placement: 'right', trigger: 'click', showOnInit: true });
    const bottomContent = Object.assign({}, leftContent, { placement: 'bottom', theme: 'light' });

    return {
      leftContent,
      rightContent,
      bottomContent,
    };
  },
  render() {
    return (
      <div style="margin: 50px auto;">
        <BkButton ref="tooltip" v-bk-tooltips="提示信息">上边</BkButton><br /><br />
        <BkButton ref="tooltip" v-bk-tooltips={this.leftContent}>左边</BkButton><br /><br />
        <BkButton ref="tooltip" v-bk-tooltips={this.rightContent}>右边</BkButton><br /><br />
        <BkButton ref="tooltip" v-bk-tooltips={this.bottomContent}>下边</BkButton><br /><br />
      </div>
    );
  },
});
