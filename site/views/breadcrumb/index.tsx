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

import { defineAsyncComponent, defineComponent, ref } from 'vue';

import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import i18n from '../../language/i18n';
import { IPropsTableItem } from '../../typings';
import { getCookie } from '../utils/cookie';

const lang = getCookie('blueking_language');

const BaseDemo = defineAsyncComponent(() => import(`./demo/${lang}/base-demo.vue`));
const PrefixDemo = defineAsyncComponent(() => import(`./demo/${lang}/prefix-demo.vue`));
const SeparatorDemo = defineAsyncComponent(() => import(`./demo/${lang}/separator-demo.vue`));

const { t } = i18n.global;

const breadcrumbPropsJson: IPropsTableItem[] = [
  {
    name: 'separator',
    type: 'String',
    default: t('斜杠\'/\''),
    desc: t('分隔符'),
    optional: [],
  },
  {
    name: 'separatorClass',
    type: 'String',
    default: '',
    desc: t('图标分隔符 class'),
    optional: [],
  },
  {
    name: 'backRouter',
    type: 'String/Object',
    default: '',
    desc: t('路由跳转对象，同 vue-router 的 to'),
    optional: [],
  },
  {
    name: 'replace',
    type: 'Boolean',
    default: 'false',
    desc: t('开启backRouter并使用默认的icon跳转时，启用 replace 将不会向 history 添加新记录'),
    optional: [],
  },
  {
    name: 'extCls',
    type: 'String',
    default: '',
    desc: t('自定义样式'),
    optional: [],
  },
];

const breadcrumbSlotJson: IPropsTableItem[] = [
  {
    name: 'default',
    type: 'Function',
    default: '',
    desc: t('默认插槽'),
    optional: [],
  },
  {
    name: 'default',
    type: 'Function',
    default: '',
    desc: t('默认插槽'),
    optional: [],
  },
  {
    name: 'separator',
    type: 'Function',
    default: '',
    desc: t('分隔符插槽'),
    optional: [],
  },
];

const breadcrumbItemPropsJson: IPropsTableItem[] = [
  {
    name: 'to',
    type: 'String/Object',
    default: '',
    desc: t('路由跳转对象，同 vue-router 的 to'),
    optional: [],
  },
  {
    name: 'replace',
    type: 'Boolean',
    default: 'false',
    desc: t('在使用 to 进行路由跳转时，启用 replace 将不会向 history 添加新记录'),
    optional: [],
  },
];
export default defineComponent({
  setup() {
    const separator = ref('/');
    const list = [
      { title: t('首页'), link: { path: '/' } },
      { title: t('进度条'), link: { path: 'loading' } },
      { title: t('滑块开关'), link: { path: 'switcher' } },
      { title: t('面包屑'), link: null },
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
          name={t('Breadcrumb 面包屑')}
          desc={t('Breadcrumb组件， 显示当前页面的路径，快速返回之前的任意页面')}
          link="https://www.google.com.hk/"
        />

        <DemoBox
          title={t('基础用法')}
          subtitle={t('垂直菜单，子菜单内嵌在菜单区域。')}
          desc={t('通过设置 BkBreadcrumbItem 的 to 属性添加跳转链接。')}
          componentName="breadcrumb"
          demoName={`demo/${lang}/base-demo`}
        >
          <BaseDemo></BaseDemo>
        </DemoBox>

        <DemoBox
          title={t('字符分割')}
          subtitle={t('通过自定义 字符串 如：> | / 分割。')}
          desc={t('通过设置 BkBreadcrumb 的 separator 属性设置分隔符，他可以是字符串或者是slot')}
          componentName="breadcrumb"
          demoName={`demo/${lang}/separator-demo`}
        >
          <SeparatorDemo></SeparatorDemo>
        </DemoBox>

        <DemoBox
          title={t('支持返回配置以及前置插槽')}
          subtitle={t('增加前置插槽快速返回')}
          desc={t('通过设置 BkBreadcrumb 的 back-router 属性（和router参数一样）添加返回跳转链接，也可以使用slot自定义返回区域的内容。')}
          componentName="breadcrumb"
          demoName={`demo/${lang}/prefix-demo`}
        >
          <PrefixDemo></PrefixDemo>
        </DemoBox>

        <PropsBox title={t('Breadcrumb 属性')} subtitle="" propsData={breadcrumbPropsJson} />
        <PropsBox title={t('Breadcrumb 插槽')} subtitle="" propsData={breadcrumbSlotJson} />
        <PropsBox subtitle="" title={t('Breadcrumb Item 属性')} propsData={breadcrumbItemPropsJson} />
      </div>
    );
  },
});
