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
import { IPropsTableItem } from '../../typings';
import { getCookie } from '../utils/cookie';

import BaseDemo from './demo/base-demo.vue';
import BeforeChangeDemo from './demo/before-change-demo.vue';
import SizeDemo from './demo/size-demo.vue';
import ThemeDemo from './demo/theme-demo.vue';
import TypeDemo from './demo/type-demo.vue';

const lang = getCookie('blueking_language');

const DisabledDemo = defineAsyncComponent(() => import(`./demo/${lang}/disabled-demo.vue`));
const TextDemo = defineAsyncComponent(() => import(`./demo/${lang}/text-demo.vue`));

const { t } = i18n.global;

const switcherPropsJson: IPropsTableItem[] = [
  {
    name: 'value',
    type: 'Boolean',
    default: 'false',
    desc: t('是否打开'),
    optional: [],
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: t('是否禁用'),
    optional: [],
  },
  {
    name: 'showText',
    type: 'Boolean',
    default: 'false',
    desc: t('是否显示文本'),
    optional: [],
  },
  {
    name: 'size',
    type: 'String',
    default: '',
    desc: t('尺寸，显示文本时此属性无效'),
    optional: ['large', 'small'],
  },
  {
    name: 'isOutline',
    type: 'Boolean',
    default: 'false',
    desc: t('是否为描边效果'),
    optional: [],
  },
  {
    name: 'isSquare',
    type: 'Boolean',
    default: 'false',
    desc: t('是否为方形效果'),
    optional: [],
  },
  {
    name: 'trueValue',
    type: 'Boolean',
    default: 'true',
    desc: t('switcher的真值'),
    optional: [],
  },
  {
    name: 'falseValue',
    type: 'Boolean',
    default: 'false',
    desc: t('switcher的假值'),
    optional: [],
  },
  {
    name: 'onText',
    type: 'String',
    default: 'ON',
    desc: t('打开状态显示的文本'),
    optional: [],
  },
  {
    name: 'offText',
    type: 'String',
    default: 'OFF',
    desc: t('关闭状态显示的文本'),
    optional: [],
  },
  {
    name: 'before-change',
    type: 'Function',
    default: '',
    desc: t('状态切换的前置检测接收操作后的状态（lastValue），返回true，false，Promise'),
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

const switcherChangeJson: IPropsTableItem[] = [
  {
    name: 'change',
    type: 'Function',
    default: '',
    desc: t('状态发生变化时回调函数'),
    optional: [],
  },
];

export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle name={t('Switcher 开关')} desc={t('在两种状态之间的切换')} link="https://www.google.com.hk/" />

        <DemoBox
          title={t('基础用法')}
          subtitle=""
          desc={t('可以通过 value / v-model 属性来定义开关状态，')}
          componentName="switcher"
          demoName="demo/base-demo"
        >
          <BaseDemo />
        </DemoBox>

        <DemoBox
          title={t('尺寸')}
          subtitle=""
          desc={t('可以通过 size 属性来定义开关的尺寸，需要更大或更小尺寸时使用 large、small 值配置，不配置即为默认尺寸。当设置 show-text 时将显示为特定尺寸同时 size 将失效。')}
          componentName="switcher"
          demoName="demo/size-demo"
        >
          <SizeDemo />
        </DemoBox>

        <DemoBox
          title={t('主题')}
          subtitle=""
          desc={t('可以通过 theme 属性来定义开关的主题')}
          componentName="switcher"
          demoName="demo/theme-demo"
        >
          <ThemeDemo />
        </DemoBox>

        <DemoBox
          title={t('禁用状态')}
          subtitle={t('不可用状态')}
          desc={t('可以使用 disabled 属性来定义开关是否禁用，它接受一个 Boolean 值')}
          componentName="switcher"
          demoName={`demo/${lang}/disabled-demo`}
        >
          <DisabledDemo />
        </DemoBox>

        <DemoBox
          title={t('前置状态检测')}
          subtitle=""
          desc={t('可以通过 before-change 接收一个函数来做前置状态检测，返回 false状态切换失败；返回true状态切换成功；返回一个promise，resolve状态切换成功，reject状态切换失败')}
          componentName="switcher"
          demoName="demo/before-change-demo"
        >
          <BeforeChangeDemo />
        </DemoBox>

        <DemoBox
          title={t('自定义文案')}
          subtitle=""
          desc={t('可以通过 onText/offText 来修改展示的文案自定义文案')}
          componentName="switcher"
          demoName={`demo/${lang}/text-demo`}
        >
          <TextDemo />
        </DemoBox>

        <DemoBox title={t('更多示例')} subtitle="" desc="" componentName="switcher" demoName="demo/type-demo">
          <TypeDemo />
        </DemoBox>

        <PropsBox title={t('Switcher 属性')} subtitle="" propsData={switcherPropsJson} />

        <PropsBox title={t('Switcher 事件')} subtitle="" propsData={switcherChangeJson} />
      </div>
    );
  },
});
