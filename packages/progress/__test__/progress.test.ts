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

import Progress from '../src/index';

describe('Progress.tsx', () => {
  test('percent', () => {
    const wrapper = mount(Progress, {
      props: {
        percent: 88,
      },
    });
    expect(wrapper.find('.progress-text').text()).toBe('88%');
    expect(wrapper.find('.progress-inner').attributes('style')).toBe('width: 88%; animation-duration: 3s;');
    expect(wrapper.classes()).toContain('bk-progress-line');
  });

  test('circle', () => {
    const wrapper = mount(Progress, {
      props: {
        type: 'circle',
      },
    });
    expect(wrapper.classes()).toContain('bk-progress-circle');
  });

  test('dashboard', () => {
    const wrapper = mount(Progress, {
      props: {
        percent: 80,
        type: 'dashboard',
      },
    });
    expect(wrapper.classes()).toContain('bk-progress-dashboard');
  });

  test('width', () => {
    const wrapper = mount(Progress, {
      props: {
        type: 'circle',
        width: 140,
      },
    });
    expect(wrapper.find('.progress-outer-circle').attributes('style')).toContain('width: 140px; height: 140px;');
  });

  test('theme', () => {
    const wrapper = mount(Progress, {
      props: {
        theme: 'success',
      },
    });
    expect(wrapper.find('.progress-inner').classes()).toContain('bk-success');
    expect(wrapper.classes()).toContain('bk-progress-line');
  });

  test('text inside', () => {
    const wrapper = mount(Progress, {
      props: {
        strokeWidth: 24,
        textInside: true,
      },
    });
    expect(wrapper.find('.inner-text').exists()).toBe(true);
  });

  test('stroke width', () => {
    const wrapper = mount(Progress, {
      props: {
        strokeWidth: 24,
      },
    });
    expect(wrapper.find('.progress-bar').attributes('style')).toBe('height: 24px; line-height: 24px;');
  });

  test('show text', () => {
    const wrapper = mount(Progress, {
      props: {
        showText: false,
      },
    });
    expect(wrapper.find('.progress-text').exists()).toBe(false);
  });
  test('color', () => {
    const wrapper = mount(Progress, {
      props: {
        color: 'yellow',
      },
    });
    expect(wrapper.find('.progress-inner').attributes('style')).toContain('background: yellow;');
  });

  test('slot', () => {
    const wrapper = mount(Progress, {
      slots: {
        default: '自定义内容',
      },
    });
    expect(wrapper.find('.progress-text').text()).toBe('自定义内容');
  });

  test('format', () => {
    const wrapper = mount(Progress, {
      props: {
        percent: 88,
        format: (percent: Number) => `百分比${percent}`,
      },
    });
    expect(wrapper.find('.progress-text').text()).toBe('百分比88');
  });
});
