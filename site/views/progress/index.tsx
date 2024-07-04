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
    desc: '进度条百分比',
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
    optional: ['small', 'large', 'huge'],
  },
  {
    name: 'width',
    type: 'Number',
    default: '126',
    desc: '环形/仪表盘大小,针对 circle 和 dashboard 类型有效',
    optional: [],
  },
  {
    name: 'stroke-width',
    type: 'Number',
    default: '',
    desc: '进度条的粗细宽度',
    optional: [],
  },
  {
    name: 'stroke-linecap',
    type: 'String',
    default: 'round',
    desc: '仪表盘进度路径两端形状',
    optional: ['butt', 'round', 'square', 'inherit'],
  },
  {
    name: 'text-inside',
    type: 'Boolean',
    default: 'false',
    desc: '线性进度条是否显示文字到进度条内',
    optional: [],
  },
  {
    name: 'show-text',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示文案',
    optional: [],
  },
  {
    name: 'color',
    type: 'String',
    default: '#13ce66',
    desc: '进度条颜色',
    optional: [],
  },
  {
    name: 'bg-color',
    type: 'String',
    default: '#f5f5f5',
    desc: '环形/仪表盘路径背景颜色',
    optional: [],
  },
  {
    name: 'format',
    type: 'Function',
    default: '(value) => value%',
    desc: '自定义的进度条文字格式',
    optional: [],
  },
  {
    name: 'fixed',
    type: 'Number',
    default: '0',
    desc: '进度条百分比的小数位数，值必须为 0 到 20 之间',
    optional: ['0 <= fixed <= 20'],
  },
  {
    name: 'title-style',
    type: 'Object',
    default: "{ fontSize: '16px', verticalAlign: 'middle' }",
    desc: '进度条文字的样式',
    optional: [],
  },
  {
    name: 'ext-cls',
    type: 'String',
    default: '',
    desc: '自定义样式类名',
    optional: [],
  },
];

const progressSlotJson: IPropsTableItem[] = [
  {
    name: 'default',
    type: 'String',
    default: '',
    desc: '自定义进度条文字插槽',
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
          desc='进度条'
          designLink='https://bkdesign.bk.tencent.com/design/141'
          name='Progress 进度条'
        />

        <DemoBox
          componentName='progress'
          demoName='base-demo'
          desc='percent 是 0 到 100 之间的数值，提供 4 种主题，由 theme 属性来定义，可选的主题有 primary, warning, success, danger，默认为 primary, 由 color 属性来自定义颜色值。'
          subtitle='修改进度条主题'
          title='基础用法'
        >
          <BaseDemo></BaseDemo>
        </DemoBox>

        <DemoBox
          componentName='progress'
          demoName='size-demo'
          desc='可以使用 size 属性来配置进度条的尺寸，可接受 small large huge，也可配置strokeWidth线宽'
          subtitle=''
          title='大小设置'
        >
          <SizeDemo></SizeDemo>
        </DemoBox>

        <DemoBox
          componentName='progress'
          demoName='text-demo'
          desc='Progress 组件可通过 show-text 来控制文案是否显示， 通过 text-inside 属性来将进度条描述置于进度条内部, titleStyle 属性来调整百分数显示的样式 format 过滤文案展示'
          subtitle=''
          title='文案内显'
        >
          <TextDemo></TextDemo>
        </DemoBox>

        <DemoBox
          componentName='progress'
          demoName='change-demo'
          desc='通过改变 percent 改变进度'
          subtitle=''
          title='动态值'
        >
          <ChangeDemo></ChangeDemo>
        </DemoBox>

        <DemoBox
          componentName='progress'
          demoName='type-demo'
          desc='通过改变 type 修改进度条形状， line 默认线性 circle 圆形 dashboard 仪表盘'
          subtitle=''
          title='环形/仪表盘'
        >
          <TypeDemo></TypeDemo>
        </DemoBox>

        <DemoBox
          componentName='progress'
          demoName='type-size-demo'
          desc='通过改变 color 修改进度颜色，bgColor修改背景颜色 width 修改大小 strokeWidth修改线宽'
          subtitle=''
          title='环形/仪表盘大小颜色配置'
        >
          <TypeSizeDemo></TypeSizeDemo>
        </DemoBox>
        <PropsBox
          propsData={progressPropsJson}
          subtitle=''
          title='Progress 属性'
        />
        <PropsBox
          propsData={progressSlotJson}
          subtitle='可以自定义文案'
          title='Progress 插槽'
        />
      </div>
    );
  },
});
