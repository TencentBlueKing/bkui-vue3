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
import BkButton from '../src/';
import BkLoading from '../../loading/src/';

describe('BkButton.tsx', () => {
  const label = 'button';
  // const spy = jest.spyOn(console, 'error');
  it('renders slot default when passed', async () => {
    const wrapper = await mount(BkButton, {
      slots: {
        default: label,
      },
    });

    expect(wrapper.text()).toMatch(label);
    expect(wrapper.classes()).toContain('bk-button');
  });

  it('renders without slot', async () => {
    const wrapper = await mount(BkButton);

    expect(wrapper.text()).toMatch('default');
    expect(wrapper.classes()).toContain('bk-button');
  });

  it('renders theme when passed', () => {
    const theme = 'primary';
    const wrapper = mount(BkButton, {
      props: { theme },
    });
    expect(wrapper.classes()).toContain(`bk-button-${theme}`);
    expect(wrapper.classes()).toContain('no-slot');
  });

  it('renders hoverTheme when passed', () => {
    const hoverTheme = 'primary';
    const wrapper = mount(BkButton, {
      props: { hoverTheme },
    });
    expect(wrapper.classes()).toContain(`bk-button-hover-${hoverTheme}`);
    expect(wrapper.classes(`bk-button-${hoverTheme}`)).toBe(false);
  });

  it('renders size when passed', () => {
    const size = 'large';
    const wrapper = mount(BkButton, {
      props: { size },
    });
    expect(wrapper.classes()).toContain(`bk-button-${size}`);
  });

  it('it accepts valid theme props', () => {
    const validTypes = ['primary', 'warning', 'success', 'danger'];
    const { validator } = BkButton.props.theme;
    validTypes.forEach(valid => expect(validator(valid)).toBe(true));
    expect(validator('batman')).toBe(false);
  });

  it('it accepts valid hoverTheme props', () => {
    const validTypes = ['primary', 'warning', 'success', 'danger'];
    const { validator } = BkButton.props.hoverTheme;
    validTypes.forEach(valid => expect(validator(valid)).toBe(true));
    expect(validator('batman')).toBe(false);
  });

  it('it accepts valid size props', () => {
    const validTypes = ['small', 'large'];
    const { validator } = BkButton.props.size;
    validTypes.forEach(valid => expect(validator(valid)).toBe(true));
    expect(validator('batman')).toBe(false);
  });

  it('renders loading when passed', () => {
    const wrapper = mount(BkButton, {
      props: {
        loading: true,
      },
    });
    expect(wrapper.findComponent(BkLoading).exists()).toBe(true);
    expect(wrapper.findComponent(BkLoading).props('theme')).toMatch('default');
  });

  it('renders loading when passed with primary theme', () => {
    const wrapper = mount(BkButton, {
      props: {
        loading: true,
        theme: 'primary',
      },
    });
    expect(wrapper.findComponent(BkLoading).props('theme')).toMatch('white');
  });

  it('renders disabled when passed', () => {
    const wrapper = mount(BkButton, {
      props: {
        disabled: true,
      },
    });
    expect(wrapper.classes()).toContain('is-disabled');
  });

  it('renders outline when passed', () => {
    const wrapper = mount(BkButton, {
      props: {
        outline: true,
      },
    });
    expect(wrapper.classes()).toContain('is-outline');
  });


  it('renders text when passed', () => {
    const wrapper = mount(BkButton, {
      props: {
        text: true,
      },
    });
    expect(wrapper.classes()).toContain('is-text');
  });

  it('emit click event when click', async () => {
    const wrapper = mount(BkButton);
    wrapper.vm.$emit('click');
    wrapper.vm.$emit('click');

    expect(wrapper.emitted().click).toBeTruthy();
    expect(wrapper.emitted().click).toHaveLength(2);
  });

  it('call click handler when click', async () => {
    const clickHandler = jest.fn();
    const wrapper = mount(BkButton, {
      props: {
        onClick: clickHandler,
      },
    });

    await wrapper.trigger('click');

    expect(clickHandler).toHaveBeenCalled();
  });
});
