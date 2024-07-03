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
import LoadingDemo from './loading-demo.vue';
import StatusDemo from './status-demo.vue';

const processProps: IPropsTableItem[] = [
  {
    name: 'list',
    type: 'Array',
    default: '--',
    desc: 'process 数据源',
    optional: [],
  },
  {
    name: 'display-key',
    type: 'String',
    default: 'content',
    desc: '循环 list 时，显示字段的 key 值',
    optional: [],
  },
  {
    name: 'controllable',
    type: 'Boolean',
    default: 'false',
    desc: '步骤可否被控制前后跳转',
    optional: ['true', 'false'],
  },
  {
    name: 'cur-process',
    type: 'Number',
    default: 1,
    desc: '当前步骤的索引值',
    optional: [],
  },
  {
    name: 'ext-cls',
    type: 'String',
    default: '--',
    desc: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-process 上',
    optional: [],
  },
];

const processEvents: IPropsTableItem[] = [
  {
    name: 'update:cur-process',
    type: 'Function',
    default: '回调参数（变化后的步骤 index）',
    desc: '更新当前流程步骤',
    optional: [],
  },
  {
    name: 'click',
    type: 'Function',
    default: '回调参数（变化后的步骤 index）',
    desc: '当前步骤变化时的回调',
    optional: [],
  },
];

export default defineComponent({
  name: 'Process',
  render() {
    return (
      <div>
        <DemoTitle
          desc='Process 步骤组件'
          link={`${import.meta.env.VITE_APP_BASE_URL ?? ''}/process`}
          name='Process 步骤'
        />
        <DemoBox
          componentName='process'
          demoName='base-demo'
          desc='默认配置list，配置 controllable 可控制 process 前后跳转'
          title='基础用法'
        >
          <BaseDemo />
        </DemoBox>
        <DemoBox
          componentName='process'
          demoName='loading-demo'
          desc='在 list 数据源中配置, 设置status 为 loading'
          title='loading状态'
        >
          <LoadingDemo />
        </DemoBox>
        <DemoBox
          componentName='process'
          demoName='status-demo'
          desc='配置 steps 的不同状态, 使用 status 属性设置当前步骤状态，支持 default、done、loading、error。 同样也可以是用icon属性添加icon '
          title='步骤状态、自定义icon配置'
        >
          <StatusDemo />
        </DemoBox>

        <PropsBox
          propsData={processProps}
          subtitle=''
          title='属性'
        />

        <PropsBox
          propsData={processEvents}
          subtitle=''
          title='事件'
        />
      </div>
    );
  },
});
