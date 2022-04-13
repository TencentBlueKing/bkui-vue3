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

import { mount, shallowMount } from '@vue/test-utils';

import CodeDiff from '../src';
import { LANGUAGES } from '../src/code-diff';
import { NEW_STR, OLD_STR } from './diffFile';


describe('CodeDiff.tsx', () => {
  it('test', (done) => {
    const wrapper = mount(CodeDiff);
    // todo
    wrapper.vm.$nextTick(() => {
      expect(wrapper.html()).toMatchSnapshot();
      done();
    });
  });
  it('renders dark theme', async () => {
    const wrapper = await shallowMount(CodeDiff, {
      props: {
        theme: 'dark',
      },
    });

    expect(wrapper.classes('dark')).toBeTruthy();
  });

  it('renders light theme', async () => {
    const wrapper = await shallowMount(CodeDiff, {
    });
    expect(wrapper.classes('dark')).toBe(false);
  });

  it('renders light theme', async () => {
    const wrapper = await mount(CodeDiff, {
      props: {
        diffContext: 20,
      },
    });

    expect(wrapper.classes('dark')).toBe(false);
  });

  LANGUAGES.forEach((l) => {
    it(`renders language ${l}`, (done) => {
      const wrapper = shallowMount(CodeDiff, {
        props: {
          newContent: NEW_STR,
          oldContent: OLD_STR,
          language: l,
        },
      });
      setTimeout(() => {
        console.log(`.lang-${l}`);
        expect(wrapper.find(`.lang-${l}`).exists()).toBeTruthy();
        done();
      }, 0);
    });
  });
});
