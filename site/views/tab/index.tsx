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

import { tabEventProps, tabPanelProps, tabProps } from '../../../packages/tab/src/props';
import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import { IPropsTableItem } from '../../typings';
import { resolvePropsToDesData } from '../utils';

import DemoAdd from './demo-add.vue';
import DemoBase from './demo-base.vue';
import CardDemo from './demo-card.vue';
import DemoCardGrid from './demo-card-grid.vue';
import DemoCardTab from './demo-card-tab.vue';
import DemoDrag from './demo-drag.vue';
import DemoExtend from './demo-extend.vue';
import DemoJsx from './demo-jsx';
import DemoPosition from './demo-position.vue';

const tabPropsJson: IPropsTableItem[] = resolvePropsToDesData(tabProps);
const tabPanelPropsJson: IPropsTableItem[] = resolvePropsToDesData(tabPanelProps);
const tabEventPropsJson: IPropsTableItem[] = resolvePropsToDesData(tabEventProps);
export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle name="Tab 选项卡" desc="选项卡切换组件。"/>
        <DemoBox
          title="基础用法"
          desc="基础的、简洁的标签页。"
          componentName="tab"
          demoName="demo-base">
          <DemoBase/>
        </DemoBox>
        <DemoBox
          title="选项卡样式"
          desc="通过配置 type 属性，设置选项卡样式。支持的属性有 card, border-card, unborder-card, vertical-card card-grid"
          componentName="tab"
          demoName="demo-card">
          <CardDemo/>
        </DemoBox>
        <DemoBox
          title="标签样式 "
          desc="通过配置 type 属性，设置选项卡样式。支持的属性有 card, border-card, unborder-card, vertical-card card-grid"
          componentName="tab"
          demoName="demo-card-tab">
          <DemoCardTab/>
        </DemoBox>
        <DemoBox
          title="card-grid"
          desc="通过配置 type 属性，设置选项卡样式。支持的属性有 card, border-card, unborder-card, vertical-card card-grid"
          componentName="tab"
          demoName="demo-card-grid">
          <DemoCardGrid/>
        </DemoBox>
        <DemoBox
          title="选项卡位置"
          desc="通过配置 tab-position 属性，设置选项卡位置。支持的属性有 left, right, top。当 tab-position 属性配置为 left 和 right 时，addable 属性以及 closable 属性无效。"
          componentName="tab"
          demoName="demo-position">
          <DemoPosition/>
        </DemoBox>
        <DemoBox
          title="可增删的选项卡"
          desc="配置 addable 属性可动态添加选项卡；配置 closable 可以动态删除选项卡"
          componentName="tab"
          demoName="demo-add">
          <DemoAdd/>
        </DemoBox>
        <DemoBox
          title="拖拽排序"
          desc="sortType 为replace时，为交换位置；为jump时，为插入当前位置。bk-tab :sortable=“true” 。tab 可拖拽排序。bk-tab-panel :unsortable=“ture”,此选项不可排序"
          componentName="tab"
          demoName="demo-drag">
          <DemoDrag/>
        </DemoBox>
        <DemoBox
          title="自定义选项卡内容"
          desc="通过使用 slot 自定义选项卡内容"
          componentName="tab"
          demoName="demo-extend">
          <DemoExtend/>
        </DemoBox>
        <DemoBox
          title="tsx用法"
          desc="tsx 写法"
          componentName="tab"
          suffix=".tsx"
          demoName="demo-jsx">
          <DemoJsx/>
        </DemoBox>
        <PropsBox title="tab 属性" propsData={tabPropsJson}/>
        <PropsBox title="tab 事件" propsData={tabEventPropsJson}/>
        <PropsBox title="tab-Panel 属性" propsData={tabPanelPropsJson}/>
      </div>
    );
  },
});
