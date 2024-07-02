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
import CustomDemo from './custom-demo.vue';
import InputDemo from './input-demo.vue';
import StepDemo from './step-demo.vue';
import VerticalDemo from './vertical-demo.vue';
const sliderProps: IPropsTableItem[] = [
  {
    name: 'model-value / v-model',
    type: 'Number | Array',
    default: null,
    desc: '滑动条的当前值，可以是单个数值或数组，数组用于范围选择',
    optional: [],
  },
  {
    name: 'extCls',
    type: 'String',
    default: '',
    desc: '自定义类名',
    optional: [],
  },
  {
    name: 'vertical',
    type: 'Boolean',
    default: 'false',
    desc: '是否为垂直模式',
    optional: [],
  },
  {
    name: 'height',
    type: 'String',
    default: '200px',
    desc: '滑动选择器高度，vertical为true时使用',
    optional: [],
  },
  {
    name: 'disable',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用滑块',
    optional: [],
  },
  {
    name: 'showTip',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示提示信息',
    optional: [],
  },
  {
    name: 'maxValue',
    type: 'Number',
    default: 100,
    desc: '最大值',
    optional: [],
  },
  {
    name: 'minValue',
    type: 'Number',
    default: '0',
    desc: '最小值',
    optional: [],
  },
  {
    name: 'step',
    type: 'Number',
    default: 1,
    desc: '步长',
    optional: [],
  },
  {
    name: 'range',
    type: 'Boolean',
    default: 'false',
    desc: '是否为分段式',
    optional: [],
  },
  {
    name: 'showInterval',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示刻度间隔',
    optional: [],
  },
  {
    name: 'showIntervalLabel',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示刻度间隔的文字',
    optional: [],
  },
  {
    name: 'showButtonLabel',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示滑块的值，不可与showIntervalLabel同时使用',
    optional: [],
  },
  {
    name: 'showBetweenLabel',
    type: 'Boolean',
    default: 'false',
    desc: '是否只显示首尾刻度',
    optional: [],
  },
  {
    name: 'showInput',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示输入框',
    optional: [],
  },
  {
    name: 'customContent',
    type: 'Object',
    default: null,
    desc: '自定义内容',
    optional: [],
  },
  {
    name: 'formatterLabel',
    type: 'Function',
    default: (value: number) => value,
    desc: '自定义刻度标签格式',
    optional: [],
  },
  {
    name: 'formatterButtonLabel',
    type: 'Function',
    default: (value: number) => value,
    desc: '自定义滑块下标签格式',
    optional: [],
  },
  {
    name: 'formatterTipLabel',
    type: 'Function',
    default: (value: number) => value,
    desc: '自定义提示标签格式',
    optional: [],
  },
  {
    name: 'labelClick',
    type: 'Boolean | Function',
    default: 'false',
    desc: '刻度标签点击事件，可以设置true或者false，设置true时触发会设置当前值为label所对应的step值，也可以设置自定义函数，返回true或者false或者number，返回true时，会触发change事件，返回number时，会设置当前值为返回的number值，返回false时，不触发change事件',
    optional: [],
  },
];

const sliderEvents: IPropsTableItem[] = [
  {
    name: 'update:modelValue',
    type: 'Function',
    default: '-',
    desc: '更新 modelValue 时触发的回调',
    optional: [],
  },
  {
    name: 'change',
    type: 'Function',
    default: '-',
    desc: '值变化时的回调',
    optional: [],
  },
];

const sliderSlots: IPropsTableItem[] = [
  {
    name: 'default',
    type: 'Slot',
    default: '-',
    desc: '滑块的默认插槽，用于自定义内容',
    optional: [],
  },
  {
    name: 'start',
    type: 'Slot',
    default: '-',
    desc: '滑块起始位置的插槽',
    optional: [],
  },
  {
    name: 'end',
    type: 'Slot',
    default: '-',
    desc: '滑块结束位置的插槽',
    optional: [],
  },
];

export default defineComponent({
  setup() {},
  render() {
    return (
      <div>
        <DemoTitle
          desc='用于操作反馈的中间态(loading)、成功、失败等'
          designLink='https://bkdesign.bk.tencent.com/design/139'
          name='Slider 滑动选择器'
        />
        <DemoBox
          componentName='slider'
          demoName='base-demo'
          desc='使用 v-model 将变量与 slider 滑杆进行数据绑定，默认最大值 max-value 为 100, 默认最小值为 min-value 0'
          subtitle=''
          title='基础用法'
        >
          <BaseDemo></BaseDemo>
        </DemoBox>
        <DemoBox
          componentName='slider'
          demoName='step-demo'
          desc=''
          subtitle=''
          title='刻度'
        >
          <StepDemo></StepDemo>
        </DemoBox>
        <DemoBox
          componentName='slider'
          demoName='input-demo'
          desc=''
          subtitle=''
          title='带输入'
        >
          <InputDemo></InputDemo>
        </DemoBox>
        <DemoBox
          componentName='slider'
          demoName='vertical-demo'
          desc=''
          subtitle=''
          title='垂直'
        >
          <VerticalDemo></VerticalDemo>
        </DemoBox>
        <DemoBox
          componentName='slider'
          demoName='custom-demo'
          desc=''
          subtitle=''
          title='自定义'
        >
          <CustomDemo></CustomDemo>
        </DemoBox>
        <PropsBox
          propsData={sliderProps}
          subtitle=''
          title='Slider 属性'
        />
        <PropsBox
          propsData={sliderEvents}
          subtitle=''
          title='Slider 事件'
        />
        <PropsBox
          propsData={sliderSlots}
          subtitle=''
          title='Slider 插槽'
        />
      </div>
    );
  },
});
