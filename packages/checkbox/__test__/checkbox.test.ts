/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
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
import { readFileSync } from 'fs';
import { resolve } from 'path';

import Checkbox from '../src/';

const components = {
  Checkbox,
};

describe('Checkbox', () => {
  const label = 'checkbox';
  it('slot', () => {
    const wrapper = mount({
      components,
      template: `<Checkbox label=${label}>${label}</Checkbox>`,
    });

    expect(wrapper.text()).toMatch(label);
    expect(wrapper.classes()).toContain('bk-checkbox');
  });

  it('label', () => {
    const wrapper = mount({
      components,
      template: `<Checkbox label=${label} />`,
    });

    expect(wrapper.text()).toMatch(label);
    expect(wrapper.classes()).toContain('bk-checkbox');
  });

  it('checked', () => {
    const wrapper = mount({
      components,
      template: `<Checkbox label=${label} checked />`,
    });
    expect(wrapper.text()).toMatch(label);
    expect(wrapper.classes()).toContain('is-checked');
  });

  it('disabled', () => {
    const wrapper = mount({
      components,
      template: `<Checkbox label=${label} disabled />`,
    });
    expect(wrapper.text()).toMatch(label);
    expect(wrapper.classes()).toContain('is-disabled');
    expect(wrapper.classes()).toContain('bk-checkbox');
  });

  it('indeterminate', () => {
    const wrapper = mount({
      components,
      template: `<Checkbox label=${label} indeterminate />`,
    });
    expect(wrapper.classes()).toContain('is-indeterminated');
    expect(wrapper.classes()).not.toContain('is-checked');
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined();
  });

  it('disabled checked keeps both states', () => {
    const wrapper = mount({
      components,
      template: `<Checkbox label=${label} disabled :model-value="true" />`,
    });
    expect(wrapper.classes()).toContain('is-disabled');
    expect(wrapper.classes()).toContain('is-checked');
    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
  });

  it('focus does not clear checked, disabled, or indeterminate', async () => {
    const wrapper = mount({
      components,
      template: `<Checkbox label=${label} disabled :model-value="true" indeterminate />`,
    });
    const before = wrapper.classes();
    await wrapper.find('input').trigger('focus');
    await wrapper.find('input').trigger('blur');
    expect(wrapper.classes()).toEqual(before);
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['is-disabled', 'is-checked', 'is-indeterminated']));
  });

  it('unchecked hover border uses the primary token and skips selected or disabled states', () => {
    const source = readFileSync(resolve(__dirname, '../src/checkbox.less'), 'utf8');
    expect(source).toContain('&:hover:not(.is-disabled):not(.is-checked):not(.is-indeterminated)');
    expect(source).toContain('border-color: @primary-color;');
  });
});
