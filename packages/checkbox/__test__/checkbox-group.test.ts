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

import Checkbox from '../src/checkbox';
import CheckboxGroup from '../src/checkbox-group';

const components = {
  CheckboxGroup,
  Checkbox,
};

describe('CheckboxGroup', () => {
  it('slot Checkbox', () => {
    const wrapper = mount({
      components,
      template: `
      <CheckboxGroup>
        <Checkbox label="选项一" />
        <Checkbox label="选项二" />
        <Checkbox label="选项三" />
      </CheckboxGroup>`,
    });
    expect(wrapper.classes()).toContain('bk-checkbox-group');
    expect(wrapper.findAll('.bk-checkbox')).toHaveLength(3);
  });
  it('disabled', () => {
    const wrapper = mount({
      components,
      template: `<CheckboxGroup disabled>
        <Checkbox label="选项一" />
        <Checkbox label="选项二" />
        <Checkbox label="选项三" />
      </CheckboxGroup>`,
    });
    expect(wrapper.classes()).toContain('bk-checkbox-group');
    expect(wrapper.findAll('.is-disabled')).toHaveLength(3);
  });
  it('modelValue', () => {
    const label = '选项一';
    const wrapper = mount({
      components,
      template: `
      <CheckboxGroup :modelValue="['${label}']">
        <Checkbox label="${label}" />
        <Checkbox label="选项二" />
        <Checkbox label="选项三" />
      </CheckboxGroup>`,
    });
    const target = wrapper.findAll('.bk-checkbox.is-checked');
    expect(target).toHaveLength(1);
    expect(target[0].text()).toMatch(label);
  });
});
