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
import type { IPropsTableItem } from '../../typings';

import BaseDemo from './base-demo.vue';
import CloseDemo from './close-demo.vue';
import MultiDemo from './multi-demo.vue';
import ThemeDemo from './theme-demo.vue';


const props: IPropsTableItem[] = [
  {
    name: 'theme',
    type: 'String',
    default: 'primary',
    desc: '组件主题色',
    optional: ['primary', 'warning', 'success', 'error'],
  },
  {
    name: 'message',
    type: 'String | IMessage',
    default: '',
    desc: '组件显示的文字内容，如果需要高阶用法，请查看IMessage说明',
    optional: [],
  },
  {
    name: 'delay',
    type: 'Number',
    default: '常规模式3000，高阶模式8000',
    desc: '组件延时关闭时间，值为 0 时需要手动关闭',
    optional: [],
  },
  {
    name: 'dismissable',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示右侧关闭 icon',
    optional: ['true', 'false'],
  },
  {
    name: 'offsetY',
    type: 'Number',
    default: '30',
    desc: '组件出现时距离视口顶部的偏移量',
    optional: [],
  },
  {
    name: 'spacing',
    type: 'Number',
    default: '10',
    desc: '多个组件之间的垂直距离',
    optional: [],
  },
  {
    name: 'extCls',
    type: 'String',
    default: '',
    desc: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-message 上',
    optional: [],
  },
  {
    name: 'onClose',
    type: 'Function',
    default: '',
    desc: '关闭组件时的回调函数, 参数为组件实例',
    optional: [],
  },
  {
    name: 'width',
    type: 'number',
    default: '常规模式下默认宽度560， 高阶模式默认宽度800',
    desc: '宽度设置，常规模式下默认宽度560， 高阶模式默认宽度800',
    optional: [],
  },
  {
    name: 'actions',
    type: 'IMessageAction[]',
    default: '',
    desc: '用于高阶模式下，操作按钮根据产品需求自定义，详细配置请参考高阶配置 IMessageActions',
    optional: [],
  },
];

const IMessage: IPropsTableItem[] = [
  {
    name: 'code',
    type: 'string | number',
    default: '',
    desc: '错误码',
    optional: [],
  },
  {
    name: 'overview',
    type: 'string',
    default: '',
    desc: '错误概述',
    optional: [],
  },
  {
    name: 'suggestion',
    type: 'string',
    default: '',
    desc: '操作建议',
    optional: [],
  },
  {
    name: 'details',
    type: 'string | Record<string, any> | Array<Record<string, any> | number | boolean>',
    default: '',
    desc: '详情',
    optional: [],
  },
  {
    name: 'assistant',
    type: 'string',
    default: '',
    desc: '助手',
    optional: [],
  },
  {
    name: 'type',
    type: 'MessageContentType',
    default: '',
    desc: ' 展开详情：数据展示格式，详情分为：Key Value 类详情、JSON 类详情',
    optional: ['key-value', 'json'],
  },
];

const IMessageActions = [
  {
    name: 'id',
    type: 'string | number',
    default: '',
    desc: '唯一ID，从给定的 IMessageActionType 中选择。如果是自定义的其他操作，此ID可以自定义，此时将会作为一个新的操作项追加',
    optional: ['assistant', 'details', 'fix', 'close'],
  },
  {
    name: 'text',
    type: '() => string | string',
    default: 'undefined',
    desc: '需要展示的文本，如果不设置显示默认',
    optional: [],
  },
  {
    name: 'icon',
    type: '() => VNode | string | VNode',
    default: 'undefined',
    desc: '需要展示的ICON，如果不设置显示默认',
    optional: [],
  },
  {
    name: 'onClick',
    type: '(...args) => Boolean | void',
    default: 'undefined',
    desc: '鼠标点击事件，如果返回false则阻止默认点击行为; 如果返回其他，默认行为不会阻止',
    optional: [],
  },
  {
    name: 'render',
    type: '() => VNode',
    default: 'undefined',
    desc: '自定义渲染 & 事件处理; 如果设置了render则整个渲染都需要自己处理，默认渲染将会被阻止, 此时其他配置将失效',
    optional: [],
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'undefined',
    desc: '是否禁用此功能，如果设置为true，则此功能不展示',
    optional: [],
  },
  {
    name: 'readonly',
    type: 'boolean',
    default: 'undefined',
    desc: '是否只读，如果设置为true，则此功能只做文本展示',
    optional: [],
  },
  {
    name: 'classList',
    type: 'string | string[]',
    default: 'undefined',
    desc: '需要添加到操作项外层元素的样式列表',
    optional: [],
  },
];

const ISlots = [
  {
    name: '#action',
    type: '',
    default: '',
    desc: '操作项插槽，可以覆盖默认操作项列表，完全自定义，如果启用此插槽，IMessageActions 相关配置将不再生效',
    optional: [],
  },
  {
    name: '#title',
    type: '',
    default: '`【message.code】${message.overview} ${message.suggestion}`',
    desc: '操作项描述，默认格式 【错误码】错误概述 + 操作建议（面向用户）',
    optional: [],
  },
];

const IMessageActionType  = [
  {
    name: 'ASSISTANT',
    type: 'assistant',
    default: '',
    desc: '联系助手：默认直接拉起企业微信与助手的聊天，需要在 message.assistant 配置对应的企微群ID',
    optional: [],
  },
  {
    name: 'DETAILS',
    type: 'details',
    default: '',
    desc: '展开详情：展开面向开发的详情',
    optional: [],
  },
  {
    name: 'FIX',
    type: 'fix',
    default: '',
    desc: '图钉按钮：点击后，Message 不会自动消失',
    optional: [],
  },
  {
    name: 'CLOSE',
    type: 'close',
    default: '',
    desc: '关闭：点击关闭，Message 消失',
    optional: [],
  },
];

export default defineComponent({
  render() {
    return (
    <div>
      <DemoTitle
        name="Message 消息提示"
        desc="用户操作后的消息提示，用于成功、失败、警告等消息提醒。"
        designLink="https://bkdesign.bk.tencent.com/design/47"/>
      <DemoBox
        title="基础用法"
        subtitle="使用默认配置的消息提示"
        desc=""
        componentName="message"
        demoName="base-demo">
        <BaseDemo/>
      </DemoBox>
      <DemoBox
        title="内置主题"
        subtitle="消息提醒提供消息、成功、警告、失败四种主题"
        desc=""
        componentName="message"
        demoName="theme-demo">
        <ThemeDemo/>
      </DemoBox>
      <DemoBox
        title="消息关闭"
        subtitle="配置 delay 字段定义消息自动关闭的时间，当值为 0 时不自动关闭。配置 dismissable 字段控制是否显示右侧的手动关闭 icon。"
        desc=""
        componentName="message"
        demoName="close-demo">
        <CloseDemo/>
      </DemoBox>
      <DemoBox
        title="高阶用法"
        subtitle="适用于有更多面向开发信息的场景。"
        desc=""
        componentName="message"
        demoName="close-demo">
        <MultiDemo/>
      </DemoBox>
      <PropsBox title="常规配置" subtitle="适用于查看类页面的同步报错" propsData={props}></PropsBox>
      <PropsBox title="高阶配置-IMessage" subtitle="适用于有更多面向开发信息的场景。" propsData={IMessage}></PropsBox>
      <PropsBox title="高阶配置-IMessageAction" subtitle="操作按钮自定义配置" propsData={IMessageActions}></PropsBox>
      <PropsBox title="高阶配置-IMessageActionType" subtitle="默认操作项说明" propsData={IMessageActionType}></PropsBox>
      <PropsBox title="高阶配置-Slot" subtitle="自定义插槽" propsData={ISlots}></PropsBox>
    </div>
    );
  },
});
