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

import { Error } from '@bkui-vue/icon';
import BkTimeline from '@bkui-vue/timeline';
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  name: 'SiteTimeline',
  setup() {
    const state = reactive({
      list: [
        {
          tag: '一天前',
          content: '由pony上线到蓝鲸市场',
          type: 'default',
          color: 'green',
        },
        {
          tag: '步骤1',
          content: '<span style="font-size: 12px;">2019-12-15 11:00</span>',
          type: 'primary',
        },
        {
          tag: '步骤2',
          content: '<span style="font-size: 12px;">2020-12-15 11:00</span>',
          type: 'success',
          filled: true,
        },
        {
          tag: '步骤3',
          content: '<span style="font-size: 12px;">2021-12-15 11:00</span>',
          type: 'warning',
          // color: 'blue',
          // filled: true,
          size: 'large',
        },
        {
          tag: '步骤4',
          content: '<span style="font-size: 12px;">2022-12-15 11:00</span>',
          type: 'danger',
          icon: <Error />,
        },
      ],
    });

    // 点击标题
    const select = (data: any) => {
      alert(`选择了：${data.tag}`);
    };

    return {
      state,
      select,
    };
  },
  render() {
    return (
      <div style="height: 400px; margin-left: 40px; margin-top: 40px">
        <BkTimeline list={this.state.list} style={{ marginBottom: '40px' }} onSelect={this.select}></BkTimeline>
      </div>
    );
  },
});
