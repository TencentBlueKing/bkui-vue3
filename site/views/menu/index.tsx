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
import i18n from '../../language/i18n';
import { IPropsTableItem } from '../../typings';

import BaseDemo from './base-demo.vue';

const { t } = i18n.global;
const menuPropsJson: IPropsTableItem[] = [
  {
    name: 'activeKey',
    type: 'String',
    default: '',
    desc: t('选中的menu的key'),
    optional: [],
  },
  {
    name: 'OpenedKeys',
    type: 'Array',
    default: [],
    desc: t('打开的submenu key值'),
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
    name: 'uniqueOpen',
    type: 'Boolean',
    default: 'true',
    desc: t('是否唯一展开一个submenu'),
    optional: [],
  },
];
const eventJson = [
  {
    name: 'update:activeKey',
    desc: t('选择项发生变化时触发'),
    params: 'key: string, {key: string, parentKey: string}',
  },
  {
    name: 'update:openKeys',
    desc: t('展开menu时触发'),
    params: 'value: string[]',
  },
  {
    name: 'click',
    desc: t('点击子项时触发'),
    params: 'key: string',
  },
  {
    name: 'openChange',
    desc: t('展开项发生变化时触发'),
    params: 'opened: boolean, {key: string, parentKey: string}',
  },
];
const subMenuEventJson = [
  {
    name: 'collapse',
    desc: t('展开变化时触发事件'),
    params: 'collapse: boolean, instance: VNode',
  },
];
const subMenuSlotsJson = [
  {
    name: 'icon',
    type: 'icon slot',
    default: [],
    desc: t('icon 插槽'),
    params: '--',
  },
];
const menuItemPropsJson = [
  {
    name: 'needIcon',
    type: 'Boolean',
    default: 'true',
    desc: t('是否展示Icon'),
    optional: [],
  },
];
const menuItemSlotsJson = [
  {
    name: 'icon',
    type: 'icon slot',
    default: [],
    desc: t('icon 插槽'),
    params: '--',
  },
];
const eventColumnMap = {
  name: t('名称'),
  desc: t('说明'),
  params: t('参数'),
};
const slotColumnMap = {
  name: t('名称'),
  desc: t('说明'),
  type: t('类型'),
  params: t('参数'),
};
export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          name="Menu"
          desc={ t('Menu组件， 为页面和功能提供导航的菜单列表。') }
          link="https://www.google.com.hk/"/>
        <DemoBox
          title={t('基础用法')}
          subtitle={ t('Menu组件的基础用法') }
          desc={ t('垂直菜单，子菜单内嵌在菜单区域。')}
          componentName="menu"
          demoName="base-demo">
             <BaseDemo/>
          </DemoBox>
        <PropsBox title={ t('Menu 属性') } propsData={menuPropsJson}/>
        <PropsBox title={ t('Menu 事件') } columnMap={eventColumnMap} propsData={eventJson}/>
        <PropsBox title={ t('SubMenu 事件') } columnMap={eventColumnMap} propsData={subMenuEventJson}/>
        <PropsBox title={ t('SubMenu 插槽') } columnMap={slotColumnMap} propsData={subMenuSlotsJson}/>
        <PropsBox title={ t('MenuItem 属性') } propsData={menuItemPropsJson}/>
        <PropsBox title={ t('MenuItem 插槽') } columnMap={slotColumnMap} propsData={menuItemSlotsJson}/>
      </div>
    );
  },
});
