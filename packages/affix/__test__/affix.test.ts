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

import Button from '@bkui-vue/button';
import { mount } from '@vue/test-utils';

import Affix from '../src';
const components = {
  Affix,
  Button,
};
const affixContent = '固定顶部';
describe('Affix.tsx', () => {
  it('render test', async () => {
    const wrapper = await mount(Affix, {
      slots: {
        default: affixContent,
      },
    });
    expect(wrapper.html()).toContain(affixContent);
  });
  it('offsetTop', async () => {
    const top = 100;
    const wrapper = mount({
      components,
      template: `
      <Affix :offset-top=${top}>
        <Button theme="primary">
          固定在顶部100px
        </Button>
      </Affix>
      `,
    });
    wrapper.element.scrollTop = 2000;
    await wrapper.trigger('scroll');
    expect(wrapper.find('.bk-affix').exists()).toBe(true);
    expect(wrapper.find('.bk-affix').attributes().style.includes('top: 100px')).toBe(true);
    expect(wrapper.find('.bk-affix').attributes().style.includes('z-index: 1000')).toBe(true);
  });
  it('zIndex', async () => {
    const zIndex = 10;
    const top = 200;
    const wrapper = mount({
      components,
      template: `
      <Affix :z-index=${zIndex} :offset-top=${top}>
        <Button theme="primary">
          层级为10
        </Button>
      </Affix>
      `,
    });
    wrapper.element.scrollTop = 2000;
    await wrapper.trigger('scroll');
    expect(wrapper.find('.bk-affix').exists()).toBe(true);
    expect(wrapper.find('.bk-affix').attributes().style.includes('top: 200px')).toBe(true);
    expect(wrapper.find('.bk-affix').attributes().style.includes('z-index: 10')).toBe(true);
  });
  it('event trigger', async () => {
    const wrapper = mount({
      components,
      template: `
      <Affix>
        <Button theme="primary">
          事件
        </Button>
      </Affix>
      `,
    });
    wrapper.element.scrollTop = 2000;
    wrapper.vm.$emit('change', true);
    await wrapper.vm.$nextTick(); // 等待事件处理完成
    expect(wrapper.emitted().change).toBeTruthy();
  });
});
