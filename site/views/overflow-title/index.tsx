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
import Directive from './directive.vue';

const overflowComponent: IPropsTableItem[] = [
  {
    name: 'content',
    type: 'String',
    default: '',
    desc: '文本内容。没有的话去default slot',
    optional: [],
  },
  {
    name: 'type',
    type: 'String',
    default: 'title',
    desc: '默认给文本加上title，如果tips，则鼠标悬浮添加添加tooltips，但是如果不是纯文本',
    optional: ['tips', 'title'],
  },
  {
    name: 'cal-type',
    type: 'String',
    default: 'dom',
    desc: '计算文本宽度方式，默认通过dom计算机文本宽度，canvas则通过measureText计算',
    optional: ['dom', 'canvas'],
  },
  {
    name: 'resizeable',
    type: 'Boolean',
    default: 'false',
    desc: '是否监听文本内容变化',
    optional: [],
  },
];

const overflowDirective: IPropsTableItem[] = [
  {
    name: 'content',
    type: 'String',
    default: '',
    desc: '文本内容。没有的话去default slot',
    optional: [],
  },
  {
    name: 'calType',
    type: 'String',
    default: 'dom',
    desc: '计算文本宽度方式，默认通过dom计算机文本宽度，canvas则通过measureText计算',
    optional: ['dom', 'canvas'],
  },
];

export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          name='overflowTitle 文件溢出处理'
          desc='overflowTitle 文本溢出，通过title 或者tooltips展示全部内容.'
          link='#/overflowTitle'
        />

        <DemoBox
          title='组件用法'
          desc='组件用法'
          componentName='overflow-title'
          demoName='base-demo'
        >
          <BaseDemo></BaseDemo>
        </DemoBox>
        <DemoBox
          title='指令用法'
          desc='指令用法'
          componentName='overflow-title'
          demoName='directive'
        >
          <Directive></Directive>
        </DemoBox>

        <PropsBox
          title='overflowTitle 组件属性'
          subtitle=''
          propsData={overflowComponent}
        />
        <PropsBox
          title='overflowTitle 指令属性(计算父元素宽度)'
          subtitle=''
          propsData={overflowDirective}
        />
      </div>
    );
  },
});
