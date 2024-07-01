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

import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import { IPropsTableItem } from '../../typings';
import BaseDemo from './base-demo.vue';
import DemoTsx from './demo-tsx';
import FooterSlotDemo from './footer-slot-demo.vue';
import HeaderSlotDemo from './header-slot-demo.vue';
import MonthRangeDemo from './month-range-demo.vue';
import RangeDemo from './range-demo.vue';
import ShortcutsSlotDemo from './shortcuts-slot-demo.vue';
import TriggerSlotDemo from './trigger-slot-demo.vue';
import WithTimeDemo from './with-time-demo.vue';
import YearMonthDemo from './year-month-demo.vue';
import YearRangeDemo from './year-range-demo.vue';

const menuPropsJson: IPropsTableItem[] = [
  {
    name: 'model-value / v-model',
    type: 'String/Array',
    default: '',
    desc: '日历组件的值，可以是 Date 或字符串或数组，只有在 daterange 和 datetimerange 类型时才支持数组',
    optional: ['Date', 'String', 'Array'],
  },
  {
    name: 'type',
    type: 'String',
    default: 'date',
    desc: '类型',
    optional: ['date', 'daterange', 'datetime', 'datetimerange', 'month', 'monthrange', 'year', 'yearrange'],
  },
  {
    name: 'editable',
    type: 'Boolean',
    default: 'true',
    desc: '设置文本框是否可编辑',
    optional: ['true', 'false'],
  },
  {
    name: 'format',
    type: 'String',
    default: [
      'date: yyyy-MM-dd',
      'month: yyyy-MM',
      'year: yyyy',
      'datetime: yyyy-MM-dd HH:mm:ss',
      'daterange: yyyy-MM-dd',
      'datetimerange: yyyy-MM-dd HH:mm:ss',
    ],
    desc: '格式',
    optional: [],
  },
  {
    name: 'readonly',
    type: 'Boolean',
    default: 'false',
    desc: '是否只读',
    optional: ['true', 'false'],
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用',
    optional: ['true', 'false'],
  },
  {
    name: 'clearable',
    type: 'Boolean',
    default: 'true',
    desc: '是否可清空',
    optional: ['true', 'false'],
  },
  {
    name: 'open',
    type: 'Boolean',
    default: 'false',
    desc: '控制日历面板的显示与隐藏',
    optional: ['true', 'false'],
  },
  {
    name: 'multiple',
    type: 'Boolean',
    default: 'false',
    desc: '是否允许选择多个日期，multiple 只支持 date 类型。选择多个日期时，model-value 值应为数组',
    optional: ['true', 'false'],
  },
  {
    name: 'time-picker-options',
    type: 'Object',
    default: '',
    desc: '支持 datetime 和 datetimerange 类型，在 DatePicker 中配置 TimePicker 的属性',
    optional: [],
  },
  {
    name: 'start-date',
    type: 'Date',
    default: '',
    desc: '设置日历面板默认显示的日期',
    optional: [],
  },
  {
    name: 'placeholder',
    type: 'String',
    default: '',
    desc: '占位文案',
    optional: [],
  },
  {
    name: 'placement',
    type: 'String',
    default: 'bottom-start',
    desc: '日历面板出现的位置',
    optional: [
      'auto',
      'auto-start',
      'auto-end',
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'right',
      'right-start',
      'right-end',
      'left',
      'left-start',
      'left-end',
    ],
  },
  {
    name: 'append-to-body',
    type: 'Boolean',
    default: 'false',
    desc: '控制日历面板是否出现在 body 内',
    optional: ['true', 'false'],
  },
  {
    name: 'shortcuts',
    type: 'Array',
    default: '',
    desc: '配置快捷选择日期。类型为 {text: string;value?: () => Date[];onClick?: (picker: any) => void;}[]',
    optional: [],
  },
  {
    name: 'shortcut-close',
    type: 'Boolean',
    default: 'false',
    desc: '配置点击 shortcuts 是否关闭弹层',
    optional: ['true', 'false'],
  },
  {
    name: 'disabled-date',
    type: 'Function',
    default: '',
    desc: '配置不可选的日期，参数为当前的日期，返回 true 禁用这天，否则不禁用。类型为 (date: Date | number) => boolean',
    optional: [],
  },
  {
    name: 'font-size',
    type: 'String',
    default: 'normal',
    desc: '设置组件主体内容字体大小。normal:（12px），medium:（14px），large:（16px）',
    optional: ['normal', 'medium', 'large'],
  },
  {
    name: 'up-to-now',
    type: 'Boolean',
    default: 'false',
    desc: '在日期范围选择器和日期时间范围选择器中（即 type 为 `daterange` 或者 `datetimerange`），设置 `up-to-now` 为 `true` 可使配置终止时间为“至今”',
    optional: ['true', 'false'],
  },
  {
    name: 'use-shortcut-text',
    type: 'Boolean',
    default: 'false',
    desc: '开启后，点击选中配置的快捷项时，输入框显示的内容为选中的快捷文案，且不可编辑',
    optional: ['true', 'false'],
  },
  {
    name: 'shortcut-selected-index',
    type: 'Number',
    default: '-1',
    desc: '选中的快捷项index',
    optional: [],
  },
  {
    name: 'footer-slot-cls',
    type: 'String',
    default: '',
    desc: '自定义 footer 的容器的样式，只有存在自定义 footer 时才会生效',
    optional: [],
  },
  {
    name: 'header-slot-cls',
    type: 'String',
    default: '',
    desc: '自定义 header 的容器的样式，只有存在自定义 header 时才会生效',
    optional: [],
  },
  {
    name: 'behavior',
    type: 'String',
    default: 'normal',
    desc: '风格设置(simplicity:简约 normal:正常)',
    optional: ['normal', 'simplicity'],
  },
  {
    name: 'extPopoverCls',
    type: 'String',
    default: '',
    desc: '配置自定义样式类名，传入的类会被加在弹出的日历面板 DOM `.bk-date-picker-dropdown` 上',
    optional: [],
  },
];

const eventColumnMap = {
  name: '名称',
  desc: '说明',
  params: '回调参数',
};

const events = [
  {
    name: 'update:modelValue',
    desc: '更新 date 值',
  },
  {
    name: 'change',
    desc: '日期改变事件，参数为当前选择的日期以及当前日历组件的类型',
    params: 'date, type',
  },
  {
    name: 'clear',
    desc: '日历面板点击清空事件，无参数',
  },
  {
    name: 'open-change',
    desc: '日历面板弹出或收起事件，参数为日历面板展开收起的状态',
    params: 'state',
  },
  {
    name: 'pick-success',
    desc: '日历面板选择日期后，点击确定选择成功的事件，无参数',
  },
  {
    name: 'shortcut-change',
    desc: '快捷项改变事件',
    params: 'value, index',
  },
];

const slotColumnMap = {
  name: '名称',
  desc: '说明',
};

const datePickerSlotsJson = [
  {
    name: 'trigger',
    desc: '可用该插槽配合 open 属性，自定义日期选择器的展示',
  },
  {
    name: 'footer',
    desc: '可用该插槽，自定义日期选择器 footer 的展示',
  },
  {
    name: 'header',
    desc: '可用该插槽，自定义日期选择器 header 的展示',
  },
  {
    name: 'shortcuts',
    desc: 'datetimerange、daterange 类型可用该插槽，自定义时间范围选择器快捷选项区域的展示',
  },
];

export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          desc='日期选择器'
          name='DatePicker 日期选择器'
        />
        <DemoBox
          componentName='date-picker'
          demoName='base-demo'
          desc='通过 v-model 或者 value 设置初始值'
          title='基础用法'
        >
          <BaseDemo />
        </DemoBox>
        <DemoBox
          componentName='date-picker'
          demoName='range-demo'
          desc='通过设置 type 属性为 daterange 来开启时间设置'
          title='开启日期范围'
        >
          <RangeDemo />
        </DemoBox>
        <DemoBox
          componentName='date-picker'
          demoName='month-range-demo'
          desc='通过设置 type 属性为 monthrange 来开启月份范围'
          title='开启月份范围'
        >
          <MonthRangeDemo />
        </DemoBox>
        <DemoBox
          componentName='date-picker'
          demoName='year-range-demo'
          desc='通过设置 type 属性为 yearrange 来开启月份范围'
          title='开启年份范围'
        >
          <YearRangeDemo />
        </DemoBox>
        <DemoBox
          componentName='date-picker'
          demoName='with-time-demo'
          desc='通过设置 type 属性为 datetime 来开启时间设置'
          title='开启时间设置'
        >
          <WithTimeDemo />
        </DemoBox>
        <DemoBox
          componentName='date-picker'
          demoName='trigger-slot-demo'
          desc='可以通过 trigger slot 来增加自定义 trigger'
          title='trigger slot'
        >
          <TriggerSlotDemo />
        </DemoBox>
        <DemoBox
          componentName='date-picker'
          demoName='header-slot-demo'
          desc='自定义 header'
          title='header slot'
        >
          <HeaderSlotDemo />
        </DemoBox>
        <DemoBox
          componentName='date-picker'
          demoName='footer-slot-demo'
          desc='自定义 footer'
          title='footer slot'
        >
          <FooterSlotDemo />
        </DemoBox>
        <DemoBox
          componentName='date-picker'
          demoName='shortcuts-slot-demo'
          desc='自定义 shortcuts'
          title='shortcuts slot'
        >
          <ShortcutsSlotDemo />
        </DemoBox>
        <DemoBox
          componentName='date-picker'
          demoName='demo-tsx'
          desc='自定义插槽 tsx 写法'
          suffix='.tsx'
          title='demo-tsx'
        >
          <DemoTsx />
        </DemoBox>
        <DemoBox
          componentName='date-picker'
          demoName='year-month-demo'
          desc='通过 type 属性配置年选择器与月选择器'
          title='年选择器与月选择器'
        >
          <YearMonthDemo />
        </DemoBox>
        <PropsBox propsData={menuPropsJson} />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={events}
          title='事件'
        ></PropsBox>
        <PropsBox
          columnMap={slotColumnMap}
          propsData={datePickerSlotsJson}
          title='插槽'
        />
      </div>
    );
  },
});
