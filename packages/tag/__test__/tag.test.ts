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
import Tag from '../src';

describe('Tag.tsx', () => {
  it('theme', async () => {
    const wrapper = await mount(Tag, {
      props: {
        theme: 'success',
      },
    });

    expect(wrapper.props('theme')).toEqual('success');
    await wrapper.setProps({ theme: 'info' });
    expect(wrapper.props('theme')).toEqual('info');
  });
  it('closable', async () => {
    const wrapper = await mount(Tag, {
      props: {
        closable: true,
      },
    });

    expect(wrapper.props('closable')).toBe(true);
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('type', async () => {
    const type = 'filled';
    const wrapper = await mount(Tag, {
      props: {
        type,
      },
    });

    expect(wrapper.props('type')).toEqual(type);
    expect(wrapper.classes()).toContain(`bk-tag-${type}`);
  });
  it('checkable', async () => {
    const wrapper = await mount(Tag, {
      props: {
        checkable: true,
      },
    });

    expect(wrapper.props('checkable')).toBe(true);
    expect(wrapper.classes()).toContain('bk-tag-checkable');
  });
  it('checked', async () => {
    const wrapper = await mount(Tag, {
      props: {
        checked: true,
      },
    });

    expect(wrapper.props('checked')).toBe(true);
    expect(wrapper.classes()).toContain('bk-tag-check');
  });
  it('radius', async () => {
    const wrapper = await mount(Tag);

    expect(wrapper.attributes('style')).toContain('border-radius: 2px;');
  });
  it('ext-cls', async () => {
    const wrapper = await mount({
      components: { Tag },
      template: '<Tag extCls="bk-tag-test" />',
    });

    expect(wrapper.find('.bk-tag-test').exists()).toBe(true);
  });
  it('icon slots', async () => {
    const iconHtml = '<i class="icon-test"></i>';
    const wrapper = await mount(Tag, {
      slots: {
        icon: iconHtml,
      },
    });
    expect(wrapper.find('.bk-tag .bk-tag-icon').exists()).toBe(true);
    expect(wrapper.html()).toContain(iconHtml);
  });
  it('close emit', async () => {
    const wrapper = await mount(Tag, {
      props: {
        closable: true,
      },
    });
    const closeButton = wrapper.find('.bk-tag-close');
    closeButton.trigger('click');
    closeButton.trigger('click');

    expect(wrapper.emitted()).toHaveProperty('close');
    expect(wrapper.emitted('close')).toHaveLength(2);
  });
  it('change emit', async () => {
    const wrapper = await mount(Tag, {
      props: {
        checkable: true,
        checked: false,
      },
    });
    wrapper.trigger('click');
    wrapper.trigger('click');

    expect(wrapper.emitted()).toHaveProperty('change');
    expect(wrapper.emitted('change')[0]).toEqual([true]);
    expect(wrapper.emitted('change')).toHaveLength(2);
  });
});
