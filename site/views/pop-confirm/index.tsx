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

import { PopConfirmEvent, PopConfirmProps } from '../../../packages/pop-confirm/src/props';
import DemoBox from '../../components/demo-box';
import DemoTitle from '../../components/demo-title';
import PropsBox from '../../components/props-box';
import { resolvePropsToDesData } from '../utils';

import DemoBase from './demo-base.vue';
import DemoSimple from './demo-simple.vue';
import DemoSlot from './demo-slot.vue';

const events = resolvePropsToDesData(PopConfirmEvent);
const props = resolvePropsToDesData(PopConfirmProps);

export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          name="Popover 弹出框提示"
          desc="bkPopconfirm是基于bkPopover改造而来，继承了bkPopover所有属性，具体请参考bkPopover文档，本文主要列出bkPopconfirm独有或不同的属性。基础样式由标题、正文和按钮构成。"
          link="https://www.google.com.hk/"/>
        <DemoBox
          title="基础用法"
          desc="由标题+通知文本+按钮组成，例如提交表单，与 confirm 弹出的全屏居中模态对话框相比，在目标元素附近弹出浮层提示，询问用户。"
          componentName="pop-confirm"
          demoName="demo-base">
          <DemoBase/>
        </DemoBox>
        <DemoBox
          title="简单样式"
          desc="由通知文本+按钮组成，比较轻量的交互模态，用于一句话承载的内容也相对较少，在目标元素附近弹出浮层提示，询问用户。"
          componentName="pop-confirm"
          demoName="demo-simple">
          <DemoSimple/>
        </DemoBox>
        <DemoBox
          title="插槽模式"
          desc="自定义样式"
          componentName="pop-confirm"
          demoName="demo-slot">
          <DemoSlot/>
        </DemoBox>

        <PropsBox title="属性" subtitle="" propsData={props}></PropsBox>
        <PropsBox title="事件" subtitle="" propsData={events}></PropsBox>
      </div>
    );
  },
});
