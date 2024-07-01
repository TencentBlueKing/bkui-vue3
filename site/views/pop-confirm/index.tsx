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
import DemoBase from './demo-base.vue';
import DemoIcon from './demo-icon.vue';
import DemoSelect from './demo-select.vue';
import DemoSimple from './demo-simple.vue';
import DemoSlot from './demo-slot.vue';

const menuPropsJson: IPropsTableItem[] = [
  {
    name: 'trigger',
    type: 'String',
    default: 'hover',
    desc: '触发方式',
    optional: ['hover', 'click'],
  },
  {
    name: 'title',
    type: 'String',
    default: '""',
    desc: '标题',
    optional: [],
  },
  {
    name: 'content',
    type: 'String',
    default: '""',
    desc: '正文',
    optional: [],
  },
  {
    name: 'confirmText',
    type: 'String',
    default: '""',
    desc: '确认按钮文字',
    optional: [],
  },
  {
    name: 'cancelText',
    type: 'String',
    default: '""',
    desc: '取消按钮文字',
    optional: [],
  },
  {
    name: 'placement',
    type: 'String',
    default: 'top-start',
    desc: '组件显示位置',
    optional: [
      'auto',
      'auto-start',
      'auto-end',
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'right',
      'right-start',
      'right-end',
      'left',
      'left-start',
      'left-end',
    ],
  },
  {
    name: 'theme',
    type: 'String',
    default: 'light',
    desc: '组件主题色',
    optional: ['dark', 'light'],
  },
];

const eventColumnMap = {
  name: '名称',
  desc: '说明',
  type: '类型',
  params: '参数',
};

const events: IPropsTableItem[] = [
  {
    name: 'confirm',
    type: 'Function',
    default: '',
    desc: '确定操作回调函数',
    optional: [],
  },
  {
    name: 'cancel',
    type: 'Function',
    default: '',
    desc: '取消操作回调函数',
    optional: [],
  },
];

const slotColumnMap = {
  name: '名称',
  desc: '说明',
  params: '参数',
};

const popConfirmSlotsJson = [
  {
    name: 'default',
    default: [],
    desc: '触发弹框插槽',
    params: '--',
  },
  {
    name: 'content',
    default: [],
    desc: '弹框内容插槽',
    params: '--',
  },
  {
    name: 'icon',
    default: [],
    desc: 'icon 插槽，只在 title 属性不为空时生效',
    params: '--',
  },
];

export default defineComponent({
  render() {
    return (
      <div>
        <DemoTitle
          desc='bkPopconfirm是基于bkPopover改造而来，继承了bkPopover所有属性，具体请参考bkPopover文档，本文主要列出bkPopconfirm独有或不同的属性。基础样式由标题、正文和按钮构成。'
          designLink='https://bkdesign.bk.tencent.com/design/45'
          name='Popconfirm 弹出确认框'
        />
        <DemoBox
          componentName='pop-confirm'
          demoName='demo-base'
          desc='由标题+通知文本+按钮组成，例如提交表单，与 confirm 弹出的全屏居中模态对话框相比，在目标元素附近弹出浮层提示，询问用户。'
          title='基础用法'
        >
          <DemoBase />
        </DemoBox>
        <DemoBox
          componentName='pop-confirm'
          demoName='demo-simple'
          desc='由通知文本+按钮组成，比较轻量的交互模态，用于一句话承载的内容也相对较少，在目标元素附近弹出浮层提示，询问用户。'
          title='简单样式'
        >
          <DemoSimple />
        </DemoBox>
        <DemoBox
          componentName='pop-confirm'
          demoName='demo-slot'
          desc='插槽模式'
          title='插槽模式'
        >
          <DemoSlot />
        </DemoBox>
        <DemoBox
          componentName='pop-confirm'
          demoName='demo-icon'
          desc='通过 icon slot 自定义 icon'
          title='自定义 icon'
        >
          <DemoIcon />
        </DemoBox>
        <DemoBox
          componentName='pop-confirm'
          demoName='demo-select'
          desc='嵌入Select组件'
          title='嵌入Select'
        >
          <DemoSelect />
        </DemoBox>

        <PropsBox propsData={menuPropsJson}></PropsBox>
        <PropsBox
          columnMap={eventColumnMap}
          propsData={events}
          title='事件'
        ></PropsBox>
        <PropsBox
          columnMap={slotColumnMap}
          propsData={popConfirmSlotsJson}
          title='插槽'
        />
      </div>
    );
  },
});
