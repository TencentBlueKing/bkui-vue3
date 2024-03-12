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

import BaseDemo from './base-demo.vue';
import SimpleDemo from './simple-demo.vue';
import TimeDemo from './time-demo.vue';
import TimezoneDemo from './timezone-demo.vue';
const menuPropsJson: IPropsTableItem[] = [
  {
    name: 'behavior',
    type: "'normal' | 'simplicity'",
    default: "'normal'",
    desc: '组件展示风格',
    optional: ["'normal'", "'simplicity'"],
  },
  {
    name: 'commonUseList',
    type: 'DateValue[]',
    default: '',
    desc: '常用列表',
    optional: [],
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: '',
    desc: '是否禁用',
    optional: ['true', 'false'],
  },
  {
    name: 'format',
    type: 'string',
    default: '',
    desc: '日期转换显示格式',
    optional: [],
  },
  {
    name: 'modelValue',
    type: 'DateValue | dayjs.Dayjs[] | number[] | string[] | undefined',
    default: '',
    desc: '日期值',
    optional: [],
  },
  {
    name: 'needTimezone',
    type: 'boolean',
    default: '',
    desc: '是否展示时区',
    optional: ['true', 'false'],
  },
  {
    name: 'timezone',
    type: 'string',
    default: '浏览器时区',
    desc: '时区值',
    optional: [],
  },
  {
    name: 'version',
    type: 'number | string',
    default: "'1.0'",
    desc: '版本号 用于控制本地缓存',
    optional: [],
  },
];
const eventJson = [
  {
    name: 'update:modelValue',
    desc: '更新date值的事件，以及相关信息',
    params:
      "value: IDatePickerProps['modelValue'], info: Array<{dayjs: dayjs.Dayjs | null, formatText: null | string}>",
  },
  {
    name: 'update:timezone',
    desc: '更新时区值的事件，以及时区信息',
    params: 'value: string, timezoneInfo: ITimezoneItem',
  },
];
const eventColumnMap = {
  name: '名称',
  desc: '说明',
  params: '参数',
};
const exampleColumnJson = {
  zh: '中文释义',
  en: '英文释义',
  from: 'from',
  to: 'to',
};
const exampleJson = [
  {
    zh: '近5分钟',
    en: 'last 5 minutes',
    from: 'now-5m',
    to: 'now',
  },
  {
    zh: '今天到目前为止',
    en: 'The day so far',
    from: 'now/d',
    to: 'now',
  },
  {
    zh: '本周',
    en: 'This week',
    from: 'now/w',
    to: 'now/w',
  },
  {
    zh: '本周到目前为止',
    en: 'This week so far',
    from: 'now/w',
    to: 'now',
  },
  {
    zh: '本月',
    en: 'This month',
    from: 'now/M',
    to: 'now/M',
  },
  {
    zh: '本月到目前为止',
    en: 'This month so far',
    from: 'now/M',
    to: 'now',
  },
  {
    zh: '上个月',
    en: 'Previous Month',
    from: 'now-1M/M',
    to: 'now-1M/M',
  },
  {
    zh: '今年到目前为止',
    en: 'This year so far',
    from: 'now/Y',
    to: 'now',
  },
  {
    zh: '今年',
    en: 'This Year',
    from: 'now/Y',
    to: 'now/Y',
  },
  {
    zh: '去年',
    en: 'Previous year',
    from: 'now-1y/y',
    to: 'now-1y/y',
  },
];
export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          name='Date Picker'
          desc='业务组件 Date Picker， 用于页面上更复杂的时间选择使用，支持 Vue2/Vue3 版本 无差别使用'
          npmLink='https://www.npmjs.com/package/@blueking/date-picker'
        />
        <DemoBox
          title='基础用法'
          subtitle='组件的基础用法'
          desc='配置v-model直接使用'
          componentName='blueking/date-picker'
          demoName='base-demo'
        >
          <BaseDemo />
        </DemoBox>
        <DemoBox
          title='时间段配置'
          subtitle='不同的时间段配置'
          desc='组件支持过去时间、未来时间、自然时间、精确时间的配置和展示'
          componentName='blueking/date-picker'
          demoName='time-demo'
        >
          <TimeDemo />
        </DemoBox>
        <DemoBox
          title='时区配置'
          subtitle='通过timezone属性来配置美国纽约时区'
          desc='支持全球各个时区段和标志城市的时区配置'
          componentName='blueking/date-picker'
          demoName='timezone-demo'
        >
          <TimezoneDemo />
        </DemoBox>
        <DemoBox
          title='展示风格'
          subtitle='简约风格'
          desc='配置behavior改变展示风格'
          componentName='blueking/date-picker'
          demoName='simple-demo'
        >
          <SimpleDemo />
        </DemoBox>
        <PropsBox
          title='now语法概述'
          subtitle='Grafana 支持以下时间单位： s (seconds) 、 m (minutes) 、 h (hours) 、 d (days) 、 w (weeks) 、 M (months) 、 和 y (years)。
          (-)减号运算符是相对于当前日期和时间或 now 向后减一个时间单位。如果您想显示单位的完整周期（日、周、月等），请在末尾附加 /<time unit>。（+）加号同理。 '
          columnMap={exampleColumnJson}
          propsData={exampleJson}
        />
        <PropsBox
          title='组件属性'
          propsData={menuPropsJson}
        />
        <PropsBox
          title='组件事件'
          columnMap={eventColumnMap}
          propsData={eventJson}
        />
      </div>
    );
  },
});
