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

import Always from './demo/always.vue';
import Base from './demo/base.vue';
import Callback from './demo/callback.vue';
import ClickTrigger from './demo/click-trigger.vue';
import MouseEvent from './demo/mouse-event.vue';
import Position from './demo/position.vue';
import Slot from './demo/slot.vue';

const props: IPropsTableItem[] = [
  {
    name: 'content',
    type: 'String',
    default: '',
    desc: '显示的内容',
    optional: [],
  },
  {
    name: 'placement',
    type: 'String',
    default: 'top',
    desc: '组件显示位置',
    optional: ['auto', 'auto-start', 'auto-end', 'top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'right', 'right-start', 'right-end', 'left', 'left-start', 'left-end'],
  },
  {
    name: 'theme',
    type: 'String',
    default: 'dark',
    desc: '组件主题色',
    optional: ['dark', 'light'],
  },
  {
    name: 'trigger',
    type: 'String',
    default: 'hover',
    desc: '触发方式。如果值为manual，则通过isShow控制显示、隐藏',
    optional: ['click', 'hover', 'manual'],
  },
  {
    name: 'isShow',
    type: 'Boolean',
    default: 'false',
    desc: '控制显示、隐藏',
    optional: ['true', 'false'],
  },
  {
    name: 'arrow',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示箭头',
    optional: ['true', 'false'],
  },
  {
    name: 'width',
    type: 'Number, String',
    default: 'auto',
    desc: '提示框的内容容器的宽度',
    optional: [],
  },
  {
    name: 'height',
    type: 'Number, String',
    default: 'auto',
    desc: '提示框的内容容器的高度',
    optional: [],
  },
  {
    name: 'always',
    type: 'Boolean',
    default: 'false',
    desc: '是否总是可见',
    optional: ['true', 'false'],
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用提示框',
    optional: ['true', 'false'],
  },
  {
    name: 'boundary',
    type: 'String, HTMLElement',
    default: 'parent',
    desc: '弹出内容绑定元素',
    optional: ['parent', 'document.body'],
  },
  {
    name: 'fixOnBoundary',
    type: 'Boolean',
    default: 'false',
    desc: '如果设置了boundary为指定DOM，此配置项生效。是否将弹出内容固定到目标元素位置。例如：boundary = document.body, fixOnBoundary = true，则弹出内容会一直固定到body',
    optional: ['true', 'false'],
  },
];

const events: IPropsTableItem[] = [
  {
    name: 'after-show',
    type: 'Function',
    default: '',
    desc: '显示提示框时触发函数',
    optional: [],
  },
  {
    name: 'after-hidden',
    type: 'Function',
    default: '',
    desc: '隐藏提示框时触发函数',
    optional: [],
  },
];

const demos = [
  {
    title: '基础用法',
    desc: '最简单的用法',
    componentName: 'popover',
    demoName: 'demo/base',
    DemoComponent: Base,
  },
  {
    title: '超长内容',
    desc: '通过自定义 slot 显示多行文本或更复杂的样式',
    componentName: 'popover',
    demoName: 'demo/slot',
    DemoComponent: Slot,
  },
  {
    title: '不同位置',
    desc: '通过 placement 属性展示十二种方位的提示',
    componentName: 'popover',
    demoName: 'demo/position',
    DemoComponent: Position,
  },
  {
    title: '总是显示',
    desc: '设置属性 always 总是显示提示框',
    componentName: 'popover',
    demoName: 'demo/always',
    DemoComponent: Always,
  },
  {
    title: '自定义回调函数',
    desc: '自定义显示以及隐藏时的回调函数',
    componentName: 'popover',
    demoName: 'demo/callback',
    DemoComponent: Callback,
  },
  {
    title: 'trigger click',
    desc: 'trigger click',
    componentName: 'popover',
    demoName: 'demo/click-trigger',
    DemoComponent: ClickTrigger,
  },
  {
    title: 'mouse click',
    desc: 'mouse click',
    componentName: 'popover',
    demoName: 'demo/mouse-event',
    DemoComponent: MouseEvent,
  },
];

export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          name="Popover 弹出框提示"
          desc="当鼠标指向页面元素时给出简单的提示"
          link="https://www.google.com.hk/"/>
          {
            demos.map(({ DemoComponent, ...demo }) => (
              <DemoBox {...demo}>
                <DemoComponent />
              </DemoBox>
            ))
          }
          <PropsBox title="属性" subtitle="" propsData={props}></PropsBox>
          <PropsBox title="事件" subtitle="" propsData={events}></PropsBox>
      </div>
    );
  },
});
