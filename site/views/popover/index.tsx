/* eslint-disable */
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
    name: 'maxHeight',
    type: 'Number, String',
    default: 'auto',
    desc: '提示框的内容容器的最大高度',
    optional: [],
  },
  {
    name: 'maxWidth',
    type: 'Number, String',
    default: 'auto',
    desc: '提示框的内容容器的最大宽度',
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
    name: 'allowHtml',
    type: 'Boolean',
    default: 'false',
    desc: 'Content 是否支持传入HTML string',
    optional: ['true', 'false'],
  },
  {
    name: 'trigger',
    type: 'String',
    default: 'click hover manual',
    desc: ' 触发方式',
    optional: ['click', 'hover', 'manual'],
  },
  {
    name: 'renderType',
    type: 'String',
    default: 'auto',
    desc: ' content 渲染方式, auto: 默认渲染模式，shown：弹出层容器挂载完毕才会渲染内部组件',
    optional: ['auto', 'shown'],
  },
  {
    name: 'padding',
    type: 'number',
    default: '5',
    desc: '弹出填充',
    optional: [],
  },
  {
    name: 'offset',
    type: 'number | IAxesOffsets',
    default: '6',
    desc: `弹出位置偏移， IAxesOffsets：{
        mainAxis?: number;
        crossAxis?: number;
        alignmentAxis?: number | null;
    }`,
    optional: [],
  },
  {
    name: 'boundary',
    type: 'String, HTMLElement',
    default: 'parent',
    desc: '弹出内容绑定元素',
    optional: ['parent', 'document.body'],
  },
  {
    name: 'zIndex',
    type: 'number',
    default: 'undefined',
    desc: '层级',
    optional: [],
  },
  {
    name: 'disableTeleport',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用 Teleport',
    optional: ['true', 'false'],
  },
  {
    name: 'autoPlacement',
    type: 'Boolean',
    default: 'false',
    desc: '自动选择具有最多可用空间的展示位置',
    optional: ['true', 'false'],
  },
  {
    name: 'autoVisibility',
    type: 'Boolean',
    default: 'true',
    desc: '当有滚动条，滚动出可视范围时自动隐藏pop',
    optional: ['true', 'false'],
  },
  {
    name: 'disableOutsideClick',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用clickoutside',
    optional: ['true', 'false'],
  },
  {
    name: 'disableTransform',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用css transform更新位移',
    optional: ['true', 'false'],
  },
  {
    name: 'reference',
    type: 'string | HTMLElement',
    default: 'null',
    desc: '自定义 reference',
    optional: [],
  },
  {
    name: 'popoverDelay',
    type: 'number | number[]',
    default: '100',
    desc: '用于设置显示隐藏延迟时间，如果设置为数值类型，则表示显示和隐藏都延迟指定数值，如果需要分开设置显示隐藏请设置为数组[showDelay, hideDealy]',
    optional: [],
  },
  {
    name: 'extCls',
    type: 'string',
    default: '',
    desc: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM',
    optional: [],
  },
  {
    name: 'componentEventDelay',
    type: 'number',
    default: '',
    desc: `* 自定义Content组件渲染，point-event延迟渲染时间
    * 避免子组件point-event渲染时触发popover鼠标事件
    * 如果设置为0，则不启用此设置`,
    optional: [],
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

const methods: IPropsTableItem[] = [
  {
    name: 'show',
    type: 'Function',
    default: '',
    desc: '弹出popover',
    optional: [],
  },
  {
    name: 'hide',
    type: 'Function',
    default: '',
    desc: '隐藏popover',
    optional: [],
  },
  {
    name: 'stopHide',
    type: 'Function',
    default: '',
    desc: '阻止隐藏popover',
    optional: [],
  },
  {
    name: 'updatePopover',
    type: 'Function',
    default: '',
    desc: '更新popover配置，参数 (virtualEl = null, props = {})',
    optional: [],
  },
  {
    name: 'handleClickOutside',
    type: 'Function',
    default: '',
    desc: '触发click outside',
    optional: [],
  }
];

const qaData: IPropsTableItem[] = [
  {
    name: 'hover事件弹出 table 组件闪退',
    desc: '设置 componentEventDelay = number(大于0的数值， 300 - 500), 避免子组件point-event渲染时触发popover鼠标事件',
  }
];

const QAColumMap = {
  name: '问题',
  desc: '说明',
};

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
          designLink="https://bkdesign.bk.tencent.com/design/116"/>
        {
          demos.map(({ DemoComponent, ...demo }) => (
            <DemoBox {...demo}>
              <DemoComponent />
            </DemoBox>
          ))
        }
        <PropsBox title="属性" subtitle="" propsData={props}></PropsBox>
        <PropsBox title="事件" subtitle="" propsData={events}></PropsBox>
        <PropsBox title="方法" subtitle="" propsData={methods}></PropsBox>
        <PropsBox title="Q & A" subtitle="" columnMap={ QAColumMap } propsData={qaData}></PropsBox>
      </div>
    );
  },
});
