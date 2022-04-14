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

import BaseDemo from './baseDemo';
const propsJson: IPropsTableItem[] = [
  {
    name: 'active',
    type: 'String',
    default: '',
    desc: '当前显示的选项卡名称',
    optional: [],
  },
  {
    name: 'type',
    type: 'String',
    default: ['border-card'],
    desc: '选项卡样式',
    optional: ['card', 'border-card', 'unborder-card'],
  },
  {
    name: 'tab-position',
    type: 'String',
    default: 'top',
    desc: '选项卡位置',
    optional: ['left', 'right', 'top'],
  },
  {
    name: 'closable',
    type: 'Boolean',
    default: 'true',
    desc: '是否可关闭选项卡',
    optional: [],
  },
];
export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          name="tab"
          desc="Tab 选项卡，用于承载同一层级下不同页面或类别的组件，方便用户在同一个页面框架下进行快速切换。 。"
          link="https://www.google.com.hk/"/>
        <DemoBox
          title="基础用法"
          subtitle="基础的、简洁的标签页。"
          desc=""
          componentName="menu"
          demoName="base-demo">
             <BaseDemo/>
          </DemoBox>
        <PropsBox propsData={propsJson}/>
      </div>
    );
  },
});
