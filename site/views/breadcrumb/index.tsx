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

import { defineComponent, ref } from 'vue';

import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import { IPropsTableItem } from '../../typings';
import BaseDemo from './base-demo.vue';
import PrefixDemo from './prefix-demo.vue';
import SeparatorDemo from './separator-demo.vue';

const breadcrumbPropsJson: IPropsTableItem[] = [
  {
    name: 'separator',
    type: 'String',
    default: "斜杠'/'",
    desc: '分隔符',
    optional: [],
  },
  {
    name: 'separator-class',
    type: 'String',
    default: '',
    desc: '图标分隔符 class',
    optional: [],
  },
  {
    name: 'back-router',
    type: 'String/Object',
    default: '',
    desc: '点击回退按钮自定义的路由(路由跳转对象，同 vue-router 的 to)',
    optional: [],
  },
  {
    name: 'replace',
    type: 'Boolean',
    default: 'false',
    desc: '开启backRouter并使用默认的icon跳转时，是否替换当前路由历史',
    optional: [],
  },
  {
    name: 'ext-cls',
    type: 'String',
    default: '',
    desc: '自定义样式类名',
    optional: [],
  },
];

const breadcrumbSlotJson: IPropsTableItem[] = [
  {
    name: 'default',
    type: 'Function',
    default: '',
    desc: '默认插槽，放置 BreadcrumbItem 组件',
    optional: [],
  },
  {
    name: 'prefix',
    type: 'Slot',
    default: '-',
    desc: '插槽，用于替换默认回退按钮',
    optional: [],
  }
];

const breadcrumbItemPropsJson: IPropsTableItem[] = [
  {
    name: 'ext-cls',
    type: 'String',
    default: '',
    desc: '自定义样式类名',
    optional: [],
  },
  {
    name: 'to',
    type: 'String | Object',
    default: '',
    desc: '点击后跳转的链接，可以是一个路径或一个描述目标位置的对象',
    optional: [],
  },
  {
    name: 'replace',
    type: 'Boolean',
    default: false,
    desc: '是否替换当前的历史记录',
    optional: [],
  },
];

const breadcrumbItemEvents: IPropsTableItem[] = [
  {
    name: 'click',
    type: 'Function',
    default: '-',
    desc: '点击事件自身的回调函数',
    optional: [],
  },
];

const breadcrumbItemSlots: IPropsTableItem[] = [
  {
    name: 'default',
    type: 'Slot',
    default: '-',
    desc: '默认插槽，放置面包屑项的内容',
    optional: [],
  },
  {
    name: 'separator',
    type: 'Slot',
    default: '-',
    desc: '自定义分隔符插槽',
    optional: [],
  },
];
export default defineComponent({
  setup() {
    const separator = ref('/');
    const list = [
      { title: '首页', link: { path: '/' } },
      { title: '进度条', link: { path: 'loading' } },
      { title: '滑块开关', link: { path: 'switcher' } },
      { title: '面包屑', link: null },
    ];
    return {
      list,
      separator,
    };
  },
  render() {
    return (
      <div>
        <DemoTitle
          desc='Breadcrumb组件， 显示当前页面的路径，快速返回之前的任意页面。'
          link='https://www.google.com.hk/'
          name='Breadcrumb 面包屑'
        />

        <DemoBox
          componentName='breadcrumb'
          demoName='base-demo'
          desc='通过设置 BkBreadcrumbItem 的 to 属性添加跳转链接。'
          subtitle='垂直菜单，子菜单内嵌在菜单区域。'
          title='基础用法'
        >
          <BaseDemo></BaseDemo>
        </DemoBox>

        <DemoBox
          componentName='breadcrumb'
          demoName='separator-demo'
          desc='通过设置 BkBreadcrumb 的 separator 属性设置分隔符，他可以是字符串或者是slot'
          subtitle='通过自定义 字符串 如：> | / 分割。'
          title='字符分割'
        >
          <SeparatorDemo></SeparatorDemo>
        </DemoBox>

        <DemoBox
          componentName='breadcrumb'
          demoName='prefix-demo'
          desc='通过设置 BkBreadcrumb 的 back-router 属性（和router参数一样）添加返回跳转链接，也可以使用slot自定义返回区域的内容。'
          subtitle='增加前置插槽快速返回'
          title='支持返回配置以及前置插槽'
        >
          <PrefixDemo></PrefixDemo>
        </DemoBox>

        <PropsBox
          propsData={breadcrumbPropsJson}
          subtitle=''
          title='Breadcrumb 属性'
        />
        <PropsBox
          propsData={breadcrumbSlotJson}
          subtitle=''
          title='Breadcrumb 插槽'
        />
        <PropsBox
          propsData={breadcrumbItemPropsJson}
          subtitle=''
          title='Breadcrumb Item 属性'
        />
        <PropsBox propsData={breadcrumbItemEvents} subtitle='' title='Breadcrumb Item 事件' />
        <PropsBox propsData={breadcrumbItemSlots} subtitle='' title='Breadcrumb Item 插槽' />
      </div>
    );
  },
});
