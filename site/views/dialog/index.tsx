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
import BeforeCloseDemo from './before-close-demo.vue';
import FullscreenDemo from './fullscreen-demo.vue';
import MaskDemo from './mask-demo.vue';
import NestedDemo from './nested-demo.vue';

const dialogPropsJson: IPropsTableItem[] = [
  {
    name: 'is-show',
    type: 'Boolean',
    default: 'false',
    desc: '是否显示弹框',
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
    name: 'width',
    type: 'String | Number',
    default: 480,
    desc: '自定义对话框宽度',
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
    name: 'transfer',
    type: 'Boolean | String | HTMLElement',
    default: 'true',
    desc: '控制弹框是否出现在 body 内',
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
    name: 'draggable',
    type: 'Boolean',
    default: 'true',
    desc: '是否可拖拽',
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
    name: 'confirm-button-theme',
    type: 'String',
    default: 'primary',
    desc: '颜色按钮类型',
    optional: ['primary', 'warning', 'success', 'danger'],
  },
  {
    name: 'cancel-text',
    type: 'String',
    default: '取消',
    desc: '取消按钮文字',
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
    name: 'before-close',
    type: '() => Promise<boolean> | boolean>',
    default: '--',
    desc: '关闭前确认',
  },
  {
    name: 'render-directive',
    type: '() => Promise<boolean> | boolean>',
    default: 'is',
    desc: '弹框的渲染方式',
    optional: ['v-if', 'v-show'],
  },

  // {
  //   name: 'dialog-type',
  //   type: 'String',
  //   default: 'operation',
  //   desc: '对话框类型',
  //   optional: ['show', 'operation', 'confirm', 'process'],
  // },
  // {
  //   name: 'prev-text',
  //   type: 'String',
  //   default: '上一步',
  //   desc: '上一步按钮文字',
  //   optional: [],
  // },
  // {
  //   name: 'next-text',
  //   type: 'String',
  //   default: '下一步',
  //   desc: '下一步按钮文字',
  //   optional: [],
  // },
  // {
  //   name: 'current',
  //   type: 'Number',
  //   default: 1,
  //   desc: '当前步骤',
  //   optional: [],
  // },
  // {
  //   name: 'total-step',
  //   type: 'Number',
  //   default: null,
  //   desc: '总步数',
  //   optional: [],
  // },
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
    name: 'update:isShow',
    type: 'Function',
    default: '',
    desc: '更新关闭状态',
    optional: [],
  },
  {
    name: 'closed',
    type: 'Function',
    default: '',
    desc: '点击 取消，右上角的关闭 icon 或 按 esc 触发',
    optional: [],
  },
  {
    name: 'hidden',
    type: 'Function',
    default: '',
    desc: '弹框关闭',
  },
  {
    name: 'shown',
    type: 'Function',
    default: '',
    desc: '弹框弹出',
  },
];

export default defineComponent({
  name: 'SiteDialog',
  render() {
    return (
      <div>
        <DemoTitle
          desc='对话框'
          designLink='https://bkdesign.bk.tencent.com/design/29'
          name='Dialog 对话框'
        />

        <DemoBox
          componentName='dialog'
          demoName='base-demo'
          desc='基本用法: isShow 控制 dialog 的显示隐藏'
          subtitle=''
          title='基本用法'
        >
          <BaseDemo></BaseDemo>
        </DemoBox>

        <DemoBox
          componentName='dialog'
          demoName='mask-demo'
          desc='通过设置  showMask 属性来设置是否显示遮罩'
          subtitle=''
          title='遮罩'
        >
          <MaskDemo />
        </DemoBox>

        <DemoBox
          componentName='dialog'
          demoName='before-close-demo'
          desc='通过 beforeChange 属性关闭前确认。'
          subtitle=''
          title='关闭前确认'
        >
          <BeforeCloseDemo />
        </DemoBox>

        <DemoBox
          componentName='dialog'
          demoName='fullscreen-demo'
          desc='通过 fullscreen 属性配置全屏弹框，当设置为全屏弹框时，draggable 配置不生效即弹框不能拖动。'
          subtitle=''
          title='全屏弹框'
        >
          <FullscreenDemo></FullscreenDemo>
        </DemoBox>

        <DemoBox
          componentName='dialog'
          demoName='nested-demo'
          desc='嵌套弹框'
          subtitle=''
          title='嵌套弹框'
        >
          <NestedDemo></NestedDemo>
        </DemoBox>

        <PropsBox
          propsData={dialogPropsJson}
          subtitle=''
          title='Dialog 属性'
        />

        <PropsBox
          propsData={dialogSlotsJson}
          subtitle=''
          title='Dialog 插槽'
        />

        <PropsBox
          propsData={dialogChangeJson}
          subtitle=''
          title='Dialog 事件'
        />
      </div>
    );
  },
});
