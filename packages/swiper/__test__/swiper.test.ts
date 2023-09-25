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

import Swiper from '../src/swiper';

const list = ['text1', 'text2', 'text3', 'text4', 'text5'];

describe('swiper.tsx', () => {
  it('prop test', async () => {
    const wrapper = await mount({
      template: `
          <bk-swiper
            :pics="list"
            :loop-time="2000"
            :height="400"
            :width="600"
          ></bk-swiper>
        `,
      components: {
        'bk-swiper': Swiper,
      },
      data() {
        return {
          list,
        };
      },
    });
    // check width height prop
    const componentStyle = wrapper.element.getAttribute('style');
    expect(componentStyle).toBe('width: 600px; height: 400px;');
    // check list prop
    const itemList = wrapper.findAll('.bk-swiper-card');
    expect(itemList.length).toBe(5);
    // check loop-time prop
    await new Promise(resolve => {
      setTimeout(() => {
        const indexList = wrapper.find('.bk-swiper-index').findAll('li');
        expect(indexList[1].classes()).toContain('bk-current-index');
        resolve(true);
      }, 2000);
    });
  });
  it('slot test', async () => {
    const wrapper = await mount({
      template: `
          <bk-swiper
            :list="list"
            :is-loop="false"
            :height="200"
            :width="300"
          >
            <template #default="item">
              <div style="text-align: center;">
                {{ item }}
              </div>
            </template>
          </bk-swiper>
        `,
      components: {
        'bk-swiper': Swiper,
      },
      data() {
        return {
          list,
        };
      },
    });
    // check width height prop
    const componentStyle = wrapper.element.getAttribute('style');
    expect(componentStyle).toBe('width: 300px; height: 200px;');
    // check list prop
    const itemList = wrapper.findAll('.bk-swiper-card');
    expect(itemList.length).toBe(5);
    // check slot
    expect(itemList[0].text()).toBe('text1');
    // check is-loop prop
    await new Promise(resolve => {
      setTimeout(() => {
        const indexList = wrapper.find('.bk-swiper-index').findAll('li');
        expect(indexList[0].classes()).toContain('bk-current-index');
        resolve(true);
      }, 2000);
    });
  });
});
