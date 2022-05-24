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

import Radio from '../src/radio';
import RadioButton from '../src/radio-button';
import RadioGroup from '../src/radio-group';

const components = {
  RadioGroup,
  Radio,
  RadioButton,
};

describe('RadioGroup', () => {
  it('slot Radio', () => {
    const wrapper = mount({
      components,
      template: `
      <RadioGroup>
        <Radio label="选项一" />
        <Radio label="选项二" />
        <Radio label="选项三" />
      </RadioGroup>`,
    });
    expect(wrapper.classes()).toContain('bk-radio-group');
    expect(wrapper.findAll('.bk-radio')).toHaveLength(3);
  });

  it('slot RadioButton', () => {
    const wrapper = mount({
      components,
      template: `<RadioGroup>
        <RadioButton label="选项一" />
        <RadioButton label="选项二" />
        <RadioButton label="选项三" />
      </RadioGroup>`,
    });
    expect(wrapper.classes()).toContain('bk-radio-group');
    expect(wrapper.findAll('.bk-radio-button')).toHaveLength(3);
  });

  it('disabled', () => {
    const wrapper = mount({
      components,
      template: `<RadioGroup disabled>
        <Radio label="选项一" />
        <Radio label="选项二" />
        <Radio label="选项三" />
      </RadioGroup>`,
    });
    expect(wrapper.classes()).toContain('bk-radio-group');
    expect(wrapper.findAll('.is-disabled')).toHaveLength(3);
  });

  it('modelValue', async () => {
    const label = '选项一';
    const wrapper = await mount({
      components,
      template: `<RadioGroup modelValue=${label}>
        <Radio label="${label}" />
        <Radio label="选项二" />
        <Radio label="选项三" />
      </RadioGroup>`,
    });
    expect(wrapper.classes()).toContain('bk-radio-group');
    expect(wrapper.find('.bk-radio.is-checked').text()).toBe(label);
  });
});
