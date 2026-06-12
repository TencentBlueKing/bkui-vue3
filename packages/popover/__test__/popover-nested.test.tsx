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

import { nextTick } from 'vue';

import { mount } from '@vue/test-utils';
import ResizeObserver from 'resize-observer-polyfill';

import Dialog from '@bkui-vue/dialog';
import Popover from '@bkui-vue/popover';
import Select from '@bkui-vue/select';
import Sideslider from '@bkui-vue/sideslider';
import Option from '../../select/src/option';

jest.setTimeout(10000);
// Select 内部依赖 ResizeObserver
window.ResizeObserver = ResizeObserver as any;

const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

const isPopoverVisible = (el: Element | null) => {
  if (!(el instanceof HTMLElement)) return false;
  return !el.classList.contains('hidden');
};

describe('Popover nested interactions', () => {
  afterEach(() => {
    // 兜底清理：Teleport 内容挂在 body 下
    document.body.innerHTML = '';
  });

  it('Dialog + Popover(content has Select): click select dropdown should not close parent popover', async () => {
    const wrapper = mount({
      components: { Dialog, Popover, Select, Option },
      template: `
        <Dialog v-model:isShow="show" :quickClose="false" :transfer="true">
          <Popover extCls="parent-pop" trigger="click" :popoverDelay="0">
            <button class="open-parent">open</button>
            <template #content>
              <Select>
                <Option :id="1" name="选项1" />
                <Option :id="2" name="选项2" />
              </Select>
            </template>
          </Popover>
        </Dialog>
      `,
      data() {
        return { show: true };
      },
    });

    // Modal/Dialog 通过 setTimeout(0) 打开
    await sleep(20);
    await nextTick();

    (document.querySelector('.open-parent') as HTMLElement).click();
    await nextTick();
    await sleep(0);

    const parent = document.querySelector('.parent-pop');
    expect(parent).toBeTruthy();
    expect(isPopoverVisible(parent)).toBe(true);

    // 打开 Select 下拉（会 Teleport 到 body）
    (parent as HTMLElement).querySelector('.bk-select-trigger')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await sleep(20);
    await nextTick();

    const selectDropdown = document.querySelector('.bk-select-popover');
    expect(selectDropdown).toBeTruthy();
    expect(isPopoverVisible(selectDropdown)).toBe(true);
    // 关键断言：父 popover 不应被当成 clickoutside 而关闭
    expect(isPopoverVisible(parent)).toBe(true);

    // 点击下拉选项（发生在“子 popover”内容区）
    (selectDropdown as HTMLElement).querySelector('.bk-select-option')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();
    await sleep(0);

    expect(isPopoverVisible(parent)).toBe(true);
    wrapper.unmount();
  });

  it('Sideslider + Popover(content has Select): click select dropdown should not close parent popover', async () => {
    const wrapper = mount({
      components: { Sideslider, Popover, Select, Option },
      template: `
        <Sideslider v-model:isShow="show" :quickClose="false" :transfer="true" title="slider">
          <Popover extCls="slider-parent-pop" trigger="click" :popoverDelay="0">
            <button class="open-slider-parent">open</button>
            <template #content>
              <Select>
                <Option :id="1" name="选项1" />
                <Option :id="2" name="选项2" />
              </Select>
            </template>
          </Popover>
        </Sideslider>
      `,
      data() {
        return { show: true };
      },
    });

    await sleep(30);
    await nextTick();

    (document.querySelector('.open-slider-parent') as HTMLElement).click();
    await nextTick();
    await sleep(0);

    const parent = document.querySelector('.slider-parent-pop');
    expect(parent).toBeTruthy();
    expect(isPopoverVisible(parent)).toBe(true);

    (parent as HTMLElement).querySelector('.bk-select-trigger')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await sleep(20);
    await nextTick();

    const selectDropdown = document.querySelector('.bk-select-popover');
    expect(selectDropdown).toBeTruthy();
    expect(isPopoverVisible(selectDropdown)).toBe(true);
    expect(isPopoverVisible(parent)).toBe(true);

    (selectDropdown as HTMLElement).querySelector('.bk-select-option')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();
    await sleep(0);

    expect(isPopoverVisible(parent)).toBe(true);
    wrapper.unmount();
  });

  it('Dialog + Select: selecting option should not close dialog', async () => {
    const wrapper = mount({
      components: { Dialog, Select, Option },
      template: `
        <Dialog v-model:isShow="show" :quickClose="true" :transfer="true" title="dialog">
          <Select>
            <Option :id="1" name="选项1" />
            <Option :id="2" name="选项2" />
          </Select>
        </Dialog>
      `,
      data() {
        return { show: true };
      },
    });

    await sleep(20);
    await nextTick();

    // 打开下拉并选择
    (document.querySelector('.bk-select-trigger') as HTMLElement).click();
    await sleep(20);
    await nextTick();

    (document.querySelector('.bk-select-popover .bk-select-option') as HTMLElement).click();
    await nextTick();
    await sleep(0);

    // dialog 仍应处于显示状态
    expect((wrapper.vm as any).show).toBe(true);
    const dialogWrapper = document.querySelector('.bk-modal-wrapper');
    expect(dialogWrapper).toBeTruthy();
    wrapper.unmount();
  });

  it('Hover Popover(content has Select): click on dropdown should not close parent, outside click should close', async () => {
    const wrapper = mount({
      components: { Popover, Select, Option },
      template: `
        <Popover
          extCls="hover-parent"
          trigger="hover"
          :popoverDelay="0"
        >
          <button class="hover-btn">hover</button>
          <template #content>
            <Select>
              <Option :id="1" name="选项1" />
              <Option :id="2" name="选项2" />
            </Select>
          </template>
        </Popover>
      `,
    });

    // 打开 hover popover（mouseenter 不冒泡，需触发在 reference wrapper 上）
    await nextTick();
    const hoverBtnWrapper = wrapper.find('.hover-btn');
    expect(hoverBtnWrapper.exists()).toBe(true);
    const hoverBtn = hoverBtnWrapper.element as HTMLElement;
    const hoverRef = hoverBtn.parentElement as HTMLElement;
    expect(hoverRef).toBeTruthy();
    hoverRef.dispatchEvent(new MouseEvent('mouseenter'));
    await nextTick();
    await sleep(0);

    const parent = document.querySelector('.hover-parent') as HTMLElement;
    expect(parent).toBeTruthy();
    expect(isPopoverVisible(parent)).toBe(true);

    // 打开 Select 下拉
    parent.querySelector('.bk-select-trigger')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await sleep(20);
    await nextTick();

    const selectDropdown = document.querySelector('.bk-select-popover') as HTMLElement;
    expect(selectDropdown).toBeTruthy();
    expect(isPopoverVisible(selectDropdown)).toBe(true);

    // 点击下拉选项（发生在“子 popover”内容区），父 hover popover 不应被当成 clickoutside 而关闭
    selectDropdown.querySelector('.bk-select-option')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();
    await sleep(0);

    // 关键断言：父 popover 仍保持显示
    expect(isPopoverVisible(parent)).toBe(true);

    wrapper.unmount();
  });
});

