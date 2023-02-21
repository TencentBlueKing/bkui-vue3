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

const lang = getCookie('blueking_language');

const DemoCollapse = defineAsyncComponent(() => import(`./demo/${lang}/collapse.vue`));
const DemoCollapseAccordion = defineAsyncComponent(() => import(`./demo/${lang}/collapse-accordion.vue`));
const DemoCollapseClick = defineAsyncComponent(() => import(`./demo/${lang}/collapse-click.vue`));
const DemoCollapseDisabled = defineAsyncComponent(() => import(`./demo/${lang}/collapse-disabled.vue`));
const DemoCollapseEnterLeave = defineAsyncComponent(() => import(`./demo/${lang}/collapse-enter-leave.vue`));
const DemoCollapsePanel = defineAsyncComponent(() => import(`./demo/${lang}/collapse-panel.vue`));
const DemoCollapseSingle = defineAsyncComponent(() => import(`./demo/${lang}/collapse-single.vue`));
const DemoCollapseSlot = defineAsyncComponent(() => import(`./demo/${lang}/collapse-slot.vue`));
const DemoCollapseTitle = defineAsyncComponent(() => import(`./demo/${lang}/collapse-title.vue`));
const CollapseJsx = defineAsyncComponent(() => import(`./demo/${lang}/collapse-jsx.tsx`));

const { t } = i18n.global;

const collapseProps: IPropsTableItem[] = [
  {
    name: 'list',
    type: 'Array',
    default: '[]',
    desc: '配置面板列表数据',
    optional: [],
  },
  {
    name: '(modelValue)v-model',
    type: '<string|number>[] | string | number',
    default: '--',
    desc: '当前激活面板的key',
    optional: [],
  },
  {
    name: 'accordion',
    type: 'boolean',
    default: 'false',
    desc: '是否使用手风琴效果',
    optional: ['true', 'false'],
  },
  {
    name: 'idFiled',
    type: 'String',
    default: '--',
    desc: '激活面板的唯一标识，不配置默认使用面板的index',
    optional: [],
  },
  {
    name: 'titleField',
    type: 'String',
    default: 'name',
    desc: '面板标题key值',
    optional: [],
  },
  {
    name: 'contentField',
    type: 'String',
    default: 'content',
    desc: '面板内容key值',
    optional: [],
  },
].map((item: IPropsTableItem) => {
  const result = Object.assign(item, { desc: t(item.desc) });
  return {
    ...result,
  };
});

const collapsePanelProps: IPropsTableItem[] = [
  {
    name: '(modelValue)v-model',
    type: 'Boolean',
    default: '--',
    desc: '当前面板是否这边(单独使用时才生效)',
    optional: [],
  },
  {
    name: 'name',
    type: 'String',
    default: '--',
    desc: '唯一标识符，相当于 ID',
    optional: [],
  },
  {
    name: 'title',
    type: 'String',
    default: 'name',
    desc: '面板标题',
    optional: [],
  },
  {
    name: 'content',
    type: 'String',
    default: 'content',
    desc: '面板内容',
    optional: [],
  },
  {
    name: 'renderDirective',
    type: 'if|show',
    default: 'show',
    desc: '配置内容隐藏方式，默认是 show，收起时，通过设置 display:none(v-show) 不显示在页面,if 为不渲染组件',
    optional: [],
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用当前面板，禁用后展开过的面板会自动折叠',
    optional: [],
  },
].map((item: IPropsTableItem) => {
  const result = Object.assign(item, { desc: t(item.desc) });
  return {
    ...result,
  };
});

const collapseEvents: IPropsTableItem[] = [
  {
    name: 'item-click',
    type: 'event',
    default: t('回调参数（item）'),
    desc: t('点击时触发，回调参数为点击的面板对象'),
    optional: [],
  },
];

const collapsePanelEvents: IPropsTableItem[] = [
  {
    name: 'change',
    type: 'event',
    default: t('回调参数 name'),
    desc: '点击时触发，回调参数为点击的面板对象',
    optional: [],
  },
  {
    name: 'item-click',
    type: 'event',
    default: t('回调参数（item）'),
    desc: '点击时触发，回调参数为点击的面板对象',
    optional: [],
  },
  {
    name: 'before-enter',
    type: 'event',
    default: '--',
    desc: '动画开始前',
    optional: [],
  },
  {
    name: 'after-leave',
    type: 'event',
    default: '--',
    desc: '动画结束后',
    optional: [],
  },
].map((item: IPropsTableItem) => {
  const result = Object.assign(item, { desc: t(item.desc) });
  return {
    ...result,
  };
});

const collapseSlots: IPropsTableItem[] = [
  {
    name: 'title',
    type: 'Slot',
    default: '--',
    desc: t('面板标题插槽'),
    optional: [],
  },
];

const collapsePanelSlots: IPropsTableItem[] = [
  {
    name: 'default',
    type: 'Slot',
    default: '--',
    desc: '面板标题插槽',
    optional: [],
  },
  {
    name: 'header',
    type: 'Slot',
    default: '--',
    desc: '面板头部插槽',
    optional: [],
  },
  {
    name: 'content',
    type: 'Slot',
    default: '--',
    desc: '面板内容插槽',
    optional: [],
  },
].map((item: IPropsTableItem) => {
  const result = Object.assign(item, { desc: t(item.desc) });
  return {
    ...result,
  };
});

export default defineComponent({
  name: 'Affix',
  render() {
    return (
      <div>
        <DemoTitle name={t('Collapse 折叠面板')} desc="" link={`${import.meta.env.VITE_APP_BASE_URL ?? ''}/collapse`} />
        <DemoBox
          title={t('基础用法')}
          desc={t('v-model绑定默认激活的item项，idFiled作为唯一标识符,如果不填写默认为当前的item的index， list配置列表。')}
          componentName="collapse"
          demoName={`demo/${lang}/collapse`}
        >
          <DemoCollapse />
        </DemoBox>
        <DemoBox
          title={t('是否使用手风琴模式')}
          desc={t('可以配置参数 accordion 来确定是否使用手风琴模式')}
          componentName="collapse"
          demoName={`demo/${lang}/collapse-accordion`}
        >
          <DemoCollapseAccordion />
        </DemoBox>
        <DemoBox
          title={t('插槽：自定义面板标题')}
          desc={t('通过配置默认插槽即可自定义标题内容')}
          componentName="collapse"
          demoName={`demo/${lang}/collapse-title`}
        >
          <DemoCollapseTitle />
        </DemoBox>

        <DemoBox
          title={t('点击事件')}
          desc={t('通过配置默认插槽即可自定义标题内容')}
          componentName="collapse"
          demoName={`demo/${lang}/collapse-click`}
        >
          <DemoCollapseClick />
        </DemoBox>
        <DemoBox
          title={t('设置列表不可点击disabled')}
          desc={t('通过配置list字段disabled即可')}
          componentName="collapse"
          demoName={`demo/${lang}/collapse-disabled`}
        >
          <DemoCollapseDisabled />
        </DemoBox>
        <DemoBox
          title={t('展开/收起 动画状态改变的回调事件')}
          desc={t('配置事件before-enter/after-leave')}
          componentName="collapse"
          demoName={`demo/${lang}/collapse-enter-leave`}
        >
          <DemoCollapseEnterLeave />
        </DemoBox>
        <DemoBox
          title="Collapse-Panel"
          desc="collapse-panel"
          componentName="collapse"
          demoName={`demo/${lang}/collapse-panel`}
        >
          <DemoCollapsePanel />
        </DemoBox>
        <DemoBox
          title={t('插槽：面板')}
          desc={t('传统用法，通过CollapsePanel配置内如')}
          componentName="collapse"
          demoName={`demo/${lang}/collapse-slot`}
        >
          <DemoCollapseSlot />
        </DemoBox>
        <DemoBox
          title={t('collapse-panel单独使用')}
          desc={t('单个collapse-panel使用')}
          componentName="collapse"
          demoName={`demo/${lang}/collapse-single`}
        >
          <DemoCollapseSingle />
        </DemoBox>
        <DemoBox
          title="Collapse Jsx"
          desc={t('tsx使用')}
          componentName="collapse"
          suffix=".tsx"
          demoName={`demo/${lang}/collapse-jsx`}
        >
          <CollapseJsx />
        </DemoBox>

        <PropsBox title={t('Collapse 属性')} subtitle="" propsData={collapseProps} />
        <PropsBox title={t('Collapse-Panel 属性')} subtitle="" propsData={collapsePanelProps} />

        <PropsBox title={t('Collapse 插槽')} subtitle="" propsData={collapseSlots} />
        <PropsBox title={t('CollapsePanel 插槽')} subtitle="" propsData={collapsePanelSlots} />
        <PropsBox title="Collapse Events" subtitle="" propsData={collapseEvents} />
        <PropsBox title="CollapsePanel Attributes" subtitle="" propsData={collapsePanelEvents} />
      </div>
    );
  },
});
