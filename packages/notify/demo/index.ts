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
    description: '满足基础使用场景',
    props: {
      id: 'notify',
      title: '新消息通知',
      message: '你有一条新消息！',
      theme: 'primary',
      delay: 3000,
    },
  },
  {
    title: '成功提示',
    description: '操作成功后的反馈提示',
    props: {
      id: 'success-notify',
      title: '操作成功',
      message: '用户信息已成功更新',
      theme: 'success',
      delay: 3000,
      position: 'top-right',
    },
  },
  {
    title: '错误警告',
    description: '系统异常或操作失败提示',
    props: {
      id: 'error-notify',
      title: '操作失败',
      message: '网络连接异常，请稍后重试',
      theme: 'error',
      delay: 5000,
      position: 'top-right',
      dismissable: true,
    },
  },
  {
    title: '重要通知',
    description: '需要用户手动关闭的重要信息',
    props: {
      id: 'warning-notify',
      title: '系统维护通知',
      message: '系统将于今晚22:00-24:00进行维护，期间服务可能短暂中断',
      theme: 'warning',
      delay: 0,
      position: 'top-left',
      dismissable: true,
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'id',
    description: '弹框的 id，值相同时表示同一弹框',
    type: 'string',
    default: '',
  },
  {
    name: 'title',
    description: '组件的标题',
    type: 'string',
    default: '',
  },
  {
    name: 'message',
    description: '组件显示的文字内容，支持字符串、函数、VNode',
    type: 'string | Function',
    default: '',
  },
  {
    name: 'theme',
    description: '组件主题色',
    type: 'string',
    options: ['primary', 'warning', 'success', 'error'],
    default: 'primary',
  },
  {
    name: 'position',
    description: '组件出现的方向',
    type: 'string',
    options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    default: 'top-right',
  },
  {
    name: 'delay',
    description: '组件延时关闭时间，值为 0 时需要手动关闭',
    type: 'number',
    default: 5000,
  },
  {
    name: 'dismissable',
    description: '是否显示右侧关闭 icon',
    type: 'boolean',
    default: true,
  },
  {
    name: 'offsetX',
    description: '组件出现时距离视口的水平偏移量',
    type: 'number',
    default: 100,
  },
  {
    name: 'offsetY',
    description: '组件出现时距离视口顶部的偏移量',
    type: 'number',
    default: 30,
  },
  {
    name: 'spacing',
    description: '多个组件之间的垂直距离',
    type: 'number',
    default: 10,
  },
  {
    name: 'extCls',
    description: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-message 上',
    type: 'string',
    default: '',
  },
  {
    name: 'onClose',
    description: '关闭组件时的回调函数, 参数为组件实例',
    type: 'Function',
    default: '',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'destroy',
    description: '关闭通知提示时触发的事件',
    params: [
      {
        name: '_value',
        type: 'string',
      },
    ],
  },
];

// 组件自定义的复杂类型
const types = [];

// 组件分组
const group = NavGroupMeta.Feedback;

// 组件名称
const name = 'notify';

// 组件标签
const title = 'Notify';

// 组件中文标签
const titleCN = '通知提示';

// 组件描述
const description = '用来给用户推送通知提示信息，通知可配置为从界面的四个角出现';

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
