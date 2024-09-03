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
import DemoAdd from './demo-add.vue';
import DemoBase from './demo-base.vue';
import CardDemo from './demo-card.vue';
import DemoCardGrid from './demo-card-grid.vue';
import DemoCardTab from './demo-card-tab.vue';
import DemoDrag from './demo-drag.vue';
import DemoExtend from './demo-extend.vue';
import DemoJsx from './demo-jsx';
import DemoNumber from './demo-number.vue';
import DemoPosition from './demo-position.vue';

const tabPropsJson: IPropsTableItem[] = [
  {
    name: 'active',
    type: 'Number|String',
    default: '--',
    desc: '选中的 tab',
  },
  {
    name: 'type',
    type: 'String',
    default: '--',
    desc: '选项卡样式',
    optional: ['card', 'border-card', 'unborder-card', 'vertical-card card-grid'],
  },
  {
    name: 'tab-position',
    type: 'String',
    default: '--',
    desc: '选项卡样式',
    optional: ['left', 'right', 'top'],
  },
  {
    name: 'closable',
    type: 'Boolean',
    default: '--',
    desc: '动态删除选项卡',
  },
  {
    name: 'addable',
    type: 'Boolean',
    default: '--',
    desc: '动态添加选项卡',
  },
  {
    name: 'sortable',
    type: 'Boolean',
    default: '--',
    desc: '拖拽排序选项卡',
  },
  {
    name: 'sort-type',
    type: 'Boolean',
    default: '--',
    desc: '拖拽排序选项卡',
    optional: ['insert', 'replace'],
  },
  {
    name: 'label-height',
    type: 'Number',
    default: '--',
    desc: '选项卡 高度',
  },
  {
    name: 'scroll-step',
    type: 'Number',
    default: '--',
    desc: '选项卡 高度',
  },
  {
    name: 'validate-active',
    type: 'Boolean',
    default: '--',
    desc: '有效选中',
  },
  {
    name: 'active-bar-size',
    type: 'Number',
    default: '--',
    desc: '选中条宽度',
  },
  {
    name: 'active-bar-color',
    type: 'Number',
    default: '--',
    desc: '选中条颜色',
  },
];
// const tabPanelPropsJson: IPropsTableItem[] = resolvePropsToDesData(tabPanelProps);
const tabPanelPropsJson: IPropsTableItem[] = [
  {
    name: 'name',
    type: 'String|Number',
    default: '--',
    desc: 'Panel 标记',
  },
  {
    name: 'label',
    type: 'String|Function',
    default: '--',
    desc: 'Panel 渲染内容',
  },
  {
    name: 'tips',
    type: 'String',
    default: '--',
    desc: '选项卡提示',
  },
  {
    name: 'closable',
    type: 'Boolean',
    default: '--',
    desc: '选项卡关闭',
  },
  {
    name: 'visible',
    type: 'Boolean',
    default: '--',
    desc: '选项卡可见',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: '--',
    desc: '选项卡禁用',
  },
  {
    name: 'sortable',
    type: 'Boolean',
    default: '--',
    desc: '选项卡排序',
  },
  {
    name: 'render-directive',
    type: 'Boolean',
    default: 'show|if',
    desc: 'Panel 渲染方式',
  },
  {
    name: 'panel',
    type: 'String|Function',
    default: '--',
    desc: 'Panel 渲染',
  },
  {
    name: 'num',
    type: 'Number',
    default: '--',
    desc: '支持panel数字展示',
  },
  {
    name: 'numDisplayType',
    type: 'String',
    default: '--',
    desc: '通过numDisplayType设置数字样式，支持的属性有bracket(括号)、square(方形)、elliptic(椭圆)',
  },
];
const tabEventPropsJson = [
  {
    name: 'add',
    desc: '添加选项卡事件',
    params: '{ e: MouseEvent }',
  },
  {
    name: 'change',
    desc: '切换选项卡选中事件',
    params: 'name',
  },
  {
    name: 'remove',
    desc: '移除选项卡事件',
    params: 'index, panel',
  },
  {
    name: 'sort',
    desc: '排序事件',
    params: 'dragTabIndex, dropTabIndex, sortType',
  },
  {
    name: 'drag',
    desc: '拖拽事件',
    params: 'dragTabIndex, dragEvent',
  },
];
const eventColumnMap = {
  name: '名称',
  desc: '说明',
  params: '参数',
};
export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          desc='选项卡切换组件。'
          designLink='https://bkdesign.bk.tencent.com/design/80'
          name='Tab 选项卡'
        />
        <DemoBox
          componentName='tab'
          demoName='demo-base'
          desc='基础的、简洁的标签页。'
          title='基础用法'
        >
          <DemoBase />
        </DemoBox>
        <DemoBox
          componentName='tab'
          demoName='demo-card'
          desc='通过配置 type 属性，设置选项卡样式。支持的属性有 card, border-card, unborder-card, vertical-card card-grid'
          title='选项卡样式'
        >
          <CardDemo />
        </DemoBox>
        <DemoBox
          componentName='tab'
          demoName='demo-card-tab'
          desc='通过配置 type 属性，设置选项卡样式。支持的属性有 card, border-card, unborder-card, vertical-card card-grid'
          title='标签样式 '
        >
          <DemoCardTab />
        </DemoBox>
        <DemoBox
          componentName='tab'
          demoName='demo-card-grid'
          desc='通过配置 type 属性，设置选项卡样式。支持的属性有 card, border-card, unborder-card, vertical-card card-grid'
          title='card-grid'
        >
          <DemoCardGrid />
        </DemoBox>
        <DemoBox
          componentName='tab'
          demoName='demo-position'
          desc='通过配置 tab-position 属性，设置选项卡位置。支持的属性有 left, right, top。当 tab-position 属性配置为 left 和 right 时，addable 属性以及 closable 属性无效。'
          title='选项卡位置'
        >
          <DemoPosition />
        </DemoBox>
        <DemoBox
          componentName='tab'
          demoName='demo-add'
          desc='配置 addable 属性可动态添加选项卡；配置 closable 可以动态删除选项卡'
          title='可增删的选项卡'
        >
          <DemoAdd />
        </DemoBox>
        <DemoBox
          componentName='tab'
          demoName='demo-drag'
          desc='sortType 为replace时，为交换位置；为jump时，为插入当前位置。bk-tab :sortable=“true” 。tab 可拖拽排序。bk-tab-panel :unsortable=“ture”,此选项不可排序'
          title='拖拽排序'
        >
          <DemoDrag />
        </DemoBox>
        <DemoBox
          componentName='tab'
          demoName='demo-extend'
          desc='通过使用 slot 自定义选项卡内容'
          title='自定义选项卡内容'
        >
          <DemoExtend />
        </DemoBox>
        <DemoBox
          componentName='tab'
          demoName='demo-jsx'
          desc='tsx 写法'
          suffix='.tsx'
          title='tsx用法'
        >
          <DemoJsx />
        </DemoBox>
        <DemoBox
          componentName='tab'
          demoName='demo-number'
          desc='通过配置num属性设置是否显示数字，通过numDisplayType设置数字样式，支持的属性有bracket(括号)、square(方形)、elliptic(椭圆)。'
          title='带数字样式'
        >
          <DemoNumber />
        </DemoBox>
        <PropsBox
          propsData={tabPropsJson}
          title='tab 属性'
        />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={tabEventPropsJson}
          title='tab 事件'
        />
        <PropsBox
          propsData={tabPanelPropsJson}
          title='tab-Panel 属性'
        />
      </div>
    );
  },
});
