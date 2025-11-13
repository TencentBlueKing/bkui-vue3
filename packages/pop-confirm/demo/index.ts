/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台 (BlueKing PaaS):
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
import { NavGroupMeta, type IComponentWiki } from '@bkui-vue/shared';

// 组件示例
// 组件示例
const presets = [
  {
    title: '基础用法',
    description: '由标题+通知文本+按钮组成，例如提交表单，与 confirm 弹出的全屏居中模态对话框相比，在目标元素附近弹出浮层提示，询问用户。',
    props: {
      width: 288,
      content: '删除操作无法撤回，请谨慎操作！',
      title: '确认删除该脚本？',
      trigger: 'click',
    },
    dependent: {
      components: ['button'],
    },
    slots: {
      default: `
        <bk-button class="align-center">删除</bk-button>
      `,
    },
    events: {
      afterHidden: `() => {
        console.log('hide');
      }`,
      afterShow: `() => {
        console.log('show');
      }`,
      confirm: `() => {
        console.log('ensure');
      }`,
    },
    style: `.align-center {
      align-self: center;
    }`,
  },
  {
    title: '简单样式',
    description: '由通知文本+按钮组成，比较轻量的交互模态，用于一句话承载的内容也相对较少，在目标元素附近弹出浮层提示，询问用户。',
    props: {
      width: 288,
      content: '删除结果数据时，将同时删除该结果数据下的所有样本曲线，请确认！',
      trigger: 'click',
    },
    dependent: {
      components: ['button'],
    },
    slots: {
      default: `<bk-button>删除</bk-button>`,
    },
    events: {
      confirm: `() => {
        console.log('ensure');
      }`,
    },
  },
  {
    title: '插槽模式',
    description: '插槽模式',
    props: {
      width: 288,
      content: '删除操作无法撤回，请谨慎操作！',
      title: '确认删除该脚本？',
      trigger: 'click',
    },
    dependent: {
      components: ['button', 'icon'],
    },
    slots: {
      default: `<bk-button>删除</bk-button>`,
      icon: `<Help />`,
      content: `<div class="pop-confirm-content">
          测试将同时删除该结果数据下的所有样本曲线
        </div>`,
    },
    events: {
      confirm: `() => {
        console.log('ensure');
      }`,
    },
    style: `.pop-confirm-content {
      margin-bottom: 16px;
      color: red;
    }`,
  },
  {
    title: '自定义 icon',
    description: '通过 icon slot 自定义 icon',
    props: {
      width: 288,
      content: '删除操作无法撤回，请谨慎操作！',
      title: '确认删除该脚本？',
      trigger: 'click',
    },
    dependent: {
      components: ['button', 'icon'],
    },
    slots: {
      default: `<bk-button>删除</bk-button>`,
      icon: `<Error />`,
    },
    events: {
      confirm: `() => {
        console.log('ensure');
      }`,
    },
  },
  {
    title: '嵌入Select',
    description: '嵌入Select组件',
    props: {
      width: 288,
      title: '确认删除该脚本？',
      trigger: 'click',
    },
    dependent: {
      components: ['button', 'select'],
    },
    slots: {
      default: `<bk-button>删除</bk-button>`,
      content: `<bk-select
          :list="[
        {
          label: '爬山',
          value: 1,
        },
        {
          label: '跑步',
          value: 2,
        },
      ]"
          :popover-options="{ boundary: 'parent' }"
          class="pop-confirm-content-select"
        />`,
    },
    events: {
      confirm: `() => {
        console.log('ensure');
      }`,
    },
    style: `.pop-confirm-content-select {
      margin-bottom: 24px;
    }`,
  },
  {
    title: '点击占位区弹窗不收起',
    description: '通过 popoverOptions 设置 hideIgnoreReference: true，若占位区为非行内元素，请配置 referenceCls: 类名',
    props: {
      width: 288,
      popoverOptions: {
        hideIgnoreReference: true,
      },
      content: '删除操作无法撤回，请谨慎操作！',
      title: '确认删除该脚本？',
      trigger: 'click',
    },
    dependent: {
      components: ['button'],
    },
    slots: {
      default: `<bk-button>删除(点我不收起弹窗)</bk-button>`,
    },
    events: {
      afterHidden: `() => {
        console.log('hide');
      }`,
      afterShow: `() => {
        console.log('show');
      }`,
      confirm: `() => {
        console.log('ensure');
      }`,
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'trigger',
    description: '触发方式',
    type: 'string',
    options: ['click', 'hover'],
    default: 'hover',
  },
  {
    name: 'title',
    description: '标题',
    type: 'string',
    default: '',
  },
  {
    name: 'content',
    description: '正文',
    type: 'string',
    default: '',
  },
  {
    name: 'confirmText',
    description: '确认按钮文字',
    type: 'string',
    default: '',
  },
  {
    name: 'cancelText',
    description: '取消按钮文字',
    type: 'string',
    default: '',
  },
  {
    name: 'placement',
    description: '组件显示位置',
    type: 'string',
    options: [
      'auto',
      'auto-start',
      'auto-end',
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'left',
      'left-start',
      'left-end',
      'right',
      'right-start',
      'right-end',
    ],
    default: 'top-start',
  },
  {
    name: 'theme',
    description: '组件主题色',
    type: 'string',
    options: ['dark', 'light'],
    default: 'light',
  },
  {
    name: 'width',
    description: '宽度',
    type: 'string | number',
    default: 'auto',
  },
  {
    name: 'confirmConfig',
    description: '确定按钮的配置，同Button的Props',
    type: 'ButtonProps',
    link: '/component/button/api#ButtonProps',
    default: {},
  },
  {
    name: 'cancelConfig',
    description: '取消按钮的配置，同Button的Props',
    type: 'ButtonProps',
    link: '/component/button/api#ButtonProps',
    default: {},
  },
  {
    name: 'popover-options',
    description: 'Popover组件的配置项',
    type: 'PopoverProps',
    link: '/component/popover/api#PopoverProps',
    default: {},
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'confirm',
    description: '确定操作回调函数',
    params: [],
  },
  {
    name: 'cancel',
    description: '取消操作回调函数',
    params: [],
  },
  {
    name: 'after-show',
    description: '显示提示框时触发函数',
    params: [],
  },
  {
    name: 'after-hidden',
    description: '隐藏提示框时触发函数',
    params: [],
  },
];

// 组件自定义的复杂类型
const types = [];

// 组件分组
const group = NavGroupMeta.Feedback;

// 组件名称
const name = 'pop-confirm';

// 组件标签
const title = 'Popconfirm';

// 组件中文标签
const titleCN = '弹出确认框';

// 组件描述
const description =
  'bkPopconfirm是基于bkPopover改造而来，继承了bkPopover所有属性，具体请参考bkPopover文档，本文主要列出bkPopconfirm独有或不同的属性。基础样式由标题、正文和按钮构成。';

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  presets,
  types,
  description,
};

export default wiki;
