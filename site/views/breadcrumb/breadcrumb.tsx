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
import DemoTitle from '../../components/demo-title';
import DemoBox from '../../components/demo-box';
import PropsBox from '../../components/props-box';
import { IPropsTableItem } from '../../typings';
import BaseDemo from './base-demo.vue';
import SeparatorDemo from './separator-demo.vue';
import PrefixDemo from './prefix-demo.vue';

const breadcrumbPropsJson: IPropsTableItem[] = [
  {
    name: 'separator',
    type: 'String',
    default: '斜杠\'/\'',
    desc: '分隔符',
    optional: [],
  },
  {
    name: 'separatorClass',
    type: 'String',
    default: '',
    desc: '图标分隔符 class',
    optional: [],
  },
  {
    name: 'backRouter',
    type: 'String/Object',
    default: '',
    desc: '路由跳转对象，同 vue-router 的 to',
    optional: [],
  },
  {
    name: 'replace',
    type: 'Boolean',
    default: 'false',
    desc: '开启backRouter并使用默认的icon跳转时，启用 replace 将不会向 history 添加新记录',
    optional: [],
  },
  {
    name: 'extCls',
    type: 'String',
    default: '',
    desc: '自定义样式',
    optional: [],
  },

];

const breadcrumbSlotJson: IPropsTableItem[] = [
  {
    name: 'default',
    type: 'Function',
    default: '',
    desc: '默认插槽',
    optional: [],
  },
  {
    name: 'prefix',
    type: 'Function',
    default: '',
    desc: '前置插槽',
    optional: [],
  },
];

const breadcrumbItemPropsJson: IPropsTableItem[] = [
  {
    name: 'to',
    type: 'String/Object',
    default: '',
    desc: '路由跳转对象，同 vue-router 的 to',
    optional: [],
  },
  {
    name: 'replace',
    type: 'Boolean',
    default: 'false',
    desc: '在使用 to 进行路由跳转时，启用 replace 将不会向 history 添加新记录',
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
          name="Breadcrumb 面包屑"
          desc="Breadcrumb组件， 显示当前页面的路径，快速返回之前的任意页面。"
          link="https://www.google.com.hk/"/>

        <DemoBox
          title="基础用法"
          subtitle="垂直菜单，子菜单内嵌在菜单区域。"
          desc="通过设置 BkBreadcrumbItem 的 to 属性添加跳转链接。"
          componentName="breadcrumb"
          demoName="base-demo">
            <BaseDemo></BaseDemo>
          </DemoBox>

          <DemoBox
          title="字符分割"
          subtitle="通过自定义 字符串 如：> | / 分割。"
          desc="通过设置 BkBreadcrumb 的 separator 属性设置分隔符，它只允许是字符串，默认为斜杠 /。"
          componentName="breadcrumb"
          demoName="separator-demo">
            <SeparatorDemo></SeparatorDemo>
          </DemoBox>

          <DemoBox
          title="支持返回配置以及前置插槽"
          subtitle="增加前置插槽快速返回"
          desc="通过设置 BkBreadcrumb 的 back-router 属性（和router参数一样）添加返回跳转链接，也可以使用slot自定义返回区域的内容。"
          componentName="breadcrumb"
          demoName="prefix-demo">
            <PrefixDemo></PrefixDemo>
          </DemoBox>

        <PropsBox
          title="Breadcrumb Attributes"
          subtitle=""
          propsData={breadcrumbPropsJson}/>
        <PropsBox
          title="Breadcrumb slot"
          subtitle=""
          propsData={breadcrumbSlotJson}/>
        <PropsBox
          subtitle=""
          title="Breadcrumb Item Attributes"
          propsData={breadcrumbItemPropsJson}/>
      </div>
    );
  },
});
