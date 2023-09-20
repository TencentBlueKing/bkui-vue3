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
const navgationProps: IPropsTableItem[] = [
  {
    name: 'nav-width',
    type: 'Number | String',
    default: '60',
    desc: '初始左侧折叠导航的宽度',
    optional: [],
  },
  {
    name: 'hover-width',
    type: 'Number | String',
    default: '260',
    desc: '展开左侧导航的宽度',
    optional: [],
  },
  {
    name: 'side-title',
    type: 'String',
    default: '',
    desc: '左侧导航的主标题',
    optional: [],
  },
  {
    name: 'header-title',
    type: 'String',
    default: '',
    desc: '头部导航条的标题',
    optional: [],
  },
  {
    name: 'hover-leave-delay',
    type: 'Number',
    default: '0',
    desc: '左侧栏hover离开后折叠的延迟时长',
    optional: [],
  },
  {
    name: 'hover-enter-delay',
    type: 'Number',
    default: '100',
    desc: '左侧栏hover进入后展开的延迟时长',
    optional: [],
  },
  {
    name: 'default-open',
    type: 'Boolean',
    default: 'false',
    desc: '左侧栏初始状态',
    optional: [],
  },
  {
    name: 'need-menu',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示左侧导航',
    optional: [],
  },
  {
    name: 'navigation-type',
    type: 'String',
    default: 'left-right',
    desc: '导航风格 （left-right: 左右导航风格 top-bottom: 上下导航风格）',
    optional: ['left-right', 'top-bottom'],
  },
];
const navgationSlotsJson = [
  {
    name: 'default',
    default: [],
    desc: 'default 内容插槽',
    params: '--',
  },
  {
    name: 'header',
    default: [],
    desc: 'header 插槽',
    params: '--',
  },
  {
    name: 'footer',
    default: [],
    desc: 'footer 插槽',
    params: '--',
  },
  {
    name: 'menu',
    default: [],
    desc: '左侧menu 插槽',
    params: '--',
  },
  {
    name: 'side-icon',
    default: [],
    desc: '左侧header Icon 插槽',
    params: '--',
  },
  {
    name: 'side-header',
    default: [],
    desc: '左侧header 插槽',
    params: '--',
  },
  {
    name: 'side-footer',
    default: [],
    desc: '左侧footer 插槽',
    params: '--',
  },
];
const slotColumnMap = {
  name: '名称',
  desc: '说明',
  params: '参数',
};
export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          name="Navigation"
          desc="Navigation组件， 为应用提供导航的整体布局。"
          link="https://www.google.com.hk/"/>
        <DemoBox
          title="基础用法"
          subtitle="点击下面按钮可以切换不同的导航风格"
          desc="通过属性配置切换不同的导航风格"
          componentName="navigation"
          demoName="base-demo">
             <BaseDemo/>
          </DemoBox>
        <PropsBox propsData={navgationProps}/>
        <PropsBox title='SubMenu 插槽' columnMap={slotColumnMap} propsData={navgationSlotsJson}/>
      </div>
    );
  },
});
