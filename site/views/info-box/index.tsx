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
import type { IPropsTableItem } from '../../typings';

import BaseDemo from './base-demo.vue';
import ConfirmDemo from './confirm-demo.vue';
import UpdateDemo from './update-demo.vue';
// import propsDialog from '@bkui-vue/dialog/src/props';
// import { resolvePropsToDesData } from '../utils';

// const props = resolvePropsToDesData(propsDialog);
const props: IPropsTableItem[] = [
  {
    name: 'isShow',
    type: 'Boolean',
    default: 'false',
    desc: '初始化是否展示',
    optional: [],
  },
  {
    name: 'onClose',
    type: 'Function',
    default: '',
    desc: '关闭执行函数',
    optional: [],
  },
  {
    name: 'onConfirm',
    type: 'Function',
    default: '',
    desc: '确定执行函数',
    optional: [],
  },
  {
    name: 'confirmText',
    type: 'String',
    default: '确定',
    desc: '确认按钮文字',
    optional: [],
  },
  {
    name: 'cancelText',
    type: 'String',
    default: '取消',
    desc: '取消按钮文字',
    optional: [],
  },
  {
    name: 'title',
    type: 'String',
    default: '',
    desc: '弹框的标题',
    optional: [],
  },
  {
    name: 'headerAlign',
    type: 'String',
    default: 'left',
    desc: '显示 header 的位置',
    optional: ['left', 'center', 'right'],
  },
  {
    name: 'footerAlign',
    type: 'String',
    default: 'right',
    desc: '显示 footer 的位置',
    optional: ['left', 'center', 'right'],
  },
  {
    name: 'theme',
    type: 'String',
    default: 'primary',
    desc: '颜色按钮类型',
    optional: ['primary', 'warning', 'success', 'danger'],
  },
  {
    name: 'width',
    type: 'String | Number',
    default: 480,
    desc: '自定义对话框宽度',
    optional: [],
  },
  {
    name: 'height',
    type: 'String | Number',
    default: 240,
    desc: '自定义对话框高度',
    optional: [],
  },
  {
    name: 'extCls',
    type: 'String | Array',
    default: '',
    desc: '配置自定义样式类名',
    optional: [],
  },
  {
    name: 'scrollable',
    type: 'Boolean',
    default: 'true',
    desc: '弹框出现时，是否允许页面滚动',
    optional: [],
  },
  {
    name: 'closeIcon',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示右上角的关闭 icon',
    optional: [],
  },
  {
    name: 'escClose',
    type: 'Boolean',
    default: 'true',
    desc: '是否允许 esc 按键关闭弹框',
    optional: [],
  },
  {
    name: 'showMask',
    type: 'Boolean',
    default: 'true',
    desc: '是否允许出现遮罩',
    optional: [],
  },
  {
    name: 'quickClose',
    type: 'Boolean',
    default: 'true',
    desc: '是否允许点击遮罩关闭弹框',
    optional: [],
  },
  {
    name: 'fullscreen',
    type: 'Boolean',
    default: 'false',
    desc: '是否全屏',
    optional: [],
  },
  {
    name: 'size',
    type: 'String',
    default: '',
    desc: '对话框尺寸',
    optional: ['normal', 'small', 'medium', 'large'],
  },
  {
    name: 'draggable',
    type: 'Boolean',
    default: 'true',
    desc: '是否可拖拽',
    optional: [],
  },
  {
    name: 'dialogType',
    type: 'String',
    default: 'operation',
    desc: '对话框类型',
    optional: ['show', 'operation', 'confirm', 'process'],
  },
  {
    name: 'prevText',
    type: 'String',
    default: '上一步',
    desc: '上一步按钮文字',
    optional: [],
  },
  {
    name: 'nextText',
    type: 'String',
    default: '下一步',
    desc: '下一步按钮文字',
    optional: [],
  },
  {
    name: 'current',
    type: 'Number',
    default: 1,
    desc: '当前步骤',
    optional: [],
  },
  {
    name: 'totalStep',
    type: 'Number',
    default: null,
    desc: '总步数',
    optional: [],
  },
];
const infoBox: IPropsTableItem[] = [
  {
    name: 'show',
    type: 'Function',
    default: '',
    desc: '展示',
    optional: [],
  },
  {
    name: 'hide',
    type: 'Function',
    default: '',
    desc: '隐藏',
    optional: [],
  },
  {
    name: 'update',
    type: 'Function',
    default: '',
    desc: '更新',
    optional: [],
  },
];
export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          name='infoBox 消息提示'
          desc='用户操作后的消息提示，用于成功、失败、警告等消息提醒。'
          link='https://www.google.com.hk/'/>
        <DemoBox
          title='基础用法'
          subtitle='使用默认配置的消息提示'
          desc=''
          componentName='message'
          demoName='base-demo'>
          <BaseDemo/>
        </DemoBox>
        <DemoBox
          title='更新'
          subtitle='实例复用'
          desc=''
          componentName='message'
          demoName='base-demo'>
          <UpdateDemo/>
        </DemoBox>
        <DemoBox
          title='Confirm'
          subtitle='confirm 确定按钮'
          desc='对话框分为4种类型。通过 dialogType 属性 设置为 confirm 实现'
          componentName='message'
          demoName='base-demo'>
          <ConfirmDemo/>
        </DemoBox>
        <PropsBox subtitle='InfoBox函数参数（以Dialog为准）' propsData={props}/>
        <PropsBox subtitle='InfoBox函数返回实例' propsData={infoBox}/>
      </div>
    );
  },
});
