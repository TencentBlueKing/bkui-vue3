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
import AlignDemo from './align-demo.vue';
import BaseDemo from './base-demo.vue';
import DropdownBoundaryBody from './boundary-body-demo.vue';
import DisabledDemo from './disabled-demo.vue';
import DropdownMethodsDemo from './dropdown-methods-demo.vue';
import IsShowDemo from './is-show-demo.vue';
import TriggerDemo from './trigger-demo.vue';

const dropdowProps: IPropsTableItem[] = [
  {
    name: 'is-show',
    type: 'Boolean',
    desc: '自定义控制显示与隐藏 trigger = manual 时生效',
    optional: ['true', 'false'],
    default: 'false',
  },
  {
    name: 'placement',
    type: 'String',
    desc: '下来菜单位置',
    optional: [
      'auto',
      'auto-start',
      'auto-end',
      'top',
      'right',
      'bottom',
      'left',
      'top-start',
      'top-end',
      'bottom-start',
      'bottom-end',
      'right-start',
      'right-end',
      'left-start',
      'left-end',
    ],
    default: 'bottom',
  },
  {
    name: 'disabled',
    type: 'Boolean',
    desc: '是否禁用弹出菜单',
    optional: ['true', 'false'],
    default: 'false',
  },
  {
    name: 'popover-options',
    type: 'Object',
    desc: 'Popover组件的配置项',
    optional: [],
    default: '{}',
  },
  {
    name: 'ext-cls',
    type: 'String',
    desc: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-dropdown 上',
    optional: [],
    default: '',
  },
];
const dropdownMenuProps: IPropsTableItem[] = [
  {
    name: 'extCls',
    type: 'String',
    desc: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-dropdown-menu 上',
    optional: [],
    default: '',
  },
];
const dropdownItemProps: IPropsTableItem[] = [
  {
    name: 'extCls',
    type: 'String',
    desc: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-dropdown-item 上',
    optional: [],
    default: '',
  },
];
const dropdownMethods: IPropsTableItem[] = [
  {
    name: 'show',
    type: 'Function',
    desc: '显示时触发',
    optional: [],
    default: '',
  },
  {
    name: 'hide',
    type: 'Function',
    desc: '隐藏时触发',
    optional: [],
    default: '',
  },
  {
    name: 'showChange',
    type: 'Function',
    desc: '显示 | 隐藏时触发',
    optional: [],
    default: '',
  },
];
const dropdownItemMethods: IPropsTableItem[] = [
  {
    name: 'click',
    type: 'Function',
    desc: '点击触发',
    optional: [],
    default: '',
  },
];
export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          desc=''
          designLink='https://bkdesign.bk.tencent.com/design/51'
          name='DropdownMenu 下拉菜单'
        />
        <DemoBox
          componentName='dropdown'
          demoName='base-demo'
          desc='slot[name=default] 配置触发对象，slot[name=content] 配置下拉菜单'
          title='基础用法'
        >
          <BaseDemo />
        </DemoBox>
        <DemoBox
          componentName='dropdown'
          demoName='align-demo'
          desc='通过配置参数 placement 可以让下拉菜单的位置，默认为 bottom'
          title='菜单出现的位置'
        >
          <AlignDemo />
        </DemoBox>
        <DemoBox
          componentName='dropdown'
          demoName='trigger-demo'
          desc='通过 trigger=click 设置触发事件类型'
          title='点击触发'
        >
          <TriggerDemo />
        </DemoBox>
        <DemoBox
          componentName='dropdown'
          demoName='is-show-demo'
          desc='通过 isShow 下来菜单的显示与隐藏，trigger=manual下生效'
          title='自定义显示与隐藏'
        >
          <IsShowDemo />
        </DemoBox>
        <DemoBox
          componentName='dropdown'
          demoName='disabled-demo'
          desc='通过 disabled 来禁用下来弹出'
          title='禁用状态'
        >
          <DisabledDemo />
        </DemoBox>
        <DemoBox
          componentName='dropdown'
          demoName='dropdown-methods-demo'
          desc='通过 show  hide 设置显示与隐藏的回调'
          title='回调函数'
        >
          <DropdownMethodsDemo />
        </DemoBox>
        <DemoBox
          componentName='dropdown'
          demoName='boundary-body-demo'
          desc="通过 popoverOptions 设置 boundary: 'body'"
          title='元素绑定在body下'
        >
          <DropdownBoundaryBody />
        </DemoBox>
        <PropsBox
          propsData={dropdowProps}
          subtitle=''
          title='Dropdown 属性'
        />
        <PropsBox
          propsData={dropdownMenuProps}
          subtitle=''
          title='DropdownMenu 属性'
        />
        <PropsBox
          propsData={dropdownItemProps}
          subtitle=''
          title='DropdownItem 属性'
        />
        <PropsBox
          propsData={dropdownMethods}
          subtitle=''
          title='Dropdown 事件'
        />
        <PropsBox
          propsData={dropdownItemMethods}
          subtitle=''
          title='DropdownItem 事件'
        />
      </div>
    );
  },
});
