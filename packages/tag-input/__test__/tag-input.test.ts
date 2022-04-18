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

import TagInput from '../src';

const list = [
  { id: 'shenzhen', name: '深圳' },
  { id: 'guangzhou', name: '广州' },
  { id: 'beijing', name: '北京' },
  { id: 'shanghai', name: '上海' },
  { id: 'hangzhou', name: '杭州' },
  { id: 'nanjing', name: '南京' },
  { id: 'chongqing', name: '重庆' },
  { id: 'taibei', name: '台北' },
  { id: 'haikou', name: '海口' },
  { id: 'shenyang', name: '沈阳' },
  { id: 'chengdu', name: '成都' },
];

const groupList = [
  {
    id: '1',
    name: '华中地区',
    children: [
      { id: '1-1', name: '河南省' },
      { id: '1-2', name: '湖北省' },
      { id: '1-3', name: '湖南省' },
    ],
  },
  {
    id: '2',
    name: '华北地区',
    children: [
      { id: '2-1', name: '北京市' },
      { id: '2-2', name: '天津市' },
      { id: '2-3', name: '河北省' },
    ],
  },
  {
    id: '3',
    name: '华南地区',
    children: [
      { id: '3-1', name: '广东省' },
      { id: '3-2', name: '海南省' },
    ],
  },
];

jest.useFakeTimers();
describe('TagInput.tsx', () => {
  it('test some base props', async () => {
    const tags = ['shenzhen'];
    const placeholder = 'Place enter';
    const wrapper = await mount(TagInput, {
      props: {
        list,
        modelValue: tags,
        trigger: 'focus',
        placeholder,
      },
    });

    // trigger
    await wrapper.find('.bk-tag-input').trigger('click');
    expect(wrapper.findAll('.bk-selector-list-item')).toHaveLength(list.length - tags.length);

    // placeholder
    expect(wrapper.find('.placeholder').text()).toEqual(placeholder);

    // show-clear-only-hover
    expect(wrapper.find('.clear-icon').exists()).toBe(true);
    await wrapper.setProps({ 'show-clear-only-hover': true });
    expect(wrapper.find('.clear-icon').exists()).toBe(false);
    await wrapper.find('.bk-tag-input').trigger('mouseenter');
    expect(wrapper.find('.clear-icon').exists()).toBe(true);

    // left-space
    const leftSpace = 20;
    await wrapper.setProps({ leftSpace });
    expect(wrapper.find('.tag-list').element.getAttribute('style')).toEqual(`margin-left: ${leftSpace}px;`);

    // content-max-height
    const contentMaxHeight = 600;
    await wrapper.setProps({ contentMaxHeight });
    expect(wrapper.find('.outside-ul').element.getAttribute('style')).toEqual(`max-height: ${contentMaxHeight}px;`);

    // content-width
    const contentWidth = 400;
    await wrapper.setProps({ contentWidth });
    await wrapper.find('.tag-input[type="text"]').trigger('focus');
    expect(wrapper.vm.popoverProps.width).toEqual(contentWidth);

    // search-key array or string
    await wrapper.setProps({ searchKey: 'id' });
    wrapper.find('.tag-input[type="text"]').setValue('guangzhou');
    await jest.runAllTimers();
    expect(wrapper.findAll('.bk-selector-list-item')[0].text()).toEqual('广州');
    await wrapper.setProps({ searchKey: ['id'] });
    wrapper.find('.tag-input[type="text"]').setValue('guangzhou');
    await jest.runAllTimers();
    expect(wrapper.findAll('.bk-selector-list-item')[0].text()).toEqual('广州');
  });

  it('render with disabled', async () => {
    const wrapper = await mount(TagInput, {
      props: {
        list,
        modelValue: ['shenzhen'],
        trigger: 'focus',
        disabled: true,
      },
    });

    const { vm } = wrapper;
    await wrapper.find('.bk-tag-input').trigger('click');
    expect(vm.popoverProps.isShow).toBe(false);
  });

  it('render with has-close-icon and clear', async () => {
    const tags = ['shenzhen'];
    const wrapper = await mount(TagInput, {
      props: {
        list,
        modelValue: tags,
        hasDeleteIcon: true,
        clearable: true,
        trigger: 'focus',
      },
    });

    expect(wrapper.findAll('.remove-tag')).toHaveLength(tags.length);
    expect(wrapper.find('.clear-icon').exists()).toBe(true);

    // remove tag
    await wrapper.findAll('.remove-tag')[0].trigger('click');
    expect(wrapper.vm.selectedTagList).toHaveLength(0);

    await wrapper.find('.bk-tag-input').trigger('click');
    await wrapper.findAll('.bk-selector-list-item')[0].trigger('click');
    expect(wrapper.vm.selectedTagList).toHaveLength(1);
    await wrapper.find('.clear-icon').trigger('click');
    expect(wrapper.vm.selectedTagList).toHaveLength(0);
  });

  it('render with custom display and save key', async () => {
    const tags = ['深圳'];
    const displayKey = 'id';
    const saveKey = 'name';
    const wrapper = await mount(TagInput, {
      props: {
        list,
        modelValue: tags,
        trigger: 'focus',
        displayKey,
        saveKey,
      },
    });

    expect(wrapper.findAll('.tag-item')[0].text()).toEqual(list[0][displayKey]);

    await wrapper.find('.bk-tag-input').trigger('click');
    await wrapper.findAll('.bk-selector-list-item')[0].trigger('click');
    expect(wrapper.emitted('update:modelValue')[0][0]).toEqual(wrapper.vm.selectedTagList.map(tag => tag[saveKey]));
  });

  it('render with group mode', async () => {
    const wrapper = await mount(TagInput, {
      props: {
        list: groupList,
        modelValue: [],
        trigger: 'focus',
        useGroup: true,
      },
    });

    expect(wrapper.findAll('.bk-selector-group-item')).toHaveLength(groupList.length);

    // max-result
    const maxResult = 2;
    await wrapper.setProps({ maxResult });
    wrapper.find('.tag-input[type="text"]').setValue('省');
    await jest.runAllTimers();
    expect(wrapper.findAll('.bk-selector-list-item')).toHaveLength(2);

    // max-data
    const maxData = 1;
    await wrapper.setProps({ maxData });
    await wrapper.findAll('.bk-selector-list-item')[0].trigger('click');
    expect(wrapper.emitted('update:modelValue')[0][0]).toHaveLength(1);
    await wrapper.findAll('.bk-selector-list-item')[0].trigger('click');
    expect(wrapper.emitted('update:modelValue')[1][0]).toHaveLength(1);
  });

  it('render with tpl', async () => {
    const tpl = (node, highlightKeyword, h) => {
      const innerHTML = `${highlightKeyword(node.name)} (${node.id})`;
      return h(
        'div',
        { class: 'bk-selector-node' },
        [
          h('span', {
            class: 'text',
            innerHTML,
          }),
        ],
      );
    };
    const tagTpl = (node, h) => h(
      'div',
      { class: 'tag' },
      [
        h('span', {
          class: 'text',
          innerHTML: `<span style="text-decoration: underline;">${node.name}</span> (${node.id})`,
        }),
      ],
    );
    const wrapper = await mount(TagInput, {
      props: {
        list,
        modelValue: ['shenzhen'],
        trigger: 'focus',
        tpl,
        tagTpl,
      },
    });

    expect(wrapper.findAll('.tag-item')[0].text()).toEqual('深圳 (shenzhen)');
    expect(wrapper.findAll('.bk-selector-list-item')[0].text()).toEqual('广州 (guangzhou)');
  });

  it('render with custom tag', async () => {
    const separator =  '|';
    const wrapper = await mount(TagInput, {
      props: {
        list,
        trigger: 'focus',
        allowCreate: true,
        separator,
      },
    });

    const tagName = 'custom-tag';
    const result = [tagName];
    wrapper.find('.tag-input[type="text"]').setValue(tagName);
    await jest.runAllTimers();
    await wrapper.find('.tag-input[type="text"]').trigger('keydown', { code: 'Enter' });
    expect(wrapper.emitted('update:modelValue')[0][0]).toEqual(result);

    // list includes custom tag
    wrapper.find('.tag-input[type="text"]').setValue('guangzhou');
    await jest.runAllTimers();
    await wrapper.find('.tag-input[type="text"]').trigger('keydown', { code: 'Enter' });
    result.push('guangzhou');
    expect(wrapper.emitted('update:modelValue')[1][0]).toEqual(result);

    const createTagValidator = value => /^A+/.test(value);
    await wrapper.setProps({ createTagValidator });

    // create success
    wrapper.find('.tag-input[type="text"]').setValue('ATagName');
    await jest.runAllTimers();
    await wrapper.find('.tag-input[type="text"]').trigger('keydown', { code: 'Enter' });
    result.push('ATagName');
    expect(wrapper.emitted('update:modelValue')[2][0]).toEqual(result);

    // create fail
    wrapper.find('.tag-input[type="text"]').setValue('tagName');
    await jest.runAllTimers();
    await wrapper.find('.tag-input[type="text"]').trigger('keydown', { code: 'Enter' });
    expect(wrapper.emitted('update:modelValue')[3][0]).toEqual(result);

    // multiple inputs
    const value = 'A-1|A-2|A-3';
    wrapper.find('.tag-input[type="text"]').setValue(value);
    await jest.runAllTimers();
    await wrapper.find('.tag-input[type="text"]').trigger('keydown', { code: 'Enter' });
    result.push(...value.split(separator));
    expect(wrapper.emitted('update:modelValue')[4][0]).toEqual(result);
  });

  it('render with paste-fn prop', async () => {
    const pasteFn = value => value.split('|').map(tag => ({ id: tag, name: tag }));
    const wrapper = await mount(TagInput, {
      props: {
        list,
        trigger: 'focus',
        clearable: true,
      },
    });

    // default paste
    const defaultValue = 'guangzhou;chongqing;beijing';
    await wrapper.find('.tag-input[type="text"]').trigger('paste', { clipboardData: { getData: () => defaultValue } });
    expect(wrapper.emitted('update:modelValue')[0][0].sort()).toEqual(defaultValue.split(';').sort());

    await wrapper.find('.clear-icon').trigger('click');

    await wrapper.setProps({ pasteFn });
    const value = 'guangzhou|chongqing|beijing';
    await wrapper.find('.tag-input[type="text"]').trigger('paste', { clipboardData: { getData: () => value } });
    expect(wrapper.emitted('update:modelValue')[2][0].sort()).toEqual(value.split('|').sort());
  });

  it('render with filter-callback prop', async () => {
    const filterCallback = (searchValue, searchKey, list) => list.filter((data) => {
      if (!searchValue) return list;
      return (data.id.indexOf(searchValue) > -1) || (data[searchKey].indexOf(searchValue) > -1);
    });
    const wrapper = await mount(TagInput, {
      props: {
        list,
        trigger: 'focus',
        filterCallback,
      },
    });

    wrapper.find('.tag-input[type="text"]').setValue('州');
    await jest.runAllTimers();
    expect(wrapper.findAll('.bk-selector-list-item')).toHaveLength(2);
    wrapper.find('.tag-input[type="text"]').setValue('guangzhou');
    await jest.runAllTimers();
    expect(wrapper.findAll('.bk-selector-list-item')).toHaveLength(1);
  });

  it('test input keydown event', async () => {
    const wrapper = await mount(TagInput, {
      props: {
        list,
        modelValue: ['shenzhen'],
        trigger: 'focus',
      },
    });

    await wrapper.find('.bk-tag-input').trigger('click');
    await wrapper.find('.tag-input[type="text"]').trigger('keydown', { code: 'ArrowDown' });
    expect(wrapper.findAll('.bk-selector-list-item')[1].classes()).toContain('bk-selector-actived');

    await wrapper.find('.tag-input[type="text"]').trigger('keydown', { code: 'ArrowUp' });
    await wrapper.find('.tag-input[type="text"]').trigger('keydown', { code: 'ArrowUp' });
    const { length } = wrapper.vm.curPageList;
    expect(wrapper.findAll('.bk-selector-list-item')[length - 1].classes()).toContain('bk-selector-actived');

    await wrapper.find('.tag-input[type="text"]').trigger('keydown', { code: 'Backspace' });
    await wrapper.find('.tag-input[type="text"]').trigger('keydown', { code: 'Backspace' });
    expect(wrapper.findAll('.tag-item')).toHaveLength(0);
  });

  it('test input blur event', async () => {
    const wrapper = await mount(TagInput, {
      props: {
        list,
        modelValue: ['shenzhen'],
        trigger: 'focus',
        allowAutoMatch: true,
        allowCreate: true,
      },
    });

    wrapper.find('.tag-input[type="text"]').setValue('guangzhou');
    await jest.runAllTimers();
    wrapper.find('.tag-input[type="text"]').trigger('blur');
    await jest.runAllTimers();
    expect(wrapper.findAll('.tag-item')).toHaveLength(2);

    wrapper.find('.tag-input[type="text"]').setValue('custom');
    await jest.runAllTimers();
    wrapper.find('.tag-input[type="text"]').trigger('blur');
    await jest.runAllTimers();
    expect(wrapper.findAll('.tag-item')).toHaveLength(3);
  });
});
