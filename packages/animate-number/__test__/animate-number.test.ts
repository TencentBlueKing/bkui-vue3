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

import { mount } from '@vue/test-utils';

import AnimateNumber from '../src';

describe('AnimateNumber.tsx', () => {
  it('test', async () => {
    const wrapper = mount({
      template: `
          <bk-animate-number :value="num"></bk-animate-number>
          <button @click="add" class="add-button"></button>
        `,
      components: {
        'bk-animate-number': AnimateNumber,
      },
      data() {
        return {
          num: 20,
        };
      },
      methods: {
        add() {
          this.num += 20;
        },
      },
    });
    // test render value
    await (() => new Promise((resolve) => {
      setTimeout(resolve, 2000);
    }))();
    expect(wrapper.text()).toBe('20');
    // test change value
    await wrapper.find('.add-button').trigger('click');
    await (() => new Promise((resolve) => {
      setTimeout(resolve, 2000);
    }))();
    expect(wrapper.text()).toBe('40');
  });
});
