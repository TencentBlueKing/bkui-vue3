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

import { Help, HelpFill } from '@bkui-vue/icon';
import { mount } from '@vue/test-utils';

import BkLoading, { BkLoadingMode } from '../src/';

describe('BkLoading.tsx', () => {
  it('renders loading', () => {
    const wrapper = mount(BkLoading, {
      props: {
        loading: true,
      },
    });
    expect(wrapper.classes('bk-nested-loading')).toBe(false);
    expect(wrapper.classes()).toContain('bk-loading-wrapper');
  });

  it('renders spin loading', () => {
    const wrapper = mount(BkLoading, {
      props: {
        mode: BkLoadingMode.Spin,
        loading: true,
      },
    });
    expect(wrapper.find('.bk-spin-indicator').exists()).toBe(true);
  });

  it('renders theme loading', () => {
    const validTypes = ['white', 'primary', 'warning', 'success', 'danger'];
    const { validator } = BkLoading.props.theme;
    validTypes.forEach(valid => expect(validator(valid)).toBe(true));
  });

  it('renders size spin loading', () => {
    const validTypes = ['small', 'large'];
    const { validator } = BkLoading.props.size;
    validTypes.forEach(valid => expect(validator(valid)).toBe(true));
  });

  it('renders nested loading', () => {
    const wrapper = mount(BkLoading, {
      props: {
        loading: false,
      },
      slots: {
        // eslint-disable-next-line max-len
        default:
          '<div style="height: 300px; width: 300px; display: flex; align-items: center; justify-content: center;">content</div>',
      },
    });

    expect(wrapper.classes('bk-nested-loading')).toBe(false);
    expect(wrapper.html()).toEqual(
      '<div style="height: 300px; width: 300px; display: flex; align-items: center; justify-content: center;">content</div>',
    );
  });

  it('renders loading with title', () => {
    const loadingTitle = 'hello';
    const wrapper = mount(BkLoading, {
      props: {
        title: loadingTitle,
      },
    });

    expect(wrapper.find('.bk-loading-title').exists()).toBe(true);
    expect(wrapper.find('.bk-loading-title').text()).toMatch(loadingTitle);
  });

  it('renders loading with custom indicator', () => {
    const wrapper = mount(BkLoading, {
      props: {
        indicator: Help,
      },
    });

    expect(wrapper.findComponent(Help).exists()).toBe(true);
  });

  it('call set global default indicator', () => {
    BkLoading.setDefaultIndicator(HelpFill);
    const wrapper = mount(BkLoading);
    expect(wrapper.findComponent(HelpFill).exists()).toBe(true);
  });
});
