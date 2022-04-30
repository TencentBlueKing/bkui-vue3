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
    type: 'String',
    default: '',
    desc: '组件显示的文字内容',
    optional: [],
  },
  {
    name: 'delay',
    type: 'Number',
    default: '3000',
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
];
export default defineComponent({
  render() {
    return (
    <div>
      <DemoTitle
        name="Message 消息提示"
        desc="用户操作后的消息提示，用于成功、失败、警告等消息提醒。"
        link="https://www.google.com.hk/"/>
      <DemoBox
        title="基础用法"
        subtitle="使用默认配置的消息提示"
        desc=""
        componentName="Message"
        demoName="base-demo">
          <BaseDemo/>
      </DemoBox>
      <DemoBox
        title="内置主题"
        subtitle="消息提醒提供消息、成功、警告、失败四种主题"
        desc=""
        componentName="Message"
        demoName="theme-demo">
          <ThemeDemo/>
      </DemoBox>
      <DemoBox
        title="消息关闭"
        subtitle="配置 delay 字段定义消息自动关闭的时间，当值为 0 时不自动关闭。配置 dismissable 字段控制是否显示右侧的手动关闭 icon。"
        desc=""
        componentName="Message"
        demoName="close-demo">
          <CloseDemo/>
      </DemoBox>
        <PropsBox subtitle="" propsData={props}></PropsBox>
    </div>
    );
  },
});
