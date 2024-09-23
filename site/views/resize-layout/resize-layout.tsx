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
import AdvanceDemo from './advance-demo.vue';
import AutoMiniMizeDemo from './auto-minimize-demo.vue';
import BaseDemo from './base-demo.vue';
import CollapsibleDemo from './collapsible-demo.vue';
import ImmediateDemo from './immediate-demo.vue';

const eventColumnMap = {
  name: '名称',
  desc: '说明',
  params: '参数',
};

const slotColumnMap = {
  name: '名称',
  desc: '说明',
  type: '类型',
  params: '参数',
};

const propsJson = [
  {
    name: 'placement',
    type: 'string',
    default: 'left',
    desc: '侧栏在布局中的位置',
    optional: ['top', 'left', 'right', 'bottom'],
  },
  {
    name: 'min',
    type: 'number',
    default: '3',
    desc: '侧栏最小像素宽度',
    optional: [],
  },
  {
    name: 'max',
    type: 'number',
    default: '无穷大',
    desc: '侧栏最大像素宽度',
    optional: [],
  },
  {
    name: 'triggerWidth',
    type: 'number',
    default: '5',
    desc: '拖拽区域大小',
    optional: [],
  },
  {
    name: 'triggerOffset',
    type: 'number',
    default: '3',
    desc: '',
    optional: [],
  },
  {
    name: 'initialDivide',
    type: 'string|number',
    default: '20%',
    desc: '侧栏初始大小,当同时设置initialDivide与min都为number类型时以最大值为默认值',
    optional: [],
  },
  {
    name: 'immediate',
    type: 'boolean',
    default: 'false',
    desc: '是否实时拉伸',
    optional: ['false', 'true'],
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    desc: '是否禁用',
    optional: ['false', 'true'],
  },
  {
    name: 'collapsible',
    type: 'boolean',
    default: 'false',
    desc: '是否开启折叠功能',
    optional: ['false', 'true'],
  },
  {
    name: 'isCollapsed',
    type: 'boolean',
    default: 'false',
    desc: '折叠状态',
    optional: ['false', 'true'],
  },
  {
    name: 'autoMinimize',
    type: 'boolean',
    default: 'false',
    desc: '是否自定最小化',
    optional: ['false', 'true'],
  },
  {
    name: 'border',
    type: 'boolean',
    default: 'true',
    desc: '是否显示外边框',
    optional: ['false', 'true'],
  },
];

const eventJson = [
  {
    name: 'before-resize',
    desc: '拉伸前的回调',
    params: 'event',
  },
  {
    name: 'resizing',
    desc: '拉伸时的回调',
    params: 'width/height',
  },
  {
    name: 'after-resize',
    desc: '拉伸后的回调',
    params: 'width/height',
  },
  {
    name: 'collapse-change',
    desc: '展开/折叠状态变更事件',
    params: 'collapsed',
  },
];

const slotJson = [
  {
    name: 'aside',
    type: 'Slot',
    default: null,
    desc: '侧栏内容',
    optional: [],
  },
  {
    name: 'main',
    type: 'Slot',
    default: null,
    desc: '主要内容',
    optional: [],
  },
  {
    name: 'collapse-trigger',
    type: 'Slot',
    default: null,
    desc: '折叠按钮',
    optional: [],
  },
];

export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          desc='通过拉伸侧栏调整布局大小'
          designLink='https://bkdesign.bk.tencent.com/design/156'
          name='Resize Layout'
        />
        <DemoBox
          componentName='resize-layout'
          demoName='base-demo'
          desc=''
          title='基础用法'
        >
          <BaseDemo />
        </DemoBox>
        <DemoBox
          componentName='resize-layout'
          demoName='auto-minimize-demo'
          desc=''
          title='最小化'
        >
          <AutoMiniMizeDemo />
        </DemoBox>
        <DemoBox
          componentName='resize-layout'
          demoName='immediate-demo'
          desc=''
          title='实时拉伸'
        >
          <ImmediateDemo />
        </DemoBox>
        <DemoBox
          componentName='resize-layout'
          demoName='collapsible-demo'
          desc=''
          title='可折叠'
        >
          <CollapsibleDemo />
        </DemoBox>
        <DemoBox
          componentName='resize-layout'
          demoName='advance-demo'
          desc=''
          title='多级嵌套'
        >
          <AdvanceDemo />
        </DemoBox>
        <PropsBox
          propsData={propsJson}
          subtitle=''
        />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={eventJson}
          title='Select 事件'
        />
        <PropsBox
          columnMap={slotColumnMap}
          propsData={slotJson}
          subtitle=''
          title='Select 插槽'
        />
      </div>
    );
  },
});
