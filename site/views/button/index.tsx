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
import { type IPropsTableItem, DemoPropsItem } from '../../typings';
import { getCookie } from '../utils/cookie';

const lang = getCookie('blueking_language');

const { t } = i18n.global;

const Base = defineAsyncComponent(() => import(`./demo/${lang}/basic.vue`));
const Disabled = defineAsyncComponent(() => import(`./demo/${lang}/disabled.vue`));
const Group = defineAsyncComponent(() => import(`./demo/${lang}/group.vue`));
const Icon = defineAsyncComponent(() => import(`./demo/${lang}/icon.vue`));
const Outline = defineAsyncComponent(() => import(`./demo/${lang}/outline.vue`));
const Size = defineAsyncComponent(() => import(`./demo/${lang}/size.vue`));
const Text = defineAsyncComponent(() => import(`./demo/${lang}/text.vue`));
const LoadingButton = defineAsyncComponent(() => import(`./demo/${lang}/loading-button.vue`));
const MouseHover = defineAsyncComponent(() => import(`./demo/${lang}/mouse-hover.vue`));

const buttonProps: IPropsTableItem[] = [
  {
    name: 'theme',
    type: 'String',
    default: '',
    desc: t('按钮主题'),
    optional: ['primary', 'success', 'warning', 'danger'],
  },
  {
    name: 'hoverTheme',
    type: 'String',
    default: '',
    desc: t('mouseHover 按钮样式, 当设置了此属性时，theme 和 text 失效'),
    optional: ['primary', 'success', 'warning', 'danger'],
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: false,
    desc: t('是否不可用'),
    optional: [],
  },
  {
    name: 'text',
    type: 'Boolean',
    default: false,
    desc: t('是否为文字按钮'),
    optional: [],
  },
  {
    name: 'outline',
    type: 'Boolean',
    default: false,
    desc: t('是否为反色按钮'),
    optional: [],
  },
  {
    name: 'size',
    type: 'String',
    default: null,
    desc: t('按钮尺寸大小'),
    optional: ['small', 'large'],
  },
];

const buttonEvents: IPropsTableItem[] = [
  {
    name: 'click',
    type: 'String',
    default: null,
    desc: t('点击时触发事件'),
    optional: [],
  },
];

const demos: DemoPropsItem[] = [
  {
    title: t('基础按钮'),
    desc: `${t('基础按钮提供 5 种主题，由 theme 属性来定义，可选的主题有 default, primary, warning, success, danger，默认为 default')}。`,
    componentName: 'button',
    demoName: `demo/${lang}/basic`,
    DemoComponent: Base,
  },
  {
    title: t('禁用按钮'),
    desc: t('配置 disabled 属性来使按钮禁用'),
    componentName: 'button',
    demoName: `demo/${lang}/disabled`,
    DemoComponent: Disabled,
  },
  {
    title: t('图标按钮'),
    desc: t('可以在slot自定义icon ，设置loading 的时候，会显示 loading 效果。可以用loading-mode【spin 或者 default 】属性指定Loading效果'),
    componentName: 'button',
    demoName: `demo/${lang}/icon`,
    DemoComponent: Icon,
  },
  {
    title: t('按钮组'),
    desc: t('可以使用 ButtonGroup实现按钮组效果'),
    componentName: 'button',
    demoName: `demo/${lang}/group`,
    DemoComponent: Group,
  },
  {
    title: t('尺寸'),
    desc: t('可以使用 size 属性来定义按钮的尺寸，可接受 small large'),
    componentName: 'button',
    demoName: `demo/${lang}/size`,
    DemoComponent: Size,
  },
  {
    title: t('文字按钮'),
    desc: t('通过设置 text 属性来配置文字按钮。文字按钮同样提供 5 种主题，由 theme 属性来定义，可选的主题有 default,primary,warning,success,danger，默认为 default。另外可以使用 disabled 属性来定义按钮是否禁用，它接受一个 Boolean 值'),
    componentName: 'button',
    demoName: `demo/${lang}/text`,
    DemoComponent: Text,
  },
  {
    title: t('加载中状态'),
    desc: t('可以使用 loading 属性来定义按钮是否显示加载中状态，它接受一个 Boolean 值。同时可以通过loading-mode属性指定loading指示器类型'),
    componentName: 'button',
    demoName: `demo/${lang}/loading-button`,
    DemoComponent: LoadingButton,
  },
  {
    title: t('反色按钮'),
    desc: t('通过配置 outline 属性来实现反色按钮的效果'),
    componentName: 'button',
    demoName: `demo/${lang}/outline`,
    DemoComponent: Outline,
  },
  {
    title: t('mousehover 颜色自定义'),
    desc: t('提供 4 种 mousehover 颜色主题，由 hover-theme 属性来定义，可选的主题有 primary, warning, success, danger。当设置了 hover-theme 属性时，theme 和 text 失效。'),
    componentName: 'button',
    demoName: `demo/${lang}/mouse-hover`,
    DemoComponent: MouseHover,
  },
];

export default defineComponent({
  name: 'Button',
  render() {
    return (
      <div class={`demo-${lang}-page`}>
        <DemoTitle
          name="Button"
          desc={t('常用的操作按钮')}
          link={`${import.meta.env.VITE_APP_BASE_URL ?? ''}/button`}
        />
        {demos.map(({ DemoComponent, ...demo }) => (
          <DemoBox {...demo}>
            <DemoComponent />
          </DemoBox>
        ))}
        <PropsBox title={t('Button 属性')} subtitle="" propsData={buttonProps} />
        <PropsBox title={t('Button 事件')} subtitle="" propsData={buttonEvents} />
      </div>
    );
  },
});
