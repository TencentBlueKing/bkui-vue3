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

import BaseDemo from './base-demo.vue';
import FooterDemo from './footer-demo.vue';
import TitleDemo from './title-demo.vue';

const SideSliserPropsJson: IPropsTableItem[] = [
  {
    name: 'isShow',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示组件，支持v-model写法',
    optional: [],
  },
  {
    name: 'title',
    type: 'String',
    default: [],
    desc: '自定义组件的标题',
    optional: [],
  },
  {
    name: 'quick-close',
    type: 'Boolean',
    default: 'false',
    desc: '是否支持点击遮罩关闭组件',
    optional: [],
  },
  {
    name: 'show-mask',
    type: 'Boolean',
    default: 'true',
    desc: '是否允许出现遮罩',
    optional: [],
  },
  {
    name: 'width',
    type: 'Number',
    default: '400',
    desc: '组件的宽度',
    optional: [],
  },
  {
    name: 'direction',
    type: 'String',
    default: 'right',
    desc: '组件滑出的方向',
    optional: ['left', 'right'],
  },
  {
    name: 'before-close',
    type: 'Function',
    default: '',
    desc: '关闭前的钩子函数',
    optional: [],
  },
  {
    name: 'ext-cls',
    type: 'String',
    default: '',
    desc: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-sideslider-wrapper 上',
    optional: [],
  },
  {
    name: 'transfer',
    type: 'Boolean',
    default: 'false',
    desc: '控制 sidslider 是否出现在 body 内',
    optional: ['false', 'true'],
  },
  {
    name: 'zIndex',
    type: 'Number',
    default: '',
    desc: '设置侧栏的z-index值，在transfer为true的情况下，改值会自动+1',
    optional: [],
  },
];

const SideSliserEventJson: IPropsTableItem[] = [
  {
    name: 'shown',
    type: '',
    default: null,
    desc: '显示组件后的回调函数',
    optional: [],
  },
  {
    name: 'hidden',
    type: '',
    default: null,
    desc: '关闭组件后的回调函数',
    optional: [],
  },
  {
    name: 'animation-end',
    type: '',
    default: null,
    desc: '关闭组件后动画结束的回调函数',
    optional: [],
  },
];

const SideSliserSlotJson: IPropsTableItem[] = [
  {
    name: 'default',
    type: 'Function',
    default: null,
    desc: '默认插槽',
    optional: [],
  },
  {
    name: 'header',
    type: 'Function',
    default: null,
    desc: '头部插槽',
    optional: [],
  },
  {
    name: 'footer',
    type: 'Function',
    default: null,
    desc: '底部插槽',
    optional: [],
  },
];

export default defineComponent({
  render() {
    return (
    <div>
      <DemoTitle
        name="Sideslider侧栏"
        desc="Sideslider组件， 提供一个从两侧滑入的组件，供用户填写/查看更多信息。"
        link="https://www.google.com.hk/"/>
      <DemoBox
        title="基础用法"
        subtitle=""
        desc="使用默认配置的组件"
        componentName="sideslider"
        demoName="base-demo">
        <BaseDemo></BaseDemo>
      </DemoBox>
      <DemoBox
        title="自定义标题和内容"
        subtitle=""
        desc="配置title参数和添加slot"
        componentName="sideslider"
        demoName="title-demo">
        <TitleDemo></TitleDemo>
      </DemoBox>
      <DemoBox
        title="自定义footer"
        subtitle=""
        desc="配置footer插槽，footer插槽内容会随着高度的变化而变化"
        componentName="sideslider"
        demoName="footer-demo">
        <FooterDemo></FooterDemo>
      </DemoBox>
      <PropsBox title="Sideslider Attributes" subtitle="" propsData={SideSliserPropsJson}/>
      <PropsBox title="Sideslider Event" subtitle="" propsData={SideSliserEventJson}/>
      <PropsBox title="Sideslider Slot" subtitle="" propsData={SideSliserSlotJson}/>
    </div>
    );
  },
});
