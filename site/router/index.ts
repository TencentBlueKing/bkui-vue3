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
  /**
   * @description:快速上手
   */
  {
    path: '/start',
    name: 'start',
    alias: '',
    component: () => import('../views/start'),
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
    component: () => import('../views/menu'),
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
    component: () => import('../views/navigation/index'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'Navigation 导航',
    },
  },
  /**
   * @description:Loading
   */
  {
    path: '/loading',
    name: 'loading',
    component: () => import('../views/loading'),
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'Loading 加载',
    },
  },
  /**
   * @description:基础按钮
   */
  {
    path: '/button',
    name: 'button',
    component: () => import('../views/button'),
    meta: {
      group: NavGroupMeta.Base,
      navName: 'Button 基础按钮',
    },
  },
  /**
   * @description:单选框
   */
  {
    path: '/radio',
    name: 'radio',
    component: () => import('../views/radio'),
    meta: {
      group: NavGroupMeta.Form,
      navName: 'Radio 单选框',
    },
  },
  /**
   * @description:多选框
   */
  {
    path: '/checkbox',
    name: 'checkbox',
    component: () => import('../views/checkbox'),
    meta: {
      group: NavGroupMeta.Form,
      navName: 'Checkbox 多选框',
    },
  },
  /**
   * @description:警告
   */
  {
    path: '/alert',
    name: 'alert',
    component: () => import('../views/alert'),
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'Alert 警告',
    },
  },
  /**
   * @description:悬浮导航
   */
  {
    path: '/fixed-navbar',
    name: 'fixedNavbar',
    component: () => import('../views/fixed-navbar/index'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'FixedNavbar 悬浮导航',
    },
  },
  /**
   * @description:返回顶部
   */
  {
    path: '/backtop',
    name: 'backtop',
    component: () => import('../views/backtop/index'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'BackTop 返回顶部',
    },
  },
  /**
   * @description:图标
   */
  {
    path: '/icon',
    name: 'icon',
    component: () => import('../views/icon/index'),
    meta: {
      group: NavGroupMeta.Base,
      navName: 'Icon 图标',
    },
  },
  /**
   * @description:异常提示
   */
  {
    path: '/exception',
    name: 'exception',
    component: () => import('../views/exception/exception'),
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'Exception 异常提示',
    },
  },
  /**
   * @description:PopComponents
   */
  // {
  //   path: '/pop-components',
  //   name: 'popComponents',
  //   component: () => import('../views/pop-components'),
  //   meta: {
  //     group: NavGroupMeta.Feedback,
  //     navName: 'PopComponents',
  //   },
  // },
  /**
   * @description:卡片
   */
  {
    path: '/card',
    name: 'card',
    component: () => import('../views/card'),
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'Card 卡片',
    },
  },
  /**
   * @description:标记
   */
  {
    path: '/badge',
    name: 'badge',
    component: () => import('../views/badge'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'Badge 标记',
    },
  },
  /**
   * @description:进度条
   */
  {
    path: '/progress',
    name: 'progress',
    component: () => import('../views/progress'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'Progress 进度条',
    },
  },
  /**
   * @description:开关
   */
  {
    path: '/switcher',
    name: 'switcher',
    component: () => import('../views/switcher'),
    meta: {
      group: NavGroupMeta.Form,
      navName: 'Switcher 开关',
    },
  },
  /**
   * @description:面包屑
   */
  {
    path: '/breadcrumb',
    name: 'breadcrumb',
    component: () => import('../views/breadcrumb'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'Breadcrumb 面包屑',
    },
  },
  /**
   * @description:文字链接
   */
  {
    path: '/link',
    name: 'link',
    component: () => import('../views/link/index'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'Link 文字链接',
    },
  },
  /**
   * @description:折叠面板
   */
  {
    path: '/collapse',
    name: 'collapse',
    component: () => import('../views/collapse/index'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'Collapse 折叠面板',
    },
  },
  /**
   * @description:步骤
   */
  {
    path: '/steps',
    name: 'steps',
    component: () => import('../views/steps/index'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'Steps 步骤',
    },
  },
  /**
   * @description:步骤
   */
  {
    path: '/process',
    name: 'process',
    component: () => import('../views/process/index'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'Process 步骤',
    },
  },
  /**
   * @description:下拉选框
   */
  {
    path: '/select',
    name: 'select',
    component: () => import('../views/select/select'),
    meta: {
      group: NavGroupMeta.Form,
      navName: 'Select 下拉选框',
    },
  },
  /**
   * @description:时间轴
   */
  {
    path: '/timeline',
    name: 'timeline',
    component: () => import('../views/timeline/index'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'Timeline 时间轴',
    },
  },
  /**
   * @description:动画数字
   */
  {
    path: '/animateNumber',
    name: 'animateNumber',
    component: () => import('../views/animate-number'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'AnimateNumber 动画数字',
    },
  },
  /**
   * @description:评分
   */
  {
    path: '/rate',
    name: 'rate',
    component: () => import('../views/rate'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'Rate 评分',
    },
  },
  /**
   * @description:轮播图
   */
  {
    path: '/swiper',
    name: 'swiper',
    component: () => import('../views/swiper'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'Swiper 轮播图',
    },
  },
  /**
   * @description:表格
   */
  {
    path: '/table',
    name: 'table',
    component: () => import('../views/table'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'Table 表格',
    },
  },
  /**
   * @description:输入框
   */
  {
    path: '/input',
    name: 'input',
    component: () => import('../views/input'),
    meta: {
      group: NavGroupMeta.Form,
      navName: 'Input 输入框',
    },
  },
  /**
   * @description:下拉菜单
   */
  {
    path: '/dropdown',
    name: 'dropdown',
    component: () => import('../views/dropdown/dropdown'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'DropdownMenu 下拉菜单',
    },
  },
  /**
   * @description:表单
   */
  {
    path: '/form',
    name: 'form',
    component: () => import('../views/form'),
    meta: {
      group: NavGroupMeta.Form,
      navName: 'Form 表单',
    },
  },
  /**
   * @description:弹出框提示
   */
  {
    path: '/upload',
    name: 'upload',
    component: () => import('../views/upload'),
    meta: {
      group: NavGroupMeta.Form,
      navName: 'Upload 文件上传',
    },
  },
  // {
  //   path: '/popover',
  //   name: 'popover',
  //   component: () => import('../views/popover'),
  //   meta: {
  //     group: NavGroupMeta.Feedback,
  //     navName: 'Popover 弹出框提示',
  //   },
  // },
  {
    path: '/popover',
    name: 'popover',
    component: () => import('../views/popover'),
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'Popover 弹出框提示',
    },
  },
  /**
   * @description:消息提示
   */
  {
    path: '/message',
    name: 'message',
    component: () => import('../views/message/message'),
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'Message 消息提示',
    },
  },
  /**
   * @description:消息提示
   */
  {
    path: '/info-box',
    name: 'info-box',
    component: () => import('../views/info-box/index'),
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'InfoBox提示框',
    },
  },
  /**
   * @description:通知提示
   */
  {
    path: '/notify',
    name: 'notify',
    component: () => import('../views/notify'),
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'Notify 通知提示',
    },
  },
  /**
   * @description:工具提示
   */
  {
    path: '/tooltips',
    name: 'tooltips',
    component: () => import('../views/tooltips'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'Tooltips 工具提示',
    },
  },
  /**
   * @description:树
   */
  {
    path: '/tree',
    name: 'tree',
    component: () => import('../views/tree'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'Tree 树',
    },
  },
  /**
   * @description:颜色选择器
   */
  {
    path: '/color-picker',
    name: 'colorPicker',
    component: () => import('../views/color-picker/color-picker'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'ColorPicker 颜色选择器',
    },
  },
  /**
   * @description:日期选择器
   */
  {
    path: '/tag',
    name: 'tag',
    component: () => import('../views/tag'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'Tag 标签',
    },
  },
  {
    path: '/tag-input',
    name: 'tagInput',
    component: () => import('../views/tag-input'),
    meta: {
      group: NavGroupMeta.Form,
      navName: 'TagInput 标签',
    },
  },
  {
    path: '/date-picker',
    name: 'datePicker',
    component: () => import('../views/date-picker'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'DatePicker 日期选择器',
    },
  },
  {
    path: '/time-picker',
    name: 'timePicker',
    component: () => import('../views/time-picker'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'TimePicker 日期选择器',
    },
  },
  /**
   * @description:分割线
   */
  {
    path: '/divider',
    name: 'divider',
    component: () => import('../views/divider/divider'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'Divider 分割线',
    },
  },
  /**
   * @description:选项卡
   */
  {
    path: '/tab',
    name: 'tab',
    component: () => import('../views/tab'),
    meta: {
      group: NavGroupMeta.Nav,
      navName: 'Tab 选项卡',
    },
  },
  /**
   * @description:滑动选择器
   */
  {
    path: '/slider',
    name: 'slider',
    component: () => import('../views/slider/slider'),
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'Slider 滑动选择器',
    },
  },
  /**
   * @description:侧边栏
   */
  {
  	  path: '/sideslider',
  	  name: 'sideslider',
  	  component: () => import('../views/sideslider'),
  	  meta: {
  	    group: NavGroupMeta.Feedback,
  	    navName: 'Sideslider 侧栏',
  	  },
  },
  /**
   * @description:穿梭框
   */
  {
    path: '/transfer',
    name: 'transfer',
    component: () => import('../views/transfer'),
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'Transfer 穿梭框',
    },
  },
  /**
   * @description:差异对比
   */
  {
    path: '/code-diff',
    name: 'codeDiff',
    component: () => import('../views/code-diff'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'Diff 差异对比',
    },
  },
  /**
   * @description:VirtualRender
   */
  {
    path: '/virtual-render',
    name: 'virtualRender',
    component: () => import('../views/virtual-render'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'VirtualRender',
    },
  },
  /**
   * @description:分页
   */
  {
    path: '/pagination',
    name: 'pagination',
    component: () => import('../views/pagination'),
    meta: {
      group: NavGroupMeta.Data,
      navName: 'Pagination 分页',
    },
  },
  /**
   * @description:404
   */
  {
    path: '/resize-layout',
    name: 'resizeLayout',
    component: () => import('../views/resize-layout/resize-layout'),
    meta: {
      group: NavGroupMeta.Layout,
      navName: 'ResizeLayout',
    },
  },
  {
    path: '/grid',
    name: 'Grid 栅格',
    component: () => import('../views/container'),
    meta: {
      group: NavGroupMeta.Layout,
      navName: 'Grid 栅格',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('../views/404'),
  },
  /**
   * @description:dialog
   */
  {
    path: '/dialog',
    name: 'dialog',
    component: () => import('../views/dialog/index'),
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'Dialog 对话框',
    },
  },
  {
    path: '/cascader',
    name: 'cascader',
    meta: {
      group: NavGroupMeta.Form,
      navName: 'Cascader 级联选择',
    },
    component: () => import('../views/cascader/index'),
  },
  {
    path: '/search-select',
    name: 'searchSelect',
    meta: {
      group: NavGroupMeta.Form,
      navName: 'SearchSelect 查询选择器',
    },
    component: () => import('../views/search-select/index'),
  },
  {
    path: '/overflow-title',
    name: 'overflowTitle',
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'overflowTitle 文本溢出',
    },
    component: () => import('../views/overflow-title/index'),
  },
  {
    path: '/pop-confirm',
    name: 'popConfirm',
    meta: {
      group: NavGroupMeta.Feedback,
      navName: 'Popconfirm 弹出确认框',
    },
    component: () => import('../views/pop-confirm/index'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
  routes,
});

export default router;
