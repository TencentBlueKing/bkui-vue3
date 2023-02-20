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

import { Collapse } from '@bkui-vue/collapse';

export default defineComponent({
  name: 'CollapseJsx',
  setup() {
    const list = ref([
      {
        name: 'Mature scheme',
        content:
          'With the experience of supporting hundreds of Tencent businesses, compatible with various complex system architectures, born in O&M and proficient in O&M',
      },
      {
        name: 'Comprehensive coverage',
        content:
          'From configuration management to job execution, task scheduling and monitoring self-healing, and then through operation and maintenance big data analysis to assist operation decision-making, it comprehensively covers the full-cycle guarantee management of business operation.',
      },
      {
        name: 'Open platform',
        content:
          'The open PaaS has a powerful development framework and scheduling engine, as well as a complete operation and maintenance development training system, to help the rapid transformation and upgrading of operation and maintenance.',
      },
    ]);
    const active = ref([0]);

    const titleSlot = (item, index) => `${active.value.includes(index) ? 'V' : '>'} ${index} - ${item.name}`;

    const contentSlot = (item, index) => `${item.content}-${index}`;

    return {
      list,
      active,
      titleSlot,
      contentSlot,
    };
  },
  render() {
    return (
      <div>
        <Collapse
          v-model={this.active}
          list={this.list}
          v-slots={{
            default: (item, index) => this.titleSlot(item, index),
            content: (item, index) => this.contentSlot(item, index),
          }}
        />
        <div>
          {this.active}
        </div>
      </div>
    );
  },
});
