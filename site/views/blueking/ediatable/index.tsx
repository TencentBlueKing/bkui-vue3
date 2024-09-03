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

import { defineComponent } from 'vue';

import DemoBox from '../../../components/demo-box';
import DemoTitle from '../../../components/demo-title';
import PropsBox from '../../../components/props-box';
import { IPropsTableItem } from '../../../typings';
import BaseConfigDemo from './base-config-demo.vue';
import BaseDemo from './base-demo.vue';
import InputColumnDemo from './input-column-demo.vue';
import DatetimePickerColumnDemo from './datetime-picker-column-demo.vue';
import SelectColumnDemo from './select-column-demo.vue';
import TagInputColumn from './tag-input-column.vue';
import TextPlainColumnDemo from './text-plain-column-demo.vue';

const menuPropsJson: IPropsTableItem[] = [
  {
    name: 'theadList',
    type: 'IHead[]',
    default: 'undefined',
    desc: '表头配置',
    optional: [],
  },
];

const iheadPropsJson: IPropsTableItem[] = [
  {
    name: 'fixed',
    type: 'String',
    default: 'undefined',
    desc: '表头列是否固定',
    optional: ['right', 'left', 'undefined'],
  },
  {
    name: 'maxWidth',
    type: 'Number',
    default: 'undefined',
    desc: '表头列最大宽度',
    optional: [],
  },
  {
    name: 'minWidth',
    type: 'Number',
    default: 'undefined',
    desc: '表头列最小宽度',
    optional: [],
  },
  {
    name: 'memo',
    type: 'String',
    default: 'undefined',
    desc: '列名hover时的提示',
    optional: [],
  },
  {
    name: 'required',
    type: 'Boolean',
    default: 'true',
    desc: '是否必填标志',
    optional: ['true', 'false'],
  },
  {
    name: 'title',
    type: 'String',
    default: 'undefined',
    desc: '表头列名',
    optional: [],
  },
  {
    name: 'width',
    type: 'Number',
    default: 'undefined',
    desc: '表头列宽度',
    optional: [],
  },
  {
    name: 'renderAppend',
    type: '() => JSX.Element',
    default: 'undefined',
    desc: '表头列名之后追加的元素',
    optional: [],
  },
];

const slotsJson = [
  {
    name: 'default',
    desc: '表头组件',
    params: '',
  },
  {
    name: 'data',
    desc: '列表组件',
    params: '',
  },
];

const eventColumnMap = {
  name: '名称',
  desc: '说明',
  params: '参数',
};

// 输入框组件
const inputColumnPropsJson: IPropsTableItem[] = [
  {
    name: 'rules',
    type: 'IRule[]',
    default: 'undefined',
    desc: '校验规则配置',
    optional: [],
  },
];

const inputColumnEmitsJson = [
  {
    name: 'submit',
    desc: '输入完成事件',
    params: 'string | number',
  },
];

const inputColumnExposesJson = [
  {
    name: 'getValue',
    desc: '校验并获取最新值',
    params: '',
  },
  {
    name: 'focus',
    desc: '聚焦',
    params: '',
  },
];

// 时间选择器组件
const datePickerColumnEmitsJson = [
  {
    name: 'change',
    desc: '选择完成事件',
    params: '[string, string] | string',
  },
];

const datePickerColumnExposesJson = [
  {
    name: 'getValue',
    desc: '校验并获取最新值',
    params: '',
  },
];

// 下拉选框组件
const selectPickerColumnEmitsJson = [
  {
    name: 'change',
    desc: '选择完成事件',
    params: 'string | number',
  },
];

// 标签输入框组件
const tagInputPickerColumnEmitsJson = [
  {
    name: 'change',
    desc: '输入完成事件',
    params: 'string[]',
  },
];

const tagInputSlotsJson = [
  {
    name: 'tip',
    desc: '聚焦后的 popover 提示',
    params: '',
  },
];

// 文本显示框组件
const textColumnPropsJson: IPropsTableItem[] = [
  {
    name: 'data',
    type: 'string | number',
    default: 'undefined',
    desc: '文本内容',
    optional: [],
  },
  {
    name: 'isLoading',
    type: 'boolean',
    default: 'false',
    desc: '是否加载中',
    optional: ['true', 'false'],
  },
  {
    name: 'placeholder',
    type: 'string',
    default: 'undefined',
    desc: '空白提示',
    optional: [],
  },
  {
    name: 'rules',
    type: 'IRule[]',
    default: 'undefined',
    desc: '校验规则配置',
    optional: [],
  },

];

export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          desc='业务组件 Ediatable， 用于可编辑表格的场景，支持 Vue2/Vue3 版本 无差别使用'
          name='Ediatable'
          npmLink='https://www.npmjs.com/package/@blueking/ediatable'
        />
        <DemoBox
          componentName='blueking/ediatable'
          demoName='base-config-demo'
          desc='配置 theadList 实现表头'
          subtitle=''
          title='基础用法1'
        >
          <BaseConfigDemo />
        </DemoBox>
        <DemoBox
          componentName='blueking/ediatable'
          demoName='base-demo'
          desc='用表头列组件实现表头'
          subtitle=''
          title='基础用法2'
        >
          <BaseDemo />
        </DemoBox>
        <PropsBox
          propsData={menuPropsJson}
          title='Props属性'
        />
        <PropsBox
          propsData={iheadPropsJson}
          title='IHead'
        />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={slotsJson}
          title='Slots属性'
        />
        {/* 列组件之输入框组件 */}
        <DemoBox
          componentName='blueking/ediatable'
          demoName='input-column-demo'
          desc='可单独使用'
          subtitle=''
          title='列组件用法之输入框组件'
        >
          <InputColumnDemo />
        </DemoBox>
        <PropsBox
          propsData={inputColumnPropsJson}
          title='Props属性(其他配置同 bkui-vue3 的 Input 组件)'
        />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={inputColumnEmitsJson}
          title='Emits事件列表'
        />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={inputColumnExposesJson}
          title='Exposes事件列表'
        />
        {/* 列组件之时间选择器组件 */}
        <DemoBox
          componentName='blueking/ediatable'
          demoName='datetime-picker-column-demo'
          desc='可单独使用'
          subtitle=''
          title='列组件用法之时间选择器组件'
        >
          <DatetimePickerColumnDemo />
        </DemoBox>
        <PropsBox
          propsData={inputColumnPropsJson}
          title='Props属性(其他配置同 bkui-vue3 的 DatePicker 组件)'
        />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={datePickerColumnEmitsJson}
          title='Emits事件列表'
        />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={datePickerColumnExposesJson}
          title='Exposes事件列表'
        />
        {/* 列组件之下拉选框组件 */}
        <DemoBox
          componentName='blueking/ediatable'
          demoName='select-column-demo'
          desc='可单独使用'
          subtitle=''
          title='列组件用法之下拉选框组件'
        >
          <SelectColumnDemo />
        </DemoBox>
        <PropsBox
          propsData={inputColumnPropsJson}
          title='Props属性(其他配置同 bkui-vue3 的 Select 组件)'
        />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={selectPickerColumnEmitsJson}
          title='Emits事件列表'
        />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={datePickerColumnExposesJson}
          title='Exposes事件列表'
        />
        {/* 列组件之标签输入框组件 */}
        <DemoBox
          componentName='blueking/ediatable'
          demoName='select-column-demo'
          desc='可单独使用'
          subtitle=''
          title='列组件用法之标签输入框'
        >
          <TagInputColumn />
        </DemoBox>
        <PropsBox
          propsData={inputColumnPropsJson}
          title='Props属性(其他配置同 bkui-vue3 的 TagInput 组件)'
        />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={tagInputPickerColumnEmitsJson}
          title='Emits事件列表'
        />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={datePickerColumnExposesJson}
          title='Exposes事件列表'
        />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={tagInputSlotsJson}
          title='Slots属性'
        />
        {/* 列组件之文本显示框组件 */}
        <DemoBox
          componentName='blueking/ediatable'
          demoName='text-plain-column-demo'
          desc='可单独使用'
          subtitle=''
          title='列组件用法之文本显示框'
        >
          <TextPlainColumnDemo />
        </DemoBox>
        <PropsBox
          propsData={textColumnPropsJson}
          title='Props属性'
        />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={datePickerColumnExposesJson}
          title='Exposes事件列表'
        />
      </div>
    );
  },
});
