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

import RadioButton from '../src/radio-button';

const components = {
  RadioButton,
};

describe('RadioButton', () => {
  const label = 'radio-button';
  it('slot', () => {
    const wrapper = mount({
      components,
      template: `<RadioButton label=${label}>${label}</RadioButton>`,
    });

    expect(wrapper.text()).toMatch(label);
    expect(wrapper.classes()).toContain('bk-radio-button');
  });

  it('label', () => {
    const wrapper = mount({
      components,
      template: `<RadioButton label=${label} />`,
    });

    expect(wrapper.text()).toMatch(label);
    expect(wrapper.classes()).toContain('bk-radio-button');
  });

  it('checked', () => {
    const wrapper = mount({
      components,
      template: `<RadioButton label=${label} checked />`,
    });
    expect(wrapper.text()).toMatch(label);
    expect(wrapper.classes()).toContain('is-checked');
  });

  it('disabled', () => {
    const wrapper = mount({
      components,
      template: `<RadioButton label=${label} disabled />`,
    });
    expect(wrapper.text()).toMatch(label);
    expect(wrapper.classes()).toContain('is-disabled');
    expect(wrapper.classes()).toContain('bk-radio-button');
  });

  // it('change event', async () => {
  //   const wrapper = mount({
  //     components,
  //     template: `
  //       <div>
  //         <RadioButton v-model="data" label=${label} @change="handleChange" />
  //       </div>
  //     `,
  //     data() {
  //       return {
  //         data: '',
  //       };
  //     },
  //     methods: {
  //       handleChange(value) {
  //         console.log(value);
  //       },
  //     },
  //   });
  //   const target = wrapper.find('.bk-radio-button');
  //   await target.trigger('click');
  //   const vm = wrapper.vm as any;
  //   expect(vm.data).toEqual(label);
  // });
});
