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

import ResizeObserver from 'resize-observer-polyfill';
import { nextTick } from 'vue';

import { mount } from '@vue/test-utils';

import BkSelect from '../src';
import BkOption from '../src/option';
import BkOptionGroup from '../src/optionGroup';

jest.setTimeout(6000);
window.ResizeObserver = ResizeObserver;
describe('Select.tsx', () => {
  // 空Select是否正常渲染
  test('render empty select', async () => {
    const wrapper = await mount(BkSelect);
    expect(wrapper.classes()).toContain('bk-select');
    expect(wrapper.find('.bk-input--text').element.getAttribute('placeholder')).toBe('请选择');
    await wrapper.find('.bk-select-trigger').trigger('click');
    const popover = document.querySelector('.bk-pop2-content');
    expect(window.getComputedStyle(popover).display).toBe('block');
    wrapper.unmount();
  });

  // 下拉是否正常
  test('toggle dropdown', async () => {
    const wrapper = await mount(BkSelect);
    const select = wrapper.getComponent({ name: 'Select' });
    const vm = select.vm as InstanceType<typeof BkSelect>;
    // 显示下拉列表
    await wrapper.find('.bk-select-trigger').trigger('click');
    expect(vm.isPopoverShow).toBeTruthy();
    expect(wrapper.classes()).toContain('popover-show');
    // 隐藏下拉列表
    await wrapper.find('.bk-select-trigger').trigger('click');
    expect(vm.isPopoverShow).toBeFalsy();
    // 禁用select
    await wrapper.setProps({
      disabled: true,
    });
    await wrapper.find('.bk-select-trigger').trigger('click');
    expect(vm.isPopoverShow).toBeFalsy();
    wrapper.unmount();
  });

  // options渲染是否正常
  test('render options', async () => {
    const wrapper = await mount({
      components: {
        BkSelect,
        BkOption,
      },
      template: `
      <BkSelect v-model="value">
        <BkOption value="test" label="label1"></BkOption>
        <BkOption :value="false" label="label2" disabled></BkOption>
        <BkOption :value="undefined" label="label3"></BkOption>
        <BkOption :value="1" label="label4"></BkOption>
        <BkOption :value="null" label="label5"></BkOption>
      </BkSelect>`,
      data() {
        return {
          value: 'test',
        };
      },
    });
    const options = document.querySelectorAll('.bk-select-option');
    const select = wrapper.findComponent({ name: 'Select' });
    const selectInstance = select.vm as InstanceType<typeof BkSelect>;
    expect(options.length).toBe(selectInstance.options.length);

    const optionInstances = wrapper.findAllComponents({ name: 'Option' });
    expect(optionInstances.filter(item => (item.vm as any).selected).length).toBe(1);
    wrapper.unmount();
  });

  // 多选
  test('multiple select', async () => {
    const wrapper = await mount({
      components: {
        BkSelect,
        BkOption,
      },
      template: `
      <BkSelect v-model="this.selectValue" multiple>
        <BkOption v-for="item in options"
          :key="item.value"
          :value="item.value"
          :label="item.label"
          :disabled="item.disabled">
        </BkOption>
      </BkSelect>`,
      data() {
        return {
          options: [
            {
              value: 1,
              label: '标签1',
            },
            {
              value: 'str',
              label: '标签2',
              disabled: true,
            },
            {
              value: undefined,
              label: '标签3',
            },
            {
              value: null,
              label: '标签4',
            },
          ],
          selectValue: [],
        };
      },
    });
    const optionInstances = wrapper.findAllComponents({ name: 'Option' });
    for (const item of optionInstances) {
      await item.trigger('click');
    }
    expect(wrapper.vm.selectValue).toEqual([1, undefined, null]);
    wrapper.unmount();
  });

  // 单选
  test('single select', async () => {
    const wrapper = await mount({
      components: {
        BkSelect,
        BkOption,
      },
      template: `
        <BkSelect v-model="seletValue">
          <BkOption v-for="item in options" :value="item.value" :label="item.label"></BkOption>
        </BkSelect>
      `,
      data() {
        return {
          seletValue: 1,
          options: [
            {
              value: 1,
              label: 'test1',
            },
            {
              value: 2,
              label: 'test2',
            },
          ],
        };
      },
    });
    const options = wrapper.findAllComponents({ name: 'Option' });
    options[1].trigger('click');
    expect(wrapper.vm.seletValue).toBe(2);
    wrapper.unmount();
  });

  // 分组
  test('group select', async () => {
    const wrapper = await mount({
      components: {
        BkSelect,
        BkOption,
        BkOptionGroup,
      },
      template: `
          <BkSelect v-model="this.selectValue" :filterable="false" multiple>
            <BkOptionGroup label="分组1">
              <BkOption value="test" label="label1"></BkOption>
              <BkOption :value="false" label="label2"></BkOption>
              <BkOption :value="undefined" label="label3"></BkOption>
              <BkOption :value="1" label="label4">测试label测试label测试label测试label测试label测试label测试label测试label测试label测试label测试label测试label</BkOption>
              <BkOption :value="null" label="label5"></BkOption>
            </BkOptionGroup>
            <BkOptionGroup label="分组2">
              <BkOption value="test" label="label6"></BkOption>
              <BkOption value="2" label="label7"></BkOption>
              <BkOption value="3" label="label8"></BkOption>
              <BkOption value="4" label="label9">测试label</BkOption>
            </BkOptionGroup>
          </BkSelect>
      `,
      data() {
        return {
          selectValue: [],
        };
      },
    });
    expect(wrapper.findAllComponents({ name: 'OptionGroup' })).toHaveLength(2);
    await wrapper.findComponent({ name: 'Option' }).trigger('click');
    expect(wrapper.findAllComponents('.is-selected.bk-select-option')).toHaveLength(2);
    expect(wrapper.vm.selectValue).toEqual(['test']);
    const option =  wrapper.findAllComponents({ name: 'Option' })[5];
    await option.trigger('click');
    expect(wrapper.vm.selectValue).toHaveLength(0);
    wrapper.unmount();
  });

  // 空组是否渲染正常
  test('render empty group', async () => {
    const wrapper = await mount({
      components: {
        BkSelect,
        BkOptionGroup,
      },
      template: `
        <BkSelect>
          <BkOptionGroup label="分组1">
          </BkOptionGroup>
          <BkOptionGroup label="分组2">
          </BkOptionGroup>
        </BkSelect>
      `,
    });
    expect(document.getElementsByClassName('bk-option-group')).toHaveLength(2);
    wrapper.unmount();
  });

  test('model value change', async () => {
    const wrapper = await mount({
      components: {
        BkSelect,
        BkOption,
      },
      template: `
        <BkSelect :model-value="seletValue">
          <BkOption v-for="item in options" :value="item.value" :label="item.label"></BkOption>
        </BkSelect>
      `,
      data() {
        const options = [];
        for (let i = 0; i < 10; i++) {
          options.push({
            label: `${i}-test`,
            value: i,
          });
        }
        return {
          seletValue: 1,
          options,
        };
      },
    });
    const { vm } = wrapper;
    vm.seletValue = 2;
    await vm.$nextTick();
    expect(wrapper.find<HTMLInputElement>('.bk-select-trigger .bk-input--text').element.value).toBe('2-test');
    wrapper.unmount();
  });

  test('options change', async () => {
    const wrapper = await mount({
      components: {
        BkSelect,
        BkOption,
      },
      template: `
        <BkSelect :model-value="seletValue">
          <BkOption v-for="item in options" :value="item.value" :label="item.label"></BkOption>
        </BkSelect>
      `,
      data() {
        return {
          seletValue: 1,
          options: [],
        };
      },
    });
    expect(wrapper.find<HTMLInputElement>('.bk-select-trigger .bk-input--text').element.value).toBe('1');
    const { vm } = wrapper;
    for (let i = 0; i < 10; i++) {
      vm.options.push({
        label: `${i}-test`,
        value: i,
      });
    }
    await vm.$nextTick();
    expect(wrapper.find<HTMLInputElement>('.bk-select-trigger .bk-input--text').element.value).toBe('1-test');
    wrapper.unmount();
  });

  // tag 删除功能
  test('select tag remove', async () => {
    const wrapper = await mount({
      components: {
        BkSelect,
        BkOption,
      },
      template: `
        <BkSelect v-model="seletValue" multiple multiple-mode="tag">
          <BkOption v-for="item in options" :value="item.value" :label="item.label"></BkOption>
        </BkSelect>
      `,
      data() {
        return {
          seletValue: [1, 2],
          options: [
            {
              value: 1,
              label: 'test1',
            },
            {
              value: 2,
              label: 'test2',
            },
          ],
        };
      },
    });
    const tags = wrapper.findAllComponents('.bk-tag');
    expect(tags).toHaveLength(2);
    tags[0].find('.bk-tag-close').trigger('click');
    expect(wrapper.vm.seletValue).toEqual([2]);
    wrapper.unmount();
  });

  // 搜索功能
  test('select search', (done) => {
    const wrapper = mount({
      components: {
        BkSelect,
        BkOption,
      },
      template: `
        <BkSelect v-model="seletValue" filterable>
          <BkOption v-for="item in options" :value="item.value" :label="item.label"></BkOption>
        </BkSelect>
      `,
      data() {
        return {
          seletValue: '',
          options: [
            {
              value: 1,
              label: 'test1',
            },
            {
              value: 2,
              label: 'test2',
            },
            {
              value: 3,
              label: 'test2',
            },
            {
              value: 4,
              label: 'test4',
            },
          ],
        };
      },
    });
    const input = wrapper.find('input[type="text"]');
    input.setValue('test2');
    const select = wrapper.findComponent(BkSelect);
    setTimeout(() => {
      expect(select.vm.searchKey).toBe('test2');
      expect(wrapper.findAllComponents({ name: 'Option' }).filter(com => com.vm.visible).length).toBe(2);
      wrapper.unmount();
      done();
    }, 400);
  });

  // 下拉框搜索测试
  test('select input search', (done) => {
    const wrapper = mount({
      components: {
        BkSelect,
        BkOption,
      },
      template: `
        <BkSelect v-model="seletValue" :input-search="false" multiple filterable multiple-mode="tag">
          <BkOption v-for="item in options" :value="item.value" :label="item.label"></BkOption>
        </BkSelect>
      `,
      data() {
        return {
          seletValue: '',
          options: [
            {
              value: 1,
              label: 'test1',
            },
            {
              value: 2,
              label: 'test2',
            },
            {
              value: 3,
              label: 'test2',
            },
            {
              value: 4,
              label: 'test4',
            },
          ],
        };
      },
    });
    const input = wrapper.findComponent({ name: 'PopContent' }).find('.bk-select-search-input');
    input.setValue('test4');
    const select = wrapper.findComponent(BkSelect);
    setTimeout(() => {
      expect(select.vm.searchKey).toBe('test4');
      expect(wrapper.findAllComponents({ name: 'Option' }).filter(com => com.vm.visible).length).toBe(1);
      wrapper.unmount();
      done();
    }, 400);
  });

  // 虚拟滚动功能
  test('virtual select', async () => {
    const wrapper = await mount(BkSelect, {
      props: {
        enableVirtualRender: true,
        list: new Array(1000000).fill('')
          .map((_, index) => ({ value: index, label: `测试数据${index}` })),
      },
    });
    expect(wrapper.findAllComponents(BkOption).length).toBeLessThan(10);
    wrapper.unmount();
  });

  // 测试多选禁用态
  test('disabled multiple select', async () => {
    const wrapper = await mount({
      components: {
        BkSelect,
        BkOption,
      },
      template: `
        <BkSelect v-model="seletValue" disabled multiple multiple-mode="tag">
          <BkOption v-for="item in options" :value="item.value" :label="item.label"></BkOption>
        </BkSelect>
      `,
      data() {
        return {
          seletValue: [1, 2],
          options: [
            {
              value: 1,
              label: 'test1',
            },
            {
              value: 2,
              label: 'test2',
            },
          ],
        };
      },
    });
    await wrapper.find('.bk-select-trigger').trigger('click');
    expect(wrapper.findComponent(BkSelect).vm.isPopoverShow).toBeFalsy();
    const tag = wrapper.findComponent('.bk-tag');
    await tag.find('.bk-tag-close').trigger('click');
    expect(wrapper.vm.seletValue).toEqual([1, 2]);
    wrapper.unmount();
  });

  // 测试单选禁用态
  test('disabled single select', async () => {
    const wrapper = await mount({
      components: {
        BkSelect,
        BkOption,
      },
      template: `
        <BkSelect v-model="seletValue" disabled>
          <BkOption v-for="item in options" :value="item.value" :label="item.label"></BkOption>
        </BkSelect>
      `,
      data() {
        return {
          seletValue: '',
          options: [
            {
              value: 1,
              label: 'test1',
            },
            {
              value: 2,
              label: 'test2',
            },
          ],
        };
      },
    });
    await wrapper.find('.bk-select-trigger').trigger('click');
    expect(wrapper.findComponent(BkSelect).vm.isPopoverShow).toBeFalsy();
    // expect(wrapper.findAllComponents({ name: 'PopContent' })).toHaveLength(1);
    // expect(wrapper.findComponent({ name: 'PopContent' }).isVisible()).toBe(false);
    const option = wrapper.findComponent(BkOption);
    await option.trigger('click');
    expect(wrapper.vm.seletValue).toBe('');
    wrapper.unmount();
  });

  // 测试重置modelValue
  test('reset model value', async () => {
    const wrapper = await mount({
      components: {
        BkSelect,
        BkOption,
      },
      template: `
        <BkSelect v-model="seletValue">
          <BkOption v-for="item in options" :value="item.value" :label="item.label"></BkOption>
        </BkSelect>
      `,
      data() {
        return {
          seletValue: 'test1',
          options: [
            {
              value: 'test1',
              label: 'test1',
            },
            {
              value: 'test2',
              label: 'test2',
            },
          ],
        };
      },
    });
    wrapper.vm.seletValue = '';
    await nextTick();
    expect((wrapper.find('input[type="text"]').element as any).value).toBe('');
    wrapper.unmount();
  });
});
