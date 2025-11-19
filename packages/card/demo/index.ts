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
    title: '基础样式',
    description: '通用卡片样式，满足基本场景',
    props: {
      title: '基础卡片',
      isEdit: true,
      position: 'right',
      border: true,
    },
    slots: {
      default: `
        <div>
          <p style="padding: 10px;">卡片内容1</p>
          <p style="padding: 10px;">卡片内容2</p>
          <p style="padding: 10px;">卡片内容3</p>
        </div>
      `,
    },
  },
  {
    title: '卡片折叠',
    description: '卡片支持折叠，满足更多空间需求',
    props: {
      title: '卡片折叠',
      isCollapse: true,
    },
    slots: {
      default: `
        <div>
          <p style="padding: 10px;">卡片内容1</p>
          <p style="padding: 10px;">卡片内容2</p>
          <p style="padding: 10px;">卡片内容3</p>
        </div>
      `,
    },
  },
  {
    title: '自定义header和footer',
    description: '自定义header和footer，满足更多场景需求',
    props: {
      title: '自定义header和footer',
      showFooter: true,
    },
    slots: {
      header: `
        <div>
          自定义header
        </div>
      `,
      default: `
        <div>
          <p style="padding: 10px;">卡片内容1</p>
          <p style="padding: 10px;">卡片内容2</p>
          <p style="padding: 10px;">卡片内容3</p>
        </div>
      `,
      footer: `
        <div class="card-demo-foot">
          <span class="card-demo-foot-item"> <help /></span>
          <span class="card-demo-foot-item"> <CollapseLeft /></span>
          <span class="card-demo-foot-item"> <copy /></span>
        </div>
      `,
    },
    style: `
      .card-demo-foot {
        height: 48px;
        text-align: center;
        background: #fafbfd;
      }

      .card-demo-foot-item {
        display: inline-block;
        width: 33.15%;
        color: #979ba5;
        border-right: 1px solid #f0f2f5;
      }

      .card-demo-foot-item:last-child {
        border: none;
      }
    `,
    dependent: {
      components: ['icon'],
    }
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'title',
    description: '卡片标题',
    type: 'string',
    default: '',
  },
  {
    name: 'showHeader',
    description: '是否显示头部',
    type: 'boolean',
    default: true,
  },
  {
    name: 'showFooter',
    description: '是否显示底部',
    type: 'boolean',
    default: false,
  },
  {
    name: 'collapseStatus',
    description: '折叠状态',
    type: 'boolean',
    default: true,
  },
  {
    name: 'border',
    description: '是否显示边框',
    type: 'boolean',
    default: true,
  },
  {
    name: 'disableHeaderStyle',
    description: '是否禁用头部样式',
    type: 'boolean',
    default: false,
  },
  {
    name: 'position',
    description: '标题位置',
    type: 'string',
    options: ['left', 'right', 'center'],
    default: 'left',
  },
  {
    name: 'isEdit',
    description: '是否开启编辑模式',
    type: 'boolean',
    default: false,
  },
  {
    name: 'isCollapse',
    description: '是否开启折叠功能',
    type: 'boolean',
    default: false,
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'update:collapseStatus',
    description: '折叠状态更新时触发，回调参数为新的折叠状态',
    params: [
      {
        name: '_value',
        type: 'boolean',
      },
    ],
  },
  {
    name: 'edit',
    description: '编辑标题时触发，回调参数为新的标题',
    params: [
      {
        name: '_value',
        type: 'string',
      },
    ],
  },
];

// 组件插槽，用来自动生成插槽文档
const slots = [
  {
    name: 'default',
    description: '默认插槽, 用于放置卡片内容',
  },
  {
    name: 'header',
    description: '头部插槽，用于自定义头部内容',
  },
  {
    name: 'footer',
    description: '底部插槽，用于自定义底部内容',
  },
  {
    name: 'icon',
    description: '图标插槽，用于自定义图标内容',
  },
];

// 组件分组
const group = NavGroupMeta.Feedback;

// 组件名称
const name = 'card';

// 组件标签
const title = 'Card';

// 组件中文标签
const titleCN = '卡片';

// 组件描述
const description = '展示页面的卡片信息';

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
};

export default wiki;
