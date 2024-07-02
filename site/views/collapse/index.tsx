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
import { type IPropsTableItem } from '../../typings';
import DemoCollapse from './demo/collapse.vue';
import DemoCollapseAccordion from './demo/collapse-accordion.vue';
import DemoCollapseBlock from './demo/collapse-block.vue';
import DemoCollapseCard from './demo/collapse-card.vue';
import DemoCollapseClick from './demo/collapse-click.vue';
import DemoCollapseDisabled from './demo/collapse-disabled.vue';
import DemoCollapseEnterLeave from './demo/collapse-enter-leave.vue';
import DemoCollapseIcon from './demo/collapse-icon.vue';
import DemoCollapseIconAlign from './demo/collapse-icon-align.vue';
import CollapseJsx from './demo/collapse-jsx';
import DemoCollapseLine from './demo/collapse-line.vue';
import DemoCollapsePanel from './demo/collapse-panel.vue';
import DemoCollapseSlot from './demo/collapse-slot.vue';
import DemoCollapseTitle from './demo/collapse-title.vue';
const collapseProps: IPropsTableItem[] = [
  {
    name: 'list',
    type: 'Array',
    default: [],
    desc: '渲染的列表，可为对象数组或字符串数组',
    optional: [],
  },
  {
    name: 'idFiled',
    type: 'String',
    default: '$index',
    desc: '激活面板的唯一标识，不配置默认使用面板的index',
    optional: [],
  },
  {
    name: 'titleField',
    type: 'String',
    default: 'name',
    desc: '列表项的标题字段',
    optional: [],
  },
  {
    name: 'contentField',
    type: 'String',
    default: 'content',
    desc: '列表项的内容字段',
    optional: [],
  },
  {
    name: 'model-value / v-model',
    type: 'Number | Array',
    default: '',
    desc: '当前激活的索引',
    optional: [],
  },
  {
    name: 'accordion',
    type: 'Boolean',
    default: 'false',
    desc: '是否使用手风琴效果',
    optional: [],
  },
  {
    name: 'hasHeaderBorder',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示头部边框',
    optional: [],
  },
  {
    name: 'hasHeaderHover',
    type: 'Boolean',
    default: 'true',
    desc: '是否在头部悬停时显示效果',
    optional: [],
  },
  {
    name: 'headerIcon',
    type: 'String',
    default: '',
    desc: '自定义图标',
    optional: [],
  },
  {
    name: 'useCardTheme',
    type: 'Boolean',
    default: 'false',
    desc: '是否使用卡片样式',
    optional: [],
  },
  {
    name: 'headerIconAlign',
    type: 'String',
    default: 'left',
    desc: '图标位置',
    optional: ['left', 'right'],
  },
  {
    name: 'useBlockTheme',
    type: 'Boolean',
    default: 'false',
    desc: '是否使用色块样式',
    optional: [],
  }
];

const collapseEvents: IPropsTableItem[] = [
  {
    name: 'item-click',
    type: 'Function',
    default: '-',
    desc: '点击项时触发的回调',
    optional: [],
  },
  {
    name: 'update:modelValue',
    type: 'Function',
    default: '-',
    desc: '更新 modelValue 时触发的回调',
    optional: [],
  },
  {
    name: 'after-leave',
    type: 'Function',
    default: '-',
    desc: '离开后触发的回调',
    optional: [],
  },
  {
    name: 'before-enter',
    type: 'Function',
    default: '-',
    desc: '进入前触发的回调',
    optional: [],
  },
];

const collapseSlots: IPropsTableItem[] = [
  {
    name: 'default',
    type: 'Slot',
    default: '-',
    desc: '默认插槽，用于放置内容',
    optional: [],
  },
  {
    name: 'title',
    type: 'Slot',
    default: '-',
    desc: '标题插槽，用于自定义标题内容',
    optional: [],
  },
  {
    name: 'content',
    type: 'Slot',
    default: '-',
    desc: '内容插槽，用于自定义内容',
    optional: [],
  },
];
const collapsePanelProps: IPropsTableItem[] = [
  {
    name: 'name',
    type: 'Number | String',
    default: '',
    desc: '面板名称，用于标识面板，可以是字符串或数字',
    optional: [],
  },
  {
    name: 'title',
    type: 'Any',
    default: '',
    desc: '面板标题，可以是字符串或插槽',
    optional: [],
  },
  {
    name: 'content',
    type: 'String',
    default: '',
    desc: '面板内容，字符串形式',
    optional: [],
  },
  {
    name: 'disabled',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用面板',
    optional: [],
  },
  {
    name: 'isFormList',
    type: 'Boolean',
    default: 'false',
    desc: '是否从列表中渲染',
    optional: [],
  },
  {
    name: 'renderDirective',
    type: 'String',
    default: null,
    desc: '渲染指令，用于控制是否渲染组件',
    optional: [],
  },
  {
    name: 'modelValue',
    type: 'Boolean',
    default: 'false',
    desc: '面板的展开/收起状态',
    optional: [],
  },
  {
    name: 'alone',
    type: 'Boolean',
    default: 'false',
    desc: '是否单独使用面板',
    optional: [],
  },
  {
    name: 'icon',
    type: 'String',
    default: 'angle-right',
    desc: '自定义图标',
    optional: [],
  },
  {
    name: 'itemClick',
    type: 'Function',
    default: '-',
    desc: '点击项时触发的回调',
    optional: [],
  }
];

const collapsePanelEvents: IPropsTableItem[] = [
  {
    name: 'change',
    type: 'Function',
    default: '-',
    desc: '切换面板时触发的回调',
    optional: [],
  },
  {
    name: 'update:modelValue',
    type: 'Function',
    default: '-',
    desc: '更新 modelValue 时触发的回调',
    optional: [],
  },
  {
    name: 'after-leave',
    type: 'Function',
    default: '-',
    desc: '面板隐藏后的回调',
    optional: [],
  },
  {
    name: 'before-enter',
    type: 'Function',
    default: '-',
    desc: '面板展开前的回调',
    optional: [],
  },
];

const collapsePanelSlots: IPropsTableItem[] = [
  {
    name: 'default',
    type: 'Slot',
    default: '-',
    desc: '面板内容插槽',
    optional: [],
  },
  {
    name: 'header',
    type: 'Slot',
    default: '-',
    desc: '面板头部插槽',
    optional: [],
  },
  {
    name: 'content',
    type: 'Slot',
    default: '-',
    desc: '自定义内容插槽',
    optional: [],
  },
];
export default defineComponent({
  name: 'Affix',
  render() {
    return (
      <div>
        <DemoTitle
          desc=''
          link={`${import.meta.env.VITE_APP_BASE_URL ?? ''}/collapse`}
          name='Collapse 折叠面板'
        />
        <DemoBox
          componentName='collapse'
          demoName='demo/collapse'
          desc='v-model绑定默认激活的item项，idFiled作为唯一标识符,如果不填写默认为当前的item的index， list配置列表。'
          title='基础用法'
        >
          <DemoCollapse />
        </DemoBox>
        <DemoBox
          componentName='collapse'
          demoName='demo/collapse-line'
          desc='通过配置has-header-border来使用线条样式效果。'
          title='线条样式'
        >
          <DemoCollapseLine />
        </DemoBox>
        <DemoBox
          componentName='collapse'
          demoName='demo/collapse-card'
          desc='通过配置use-card-theme来使用卡片样式效果。'
          title='卡片样式'
        >
          <DemoCollapseCard />
        </DemoBox>
        <DemoBox
          componentName='collapse'
          demoName='demo/collapse-card'
          desc='通过配置use-block-theme来使用色块样式效果。'
          title='色块样式'
        >
          <DemoCollapseBlock />
        </DemoBox>
        <DemoBox
          componentName='collapse'
          demoName='demo/collapse-icon'
          desc='通过配置header-icon来自定义图标。'
          title='自定义图标'
        >
          <DemoCollapseIcon />
        </DemoBox>
        <DemoBox
          componentName='collapse'
          demoName='demo/collapse-icon-align'
          desc='通过配置header-icon-align来控制图标位置。'
          title='图标位置'
        >
          <DemoCollapseIconAlign />
        </DemoBox>
        <DemoBox
          componentName='collapse'
          demoName='demo/collapse-accordion'
          desc='可以配置参数 accordion 来确定是否使用手风琴模式'
          title='是否使用手风琴模式'
        >
          <DemoCollapseAccordion />
        </DemoBox>
        <DemoBox
          componentName='collapse'
          demoName='demo/collapse-title'
          desc='通过配置默认插槽即可自定义标题内容'
          title='插槽：自定义面板标题'
        >
          <DemoCollapseTitle />
        </DemoBox>

        <DemoBox
          componentName='collapse'
          demoName='demo/collapse-click'
          desc='通过配置默认插槽即可自定义标题内容'
          title='点击事件'
        >
          <DemoCollapseClick />
        </DemoBox>
        <DemoBox
          componentName='collapse'
          demoName='demo/collapse-disabled'
          desc='通过配置list字段disabled即可'
          title='设置列表不可点击disabled'
        >
          <DemoCollapseDisabled />
        </DemoBox>
        <DemoBox
          componentName='collapse'
          demoName='demo/collapse-enter-leave'
          desc='配置事件before-enter/after-leave'
          title='展开/收起 动画状态改变的回调事件'
        >
          <DemoCollapseEnterLeave />
        </DemoBox>
        <DemoBox
          componentName='collapse'
          demoName='demo/collapse-panel'
          desc='collapse-panel'
          title='collapse-panel'
        >
          <DemoCollapsePanel />
        </DemoBox>
        <DemoBox
          componentName='collapse'
          demoName='demo/collapse-slot'
          desc='传统用法，通过CollapsePanel配置内如'
          title='插槽：面板'
        >
          <DemoCollapseSlot />
        </DemoBox>
        <DemoBox
          componentName='collapse'
          demoName='demo/collapse-jsx'
          desc='tsx使用'
          suffix='.tsx'
          title='collapse jsx'
        >
          <CollapseJsx />
        </DemoBox>

        <PropsBox
          propsData={collapseProps}
          subtitle=''
          title='Collapse 属性'
        />
        <PropsBox
          propsData={collapseEvents}
          subtitle=''
          title='Collapse 事件'
        />
        <PropsBox
          propsData={collapseSlots}
          subtitle=''
          title='Collapse 插槽'
        />
        <PropsBox
          propsData={collapsePanelProps}
          subtitle=''
          title='CollapsePanel 属性'
        />
        <PropsBox
          propsData={collapsePanelEvents}
          subtitle=''
          title='CollapsePanel 事件'
        />
        <PropsBox
          propsData={collapsePanelSlots}
          subtitle=''
          title='CollapsePanel 插槽'
        />
      </div>
    );
  },
});
