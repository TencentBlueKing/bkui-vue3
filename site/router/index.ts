/* eslint-disable codecc/comment-ratio */
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
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { NavGroupMeta } from '../typings';

/**
 * @description:导航配置
 * @param {*}
 * @return {*}
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/start',
    name: 'start',
    alias: '',
    component: () => import('../views/start/start'),
    meta: {
      group: NavGroupMeta.Start,
      navName: '快速上手',
    },
  },
  /**
   * @description:菜单页
   */
  {
    path: '/menu',
    name: 'menu',
    alias: '',
    component: () => import('../views/menu/menu'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'Menu 菜单',
    },
  },
  /**
   * @description:导航页
   */
  {
    path: '/navigation',
    name: 'navigation',
    alias: '',
    component: () => import('../views/navigation'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'Navigation 导航',
    },
  },
  /**
   * @description:首页
   */
  {
    path: '/home',
    name: 'home',
    alias: '',
    component: () => import('../views/home'),
    meta: {
      group: NavGroupMeta.Others,
      navName: 'Home',
    },
  },
  {
    path: '/loading',
    name: 'loading',
    component: () => import('../views/loading'),
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'Loading 加载',
    },
  },
  {
    path: '/button',
    name: 'button',
    component: () => import('../views/button'),
    meta: {
      group: NavGroupMeta.Base,
      navName: 'Button 基础按钮',
    },
  },
  {
    path: '/radio',
    name: 'radio',
    component: () => import('../views/radio'),
    meta: {
      group: NavGroupMeta.Form,
      navName: 'Radio 单选框',
    },
  },
  {
    path: '/checkbox',
    name: 'checkbox',
    component: () => import('../views/checkbox'),
    meta: {
      group: NavGroupMeta.Form,
      navName: 'Checkbox 多选框',
    },
  },
  {
    path: '/alert',
    name: 'alert',
    component: () => import('../views/alert'),
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'Alert 警告',
    },
  },
  {
    path: '/fixed-navbar',
    name: 'fixedNavbar',
    component: () => import('../views/fixed-navbar'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'FixedNavbar 悬浮导航',
    },
  },
  {
    path: '/backtop',
    name: 'backtop',
    component: () => import('../views/backtop'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'BackTop 返回顶部',
    },
  },
  {
    path: '/icon',
    name: 'icon',
    component: () => import('../views/icon'),
    meta: {
      group: NavGroupMeta.Base,
      navName: 'Icon 图标',
    },
  },
  {
    path: '/exception',
    name: 'exception',
    component: () => import('../views/exception'),
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'Exception 异常提示',
    },
  },
  {
    path: '/pop-components',
    name: 'popComponents',
    component: () => import('../views/pop-components'),
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'PopComponents',
    },
  },
  {
    path: '/card',
    name: 'card',
    component: () => import('../views/card'),
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'Card 卡片',
    },
  },
  {
    path: '/badge',
    name: 'badge',
    component: () => import('../views/badge'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'Badge 标记',
    },
  },
  {
    path: '/progress',
    name: 'progress',
    component: () => import('../views/progress/progress'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'Progress 进度条',
    },
  },
  {
    path: '/switcher',
    name: 'switcher',
    component: () => import('../views/switcher/switcher'),
    meta: {
      group: NavGroupMeta.Form,
      navName: 'Switcher 开关',
    },
  },
  {
    path: '/breadcrumb',
    name: 'breadcrumb',
    component: () => import('../views/breadcrumb/breadcrumb'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'Breadcrumb 面包屑',
    },
  },
  {
    path: '/link',
    name: 'link',
    component: () => import('../views/link'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'Link 文字链接',
    },
  },
  {
    path: '/collapse',
    name: 'collapse',
    component: () => import('../views/collapse'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'Collapse 折叠面板',
    },
  },
  {
    path: '/steps',
    name: 'steps',
    component: () => import('../views/steps'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'Steps 步骤',
    },
  },

  {
    path: '/process',
    name: 'process',
    component: () => import('../views/process'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'Process 步骤',
    },
  },
  {
    path: '/select',
    name: 'select',
    component: () => import('../views/select'),
    meta: {
      group: NavGroupMeta.Form,
      navName: 'Select 下拉选框',
    },
  },
  {
    path: '/timeline',
    name: 'timeline',
    component: () => import('../views/timeline'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'Timeline 时间轴',
    },
  },
  {
    path: '/animateNumber',
    name: 'animateNumber',
    component: () => import('../views/animate-number'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'AnimateNumber 动画数字',
    },
  },
  {
    path: '/rate',
    name: 'rate',
    component: () => import('../views/rate'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'Rate 评分',
    },
  },
  {
    path: '/table',
    name: 'table',
    component: () => import('../views/table/table'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'Table 表格',
    },
  },
  {
    path: '/input',
    name: 'input',
    component: () => import('../views/input'),
    meta: {
      group: NavGroupMeta.Form,
      navName: 'Input 输入框',
    },
  },
  {
    path: '/dropdown',
    name: 'dropdown',
    component: () => import('../views/dropdown'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'DropdownMenu 下拉菜单',
    },
  },
  {
    path: '/form',
    name: 'form',
    component: () => import('../views/form'),
    meta: {
      group: NavGroupMeta.Form,
      navName: 'Form 表单',
    },
  },
  {
    path: '/popover',
    name: 'popover',
    component: () => import('../views/popover'),
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'Popover 弹出框提示',
    },
  },
  {
    path: '/message',
    name: 'message',
    component: () => import('../views/message'),
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'Message 消息提示',
    },
  },
  {
    path: '/notify',
    name: 'notify',
    component: () => import('../views/notify'),
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'Notify 通知提示',
    },
  },
  {
    path: '/tooltips',
    name: 'tooltips',
    component: () => import('../views/tooltips'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'Tooltips 工具提示',
    },
  },
  {
    path: '/tree',
    name: 'tree',
    component: () => import('../views/tree/tree'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'Tree 树',
    },
  },
  {
    path: '/tag',
    name: 'tag',
    component: () => import('../views/tag/tag'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'Tag 标签',
    },
  },
  {
    path: '/date-picker',
    name: 'datePicker',
    component: () => import('../views/date-picker/date-picker'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'DatePicker 日期选择器',
    },
  },
  {
    path: '/divider',
    name: 'divider',
    component: () => import('../views/divider'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'Divider 分割线',
    },
  },
  {
    path: '/tab',
    name: 'tab',
    component: () => import('../views/tab'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'Tab 选项卡',
    },
  },
  {
    path: '/slider',
    name: 'slider',
    component: () => import('../views/slider'),
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'Slider 滑动选择器',
    },
  },
  {
    path: '/virtual-render',
    name: 'virtualRender',
    component: () => import('../views/virtual-render/virtual-render'),
    meta: {
      group: NavGroupMeta.Others,
      navName: 'VirtualRender',
    },
  },
  {
    path: '/pagination',
    name: 'pagination',
    component: () => import('../views/pagination'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'Pagination 分页',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('../views/404'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
