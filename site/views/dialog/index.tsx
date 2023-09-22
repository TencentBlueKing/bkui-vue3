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

import AsyncDemo from './async-demo.vue';
import BaseDemo from './base-demo.vue';
import ConfigDemo from './config-demo.vue';
import FullscreenDemo from './fullscreen-demo.vue';
import NestedDemo from './nested-demo.vue';
import SizeDemo from './size-demo.vue';
import TypeDemo from './type-demo.vue';

const dialogPropsJson: IPropsTableItem[] = [
  {
    name: 'is-show',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示弹框',
    optional: [],
  },
  {
    name: 'confirm-text',
    type: 'String',
    default: '确定',
    desc: '确认按钮文字',
    optional: [],
  },
  {
    name: 'cancel-text',
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
    name: 'header-align',
    type: 'String',
    default: 'left',
    desc: '显示 header 的位置',
    optional: ['left', 'center', 'right'],
  },
  {
    name: 'footer-align',
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
    name: 'ext-cls',
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
    name: 'close-icon',
    type: 'Boolean',
    default: 'true',
    desc: '是否显示右上角的关闭 icon',
    optional: [],
  },
  {
    name: 'esc-close',
    type: 'Boolean',
    default: 'true',
    desc: '是否允许 esc 按键关闭弹框',
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
    name: 'quick-close',
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
    name: 'dialog-type',
    type: 'String',
    default: 'operation',
    desc: '对话框类型',
    optional: ['show', 'operation', 'confirm', 'process'],
  },
  {
    name: 'prev-text',
    type: 'String',
    default: '上一步',
    desc: '上一步按钮文字',
    optional: [],
  },
  {
    name: 'next-text',
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
    name: 'total-step',
    type: 'Number',
    default: null,
    desc: '总步数',
    optional: [],
  },
  {
    name: 'multi-instance',
    type: 'Boolean',
    default: 'true',
    desc: '是否允许多个弹框同时存在',
    optional: [],
  },
];

const dialogSlotsJson: IPropsTableItem[] = [
  {
    name: 'header',
    type: 'Function',
    default: '',
    desc: '头部插槽',
    optional: [],
  },
  {
    name: 'default',
    type: 'Function',
    default: '',
    desc: '内容插槽',
    optional: [],
  },
  {
    name: 'footer',
    type: 'Function',
    default: '',
    desc: '底部插槽',
    optional: [],
  },
  {
    name: 'tools',
    type: 'Function',
    default: '',
    desc: '工具栏插槽，顶部区域',
    optional: [],
  },
];

const dialogChangeJson: IPropsTableItem[] = [
  {
    name: 'closed',
    type: 'Function',
    default: '',
    desc: '点击 取消，右上角的关闭 icon 或 按 esc 触发',
    optional: [],
  },
  {
    name: 'confirm',
    type: 'Function',
    default: '',
    desc: '点击确认按钮时触发',
    optional: [],
  },
  {
    name: 'value-change',
    type: 'Function',
    default: '',
    desc: '弹框显示状态变化的回调函数',
    optional: [],
  },
  {
    name: 'prev',
    type: 'Function',
    default: '',
    desc: '流程型对话框中，点击上一步触发',
    optional: [],
  },
  {
    name: 'next',
    type: 'Function',
    default: '',
    desc: '流程型对话框中，点击下一步触发',
    optional: [],
  },
];

export default defineComponent({
  name: 'SiteDialog',
  render() {
    return (
      <div>
        <DemoTitle
          name='Dialog 对话框'
          desc='对话框'
          designLink='https://bkdesign.bk.tencent.com/design/29'
        />

        <DemoBox
          title='基本用法'
          subtitle=''
          desc='默认配置的对话框。通过 theme 属性配置弹框中不同的主题确认按钮；通过 quickClose 配置是否允许点击遮罩关闭弹框，默认为 true。通过 escClose 配置是否启用 esc 按键关闭弹框，默认为 true。'
          componentName='dialog'
          demoName='base-demo'
        >
          <BaseDemo></BaseDemo>
        </DemoBox>

        <DemoBox
          title='自定义size'
          subtitle=''
          desc='对话框分为4个尺寸。通过 size 属性 normal, small, medium, large 进行配置，也可通过 width, height 自定义宽高。'
          componentName='dialog'
          demoName='size-demo'
        >
          <SizeDemo></SizeDemo>
        </DemoBox>

        <DemoBox
          title='自定义内容以及弹框配置'
          subtitle=''
          desc='通过设置 draggable 属性来设置是否允许弹框拖拽。通过 closeIcon 属性设置是否显示右上角的关闭 icon。'
          componentName='dialog'
          demoName='config-demo'
        >
          <ConfigDemo></ConfigDemo>
        </DemoBox>

        <DemoBox
          title='异步'
          subtitle=''
          desc='通过 loading 属性配置异步关闭效果，开启则需手动设置value来关闭对话框。'
          componentName='dialog'
          demoName='async-demo'
        >
          <AsyncDemo></AsyncDemo>
        </DemoBox>

        <DemoBox
          title='全屏弹框'
          subtitle=''
          desc='通过 fullscreen 属性配置全屏弹框，当设置为全屏弹框时，draggable 配置不生效即弹框不能拖动。'
          componentName='dialog'
          demoName='fullscreen-demo'
        >
          <FullscreenDemo></FullscreenDemo>
        </DemoBox>

        <DemoBox
          title='对话框类型'
          subtitle=''
          desc='对话框分为4种类型。通过 dialogType 属性 show，operation，confirm，process 进行配置，默认 operation 类型。'
          componentName='dialog'
          demoName='type-demo'
        >
          <TypeDemo></TypeDemo>
        </DemoBox>

        <DemoBox
          title='嵌套弹框'
          subtitle=''
          desc='通过 multi-instance 配置是否嵌套弹框同时存在，默认为 true，多个弹框叠加，设置为 false 只保留最后一个。'
          componentName='dialog'
          demoName='nested-demo'
        >
          <NestedDemo></NestedDemo>
        </DemoBox>

        <PropsBox
          title='Dialog 属性'
          subtitle=''
          propsData={dialogPropsJson}
        />

        <PropsBox
          title='Dialog 插槽'
          subtitle=''
          propsData={dialogSlotsJson}
        />

        <PropsBox
          title='Dialog 事件'
          subtitle=''
          propsData={dialogChangeJson}
        />
      </div>
    );
  },
});
