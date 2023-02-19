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
import { type IPropsTableItem } from '../../typings';
import { getCookie } from '../utils/cookie';

const lang = getCookie('lang');

const BaseDemo = defineAsyncComponent(() => import(`./demo/${lang}/base-demo.vue`));
const CustomDemo = defineAsyncComponent(() => import(`./demo/${lang}/custom-demo.vue`));
const HtmlDemo = defineAsyncComponent(() => import(`./demo/${lang}/html-demo.vue`));
const NodeDemo = defineAsyncComponent(() => import(`./demo/${lang}/node-demo.vue`));
const StatusDemo = defineAsyncComponent(() => import(`./demo/${lang}/status-demo.vue`));

const { t } = i18n.global;

const timelineProps: IPropsTableItem[] = [
  {
    name: 'list',
    type: 'Array',
    default: '-',
    desc: t('时间轴数据源（必传)'),
    optional: ['-'],
  },
  {
    name: 'list[].border',
    type: 'Boolean',
    default: 'true',
    desc: t('是否需要边框'),
    optional: ['true', 'false'],
  },
  {
    name: 'list[].tag',
    type: 'String',
    default: '-',
    desc: t('标题（一般是时间标识）'),
    optional: ['-'],
  },
  {
    name: 'list[].content',
    type: 'String/Object',
    default: '-',
    desc: t('内容'),
    optional: ['-'],
  },
  {
    name: 'list[].type',
    type: 'String',
    default: 'primary',
    desc: t('节点样式'),
    optional: ['default', 'primary', 'warning', 'success', 'danger'],
  },
  {
    name: 'list[].size',
    type: 'String',
    default: '-',
    desc: t('节点大小'),
    optional: ['large'],
  },
  {
    name: 'list[].color',
    type: 'String',
    default: '-',
    desc: t('节点颜色'),
    optional: ['blue', 'red', 'green', 'yellow', 'gray'],
  },
  {
    name: 'list[].icon',
    type: 'Function',
    default: '-',
    desc: t('节点图标，可使用蓝鲸 ICON'),
    optional: ['-'],
  },
  {
    name: 'list[].theme',
    type: 'String',
    default: 'primary',
    desc: t('组件的主题色'),
    optional: ['primary', 'success', 'warning', 'danger'],
  },
  {
    name: 'list[].filled',
    type: 'Boolean',
    default: 'primary',
    desc: t('是否填充节点(实心)'),
    optional: ['true', 'false'],
  },
  {
    name: 'ext-cls',
    type: 'String',
    default: '-',
    desc: t('配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-timeline 上'),
    optional: ['-'],
  },
];
const timelineEvents: IPropsTableItem[] = [
  {
    name: 'select',
    type: 'Function',
    default: '-',
    desc: t('相应点击项的数据data'),
    optional: ['-'],
  },
];
export default defineComponent({
  name: 'Steps',
  render() {
    return (
      <div>
        <DemoTitle
          name={t('Timeline 时间轴')}
          desc={t('Timeline 时间轴，用于时间轴的场景组件')}
          link={`${import.meta.env.VITE_APP_BASE_URL ?? ''}/timeline`}
        />
        <DemoBox
          title={t('基础用法')}
          desc={t('默认配置 list，list 为必传。可根据具体的应用场景，灵活地配置 list.tag 和 list.content，可以将时间作为标题，也可以作为内容的一部分')}
          componentName="timeline"
          demoName={`demo/${lang}/base-demo`}
        >
          <BaseDemo />
        </DemoBox>

        <DemoBox
          title={t('节点状态')}
          desc={t('在 list 数据源中配置 size color filled 属性呈现不同状态。绿色代表成功/已完成，蓝色代表正在进行，红色代表错误/失败，黄色代表告警/暂停，灰色代表未开始。实心代表已完成。')}
          componentName="timeline"
          demoName={`demo/${lang}/status-demo`}
        >
          <StatusDemo />
        </DemoBox>

        <DemoBox
          title={t('自定义节点图标')}
          desc={t('在 list 数据源中配置 icon 属性')}
          componentName="timeline"
          demoName={`demo/${lang}/custom-demo`}
        >
          <CustomDemo />
        </DemoBox>

        <DemoBox
          title={t('节点样式可配置')}
          desc={t('在 list 数据源中配置 type 属性（值可取 defult, primary, warning, success, danger），默认为 defult')}
          componentName="timeline"
          demoName={`demo/${lang}/node-demo`}
        >
          <NodeDemo />
        </DemoBox>

        <DemoBox
          title={t('可配置 HTML 模板')}
          desc={t('对 list 数据源中的 content 属性配置正确的 HTML 模板内容(注意：你的站点上动态渲染的任意 HTML 可能会非常危险，因为它很容易导致 XSS 攻击)')}
          componentName="timeline"
          demoName={`demo/${lang}/html-demo`}
        >
          <HtmlDemo />
        </DemoBox>

        <PropsBox title={t('属性')} subtitle="" propsData={timelineProps} />
        <PropsBox title={t('事件')} subtitle="" propsData={timelineEvents} />
      </div>
    );
  },
});
