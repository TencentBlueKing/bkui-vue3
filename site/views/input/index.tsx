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
import { type IPropsTableItem } from '../../typings';

import AutoSize from './demo/autosize.vue';
import Basic from './demo/basic.vue';
import Clearable from './demo/clearable.vue';
import Combine from './demo/combine.vue';
import EventCallback from './demo/event-callback.vue';
import HoverClear from './demo/hover-clear.vue';
import Icon from './demo/icon.vue';
import MaxLength from './demo/max-length.vue';
import NativeAttrs from './demo/native-attrs.vue';
import Number from './demo/number.vue';
import Password from './demo/password.vue';
import Simple from './demo/simple.vue';
import Size from './demo/size.vue';
import Status from './demo/status.vue';
import Textarea from './demo/textarea.vue';
// 输入框属性列表
const inputProps: IPropsTableItem[] = [
  {
    name: 'type',
    type: 'String',
    default: 'text',
    desc: '输入框类型',
    optional: ['text', 'textarea', 'password', 'number', 'email', 'url', 'date'],
  },
  {
    name: 'placeholder',
    type: 'String',
    default: 'Enter',
    desc: '空白提示',
    optional: [],
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: false,
    desc: '是否不可用',
    optional: [],
  },
  {
    name: 'readonly',
    type: 'Boolean',
    default: false,
    desc: '是否只读',
    optional: [],
  },
  {
    name: 'prefix',
    type: 'String',
    default: false,
    desc: '前缀字符，当配置prefix slot时失效',
    optional: [],
  },
  {
    name: 'suffix',
    type: 'String',
    default: false,
    desc: '后缀字符，当配置suffix slot时失效',
    optional: [],
  },
  {
    name: 'clearable',
    type: 'Boolean',
    default: null,
    desc: '是否可清除。数字输入框时，此配置不生效',
    optional: [],
  },
  {
    name: 'maxlength',
    type: 'Boolean',
    default: null,
    desc: '最大输入长度',
    optional: [],
  },
  {
    name: 'minlength',
    type: 'Boolean',
    default: null,
    desc: '最小输入长度',
    optional: [],
  },
  {
    name: 'size',
    type: 'String',
    default: null,
    desc: '输入框尺寸，只在 type!="textarea" 时有效',
    optional: ['small', 'large'],
  },
  {
    name: 'name',
    type: 'String',
    default: null,
    desc: '名称',
    optional: [],
  },
  {
    name: 'precision',
    type: 'Number',
    default: null,
    desc: '保留小数位',
    optional: [],
  },
  {
    name: 'show-word-limit',
    type: 'Boolean',
    default: null,
    desc: '是否显示输入字数统计，只在 type = "text" 或 type = "textarea" 时有效',
    optional: [],
  },
  {
    name: 'over-max-length-limit',
    type: 'Boolean',
    default: false,
    desc: '超出最大字数限制后是否可以继续输入，结合maxlength使用',
    optional: [],
  },
  {
    name: 'show-overflow-tooltips',
    type: 'Boolean',
    default: true,
    desc: '文本超出长度是否显示tooltips',
    optional: [],
  },
  {
    name: 'autosize',
    type: 'Boolean, Object',
    default: false,
    desc: '设置文本框 autosize 属性使得根据内容自动调整的高度。 你可以给 autosize 提供一个包含有最大行数和最小行数的对象，让输入框自动调整。',
    optional: [],
  },
  {
    name: 'behavior',
    type: 'String',
    default: 'normal',
    desc: '简约风格设置(simplicity:简约 normal:正常 type=textarea时不生效)',
    optional: ['simplicity', 'normal'],
  },
  {
    name: 'stopPropagation',
    type: 'Boolean',
    default: true,
    desc: '是否阻止事件冒泡'
  }
];
// 输入框事件列表
const inputEvents: IPropsTableItem[] = [
  {
    name: 'update:modelValue',
    type: 'String',
    default: null,
    desc: '更新modelValue值',
    optional: [],
  },
  {
    name: 'focus',
    type: 'String',
    default: null,
    desc: '获取焦点时触发事件',
    optional: [],
  },
  {
    name: 'blur',
    type: 'String',
    default: null,
    desc: '失去焦点时触发事件',
    optional: [],
  },
  {
    name: 'change',
    type: 'String',
    default: null,
    desc: '值变更时触发事件',
    optional: [],
  },
  {
    name: 'clear',
    type: 'String',
    default: null,
    desc: '清空值时触发事件',
    optional: [],
  },
  {
    name: 'input',
    type: 'String',
    default: null,
    desc: '输入时触发事件',
    optional: [],
  },
  {
    name: 'keypress',
    type: 'String',
    default: null,
    desc: '按下键盘时触发',
    optional: [],
  },
  {
    name: 'keydown',
    type: 'String',
    default: null,
    desc: '按下键盘时触发事件',
    optional: [],
  },
  {
    name: 'keyup',
    type: 'String',
    default: null,
    desc: '按下键盘按键松开时触发事件',
    optional: [],
  },
  {
    name: 'enter',
    type: 'String',
    default: null,
    desc: '获取焦点时，按下回车时触发事件',
    optional: [],
  },
  {
    name: 'paste',
    type: 'String',
    default: null,
    desc: '粘贴内容时触发事件',
    optional: [],
  },
];
// 输入框插槽
const inputSlots = [
  {
    name: 'prefix',
    type: 'Slot',
    default: null,
    desc: '前置插槽',
    optional: [],
  },
  {
    name: 'suffix',
    type: 'Slot',
    default: null,
    desc: '后置插槽',
    optional: [],
  },
];

const demos = [
  {
    // '基础输入框',
    title: '基础输入框',
    desc: '使用 bk-input 标签配置输入框组件',
    componentName: 'input',
    demoName: 'demo/basic',
    DemoComponent: Basic,
  },
  {
    // 'hover 时才显示 clear 按钮',
    title: 'hover 时才显示 clear 按钮',
    desc: '配置show-clear-only-hover为true时，清除按钮在hover时才会显示',
    componentName: 'input',
    demoName: 'demo/hover-clear',
    DemoComponent: HoverClear,
  },
  {
    // '尺寸',
    title: '尺寸',
    desc: '可以使用 size 属性来定义按钮的尺寸，可接受 small large',
    componentName: 'input',
    demoName: 'demo/size',
    DemoComponent: Size,
  },
  {
    // '数字输入框',
    title: '数字输入框',
    desc: '通过配置 type 属性为 number 来设置数字类型输入，通过设置 max，min 设置最大最小值, 设置 precision 保留小数位(初始值会被四舍五入，例如：numberInputValue=4.5，precision=0时，值会被四舍五入为5)。数字输入框时，clearable 配置不生效',
    componentName: 'input',
    demoName: 'demo/number',
    DemoComponent: Number,
  },
  {
    // '多行文本输入框',
    title: '多行文本输入框',
    desc: '通过配置 type 属性为 textarea 来显示多行文本输入框',
    componentName: 'input',
    demoName: 'demo/textarea',
    DemoComponent: Textarea,
  },
  {
    // '自适应高度文本输入框',
    title: '自适应高度文本输入框',
    desc: '通过配置 type 属性为 textarea 来显示多行文本输入框',
    componentName: 'input',
    demoName: 'demo/autosize',
    DemoComponent: AutoSize,
  },
  {
    // '自适应高度文本输入框',
    title: '带长度限制的输入框',
    desc: `
      使用 maxlength 设置输入框的长度限度，一个中文等于一个计数长度。
      使用 maxcharacter 设置输入框的长度限度，一个中文汉字表示两个字符长度。
      使用 overMaxLengthLimit 设置是否允许在输入内容已经超出限制时继续输入。
    `,
    componentName: 'input',
    demoName: 'demo/max-length',
    DemoComponent: MaxLength,
  },
  {
    // '带清空操作输入框',
    title: '带清空操作输入框',
    desc: '通过配置 clearable 属性为 true 来启用有文本时允许清空操作',
    componentName: 'input',
    demoName: 'demo/clearable',
    DemoComponent: Clearable,
  },
  {
    // '密码框',
    title: '密码框',
    desc: '通过配置 type 属性为 password 来设置密码框；通过配置 password-icon 属性来设置切换显示密码的 icon',
    componentName: 'input',
    demoName: 'demo/password',
    DemoComponent: Password,
  },
  {
    // '组合型输入框',
    title: '组合型输入框',
    desc: '通过配置 slot=prefix, slot=suffix，来让组合输入框',
    componentName: 'input',
    demoName: 'demo/combine',
    DemoComponent: Combine,
  },
  {
    // '带Icon输入框',
    title: '带Icon输入框',
    desc: '通过配置 slot=prefix, slot=suffix，来设置icon',
    componentName: 'input',
    demoName: 'demo/icon',
    DemoComponent: Icon,
  },
  {
    // '带状态输入框',
    title: '带状态输入框',
    desc: '通过配置 disabled, readonly，来让输入框禁用、只读',
    componentName: 'input',
    demoName: 'demo/status',
    DemoComponent: Status,
  },
  {
    // '事件回调',
    title: '事件回调',
    desc: '支持 keyup enter keypress keydown change focus blur 回调事件',
    componentName: 'input',
    demoName: 'demo/event-callback',
    DemoComponent: EventCallback,
  },
  {
    // 'HTML 原生属性透传',
    title: 'HTML 原生属性透传',
    desc: '支持 HTML input 标签所有原生属性，设置 password 禁用自动填充功能',
    componentName: 'input',
    demoName: 'demo/native-attrs',
    DemoComponent: NativeAttrs,
  },
  {
    // '简约风格输入框',
    title: '简约风格输入框',
    desc: '通过属性behavior配置简约风格',
    componentName: 'input',
    demoName: 'demo/simple',
    DemoComponent: Simple,
  },
];

// const demos = [
//   {
//     // '基础输入框',
//     title: '基础输入框',
//     desc: '使用 bk-input 标签配置输入框组件',
//     componentName: 'input',
//     demoName: 'demo/basic',
//     DemoComponent: Basic,
//   },
//   {
//     // 'hover 时才显示 clear 按钮',
//     title: 'hover 时才显示 clear 按钮',
//     desc: '配置show-clear-only-hover为true时，清除按钮在hover时才会显示',
//     componentName: 'input',
//     demoName: 'demo/hover-clear',
//     DemoComponent: HoverClear,
//   },
//   {
//     // '尺寸',
//     title: '尺寸',
//     desc: '可以使用 size 属性来定义按钮的尺寸，可接受 small large',
//     componentName: 'input',
//     demoName: 'demo/size',
//     DemoComponent: Size,
//   },
//   {
//     // '数字输入框',
//     title: '数字输入框',
//     desc: '通过配置 type 属性为 number 来设置数字类型输入，通过设置 max，min 设置最大最小值, 设置 precision 保留小数位(初始值会被四舍五入，例如：numberInputValue=4.5，precision=0时，值会被四舍五入为5)。数字输入框时，clearable 配置不生效',
//     componentName: 'input',
//     demoName: 'demo/number',
//     DemoComponent: Number,
//   },
//   {
//     // '多行文本输入框',
//     title: '多行文本输入框',
//     desc: '通过配置 type 属性为 textarea 来显示多行文本输入框',
//     componentName: 'input',
//     demoName: 'demo/textarea',
//     DemoComponent: Textarea,
//   },
//   {
//     // '带清空操作输入框',
//     title: '带清空操作输入框',
//     desc: '通过配置 clearable 属性为 true 来启用有文本时允许清空操作',
//     componentName: 'input',
//     demoName: 'demo/clearable',
//     DemoComponent: Clearable,
//   },
//   {
//     // '密码框',
//     title: '密码框',
//     desc: '通过配置 type 属性为 password 来设置密码框；通过配置 password-icon 属性来设置切换显示密码的 icon',
//     componentName: 'input',
//     demoName: 'demo/password',
//     DemoComponent: Password,
//   },
//   {
//     // '组合型输入框',
//     title: '组合型输入框',
//     desc: '通过配置 slot=prefix, slot=suffix，来让组合输入框',
//     componentName: 'input',
//     demoName: 'demo/combine',
//     DemoComponent: Combine,
//   },
//   {
//     // '带Icon输入框',
//     title: '带Icon输入框',
//     desc: '通过配置 slot=prefix, slot=suffix，来设置icon',
//     componentName: 'input',
//     demoName: 'demo/icon',
//     DemoComponent: Icon,
//   },
//   {
//     // '带状态输入框',
//     title: '带状态输入框',
//     desc: '通过配置 disabled, readonly，来让输入框禁用、只读',
//     componentName: 'input',
//     demoName: 'demo/status',
//     DemoComponent: Status,
//   },
//   {
//     // '事件回调',
//     title: '事件回调',
//     desc: '支持 keyup enter keypress keydown change focus blur 回调事件',
//     componentName: 'input',
//     demoName: 'demo/event-callback',
//     DemoComponent: EventCallback,
//   },
//   {
//     // 'HTML 原生属性透传',
//     title: 'HTML 原生属性透传',
//     desc: '支持 HTML input 标签所有原生属性，设置 password 禁用自动填充功能',
//     componentName: 'input',
//     demoName: 'demo/native-attrs',
//     DemoComponent: NativeAttrs,
//   },
//   {
//     // '简约风格输入框',
//     title: '简约风格输入框',
//     desc: '通过属性behavior配置简约风格',
//     componentName: 'input',
//     demoName: 'demo/simple',
//     DemoComponent: Simple,
//   },
// ];

export default defineComponent({
  name: 'Input',
  render() {
    return (
      <div>
        <DemoTitle
          name='Input'
          desc='常用的输入框'
          link={`${import.meta.env.VITE_APP_BASE_URL ?? ''}/input`}
          designLink='https://bkdesign.bk.tencent.com/design/14'
        />
        {demos.map(({ DemoComponent, ...demo }) => (
          <DemoBox {...demo}>
            <DemoComponent />
          </DemoBox>
        ))}
        <PropsBox
          title='Input 属性'
          subtitle=''
          propsData={inputProps}
        />
        <PropsBox
          title='Input 插槽'
          subtitle=''
          propsData={inputSlots}
        />
        <PropsBox
          title='Input 事件'
          subtitle=''
          propsData={inputEvents}
        />
      </div>
    );
  },
});
