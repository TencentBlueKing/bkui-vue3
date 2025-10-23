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
    title: '单个导航',
    description: '用于功能模块较少且层级不深的场景',
    props: {
      navigationType: 'left-right',
    },
    slots: {
      menu: `
      <bk-menu>
          <bk-menu-item key="QQ音乐"> QQ音乐 </bk-menu-item>
          <bk-menu-item key="腾讯视频"> 腾讯视频 </bk-menu-item>
          <bk-menu-item key="微信"> 微信 </bk-menu-item>
          <bk-menu-item key="QQ"> QQ </bk-menu-item>
      </bk-menu>`,
    },
  },
  {
    title: '组合导航',
    description: '用于功能模块较多且层级较深的场景',
    props: {
      needMenu: true,
    },
    slots: {
      menu: `
      <bk-menu>
          <bk-menu-item key="QQ音乐"> QQ音乐 </bk-menu-item>
          <bk-menu-item key="腾讯视频"> 腾讯视频 </bk-menu-item>
          <bk-menu-item key="微信"> 微信 </bk-menu-item>
          <bk-menu-item key="QQ"> QQ </bk-menu-item>
      </bk-menu>
      <bk-menu-group
            fold-name="TiMi"
            name="天美世界"
          >
            <bk-menu-item key="王者荣耀"> 王者荣耀 </bk-menu-item>
            <bk-menu-item key="QQ飞车"> QQ飞车 </bk-menu-item>
            <bk-menu-item key="天天酷跑"> 天天酷跑 </bk-menu-item>
            <bk-menu-item key="重返帝国"> 重返帝国 </bk-menu-item>
          </bk-menu-group>
          <bk-submenu
            key="内容"
            title="内容"
          >
            <bk-menu-item key="腾讯影业"> 腾讯影业 </bk-menu-item>
            <bk-menu-item key="腾讯新闻"> 腾讯新闻 </bk-menu-item>
            <bk-menu-item key="腾讯动漫"> 腾讯动漫 </bk-menu-item>
            <bk-menu-item key="阅文集团"> 阅文集团 </bk-menu-item>
            <bk-menu-item key="腾讯电竞"> 腾讯电竞 </bk-menu-item>
          </bk-submenu>
      `,
      header: '<div class="header-demo">这里是头部导航</div>',
    },
  },
];

// 组件属性
const props = [
  {
    name: 'nav-width',
    description: '初始左侧折叠导航的宽度',
    type: 'number | string',
    default: '60',
  },
  {
    name: 'hover-width',
    description: '展开左侧导航的宽度',
    type: 'number | string',
    default: '260',
  },
  {
    name: 'side-title',
    description: '左侧导航的主标题',
    type: 'string',
  },
  {
    name: 'header-title',
    description: '头部导航条的标题',
    type: 'string',
  },
  {
    name: 'hover-leave-delay',
    description: '左侧栏hover离开后折叠的延迟时长',
    type: 'number',
    default: 0,
  },
  {
    name: 'hover-enter-delay',
    description: '左侧栏hover进入后展开的延迟时长',
    type: 'number',
    default: '100',
  },
  {
    name: 'default-open',
    description: '左侧栏初始状态',
    type: 'boolean',
    default: false,
  },
  {
    name: 'need-menu',
    description: '是否显示左侧导航',
    type: 'boolean',
    default: true,
  },
  {
    name: 'navigation-type',
    description: '导航风格 （left-right: 左右导航风格 top-bottom: 上下导航风格）',
    type: 'string',
    options: ['left-right', 'top-bottom'],
    default: 'left-right',
  },
];

// 组件事件
const emits = [
  {
    name: 'leave',
    description: '当鼠标离开导航区域时触发',
    params: [
      {
        name: 'isOpen',
        type: 'boolean',
        description: '导航是否处于展开状态',
      },
    ],
  },
  {
    name: 'toggle',
    description: '当导航展开状态切换时触发',
    params: [
      {
        name: 'isOpen',
        type: 'boolean',
        description: '导航是否处于展开状态',
      },
    ],
  },
  {
    name: 'hover',
    description: '当鼠标悬停在导航区域时触发',
    params: [
      {
        name: 'isOpen',
        type: 'boolean',
        description: '导航是否处于展开状态',
      },
    ],
  },
  {
    name: 'toggle-click',
    description: '当点击切换按钮时触发',
    params: [
      {
        name: 'isOpen',
        type: 'boolean',
        description: '导航是否处于展开状态',
      },
    ],
  },
];

const children = [
  {
    name: 'SubMenu',
    emits: [],
    props: [],
    slots: [
      {
        name: 'default',
        description: 'default 内容插槽',
      },
      {
        name: 'header',
        description: 'header 插槽',
      },
      {
        name: 'footer',
        description: 'footer 插槽',
      },
      {
        name: 'menu',
        description: '左侧menu 插槽',
      },
      {
        name: 'side-icon',
        description: '左侧header Icon 插槽',
      },
      {
        name: 'side-header',
        description: '左侧header 插槽',
      },
      {
        name: 'side-footer',
        description: '左侧footer 插槽',
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Nav;

// 组件名称
const name = 'navigation';

// 组件标签
const title = 'Navigation';

// 组件中文标签
const titleCN = '导航';

// 组件描述
const description = 'Navigation组件， 为应用提供导航的整体布局。';

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  presets,
  description,
  children,
};
export default wiki;
