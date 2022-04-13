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

import BkSelect from '../src';
import BkOption from '../src/option';
import BkOptionGroup from '../src/optionGroup';

describe('Select.tsx', () => {
  // 空Select是否正常渲染
  test('render empty select', async () => {
    const wrapper = await mount(BkSelect);
    expect(wrapper.classes()).toContain('bk-select');
    expect(wrapper.find('.bk-select-input').element.getAttribute('placeholder')).toBe('请选择');
    await wrapper.find('.bk-select-trigger').trigger('click');
    expect(wrapper.find('.bk-popover-content').element.hasAttribute('data-show')).toBeTruthy();
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
    expect(wrapper.find('.bk-popover-content').element.hasAttribute('data-show')).toBeFalsy();
  });

  // options渲染是否正常
  test('render options', async () => {
    const wrapper = await mount({
      components: {
        BkSelect,
        BkOption,
      },
      template: `
      <BkSelect>
        <BkOption value="test" label="label1"></BkOption>
        <BkOption :value="false" label="label2" disabled></BkOption>
        <BkOption :value="undefined" label="label3"></BkOption>
        <BkOption :value="1" label="label4"></BkOption>
        <BkOption :value="null" label="label5"></BkOption>
      </BkSelect>`,
    });
    const options = wrapper.element.querySelectorAll('.bk-select-option');
    const select = wrapper.findComponent({ name: 'Select' });
    const selectInstance = select.vm as InstanceType<typeof BkSelect>;
    expect(options.length).toBe(selectInstance.options.size);

    const optionInstances = wrapper.findAllComponents({ name: 'Option' });
    expect(optionInstances.filter(item => (item.vm as any).selected).length).toBe(1);
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
  });

  // 单选
  test('single select', async () => {});

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
          selectValue: ['test'],
        };
      },
    });
    expect(wrapper.findAllComponents('.is-selected.bk-select-option')).toHaveLength(2);
    expect(wrapper.findAllComponents({ name: 'Group' })).toHaveLength(2);
    await wrapper.findComponent({ name: 'Option' }).trigger('click');
    expect(wrapper.vm.selectValue).toEqual(['test']);
    const option =  wrapper.findAllComponents({ name: 'Option' })[5];
    await option.trigger('click');
    expect(wrapper.vm.selectValue).toHaveLength(0);
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
    expect(wrapper.findAll('.bk-option-group')).toHaveLength(2);
    expect(wrapper.find('.bk-select-content').isVisible()).toBe(false);
  });

  // 单选搜索功能
  test('single select search', async () => {
    // const wrapper = await mount({
    //   components: {
    //     BkSelect,
    //     BkOption,
    //   },
    //   template: `
    //     <BkSelect v-model="seletValue" filterable>
    //       <BkOption value="test" label="label1"></BkOption>
    //       <BkOption :value="false" label="label2" disabled></BkOption>
    //       <BkOption :value="undefined" label="label3"></BkOption>
    //       <BkOption :value="1" label="label4"></BkOption>
    //       <BkOption :value="null" label="label5"></BkOption>
    //     </BkSelect>
    //   `,
    //   data() {
    //     return {
    //       seletValue: '',
    //     };
    //   },
    // });

    // const { vm } = wrapper;
    // const select = wrapper.findComponent({ name: 'Select' }).vm as InstanceType<typeof BkSelect>;;
    // await wrapper.find('.bk-select-trigger').trigger('click');
    // select.searchKey = '2';
    // await vm.$nextTick();
    // const options = wrapper.findAll('.bk-select-option').filter(item => item.isVisible());
    // expect(options).toHaveLength(1);
    // expect(await options[0].trigger('click'));
    // expect(vm.seletValue).toBe('');
    // select.searchKey = 'LABEL1';
    // await vm.$nextTick();
    // const [matchOption] = wrapper.findAll('.bk-select-option').filter(item => item.isVisible());
    // await matchOption.trigger('click');
    // expect(vm.seletValue).toBe('test');
  });
});
