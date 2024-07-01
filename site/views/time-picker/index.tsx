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
import RangeDemo from './range-demo.vue';

const menuPropsJson: IPropsTableItem[] = [
  {
    name: 'model-value / v-model',
    type: 'String/Array',
    default: '',
    desc: '时间选择器组件的值，可以是 Date 或字符串或数组，只有在 timerange 类型时才支持数组',
    optional: ['Date', 'String', 'Array'],
  },
  {
    name: 'type',
    type: 'String',
    default: 'date',
    desc: '类型',
    optional: ['time', 'timerange'],
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
    default: 'HH:mm:ss',
    desc: '格式，不配置 ss 时即不显示秒',
    optional: [],
  },
  {
    name: 'steps',
    type: 'Array',
    default: '',
    desc: '面板的时间间隔，数组的三项分别对应小时、分钟、秒。例如设置为 [1, 15, 20] 时，面板中分钟的备选项为：00、15、30、45，秒的备选项为：00、20、40。',
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
    desc: '时间面板出现的位置',
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
    name: 'disabled-hours',
    type: 'Array',
    default: '',
    desc: '不可选小时数，数组中的小时数将为禁用状态',
    optional: [],
  },
  {
    name: 'disabled-minutes',
    type: 'Array',
    default: '',
    desc: '不可选分钟数，数组中的分钟数将为禁用状态',
    optional: [],
  },
  {
    name: 'disabled-seconds',
    type: 'Array',
    default: '',
    desc: '不可选秒数，数组中的秒数将为禁用状态',
    optional: [],
  },
  {
    name: 'hide-disabled-options',
    type: 'String',
    default: 'false',
    desc: '是否隐藏禁止选择的小时、分钟、秒',
    optional: ['true', 'false'],
  },
  {
    name: 'font-size',
    type: 'String',
    default: 'normal',
    desc: '设置组件主体内容字体大小。normal:（12px），medium:（14px），large:（16px）',
    optional: ['normal', 'medium', 'large'],
  },
  {
    name: 'allow-cross-day',
    type: 'Boolean',
    default: 'false',
    desc: '是否允许时间段进行跨天选择, 即起始时间大于终止时间, 此属性只在type为timerange时生效',
    optional: ['true', 'false'],
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

const timePickerSlotsJson = [
  {
    name: 'trigger',
    desc: '可用该插槽配合 open 属性，自定义日期选择器的展示',
  },
];

export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          desc='时间选择器'
          designLink='https://bkdesign.bk.tencent.com/design/117'
          name='TimePicker 时间选择器'
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
          componentName='time-picker'
          demoName='range-demo'
          desc='通过设置 type 属性为 timerange 来开启时间设置'
          title='开启时间范围'
        >
          <RangeDemo />
        </DemoBox>
        <PropsBox propsData={menuPropsJson} />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={events}
          title='事件'
        ></PropsBox>
        <PropsBox
          columnMap={slotColumnMap}
          propsData={timePickerSlotsJson}
          title='插槽'
        />
      </div>
    );
  },
});
