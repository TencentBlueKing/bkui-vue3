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
import { IPropsTableItem } from '../../typings';
import CardDemo from './card-demo.vue';
import CardEdit from './card-edit.vue';
const cardProps: IPropsTableItem[] = [
  {
    name: 'title',
    type: 'String',
    default: '',
    desc: '卡片标题',
    optional: [],
  },
  {
    name: 'showHeader',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示头部',
    optional: [],
  },
  {
    name: 'showFooter',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示底部',
    optional: [],
  },
  {
    name: 'collapseStatus',
    type: 'Boolean',
    default: 'true',
    desc: '折叠状态',
    optional: [],
  },
  {
    name: 'border',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示边框',
    optional: [],
  },
  {
    name: 'disableHeaderStyle',
    type: 'Boolean',
    default: 'false',
    desc: '是否禁用头部样式',
    optional: [],
  },
  {
    name: 'position',
    type: 'String',
    default: 'left',
    desc: '标题位置',
    optional: ['left', 'center', 'right'],
  },
  {
    name: 'isEdit',
    type: 'Boolean',
    default: 'false',
    desc: '是否开启编辑模式',
    optional: [],
  },
  {
    name: 'isCollapse',
    type: 'Boolean',
    default: 'false',
    desc: '是否开启折叠功能',
    optional: [],
  },
];

const cardEvents: IPropsTableItem[] = [
  {
    name: 'update:collapseStatus',
    type: 'Function',
    default: '-',
    desc: '折叠状态更新时触发，回调参数为新的折叠状态',
    optional: [],
  },
  {
    name: 'edit',
    type: 'Function',
    default: '-',
    desc: '编辑标题时触发，回调参数为新的标题内容',
    optional: [],
  },
];

const cardSlots: IPropsTableItem[] = [
  {
    name: 'default',
    type: 'Slot',
    default: '-',
    desc: '默认插槽，用于放置卡片内容',
    optional: [],
  },
  {
    name: 'header',
    type: 'Slot',
    default: '-',
    desc: '头部插槽，用于自定义头部内容',
    optional: [],
  },
  {
    name: 'footer',
    type: 'Slot',
    default: '-',
    desc: '底部插槽，用于自定义底部内容',
    optional: [],
  },
  {
    name: 'icon',
    type: 'Slot',
    default: '-',
    desc: '图标插槽，用于自定义图标内容',
    optional: [],
  },
];

export default defineComponent({
  setup() {
    return {};
  },
  render() {
    return (
      <div>
        <DemoTitle
          desc='Card 卡片是一种容器，可以将信息聚合展示。'
          designLink='https://bkdesign.bk.tencent.com/design/38'
          name='Card'
        />
        <DemoBox
          componentName='card'
          demoName='card-demo'
          desc='通过配置footer插槽，自定义 Card 中底部内容 的展示。同理使用header插槽， 可自定义 Card 中顶部内容展示'
          subtitle=''
          title='基础用法'
        >
          <CardDemo />
        </DemoBox>
        <DemoBox
          componentName='card'
          demoName='card-edit'
          desc='通过配置isEdit属性为true即可开启标题功能，enter或失焦保存'
          subtitle=''
          title='编辑标题'
        >
          <CardEdit />
        </DemoBox>
        <PropsBox
          propsData={cardProps}
          subtitle=''
          title='Card 属性'
        />
        <PropsBox
          propsData={cardEvents}
          subtitle=''
          title='Card 事件'
        />
        <PropsBox
          propsData={cardSlots}
          subtitle=''
          title='Card 插槽'
        />
      </div>
    );
  },
});
