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

import BaseDemo from './base-demo.vue';
import ControllableDemo from './controllable-demo.vue';
import CustomDemo from './custom-demo.vue';
import DirectionDemo from './direction-demo.vue';
import SizeDemo from './size-demo.vue';
import StatusDemo from './status-demo.vue';
import ThemeDemo from './theme-demo.vue';


const stepsProps: IPropsTableItem[] = [
  {
    name: 'steps',
    type: 'Array',
    default: '--',
    desc: '	组件步骤内容，有四个可选的key：title icon description status。',
    optional: [],
  },
  {
    name: 'cur-step',
    type: 'Number',
    default: '1',
    desc: '当前步骤的索引值，从 1 开始',
    optional: [],
  },
  {
    name: 'direction',
    type: 'String',
    default: 'horizontal',
    desc: '步骤条方向，支持水平（horizontal）和竖直（vertical）两种方向',
    optional: ['horizontal', 'vertical'],
  },
  {
    name: 'size',
    type: 'String',
    default: '-',
    desc: '指定大小，目前支持普通（不设置）和小尺寸（small）',
    optional: ['small'],
  },
  {
    name: 'status',
    type: 'String',
    default: '-',
    desc: '指定当前步骤状态，不指定则为默认状态（是否完成）',
    optional: ['error', 'loading'],
  },
  {
    name: 'controllable',
    type: 'Boolean',
    default: '-',
    desc: '步骤可否被控制前后跳转',
    optional: ['false'],
  },
  {
    name: 'theme',
    type: 'String',
    default: 'primary',
    desc: '组件的主题色',
    optional: ['primary', 'success', 'warning', 'danger'],
  },
  {
    name: 'ext-cls',
    type: 'String',
    default: '-',
    desc: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-steps 上',
    optional: [],
  },
  {
    name: 'before-change',
    type: 'Function(nextStep)',
    default: '-',
    desc: '步骤切换前的钩子函数，支持异步函数',
    optional: [],
  },
];
const stepsEvents: IPropsTableItem[] = [
  {
    name: 'step-changed',
    type: 'Function',
    default: '回调参数（变化后的步骤 index）',
    desc: '当前步骤变化时的回调',
    optional: [],
  },
];
export default defineComponent({
  name: 'Steps',
  render() {
    return (
      <div>
        <DemoTitle
          name="Steps步骤条"
          desc="Steps步骤条，用于步骤类的场景组件"
          link={`${import.meta.env.VITE_APP_BASE_URL ?? ''}/steps`}
        />
        <DemoBox
          title="基础用法"
          desc="不传值时：默认选中第一个节点，颜色为蓝鲸主题色"
          componentName="steps"
          demoName="base-demo">
            <BaseDemo />
        </DemoBox>
        <DemoBox
          title="小尺寸"
          desc="可以使用 size 属性来定义尺寸，可接受 small"
          componentName="steps"
          demoName="size-demo">
            <SizeDemo />
        </DemoBox>
        <DemoBox
          title="设置主题"
          desc="可以通过 theme 属性来定义主题"
          componentName="steps"
          demoName="theme-demo">
            <ThemeDemo />
        </DemoBox>
        <DemoBox
          title="可点击"
          desc="可以通过 controllable为true 属性来使组件每个步骤可点击"
          componentName="steps"
          demoName="controllable-demo">
            <ControllableDemo />
        </DemoBox>

        <DemoBox
          title="垂直方向和实线"
          desc="可以通过 direction属性来设置组件排列方式，可接受horizontal，vertical，默认为horizontal。指定 line-type 值为 solid 显示为实线"
          componentName="steps"
          demoName="direction-demo">
            <DirectionDemo />
        </DemoBox>

        <DemoBox
          title="错误和加载中状态"
          desc="使用 status 属性设置当前步骤状态为错误或加载中，分别对应 error、loading 值，清空则还原为默认状态"
          componentName="steps"
          demoName="status-demo">
            <StatusDemo />
        </DemoBox>

        <DemoBox
          title="自定义步骤内容"
          desc="配置 steps 参数，具体内容参考下方属性表格"
          componentName="steps"
          demoName="custom-demo">
            <CustomDemo />
        </DemoBox>

        <PropsBox
          title="属性"
          subtitle=""
          propsData={stepsProps}/>
        <PropsBox
          title="事件"
          subtitle=""
          propsData={stepsEvents}/>
      </div>
    );
  },
});
