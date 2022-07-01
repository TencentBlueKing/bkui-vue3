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

const fixedNavBarPropsJson: IPropsTableItem[] = [
  {
    name: 'navItems',
    type: 'Array',
    default: null,
    desc: '需要固定展示的元素',
    optional: [],
  },
  {
    name: 'position',
    type: 'String',
    default: 'middle',
    desc: '位置，可以分别设置为上、中、下的位置',
    optional: ['top', 'middle', 'bottom'],
  },
  {
    name: 'extCls',
    type: 'String',
    default: '',
    desc: '自定义样式',
    optional: [],
  },

];

const fixedItemPropsJson: IPropsTableItem[] = [
  {
    name: 'icon',
    type: 'String',
    default: '',
    desc: '元素的icon',
    optional: [],
  },
  {
    name: 'text',
    type: 'String',
    default: '',
    desc: '元素的显示的文字',
    optional: [],
  },
  {
    name: 'action',
    type: 'Function',
    default: () => {},
    desc: '元素点击的回调函数',
    optional: [],
  },
  {
    name: 'tooltip',
    type: 'Object',
    default: '{ disabled: true }',
    desc: '用于自定义鼠标悬浮内容的配置',
    optional: [],
  },
];

export default defineComponent({
  render() {
    return (
      <>
        <DemoTitle
          name="FixedNavbar 悬浮导航"
          desc="FixedNavbar 悬浮导航组件，快速设置右侧悬浮面板"
          link="https://www.google.com.hk/"/>

        <DemoBox
          title="基础用法"
          desc="悬浮导航在右侧展示"
          componentName="fixed-navbar"
          demoName="base-demo"
        >
            <BaseDemo></BaseDemo>
        </DemoBox>

        <PropsBox
          title="FixedNavbar Attributes"
          subtitle=""
          propsData={fixedNavBarPropsJson}
        />
        <PropsBox
          subtitle=""
          title="NavItems Attributes"
          propsData={fixedItemPropsJson}
        />

      </>
    );
  },
});
