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
import {
  type IPropsTableItem,
} from '../../typings';

import DemoAlert from './demo/alert.vue';
import DemoAlertClose from './demo/alert-close.vue';
import DemoAlertCloseText from './demo/alert-close-text.vue';
import DemoAlertShowIcon from './demo/alert-show-icon.vue';

const alertProps: IPropsTableItem[] = [
  {
    name: 'theme',
    type: 'String',
    default: 'info',
    desc: '主题',
    optional: ['info', 'success', 'warning', 'error'],
  },
  {
    name: 'title',
    type: 'String',
    default: '',
    desc: '标题',
    optional: [],
  },
  {
    name: 'closable',
    type: 'Boolean',
    default: 'false',
    desc: '是否可以关闭',
    optional: ['true', 'false'],
  },
  {
    name: 'closeText',
    type: 'String',
    default: '',
    desc: '自定义关闭按钮文案',
    optional: [],
  },
  {
    name: 'showIcon',
    type: 'Boolean',
    default: '',
    desc: '是否显示ICON',
    optional: [],
  },
];

const alertEvents: IPropsTableItem[] = [
  {
    name: 'close',
    type: 'Function',
    default: '',
    desc: '关闭事件',
    optional: [],
  },
];

const alertSlots: IPropsTableItem[] = [
  {
    name: 'title',
    type: '',
    default: '',
    desc: '',
    optional: [],
  },
];

export default defineComponent({
  name: 'Alert',
  render() {
    return (
      <div>
        <DemoTitle
          name="Radio"
          desc="展示页面的提示信息"
          link="https://www.qq.com/"/>
        <DemoBox
          title="基本用法"
          desc=""
          componentName="alert"
          demoName="/demo/alert">
            <DemoAlert />
        </DemoBox>
        <DemoBox
          title="不显示ICON"
          desc=""
          componentName="alert"
          demoName="/demo/alert-show-icon">
            <DemoAlertShowIcon />
        </DemoBox>
        <DemoBox
          title="可关闭"
          desc=""
          componentName="alert"
          demoName="/demo/alert-close">
            <DemoAlertClose />
        </DemoBox>
        <DemoBox
          title="自定义关闭按钮文字"
          desc=""
          componentName="alert"
          demoName="/demo/alert-close-text">
            <DemoAlertCloseText />
        </DemoBox>
        <PropsBox
          title="Alert 属性"
          subtitle=""
          propsData={alertProps}/>
        <PropsBox
          title="Alert 事件"
          subtitle=""
          propsData={alertEvents}/>
        <PropsBox
          title="Alert 插槽"
          subtitle=""
          propsData={alertSlots}/>
      </div>
    );
  },
});
