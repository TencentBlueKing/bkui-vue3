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

import Collapse from '../src';

describe('collapse.tsx', () => {
  it('renders slot default when passed', async () => {
    const wrapper = await mount(Collapse, {
      props: {
        list: [
          { name: 'Title1', content: 'neirong1' },
          { name: 'Title2', content: '内容2' },
        ],
      },
    });
    expect(wrapper.classes()).toContain('bk-collapse-wrapper');

    // 渲染两个
    expect(wrapper.findAll('.bk-collapse-item').length).toEqual(2);
  });
});

describe('collapse accordion', () => {
  it('renders only one content when accordion is true', async () => {
    const wrapper = await mount(Collapse, {
      props: {
        list: [
          { name: 'Title1', content: 'neirong1' },
          { name: 'Title2', content: '内容2' },
        ],
        accordion: true,
        modelValue: [0],
      },
    });

    expect(wrapper.classes()).toContain('bk-collapse-wrapper');
    expect(wrapper.findAll('.bk-collapse-item .bk-collapse-content')[0].classes()).toContain('active');
  });

  it('renders all active content when accordion is false', async () => {
    const wrapper = await mount(Collapse, {
      props: {
        list: [
          { name: 'Title1', content: 'neirong1' },
          { name: 'Title2', content: '内容2' },
          { name: 'Title3', content: '内容3' },
        ],
        accordion: false,
        modelValue: [0, 2],
      },
    });

    expect(wrapper.classes()).toContain('bk-collapse-wrapper');
    expect(wrapper.findAll('.bk-collapse-item .bk-collapse-content')[0].classes()).toContain('active');
    expect(wrapper.findAll('.bk-collapse-item .bk-collapse-content')[2].classes()).toContain('active');
  });
  it('titleField', async () => {
    const wrapper = await mount(BkCollapse, {
      props: {
        list: [
          { title: 'Title1', content: 'neirong1' },
          { title: 'Title2', content: '内容2' },
          { title: 'Title3', content: '内容3' },
        ],
        accordion: false,
        modelValue: [0],
        titleField: 'title',
      },
    });
    expect(wrapper.findAll('.bk-collapse-item .bk-collapse-title')[0].text()).toEqual('Title1');
  });
  it('contentField', async () => {
    const wrapper = await mount(BkCollapse, {
      props: {
        list: [
          { name: 'Title1', contentField: 'neirong1' },
          { name: 'Title2', contentField: '内容2' },
          { name: 'Title3', contentField: '内容3' },
        ],
        accordion: false,
        modelValue: [0],
        contentField: 'contentField',
      },
    });
    expect(wrapper.findAll('.bk-collapse-item .bk-collapse-content')[0].text()).toEqual('neirong1');
  });
  it('idFiled', async () => {
    const wrapper = await mount(BkCollapse, {
      props: {
        list: [
          { name: 'Title1', contentField: 'neirong1' },
          { name: 'Title2', contentField: '内容2' },
          { name: 'Title3', contentField: '内容3' },
        ],
        accordion: false,
        modelValue: ['Title1'],
        idFiled: 'name',
      },
    });
    expect(wrapper.findAll('.bk-collapse-item .bk-collapse-content')[0].classes()).toContain('active');
  });
  it('content Slots', async () => {
    const wrapper = await mount(BkCollapse, {
      props: {
        list: [
          { name: 'Title1', contentField: 'neirong1' },
          { name: 'Title2', contentField: '内容2' },
          { name: 'Title3', contentField: '内容3' },
        ],
        accordion: false,
      },
      slots: {
        content: 'contentSlot',
      },
    });
    expect(wrapper.findAll('.bk-collapse-item .bk-collapse-content')[0].text()).toContain('contentSlot');
  });
});
