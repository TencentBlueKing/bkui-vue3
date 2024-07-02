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
import Badge from './badge.vue';
import BadgeDemo from './badge-demo.vue';
import BadgeDot from './badge-dot.vue';
const badgeProps: IPropsTableItem[] = [
  {
    name: 'theme',
    type: 'String',
    default: 'primary',
    desc: 'badge 主题',
    optional: ['primary', 'success', 'info', 'warning', 'danger', 'default'],
  },
  {
    name: 'count',
    type: 'String | Number',
    default: 1,
    desc: '显示的数字',
    optional: [],
  },
  {
    name: 'position',
    type: 'String',
    default: 'top-right',
    desc: 'badge 显示位置',
    optional: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
  },
  {
    name: 'radius',
    type: 'String',
    default: '18px',
    desc: '设置边框的 radius 属性值',
    optional: [],
  },
  {
    name: 'valLength',
    type: 'Number',
    default: 3,
    desc: '数字显示最大长度，最大值建议英文不超过3个字母，中文不超过2个汉字',
    optional: [],
  },
  {
    name: 'overflowCount',
    type: 'Number',
    default: 99,
    desc: '组件显示的最大值，当 count 超过 overflowCount，显示数字 +；仅当设置了 Number 类型的 count 值时生效',
    optional: [],
  },
  {
    name: 'dot',
    type: 'Boolean',
    default: 'false',
    desc: '是否仅显示红点；当设置 dot 为 true 时，count, icon, overflowCount 均会被忽略',
    optional: [],
  },
  {
    name: 'visible',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示 badge',
    optional: [],
  },
  {
    name: 'extCls',
    type: 'String',
    default: '-',
    desc: '外部设置的 class 名',
    optional: [],
  },
];
const badgeEvents: IPropsTableItem[] = [
  {
    name: 'hover',
    type: 'Function',
    default: '-',
    desc: 'hover 事件的回调',
    optional: [],
  },
  {
    name: 'leave',
    type: 'Function',
    default: '-',
    desc: 'leave 事件的回调',
    optional: [],
  },
];
const badgeSlots: IPropsTableItem[] = [
  {
    name: 'default',
    type: 'Slot',
    default: '-',
    desc: '默认插槽，用于放置需要标记的内容',
    optional: [],
  },
  {
    name: 'icon',
    type: 'Slot',
    default: '-',
    desc: '图标插槽，用于显示图标内容',
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
          desc='Badge 组件， 可以出现在任意 DOM 节点角上的数字或状态标记。'
          designLink='https://bkdesign.bk.tencent.com/design/37'
          name='Badge'
        />
        <DemoBox
          componentName='badge'
          demoName='badge-demo'
          desc='用默认配置初始化组件'
          subtitle=''
          title='基础用法'
        >
          <BadgeDemo />
        </DemoBox>
        <DemoBox
          componentName='badge'
          demoName='badge'
          desc='可在不包裹任何元素情况下，独立使用 badge'
          subtitle=''
          title='不包裹任何元素，独立使用'
        >
          <Badge />
        </DemoBox>
        <DemoBox
          componentName='badge'
          demoName='badge-dot'
          desc='配置参数 dot'
          subtitle=''
          title='无内容红点'
        >
          <BadgeDot />
        </DemoBox>
        <PropsBox
          propsData={badgeProps}
          subtitle=''
          title='Badge 属性'
        />
        <PropsBox
          propsData={badgeEvents}
          subtitle=''
          title='Badge 事件'
        />
        <PropsBox
          propsData={badgeSlots}
          subtitle=''
          title='Badge 插槽'
        />
      </div>
    );
  },
});
