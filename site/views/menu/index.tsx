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

const menuPropsJson: IPropsTableItem[] = [
  {
    name: 'active-key',
    type: 'String',
    default: '',
    desc: '选中的menu的key',
    optional: [],
  },
  {
    name: 'opened-keys',
    type: 'Array',
    default: [],
    desc: '打开的submenu key值',
    optional: [],
  },
  // {
  //   name: 'mode',
  //   type: 'String',
  //   default: 'vertical',
  //   desc: '展示方式',
  //   optional: ['vertical', 'horizontal'],
  // },
  {
    name: 'unique-open',
    type: 'Boolean',
    default: 'true',
    desc: '是否唯一展开一个submenu',
    optional: [],
  },
];

const menuGroupPropsJson: IPropsTableItem[] = [
  {
    name: 'name',
    type: 'String',
    default: '',
    desc: 'group name',
  },
  {
    name: 'foldName',
    type: 'String | undefined',
    default: 'undefined',
    desc: '折叠后显示的分组名',
  },
];

const menuItemPropsJson = [
  {
    name: 'need-icon',
    type: 'Boolean',
    default: 'true',
    desc: '是否展示Icon',
    optional: [],
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用',
    optional: [],
  },
];

const eventJson = [
  {
    name: 'update:activeKey',
    desc: '选择项发生变化时触发',
    params: 'key: string, {key: string, parentKey: string}',
  },
  {
    name: 'update:openKeys',
    desc: '展开menu时触发',
    params: 'value: string[]',
  },
  {
    name: 'click',
    desc: '点击子项时触发',
    params: 'key: string',
  },
  {
    name: 'openChange',
    desc: '展开项发生变化时触发',
    params: 'opened: boolean, {key: string, parentKey: string}',
  },
];
const subMenuEventJson = [
  {
    name: 'collapse',
    desc: '展开变化时触发事件',
    params: 'collapse: boolean, instance: VNode',
  },
];
const menuItemEventJson = [
  {
    name: 'click',
    desc: '点击事件',
    params: 'Event',
  },
];
const subMenuSlotsJson = [
  {
    name: 'icon',
    type: 'icon slot',
    default: [],
    desc: 'icon 插槽',
    params: '--',
  },
];

const menuItemSlotsJson = [
  {
    name: 'icon',
    type: 'icon slot',
    default: [],
    desc: 'icon 插槽',
    params: '--',
  },
];
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
export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          desc='Menu组件， 为页面和功能提供导航的菜单列表。'
          link='https://www.google.com.hk/'
          name='Menu'
        />
        <DemoBox
          componentName='menu'
          demoName='base-demo'
          desc='垂直菜单，子菜单内嵌在菜单区域。'
          subtitle='Menu组件的基础用法'
          title='基础用法'
        >
          <BaseDemo />
        </DemoBox>

        <PropsBox
          propsData={menuPropsJson}
          title='Menu 属性'
        />
        <PropsBox
          propsData={menuGroupPropsJson}
          title='MenuGroup 属性'
        />
        <PropsBox
          propsData={menuItemPropsJson}
          title='MenuItem 属性'
        />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={eventJson}
          title='Menu 事件'
        />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={eventJson}
          title='MenuItem 事件'
        />
        <PropsBox
          columnMap={eventColumnMap}
          propsData={subMenuEventJson}
          title='SubMenu 事件'
        />
        <PropsBox
          columnMap={slotColumnMap}
          propsData={subMenuSlotsJson}
          title='SubMenu 插槽'
        />

        <PropsBox
          columnMap={slotColumnMap}
          propsData={menuItemSlotsJson}
          title='MenuItem 插槽'
        />
      </div>
    );
  },
});
