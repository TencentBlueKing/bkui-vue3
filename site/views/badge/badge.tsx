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
import DemoTitle from '../../components/demo-title';
import DemoBox from '../../components/demo-box';
import PropsBox from '../../components/props-box';
import { IPropsTableItem } from '../../typings';
import BadgeDemo from './badge-demo.vue';
const menuPropsJson: IPropsTableItem[] = [
  {
    name: 'theme',
    type: 'String',
    default: 'primary',
    desc: '组件的主题色',
    optional: ['primary', 'info', 'warning', 'danger', 'success'],
  },
  {
    name: 'count',
    type: 'String | Number',
    default: 1,
    desc: '组件显示的值',
    optional: [],
  },
  {
    name: 'position',
    type: 'String',
    default: 'top-right',
    desc: '	组件相对于其兄弟组件的位置',
    optional: ['top-right', 'bottom-right', 'bottom-left', 'top-left'],
  },
  {
    name: 'radius',
    type: 'String | Number',
    default: '18px',
    desc: '配置自定义弧度，以实现多种形状 ',
    optional: [],
  },
  {
    name: 'valLength',
    type: 'Number',
    default: 3,
    desc: '配置val字符显示长度，最大值建议英文不超过3个字母，中文不超过2个汉字 ',
    optional: [],
  },
  {
    name: 'overflowCount',
    type: 'Number',
    default: '18px',
    desc: '组件显示的最大值，当 count 超过 overflowCount，显示数字 +；仅当设置了 Number 类型的 count 值时生效',
    optional: [],
  },
  {
    name: 'dot',
    type: 'Boolean',
    default: false,
    desc: '是否仅显示小圆点；当设置 dot 为 true 时，count, icon, overflowCount 均会被忽略',
    optional: [],
  },
  {
    name: 'visible',
    type: 'Boolean',
    default: false,
    desc: '是否显示组件',
    optional: [],
  },
  {
    name: 'extCls',
    type: 'String',
    default: '',
    desc: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM `.bk-badge-main` 上',
    optional: [],
  },
];

export default defineComponent({
  setup() {
    return {
    };
  },
  render() {
    return (
      <div>
        <DemoTitle
          name="Badge"
          desc="Badge 组件， 可以出现在任意 DOM 节点角上的数字或状态标记。" />
        <DemoBox
          title="基础用法"
          subtitle=""
          desc="用默认配置初始化组件"
          componentName="badge"
          demoName="badge-demo">
            <BadgeDemo/>
          </DemoBox>
        <PropsBox propsData={menuPropsJson}/>
      </div>
    );
  },
});
