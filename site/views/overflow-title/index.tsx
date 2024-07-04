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
    desc: '文本内容。该值没有的时候则默认取default slot',
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
    name: 'resizeable',
    type: 'Boolean',
    default: 'false',
    desc: '是否监听文本内容变化',
    optional: [],
  },
  {
    name: 'boundary',
    type: 'String, HTMLElement',
    default: 'document.body',
    desc: 'popover弹出内容绑定元素，可以被popoverOptions覆盖',
    optional: [],
  },
  {
    name: 'placement',
    type: 'String,',
    default: 'top-start',
    desc: 'popover组件显示位置，可以被popoverOptions覆盖',
    optional: [],
  },
  {
    name: 'popoverOptions',
    type: 'Object',
    default: '--',
    desc: 'Popover组件的配置项,type为title无效',
    optional: [],
  },
];

const overflowComponentSlots: IPropsTableItem[] = [
  {
    name: 'default',
    type: 'Slot',
    default: '-',
    desc: '默认插槽',
    optional: [],
  }
];

const overflowDirective: IPropsTableItem[] = [
  {
    name: 'content',
    type: 'String',
    default: '',
    desc: '文本内容。该值没有的时候则默认取default slot',
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
          desc='overflowTitle 文本溢出，通过title 或者tooltips展示全部内容.'
          link='#/overflowTitle'
          name='overflowTitle 文件溢出处理'
        />

        <DemoBox
          componentName='overflow-title'
          demoName='base-demo'
          desc='组件用法'
          title='组件用法'
        >
          <BaseDemo></BaseDemo>
        </DemoBox>
        <DemoBox
          componentName='overflow-title'
          demoName='directive'
          desc='指令用法'
          title='指令用法'
        >
          <Directive></Directive>
        </DemoBox>

        <PropsBox
          propsData={overflowComponent}
          subtitle=''
          title='overflowTitle 组件属性'
        />
        <PropsBox
          title='overflowTitle 插槽'
          subtitle=''
          propsData={overflowComponentSlots}
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
