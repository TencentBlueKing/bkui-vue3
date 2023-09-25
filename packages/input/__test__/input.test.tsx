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

import Input from '../src/index';
describe('Input', () => {
  it('renders correctly', () => {
    const wrapper = mount({
      render() {
        return <Input />;
      },
    });
    expect(wrapper.classes()).toContain('bk-input');
  });

  it('renders with prefix props', () => {
    const prefix = 'http:';
    const wrapper = mount({
      render() {
        return <Input prefix={prefix} />;
      },
    });

    expect(wrapper.find('.bk-input--prefix-area').exists()).toBe(true);
    expect(wrapper.find('.bk-input--prefix-area--text').text()).toEqual(prefix);
  });

  it('renders with prefix slot', () => {
    const prefix = 'http:';
    const wrapper = mount({
      render() {
        return (
          <Input prefix={prefix}>
            {{
              prefix: () => <span class='bk-input-prefix'>{prefix}</span>,
            }}
          </Input>
        );
      },
    });
    expect(wrapper.find('.bk-input--prefix-area').exists()).toBe(false);
    expect(wrapper.find('.bk-input-prefix').text()).toEqual(prefix);
  });
  it('renders with suffix props', () => {
    const suffix = '@qq.com';
    const wrapper = mount({
      render() {
        return <Input suffix={suffix} />;
      },
    });

    expect(wrapper.find('.bk-input--suffix-area').exists()).toBe(true);
    expect(wrapper.find('.bk-input--suffix-area--text').text()).toEqual(suffix);
  });

  it('renders with suffix slot', () => {
    const suffix = '@qq.com';
    const wrapper = mount({
      render() {
        return (
          <Input>
            {{
              suffix: () => <span class='bk-input-suffix'>{suffix}</span>,
            }}
          </Input>
        );
      },
    });

    expect(wrapper.find('.bk-input--suffix-area').exists()).toBe(false);
    expect(wrapper.find('.bk-input-suffix').text()).toEqual(suffix);
  });

  it('renders with clearable', async () => {
    const demo = 'hello';
    const wrapper = mount(Input, {
      props: {
        clearable: true,
        modelValue: demo,
      },
    });

    expect(wrapper.find('input').element.value).toBe(demo);
    await wrapper.find('.bk-input--suffix-icon').trigger('click');

    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted()['update:modelValue'][0][0]).toBe('');
  });

  it('renders with search input', () => {
    const wrapper = mount({
      render() {
        return (
          <Input
            type='search'
            modelValue='hello'
          ></Input>
        );
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('focus status', async () => {
    const handleFocused = jest.fn();
    const handleBlur = jest.fn();
    const wrapper = mount(Input, {
      props: {
        onFocus: handleFocused,
        onBlur: handleBlur,
      },
    });
    await wrapper.find('input').trigger('focus');
    expect(wrapper.classes('is-focused')).toBe(true);
    expect(handleFocused).toBeCalled();
    expect(wrapper.emitted()).toHaveProperty('focus');

    await wrapper.find('input').trigger('blur');
    expect(wrapper.classes('is-focused')).toBe(false);
    expect(handleBlur).toBeCalled();
    expect(wrapper.emitted()).toHaveProperty('blur');
  });

  it('status check', async () => {
    const wrapper = mount(Input);
    await wrapper.setProps({
      disabled: true,
      readonly: false,
    });
    expect(wrapper.classes('is-disabled')).toBe(true);
    expect(wrapper.classes('is-readonly')).toBe(false);

    await wrapper.setProps({
      disabled: false,
      readonly: true,
    });
    expect(wrapper.classes('is-readonly')).toBe(true);
    expect(wrapper.classes('is-disabled')).toBe(false);
  });

  it('renders with event', async () => {
    const val = 'hello';
    const wrapper = mount(Input, {
      props: {
        clearable: true,
        modelValue: '',
      },
    });

    wrapper.find('input').setValue(val);
    expect(wrapper.find('input').element.value).toBe(val);

    expect(wrapper.emitted()).toHaveProperty('input');
    expect(wrapper.emitted().change[0][0]).toBe(val);
    expect(wrapper.emitted()['update:modelValue'][0][0]).toBe(val);
  });

  it('renders with password type', async () => {
    const wrapper = mount(Input, {
      props: {
        type: 'password',
        modelValue: 'password',
      },
    });

    await wrapper.find('.bk-input--suffix-icon').trigger('click');
    expect(wrapper.find('input').element.type).toBe('text');
    await wrapper.find('.bk-input--suffix-icon').trigger('click');
    expect(wrapper.find('input').element.type).toBe('password');
  });

  it('renders with number type', async () => {
    const wrapper = mount(Input, {
      props: {
        type: 'number',
        modelValue: 0,
        showControl: false,
      },
    });

    expect(wrapper.find('.bk-input--number-control').exists()).toBe(false);

    await wrapper.setProps({
      showControl: true,
    });
    expect(wrapper.find('.bk-input--number-control').exists()).toBe(true);
    const spans = wrapper.findAll('.bk-input--number-control span');
    await spans[0].trigger('click');
    expect(wrapper.emitted()).toHaveProperty('update:modelValue');
    expect(wrapper.emitted()['update:modelValue'][0][0]).toBe(1);

    await wrapper.setProps({
      modelValue: 1,
    });
    await spans[1].trigger('click');
    expect(wrapper.emitted()['update:modelValue'].length).toEqual(2);
    expect(wrapper.emitted()['update:modelValue'][1][0]).toBe(0);

    await wrapper.setProps({
      max: 100,
      min: 0,
      step: 1,
      modelValue: 0,
    });
    await spans[1].trigger('click');
    expect(wrapper.emitted()['update:modelValue'].length).toEqual(3);
    expect(wrapper.emitted()['update:modelValue'][2][0]).toBe(0);

    await wrapper.setProps({
      modelValue: 100,
    });
    await spans[0].trigger('click');
    expect(wrapper.emitted()['update:modelValue'].length).toEqual(4);
    expect(wrapper.emitted()['update:modelValue'][3][0]).toBe(100);

    await wrapper.setProps({
      modelValue: 0,
    });
    await spans[1].trigger('click');
    expect(wrapper.emitted()['update:modelValue'].length).toEqual(5);
    expect(wrapper.emitted()['update:modelValue'][4][0]).toBe(0);

    const handleChange = jest.fn();
    const handleInput = jest.fn();
    await wrapper.setProps({
      modelValue: 1.21,
      precision: 2,
      onInput: handleInput,
      onChange: handleChange,
    });

    await wrapper.find('input').setValue(2.3333);
    expect(wrapper.emitted()['update:modelValue'][5][0]).toBe(2.3333);
    expect(handleInput).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalled();
    await wrapper.setProps({
      precision: 'test',
    });
    await spans[0].trigger('click');
    expect(wrapper.emitted()['update:modelValue'].length).toEqual(7);
    expect(wrapper.emitted()['update:modelValue'][6][0]).toBe(2);

    await wrapper.setProps({
      precision: 0,
    });
    await spans[0].trigger('click');
    expect(wrapper.emitted()['update:modelValue'].length).toEqual(8);
    expect(wrapper.emitted()['update:modelValue'][7][0]).toBe(2);
  });

  it('render with maxlength & showWordLimit', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'demo',
        showWordLimit: true,
        maxlength: 10,
      },
    });

    expect(wrapper.find('.bk-input--max-length').exists()).toBe(true);
    await wrapper.setProps({
      showWordLimit: false,
    });
    expect(wrapper.find('.bk-input--max-length').exists()).toBe(false);
  });

  it('render with textarea & showWordLimit', async () => {
    const wrapper = mount(Input, {
      props: {
        type: 'textarea',
        modelValue: 'demo',
        maxlength: 10,
      },
    });

    expect(wrapper.find('.bk-textarea--max-length').exists()).toBe(true);
    expect(wrapper.find('.bk-textarea').exists()).toBe(true);
  });
});
