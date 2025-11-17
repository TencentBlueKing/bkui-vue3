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
const presets = [
  {
    title: '基础用法',
    description: 'slot[name=default] 配置触发对象，slot[name=content] 配置下拉菜单',
    props: {
      popoverOptions: {
        clickContentAutoHide: true,
      },
    },
    slots: {
      default: `
        <bk-button theme="primary">更多操作</bk-button>
      `,
      content: `
        <bk-dropdown-menu>
          <bk-dropdown-item>生产环境</bk-dropdown-item>
          <bk-dropdown-item>测试环境</bk-dropdown-item>
          <bk-dropdown-item>预发布环境</bk-dropdown-item>
          <bk-dropdown-item>正式环境</bk-dropdown-item>
          <bk-dropdown-item>灰度环境</bk-dropdown-item>
          <bk-dropdown-item>开发环境</bk-dropdown-item>
          <bk-dropdown-item>调试环境</bk-dropdown-item>
        </bk-dropdown-menu>
      `,
    },
    dependent: {
      components: ['button'],
    },
  },
  {
    title: '菜单出现位置',
    description: '通过 placement 配置菜单出现位置',
    props: {
      placement: 'top-start',
      popoverOptions: {
        clickContentAutoHide: true,
      },
    },
    slots: {
      default: `
        <bk-button theme="primary">更多操作</bk-button>
      `,
      content: `
        <bk-dropdown-menu>
          <bk-dropdown-item>生产环境</bk-dropdown-item>
          <bk-dropdown-item>测试环境</bk-dropdown-item>
          <bk-dropdown-item>预发布环境</bk-dropdown-item>
          <bk-dropdown-item>正式环境</bk-dropdown-item>
          <bk-dropdown-item>灰度环境</bk-dropdown-item>
          <bk-dropdown-item>开发环境</bk-dropdown-item>
          <bk-dropdown-item>调试环境</bk-dropdown-item>
        </bk-dropdown-menu>
      `,
    },
  },
  {
    title: '点击触发',
    description: '通过 trigger=click 设置触发事件类型',
    props: {
      trigger: 'click',
      popoverOptions: {
        clickContentAutoHide: true,
      },
    },
    slots: {
      default: `
        <bk-button theme="primary">更多操作</bk-button>
      `,
      content: `
        <bk-dropdown-menu>
          <bk-dropdown-item>生产环境</bk-dropdown-item>
          <bk-dropdown-item>测试环境</bk-dropdown-item>
          <bk-dropdown-item>预发布环境</bk-dropdown-item>
          <bk-dropdown-item>正式环境</bk-dropdown-item>
          <bk-dropdown-item>灰度环境</bk-dropdown-item>
          <bk-dropdown-item>开发环境</bk-dropdown-item>
          <bk-dropdown-item>调试环境</bk-dropdown-item>
        </bk-dropdown-menu>
      `,
    },
  },
  {
    title: '自定义显示与隐藏',
    description: '通过 isShow 下来菜单的显示与隐藏，trigger=manual下生效',
    props: {
      isShow: true,
      trigger: 'manual',
    },
    slots: {
      default: `
        <bk-button theme="primary">更多操作</bk-button>
      `,
      content: `
        <bk-dropdown-menu>
          <bk-dropdown-item>生产环境</bk-dropdown-item>
          <bk-dropdown-item>测试环境</bk-dropdown-item>
          <bk-dropdown-item>预发布环境</bk-dropdown-item>
          <bk-dropdown-item>正式环境</bk-dropdown-item>
          <bk-dropdown-item>灰度环境</bk-dropdown-item>
          <bk-dropdown-item>开发环境</bk-dropdown-item>
          <bk-dropdown-item>调试环境</bk-dropdown-item>
        </bk-dropdown-menu>
      `,
    },
    events: {
      showChange: `(val) => {
        BkMessage(\`is-show: \${val}\`);
      }`,
    },
    dependent: {
      components: ['message'],
    },
  },
  {
    title: '禁用状态',
    description: '通过 disabled 设置禁用状态',
    props: {
      disabled: true,
    },
    slots: {
      default: `
        <bk-button theme="primary">更多操作</bk-button>
      `,
      content: `
        <bk-dropdown-menu>
          <bk-dropdown-item>生产环境</bk-dropdown-item>
          <bk-dropdown-item>测试环境</bk-dropdown-item>
          <bk-dropdown-item>预发布环境</bk-dropdown-item>
          <bk-dropdown-item>正式环境</bk-dropdown-item>
          <bk-dropdown-item>灰度环境</bk-dropdown-item>
          <bk-dropdown-item>开发环境</bk-dropdown-item>
          <bk-dropdown-item>调试环境</bk-dropdown-item>
        </bk-dropdown-menu>
      `,
    },
  },
  {
    title: '回调函数',
    description: '通过 show hide 设置显示与隐藏的回调',
    // props: {
    //   trigger: 'manual',
    // },
    slots: {
      default: `
        <bk-button theme="primary">更多操作</bk-button>
      `,
      content: `
        <bk-dropdown-menu>
          <bk-dropdown-item>生产环境</bk-dropdown-item>
          <bk-dropdown-item>测试环境</bk-dropdown-item>
          <bk-dropdown-item>预发布环境</bk-dropdown-item>
          <bk-dropdown-item>正式环境</bk-dropdown-item>
          <bk-dropdown-item>灰度环境</bk-dropdown-item>
          <bk-dropdown-item>开发环境</bk-dropdown-item>
          <bk-dropdown-item>调试环境</bk-dropdown-item>
        </bk-dropdown-menu>
      `,
    },
    events: {
      show: `
        () => {
          BkMessage('show');
        }
      `,
      hide: `
        () => {
          BkMessage('hide');
        }
      `,
    },
    dependent: {
      components: ['message'],
    },
  },
  {
    title: '元素绑定在body下',
    description: '通过 popoverOptions 设置 boundary: "body"',
    props: {
      popoverOptions: {
        clickContentAutoHide: true,
        boundary: 'body',
      },
    },
    slots: {
      default: `
        <bk-button theme="primary">更多操作</bk-button>
      `,
      content: `
        <bk-dropdown-menu>
          <bk-dropdown-item>生产环境</bk-dropdown-item>
          <bk-dropdown-item>测试环境</bk-dropdown-item>
          <bk-dropdown-item>预发布环境</bk-dropdown-item>
          <bk-dropdown-item>正式环境</bk-dropdown-item>
          <bk-dropdown-item>灰度环境</bk-dropdown-item>
          <bk-dropdown-item>开发环境</bk-dropdown-item>
          <bk-dropdown-item>调试环境</bk-dropdown-item>
        </bk-dropdown-menu>
      `,
    },
  },
  {
    title: '点击占位区弹窗不收起',
    description: '通过 popoverOptions 设置 hideIgnoreReference: true，若占位区为非行内元素，请配置 referenceCls: 类名',
    props: {
      popoverOptions: {
        clickContentAutoHide: true,
        hideIgnoreReference: true,
      },
    },
    slots: {
      default: `
        <bk-button theme="primary">更多操作</bk-button>
      `,
      content: `
        <bk-dropdown-menu>
          <bk-dropdown-item>生产环境</bk-dropdown-item>
          <bk-dropdown-item>测试环境</bk-dropdown-item>
          <bk-dropdown-item>预发布环境</bk-dropdown-item>
          <bk-dropdown-item>正式环境</bk-dropdown-item>
          <bk-dropdown-item>灰度环境</bk-dropdown-item>
          <bk-dropdown-item>开发环境</bk-dropdown-item>
          <bk-dropdown-item>调试环境</bk-dropdown-item>
        </bk-dropdown-menu>
      `,
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'is-show',
    description: 'trigger = manual时候控制显隐藏',
    type: 'boolean',
    default: false,
  },
  {
    name: 'placement',
    description: '弹层出现位置',
    type: 'string',
    default: 'top',
  },
  {
    name: 'trigger',
    description: '触发方式',
    type: 'string',
    default: 'hover',
  },
  {
    name: 'disabled',
    description: '是否禁用',
    type: 'boolean',
    default: false,
  },
  {
    name: 'popover-options',
    description: 'popover配置',
    type: 'object',
    default: {},
  },
  {
    name: 'ext-cls',
    description: '自定义样式类名',
    type: 'string',
    default: '',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'showChange',
    description: '显示状态变化时触发',
    params: [
      {
        name: 'val',
        type: 'boolean',
      },
    ],
  },
  {
    name: 'show',
    description: '显示时触发',
    params: [],
  },
  {
    name: 'hide',
    description: '隐藏时触发',
    params: [],
  },
];

const slots = [
  {
    name: 'default',
    description: '触发对象插槽',
    params: [
      {
        name: 'popoverShow',
        type: 'boolean',
      },
    ],
  },
  {
    name: 'content',
    description: '下拉菜单插槽',
  },
];

// 组件分组
const group = NavGroupMeta.Data;

// 组件名称
const name = 'dropdown';

// 组件标签
const title = 'Dropdown';

// 组件中文标签
const titleCN = '下拉菜单';

// 组件描述
const description = '下拉菜单';

const children = [
  {
    name: 'dropdown-menu',
    props: [
      {
        name: 'ext-cls',
        description: '自定义样式类名',
        type: 'string',
        default: '',
      },
    ],
    emits: [],
  },
  {
    name: 'dropdown-item',
    props: [
      {
        name: 'ext-cls',
        description: '自定义样式类名',
        type: 'string',
        default: '',
      },
    ],
    emits: [
      {
        name: 'click',
        description: '点击时触发',
        params: [
          {
            name: 'event',
            type: 'MouseEvent',
          },
        ],
      },
    ],
  },
];

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  slots,
  presets,
  description,
  children,
};

export default wiki;
