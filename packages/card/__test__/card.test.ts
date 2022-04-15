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

import { Help, HelpDocumentFill, HelpFill } from '@bkui-vue/icon';
import { mount } from '@vue/test-utils';

import Card from '../src';
const mountTpl = (template: string) => mount({
  components: {
    bkCard: Card,
    Help,
    HelpDocumentFill,
    HelpFill,
  },
  template,
}, {
  global: {
    provide: {
      card: {},
    },
  },
});
describe('Card.tsx', () => {
  it('showHeader', async () => {
    const wrapper = await mount(Card, {
      props: { showHeader: false },
    });
    expect(wrapper.findAll('.bk-card-head').length).toEqual(0);
  });
  it('showFooter && hideHeader ', async () => {
    const wrapper = await mount(Card, {
      props: { showHeader: false, showFooter: true },
    });
    expect(wrapper.findAll('.bk-card-head').length).toEqual(0);
    expect(wrapper.findAll('.bk-card-footer').length).toEqual(1);
  });
  it('showFooter', async () => {
    const wrapper = await mount(Card, {
      props: { showFooter: true },
    });
    expect(wrapper.findAll('.bk-card-footer').length).toEqual(1);
  });
  it('border', async () => {
    const wrapper = await mount(Card, {
      props: { border: false },
    });
    expect(wrapper.findAll('.bk-card-border-none').length).toEqual(1);
  });
  it('headBorder', async () => {
    const wrapper = await mount(Card, {
      props: { headBorder: false },
    });
    expect(wrapper.findAll('.bk-card-border-none').length).toEqual(1);
  });
  it('title', async () => {
    const wrapper = await mount(Card, {
      props: { title: 'Card Title' },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('collapseStatus', async () => {
    const wrapper = await mount(Card, {
      props: { collapseStatus: false },
    });
    expect(wrapper.findAll('.bk-card-body').length).toEqual(0);
  });
  it('default slot', async () => {
    const wrapper = mountTpl(`
    <bkCard>
      <div>
          <p>卡片内容 1</p>
          <p>卡片内容 2</p>
          <p>卡片内容 3</p>
      </div>
    </bkCard>`);
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('footer slot', async () => {
    const wrapper = mountTpl(`
    <bkCard>
      <div>
          <p>卡片内容 1</p>
          <p>卡片内容 2</p>
          <p>卡片内容 3</p>
      </div>
      <div slot="footer">
        <div style="background: #fafbfd;">
          <span class="card-foot-icon"><HelpDocumentFill /></span>
          <span class="card-foot-icon"><Help /></span>
          <span class="card-foot-icon"><HelpFill /></span>
        </div>
      </div>
    </bkCard>`);
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('Header slot', async () => {
    const wrapper = mountTpl(`
    <bkCard :showHeader=${true} :showFooter=${false}>
      <div slot="header">
        <Help />
        <label>Card Test</label>
      </div>
      <div>
          <p>卡片内容 1</p>
          <p>卡片内容 2</p>
          <p>卡片内容 3</p>
      </div>
    </bkCard>`);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
