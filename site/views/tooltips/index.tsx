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

import { defineAsyncComponent, defineComponent } from 'vue';

import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import i18n from '../../language/i18n';
import type { DemoPropsItem, IPropsTableItem } from '../../typings';
import { getCookie } from '../utils/cookie';

const lang = getCookie('blueking_language');

const Base = defineAsyncComponent(() => import(`./demo/${lang}/base.vue`));
const Callback = defineAsyncComponent(() => import(`./demo/${lang}/callback.vue`));
const Click = defineAsyncComponent(() => import(`./demo/${lang}/click.vue`));
const Position = defineAsyncComponent(() => import(`./demo/${lang}/position.vue`));

const { t } = i18n.global;

const props: IPropsTableItem[] = [
  {
    name: 'content',
    type: 'String',
    default: '',
    desc: t('提示信息内容'),
    optional: [],
  },
  {
    name: 'placement',
    type: 'String',
    default: 'top',
    desc: t('组件显示位置'),
    optional: ['auto', 'auto-start', 'auto-end', 'top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'right', 'right-start', 'right-end', 'left', 'left-start', 'left-end'],
  },
  {
    name: 'showOnInit',
    type: 'Boolean',
    default: 'false',
    desc: t('是否在初始化时默认显示'),
    optional: ['true', 'false'],
  },
  {
    name: 'theme',
    type: 'String',
    default: 'dark',
    desc: t('组件主题色'),
    optional: ['dark', 'light'],
  },
  {
    name: 'trigger',
    type: 'String',
    default: 'hover',
    desc: t('触发方式'),
    optional: ['click', 'hover'],
  },
  {
    name: 'arrow',
    type: 'Boolean',
    default: 'false',
    desc: t('是否显示箭头'),
    optional: ['true', 'false'],
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: t('是否禁用提示框'),
    optional: ['true', 'false'],
  },
  {
    name: 'delay',
    type: 'Number',
    default: '0',
    desc: t('显示的延迟，毫秒'),
    optional: [],
  },
  {
    name: 'extCls',
    type: 'String',
    default: '',
    desc: t('配置自定义样式类名，传入的类会被加在组件最外层的 DOM'),
    optional: [],
  },
];

const events: IPropsTableItem[] = [
  {
    name: 'onShow',
    type: 'Function',
    default: '',
    desc: t('显示提示框时触发函数'),
    optional: [],
  },
  {
    name: 'onHide',
    type: 'Function',
    default: '',
    desc: t('隐藏提示框时触发函数'),
    optional: [],
  },
];

const demos: DemoPropsItem[] = [
  {
    title: t('基础用法（通过绑定对象来配置）'),
    desc: t('通过指令配置简单的 tooltips'),
    componentName: 'tooltips',
    demoName: `demo/${lang}/base`,
    DemoComponent: Base,
  },
  {
    title: t('不同位置'),
    desc: t('通过 placement 属性展示不同位置的提示'),
    componentName: 'tooltips',
    demoName: `demo/${lang}/position`,
    DemoComponent: Position,
  },
  {
    title: t('点击触发'),
    desc: t('通过给 v-bk-tooltips 配置 trigger 为 click 来设置点击触发 tooltips'),
    componentName: 'tooltips',
    demoName: `demo/${lang}/click`,
    DemoComponent: Click,
  },
  {
    title: t('自定义回调函数'),
    desc: t('自定义显示以及隐藏时的回调函数'),
    componentName: 'tooltips',
    demoName: `demo/${lang}/callback`,
    DemoComponent: Callback,
  },
];

export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          name={ t('Tooltips 工具提示 （指令）') }
          desc={ t('当鼠标指向页面元素时给出简单的提示') }
          link="https://www.google.com.hk/"/>
          {
            demos.map(({ DemoComponent, ...demo }) => (
              <DemoBox {...demo}>
                <DemoComponent />
              </DemoBox>
            ))
          }
        <PropsBox title={t('属性')} subtitle="" propsData={props}></PropsBox>
        <PropsBox title={t('事件')} subtitle="" propsData={events}></PropsBox>
      </div>
    );
  },
});
