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

import DemCollapse from './demo/collapse.vue';
import DemCollapseAccordion from './demo/collapse-accordion.vue';
import DemCollapseClick from './demo/collapse-click.vue';
import DemCollapseDisabled from './demo/collapse-disabled.vue';
import DemCollapseEnterLeave from './demo/collapse-enter-leave.vue';
import DemCollapseTitle from './demo/collapse-title.vue';

const collapseProps: IPropsTableItem[] = [
  {
    name: 'list',
    type: 'Array',
    default: '[]',
    desc: '配置面板列表数据	',
    optional: [],
  },
  {
    name: '(modelValue)v-model',
    type: '<string|number>[] | string | number',
    default: '--',
    desc: '当前激活面板的key',
    optional: [],
  },
  {
    name: 'accordion',
    type: 'boolean',
    default: 'false',
    desc: '是否使用手风琴效果',
    optional: ['true', 'false'],
  },
  {
    name: 'idFiled',
    type: 'String',
    default: '--',
    desc: '激活面板的唯一标识，不配置默认使用面板的index',
    optional: [],
  },
  {
    name: 'titleField',
    type: 'String',
    default: 'name',
    desc: '面板标题key值',
    optional: [],
  },
  {
    name: 'contentField',
    type: 'String',
    default: 'content',
    desc: '面板内容key值',
    optional: [],
  },
];
const collapseEvents: IPropsTableItem[] = [
  {
    name: 'item-click',
    type: 'event',
    default: '回调参数（item）',
    desc: '点击时触发，回调参数为点击的面板对象',
    optional: [],
  },
  {
    name: 'before-enter',
    type: 'event',
    default: '--',
    desc: '动画开始前',
    optional: [],
  },
  {
    name: 'after-leave',
    type: 'event',
    default: '--',
    desc: '动画结束后',
    optional: [],
  },
];
const collapseSlots: IPropsTableItem[] = [
  {
    name: 'default',
    type: 'Slot',
    default: '--',
    desc: '面板标题插槽',
    optional: [],
  },
  {
    name: 'content',
    type: 'Slot',
    default: '--',
    desc: '面板内容插槽',
    optional: [],
  },
];
export default defineComponent({
  name: 'Affix',
  render() {
    return (
      <div>
        <DemoTitle
          name="Collapse 折叠面板"
          desc=""
          link={`${import.meta.env.VITE_APP_BASE_URL ?? ''}/collapse`}
        />
        <DemoBox
          title="基础用法"
          desc="v-model绑定默认激活的item项，idFiled作为唯一标识符,如果不填写默认为当前的item的index， list配置列表"
          componentName="collapse"
          demoName="demo/collapse">
            <DemCollapse />
        </DemoBox>
        <DemoBox
          title="是否使用手风琴模式"
          desc="可以配置参数 accordion 来确定是否使用手风琴模式"
          componentName="collapse"
          demoName="demo/collapse-accordion">
            <DemCollapseAccordion />
        </DemoBox>
        <DemoBox
          title="插槽：自定义面板标题"
          desc="通过配置默认插槽即可自定义标题内容"
          componentName="collapse"
          demoName="demo/collapse-title">
            <DemCollapseTitle />
        </DemoBox>
        <DemoBox
          title="点击事件"
          desc="通过配置默认插槽即可自定义标题内容"
          componentName="collapse"
          demoName="demo/collapse-click">
            <DemCollapseClick />
        </DemoBox>
        <DemoBox
          title="设置列表不可点击disabled"
          desc="通过配置list字段disabled即可"
          componentName="collapse"
          demoName="demo/collapse-disabled">
            <DemCollapseDisabled />
        </DemoBox>
        <DemoBox
          title="展开/收起 动画状态改变的回调事件"
          desc="配置事件before-enter/after-leave"
          componentName="collapse"
          demoName="demo/collapse-enter-leave">
            <DemCollapseEnterLeave />
        </DemoBox>
        <PropsBox
          title="Collapse Attributes"
          subtitle=""
          propsData={collapseProps}/>
        <PropsBox
          title="Collapse Slots"
          subtitle=""
          propsData={collapseSlots}/>
        <PropsBox
          title="Collapse Events"
          subtitle=""
          propsData={collapseEvents}/>
      </div>
    );
  },
});
