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

import { defineComponent, ref } from 'vue';

import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import { IPropsTableItem } from '../../typings';
import BaseDemo from './base-demo.vue';
import ChangeDemo from './change-demo.vue';
import SizeDemo from './size-demo.vue';
import TextDemo from './text-demo.vue';
import TypeDemo from './type-demo.vue';
import TypeSizeDemo from './type-size-demo.vue';

const progressPropsJson: IPropsTableItem[] = [
  {
    name: 'type',
    type: 'String',
    default: 'line',
    desc: '进度条类型',
    optional: ['line', 'circle', 'dashboard'],
  },
  {
    name: 'percent',
    type: 'Number',
    default: '0',
    desc: '进度值',
    optional: ['0～100'],
  },
  {
    name: 'theme',
    type: 'String',
    default: 'primary',
    desc: '线性进度条主题色',
    optional: ['primary', 'warning', 'success', 'danger'],
  },
  {
    name: 'size',
    type: 'String',
    default: '',
    desc: '线性进度条大小',
    optional: ['small', 'large'],
  },
  {
    name: 'width',
    type: 'Number',
    default: '126',
    desc: '环形/仪表盘进度条大小',
    optional: [],
  },
  {
    name: 'strokeWidth',
    type: 'Number',
    default: '',
    desc: '线宽',
    optional: [],
  },
  {
    name: 'strokeLinecap',
    type: 'String',
    default: 'round',
    desc: '仪表盘进度路径两端形状',
    optional: ['butt', 'round', 'square', 'inherit'],
  },
  {
    name: 'textInside',
    type: 'Boolean',
    default: 'false',
    desc: '线性进度条是否显示文字到进度条内',
    optional: [],
  },
  {
    name: 'showText',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示文案',
    optional: [],
  },
  {
    name: 'color',
    type: 'String',
    default: '#13ce66',
    desc: '环形/仪表盘路径颜色',
    optional: [],
  },
  {
    name: 'bgColor',
    type: 'String',
    default: '#f5f5f5',
    desc: '环形/仪表盘背景颜色',
    optional: [],
  },
  {
    name: 'format',
    type: 'Function',
    default: '(value) => value%',
    desc: '文案过滤回调方法',
    optional: [],
  },
  {
    name: 'fixed',
    type: 'Number',
    default: '0',
    desc: '精确到小数点位数',
    optional: ['0 <= fixed <= 20'],
  },
  {
    name: 'title-style',
    type: 'Object',
    default: '{ fontSize: \'16px\', verticalAlign: \'middle\' }',
    desc: '设置文案样式',
    optional: [],
  },
  {
    name: 'extCls',
    type: 'String',
    default: '',
    desc: '自定义样式',
    optional: [],
  },
];

const progressSlotJson: IPropsTableItem[] = [
  {
    name: 'default',
    type: 'String',
    default: '',
    desc: '默认插槽',
    optional: [],
  },
];

export default defineComponent({
  setup() {
    const separator = ref('/');
    const list = [
      { title: '首页', link: { path: '/' } },
      { title: '进度条', link: { path: 'loading' } },
      { title: '滑块开关', link: { path: 'switcher' } },
      { title: '面包屑', link: null },
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
          name="Progress 进度条"
          desc="进度条"
          link="https://www.google.com.hk/"/>

        <DemoBox
            title="基础用法"
            subtitle="修改进度条主题"
            desc="percent 是 0 到 100 之间的数值，提供 4 种主题，由 theme 属性来定义，可选的主题有 primary, warning, success, danger，默认为 primary, 由 color 属性来自定义颜色值。"
            componentName="progress"
            demoName="base-demo">
            <BaseDemo></BaseDemo>
          </DemoBox>

          <DemoBox
            title="大小设置"
            subtitle=""
            desc="可以使用 size 属性来配置进度条的尺寸，可接受 small large，也可配置strokeWidth线宽"
            componentName="progress"
            demoName="size-demo">
            <SizeDemo></SizeDemo>
          </DemoBox>

          <DemoBox
            title="文案内显"
            subtitle=""
            desc="Progress 组件可通过 show-text 来控制文案是否显示， 通过 text-inside 属性来将进度条描述置于进度条内部, titleStyle 属性来调整百分数显示的样式 format 过滤文案展示"
            componentName="progress"
            demoName="text-demo">
            <TextDemo></TextDemo>
          </DemoBox>

          <DemoBox
            title="动态值"
            subtitle=""
            desc="通过改变 percent 改变进度"
            componentName="progress"
            demoName="change-demo">
            <ChangeDemo></ChangeDemo>
          </DemoBox>

          <DemoBox
            title="环形/仪表盘"
            subtitle=""
            desc="通过改变 type 修改进度条形状， line 默认线性 circle 圆形 dashboard 仪表盘"
            componentName="progress"
            demoName="type-demo">
            <TypeDemo></TypeDemo>
          </DemoBox>

          <DemoBox
            title="环形/仪表盘大小颜色配置"
            subtitle=""
            desc="通过改变 color 修改进度颜色，bgColor修改背景颜色 width 修改大小 strokeWidth修改线宽"
            componentName="progress"
            demoName="type-size-demo">
            <TypeSizeDemo></TypeSizeDemo>
          </DemoBox>
        <PropsBox
          title="Progress Attributes"
          subtitle=""
          propsData={progressPropsJson}/>
        <PropsBox
          subtitle="可以自定义文案"
          title="Progress slot"
          propsData={progressSlotJson}/>
      </div>
    );
  },
});
