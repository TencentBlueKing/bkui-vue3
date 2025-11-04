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
    description: 'Menu组件的基础用法',
    props: {
      openedKeys: ['数字'],
      activeKey: '腾讯微视',
    },
    slots: {
      default: `
        <bk-menu-item key="QQ音乐">QQ音乐</bk-menu-item>
        <bk-menu-item key="腾讯视频">腾讯视频</bk-menu-item>
        <bk-menu-item key="微信">微信</bk-menu-item>
        <bk-menu-item key="QQ">QQ</bk-menu-item>
        
        <bk-menu-group name="光子">
          <bk-menu-item key="和平精英">和平精英</bk-menu-item>
          <bk-menu-item key="黎明觉醒" disabled>
            <span v-bk-tooltips="{ content: '暂未开放' }">黎明觉醒</span>
          </bk-menu-item>
          <bk-menu-item key="自由幻想">自由幻想</bk-menu-item>
          <bk-menu-item key="欢乐斗地主">欢乐斗地主</bk-menu-item>
        </bk-menu-group>
        
        <bk-menu-group name="天美">
          <bk-menu-item key="王者荣耀">王者荣耀</bk-menu-item>
          <bk-menu-item key="QQ飞车">QQ飞车</bk-menu-item>
          <bk-menu-item key="天天酷跑">天天酷跑</bk-menu-item>
          <bk-menu-item key="重返帝国">重返帝国</bk-menu-item>
        </bk-menu-group>
        
        <bk-submenu key="数字" title="数字">
          <bk-menu-item key="腾讯微视">腾讯微视</bk-menu-item>
          <bk-menu-item key="腾讯云">腾讯云</bk-menu-item>
          <bk-menu-item key="微众银行">微众银行</bk-menu-item>
          <bk-menu-item key="腾讯体育">腾讯体育</bk-menu-item>
          <bk-menu-item key="腾讯看点">腾讯看点</bk-menu-item>
        </bk-submenu>
        
        <bk-submenu key="内容" title="内容">
          <bk-menu-item key="腾讯影业">腾讯影业</bk-menu-item>
          <bk-menu-item key="腾讯新闻">腾讯新闻</bk-menu-item>
          <bk-menu-item key="腾讯动漫">腾讯动漫</bk-menu-item>
          <bk-menu-item key="阅文集团">阅文集团</bk-menu-item>
          <bk-menu-item key="腾讯电竞">腾讯电竞</bk-menu-item>
        </bk-submenu>
      `,
    },
  },
];

// 组件属性
const props = [
  {
    name: 'active-key',
    description: '选中的menu的key',
    type: 'string',
  },
  {
    name: 'opened-keys',
    description: '打开的submenu key值',
    type: 'string[]',
  },
  {
    name: 'unique-open',
    description: '是否唯一展开一个submenu',
    type: 'boolean',
    default: true,
  },
];

// 组件事件
const emits = [
  {
    name: 'update:activeKey',
    description: '选择项发生变化时触发',
    params: [
      {
        name: 'key',
        type: 'string',
      },
      {
        name: 'parentKey',
        type: 'string',
      },
    ],
  },
  {
    name: 'update:openKeys',
    description: '展开menu时触发',
    params: [
      {
        name: 'value',
        type: 'string[]',
      },
    ],
  },
  {
    name: 'click',
    description: '点击子项时触发',
    params: [
      {
        name: 'key',
        type: 'string',
      },
    ],
  },
  {
    name: 'openChange',
    description: '展开项发生变化时触发',
    params: [
      {
        name: 'opened',
        type: 'boolean',
      },
      {
        name: 'key',
        type: 'string',
      },
      {
        name: 'parentKey',
        type: 'string',
      },
    ],
  },
];

const children = [
  {
    name: 'MenuGroup',
    description: '菜单子项组',
    props: [
      {
        name: 'name',
        description: 'group name',
        type: 'string',
      },
      {
        name: 'foldName',
        description: '折叠后显示的分组名',
        type: 'string | undefined',
      },
    ],
    emits: [],
    slots: [],
  },
  {
    name: 'MenuItem',
    description: '菜单子项',
    props: [
      {
        name: 'need-icon',
        description: '是否展示Icon',
        type: 'boolean',
      },
      {
        name: 'disabled',
        description: '是否禁用',
        type: 'boolean',
        default: false,
      },
    ],
    emits: [
      {
        name: 'update:activeKey',
        description: '选择项发生变化时触发',
        params: [
          {
            name: 'key',
            type: 'string',
          },
          {
            name: 'parentKey',
            type: 'string',
          },
        ],
      },
      {
        name: 'update:openKeys',
        description: '展开menu时触发',
        params: [
          {
            name: 'value',
            type: 'string[]',
          },
        ],
      },
      {
        name: 'click',
        description: '点击子项时触发',
        params: [
          {
            name: 'key',
            type: 'string',
          },
        ],
      },
      {
        name: 'openChange',
        description: '展开项发生变化时触发',
        params: [
          {
            name: 'opened',
            type: 'boolean',
          },
          {
            name: 'key',
            type: 'string',
          },
          {
            name: 'parentKey',
            type: 'string',
          },
        ],
      },
    ],
    slots: [
      {
        name: 'icon',
        description: 'icon 插槽',
      },
    ],
  },
  {
    name: 'SubMenu',
    description: '子菜单',
    props: [],
    emits: [
      {
        name: 'collapse',
        description: '展开变化时触发事件',
        params: [
          {
            name: 'collapse',
            type: 'boolean',
          },
          {
            name: 'instance',
            type: 'VNode',
          },
        ],
      },
    ],
    slots: [
      {
        name: 'icon',
        description: 'icon 插槽',
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Nav;

// 组件名称
const name = 'menu';

// 组件标签
const title = 'Menu';

// 组件中文标签
const titleCN = '菜单';

// 组件描述
const description = 'Menu组件， 为页面和功能提供导航的菜单列表。';

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  children,
  presets,
  description,
};

export default wiki;
