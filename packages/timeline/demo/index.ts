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
    description:
      '默认配置 list，list 为必传。可根据具体的应用场景，灵活地配置 list.tag 和 list.content，可以将时间作为标题，也可以作为内容的一部分',
    props: {
      list: [
        {
          tag: '一天前',
          content: '由pony上线到蓝鲸市场',
          size: 'large',
        },
        {
          tag: '步骤1',
          content: '<span style="font-size: 12px;">2019-12-15 11:00</span>',
        },
        {
          tag: '步骤2',
          content: '<span style="font-size: 12px;">2020-12-15 11:00</span>',
        },
        {
          tag: '步骤3',
          content: '<span style="font-size: 12px;">2021-12-15 11:00</span>',
        },
        {
          tag: '步骤4',
          content: '<span style="font-size: 12px;">2022-12-15 11:00</span>',
        },
      ],
    },
    events: {
      select: '(data) => { alert(`选择了：${data.tag}`); }',
    },
    style: `
      .edit-component-component {
        display: flex;
        justify-content: center;
      }
    `,
  },
  {
    title: '节点状态',
    description:
      '在 list 数据源中配置 size color filled 属性呈现不同状态。绿色代表成功/已完成，蓝色代表正在进行，红色代表错误/失败，黄色代表告警/暂停，灰色代表未开始。实心代表已完成。',
    props: {
      list: [
        {
          tag: 'pony审批通过，并附“同意”',
          content: '由pony上线到蓝鲸市场',
          color: 'green',
          filled: true,
        },
        {
          tag: 'tony审批通过，并附“同意”',
          content: '<span style="font-size: 12px;">2019-12-15 11:00</span>',
          color: 'blue',
          filled: true,
        },
        {
          tag: 'allen暂停审批',
          content: '<span style="font-size: 12px;">2020-12-15 11:00</span>',
          color: 'yellow',
          size: 'large',
        },
        {
          tag: '步骤3',
          content: '<span style="font-size: 12px;">2021-12-15 11:00</span>',
        },
        {
          tag: '步骤4',
          content: '<span style="font-size: 12px;">2022-12-15 11:00</span>',
        },
      ],
    },
    style: `
      .edit-component-component {
        display: flex;
        justify-content: center;
      }
    `,
  },
  {
    title: '节点样式可配置',
    description: '在 list 数据源中配置 type 属性（值可取 defult, primary, warning, success, danger），默认为 defult',
    props: {
      list: [
        {
          tag: '一天前',
          content: '由pony上线到蓝鲸市场',
          type: 'default',
        },
        {
          tag: '步骤1',
          content: '<span style="font-size: 12px;">2019-12-15 11:00</span>',
          type: 'primary',
        },
        {
          tag: '步骤2',
          content: '<span style="font-size: 12px;">2020-12-15 11:00</span>',
          type: 'warning',
        },
        {
          tag: '步骤3',
          content: '<span style="font-size: 12px;">2021-12-15 11:00</span>',
          type: 'success',
        },
        {
          tag: '步骤4',
          content: '<span style="font-size: 12px;">2022-12-15 11:00</span>',
          type: 'danger',
        },
      ],
    },
    style: `
      .edit-component-component {
        display: flex;
        justify-content: center;
      }
    `,
  },
  {
    title: '可配置 HTML 模板',
    description:
      '对 list 数据源中的 content 属性配置正确的 HTML 模板内容(注意：你的站点上动态渲染的任意 HTML 可能会非常危险，因为它很容易导致 XSS 攻击)',
    props: {
      list: [
        {
          tag: '一天前',
          content: '由pony上线到蓝鲸市场',
        },
        {
          tag: '步骤1',
          content: '<div style="color: red;">由<strong>tony</strong>部署到生产环境并发布至应用市场</div>',
        },
        {
          tag: '步骤2',
          content: '<div>由<strong>allen</strong>上线到<span style="color: #3c96ff;">蓝鲸市场</span></div>',
        },
        {
          tag: '步骤3',
          content:
            '由<strong>tony</strong>部署到<p style="color: #ff5656">生产环境</p>并发布至<strong>应用市场</strong>',
        },
        {
          tag: '步骤4',
          content: '由<strong>allen</strong>部署到预发布环境',
        },
      ],
    },
    style: `
      .edit-component-component {
        display: flex;
        justify-content: center;
      }
    `,
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'list',
    description: '时间轴数据源（必传)',
    type: 'Array<TimelineItem>',
    default: '',
    link: '/component/timeline/api#TimelineItem',
  },
  {
    name: 'ext-cls',
    description: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-timeline 上',
    type: 'string',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'select',
    description: '相应点击项的数据data',
    params: [
      {
        name: 'data',
        type: 'TimelineItem',
        link: '/component/timeline/api#TimelineItem',
      },
    ],
  },
];

const types = [
  {
    name: 'TimelineItem',
    description: '时间轴项配置',
    fields: [
      {
        name: 'tag',
        description: '标题（一般是时间标识）',
        type: 'string | VNode',
      },
      {
        name: 'content',
        description: '内容',
        type: 'string | Object | VNode',
      },
      {
        name: 'border',
        description: '是否需要边框',
        type: 'boolean',
      },
      {
        name: 'type',
        description: '节点样式',
        type: 'string',
        options: ['default', 'primary', 'warning', 'success', 'danger'],
      },
      {
        name: 'size',
        description: '节点大小',
        type: 'string',
        options: ['large'],
      },
      {
        name: 'color',
        description: '节点颜色',
        type: 'string',
        options: ['blue', 'red', 'green', 'yellow', 'gray'],
      },
      {
        name: 'icon',
        description: '节点图标，可使用蓝鲸 ICON',
        type: 'Function',
      },
      {
        name: 'theme',
        description: '组件的主题色',
        type: 'string',
        options: ['primary', 'success', 'warning', 'danger'],
      },
      {
        name: 'filled',
        description: '是否填充节点(实心)',
        type: 'boolean',
      },
      {
        name: 'nodeType',
        description: '时间轴节点渲染类型，缺省值为 template 默认使用 v-html ，填写 vnode 则支持 JSX 渲染',
        type: 'string',
        options: ['template', 'vnode'],
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Nav;

// 组件名称
const name = 'timeline';

// 组件标签
const title = 'Timeline';

// 组件中文标签
const titleCN = '时间轴';

// 组件描述
const description = '时间轴组件';

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  types,
  presets,
  description,
};

export default wiki;
