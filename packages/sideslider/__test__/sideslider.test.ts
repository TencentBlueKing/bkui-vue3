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

import BkSideslider from '../src';
const components = {
  BkSideslider,
};
const isShow = true;
describe('Sideslider.tsx', () => {
  it('render with default settings', async () => {
    const wrapper = await mount(BkSideslider, {
      propsData: {
        isShow,
      },
    });
    expect(wrapper.classes()).toContain('bk-sideslider-wrapper');
  });
  it('test props of title', async () => {
    const wrapper = await mount(BkSideslider, {
      propsData: {
        title: '我是自定义标题',
        isShow,
      },
    });
    expect(wrapper.find('.bk-sideslider-title').text()).toBe('我是自定义标题');
  });
  it('test props of scroll-able', async () => {
    const wrapper = await mount(BkSideslider, {
      propsData: {
        scrollable: true,
        isShow,
      },
    });
    expect(wrapper.classes()).toContain('scroll-able');
  });
  it('test slot footer', async () => {
    const wrapper = await mount({
      components,
      template: '<BkSideslider :isShow="true"><template #footer>我是自定义尾部</template></BkSideslider>',
    });
    expect(wrapper.find('.bk-sideslider-footer').text()).toBe('我是自定义尾部');
  });
  it('test props width', async () => {
    const wrapper = await mount({
      components,
      template: '<BkSideslider ref="slider" width="500px"></BkSideslider>',
    });
    expect(wrapper.html()).toContain('<div class="bk-modal-wrapper normal bk-sideslider-wrapper scroll-able" style="width: 500px; height: 100%; display: none; right: 0px;">');
  });
});
