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

import BkDropdown from '../src';
import BkDropdownItem from '../src/dropdown-item';
import BkDropdownMenu from '../src/dropdown-menu';
const SLEEP_TIME = 50;
const sleep = (time = SLEEP_TIME) => new Promise(resolve => setTimeout(resolve, time));

const Mount = async (config: any) => await mount({
  components: {
    [BkDropdown.name]: BkDropdown,
    [BkDropdownMenu.name]: BkDropdownMenu,
    [BkDropdownItem.name]: BkDropdownItem,
  },
  ...config,
});

const DROPDOWN_TEXT = 'test dropdown';

describe('Dropdown.tsx', () => {
  it('renders when passed', async () => {
    const wrapper = await Mount({
      template: `
        <BkDropdown>
          <div class="trigger-text">${DROPDOWN_TEXT}</div>
          <BkDropdownMenu #content>
            <BkDropdownItem>item</BkDropdownItem>
          </BkDropdownMenu>
        </BkDropdown>`,
    });
    expect(wrapper.classes()).toContain('bk-dropdown');
    const content = wrapper.find('.bk-dropdown-content');
    expect(content.classes()).toContain('bk-dropdown-content');
    const triggerEl = wrapper.find('.bk-dropdown-reference');
    const triggerTextEL = triggerEl.find('.trigger-text');
    expect(triggerTextEL.classes()).toContain('trigger-text');
    expect(triggerTextEL.text()).toMatch(DROPDOWN_TEXT);
  });

  it('renders extCls when passed', async () => {
    const EXT_CLS = 'extCls-test';
    const wrapper = await Mount({
      template: `
        <BkDropdown extCls="${EXT_CLS}">
          <div class="trigger-text">${DROPDOWN_TEXT}</div>
          <BkDropdownMenu #content>
            <BkDropdownItem>item</BkDropdownItem>
          </BkDropdownMenu>
        </BkDropdown>`,
    });
    expect(wrapper.classes()).toContain(EXT_CLS);
  });

  it('renders hover when passed', async () => {
    const wrapper = await Mount({
      template: `
        <BkDropdown>
          <div>${DROPDOWN_TEXT}</div>
          <BkDropdownMenu #content>
            <BkDropdownItem>item</BkDropdownItem>
          </BkDropdownMenu>
        </BkDropdown>`,
    });
    const content = wrapper.find('.bk-dropdown-content');
    const triggerEl = wrapper.find('.bk-dropdown-reference');
    await triggerEl.trigger('mouseenter');
    expect(content.attributes()).toHaveProperty('data-show', '');
  });

  it('renders manual when passed', async () => {
    const wrapper = await Mount({
      template: `
        <BkDropdown trigger="manual" :isShow="isShow">
          <div class="trigger">${DROPDOWN_TEXT}</div>
          <BkDropdownMenu #content>
            <BkDropdownItem>item</BkDropdownItem>
          </BkDropdownMenu>
        </BkDropdown>`,
      data() {
        return {
          isShow: true,
        };
      },
    });
    const { vm } = wrapper;
    const content = wrapper.find('.bk-dropdown-content');
    expect(content.attributes()).toHaveProperty('data-show', '');
    await sleep();
    vm.isShow = false;
    await sleep();
    expect(content.attributes()).not.toHaveProperty('data-show', '');
  });
});
