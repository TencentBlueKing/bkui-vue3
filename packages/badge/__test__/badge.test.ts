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
import Badge from '../src/index';
import { Help } from '@bkui-vue/icon';
import Button from '@bkui-vue/button';
const mountTpl = (template: string) => mount({
  components: {
    bkBadge: Badge,
    Help,
    bkButton: Button,
  },
  template,
}, {
  global: {
    provide: {
      badge: {},
    },
  },
});
describe('Badge.tsx', () => {
  it('theme', async () => {
    const theme = 'danger';
    const wrapper = await mount(Badge, {
      props: { theme },
    });
    expect(wrapper.findAll(`.bk-${theme}`).length).toEqual(1);
  });

  it('count', async () => {
    const wrapper = await mount(Badge, {
      props: { count: 10 },
    });
    // todo
    expect(wrapper.findAll('.bk-primary').length).toEqual(1);
  });
  it('dot', async () => {
    const wrapper = await mount(Badge, {
      props: { dot: true },
    });
    expect(wrapper.findAll('.dot').length).toEqual(1);
  });
  it('overflowCount', async () => {
    const wrapper = await mount(Badge, {
      props: { count: 100 },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('position', async () => {
    const wrapper = await mount(Badge, {
      props: { position: 'top-left' },
    });
    expect(wrapper.findAll('.top-left').length).toEqual(1);
  });
  it('slot', async () => {
    const wrapper = mountTpl(`
    <bkBadge>
      <bkButton>Badge</bkButton>
    </bkBadge>`);
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('icon', async () => {
    const wrapper = mountTpl(`
    <bkBadge>
      <template slot="icon">
        <Help />
      </template>
      <bkButton>Badge</bkButton>
    </bkBadge>`);
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('visible', async () => {
    const wrapper = await mount(Badge, {
      props: { visible: true },
    });
    expect(wrapper.findAll('.bk-badge').length).toEqual(0);
  });
});
