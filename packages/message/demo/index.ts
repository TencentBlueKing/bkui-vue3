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
    description: '通用的 Message 使用场景',
    props: {
      theme: 'primary',
      delay: 3000,
      width: 560,
    },
  },
  {
    title: '高阶用法',
    description: '适用于有更多面向开发信息的场景',
    props: {
      type: 'key-value',
      code: '404',
      overview: '页面不存在',
      suggestion: '请联系管理员处理',
      delay: 8000,
      width: 800,
    },
  },
];

// 组件属性
const props = [
  {
    name: 'theme',
    description: '组件主题色',
    type: 'string',
    options: ['primary', 'warning', 'success', 'error'],
    default: 'primary',
  },
  {
    name: 'message',
    description: '组件显示的文字内容，如果需要高阶用法，请查看IMessage说明',
    type: 'string | IMessage',
    link: '/component/message/api#IMessage',
  },
  {
    name: 'delay',
    description: '组件延时关闭时间，值为 0 时需要手动关闭',
    type: 'number',
    default: 3000,
  },
  {
    name: 'dismissable',
    description: '是否显示右侧关闭 icon',
    type: 'boolean',
    options: [true, false],
    default: true,
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
  },
  {
    name: 'onClose',
    description: '关闭组件时的回调函数, 参数为组件实例',
    type: 'function',
  },
  {
    name: 'width',
    description: '宽度设置，常规模式下默认宽度560， 高阶模式默认宽度800',
    type: 'number',
    default: 560,
  },
  {
    name: 'actions',
    description: '用于高阶模式下，操作按钮根据产品需求自定义，详细配置请参考高阶配置 IMessageActions',
    type: 'IMessageAction[]',
    link: '/component/message/api#IMessageAction',
  },
];

// 组件事件
const emits = [
  {
    name: 'destroy',
    description: '当消息被销毁时触发的事件',
    params: [
      {
        name: 'id',
        type: 'string',
      },
    ],
  },
  {
    name: 'detail',
    description: '当消息详情显示状态改变时触发的事件',
    params: [
      {
        name: 'isShow',
        type: 'boolean',
      },
      {
        name: 'id',
        type: 'string',
      },
    ],
  },
];

// 组件自定义的复杂类型
const types = [
  {
    name: 'IMessage',
    description: '适用于有更多面向开发信息的场景。',
    fields: [
      {
        name: 'code',
        description: '错误码',
        type: 'string | number',
      },
      {
        name: 'overview',
        description: '错误概述',
        type: 'string',
      },
      {
        name: 'suggestion',
        description: '操作建议',
        type: 'string',
      },
      {
        name: 'details',
        description: '详情',
        type: 'string | Record<string, any> | Array<Record<string, any> | number | boolean>',
      },
      {
        name: 'assistant',
        description: '助手',
        type: 'string',
      },
      {
        name: 'type',
        description: '展开详情：数据展示格式，详情分为：Key Value 类详情、JSON 类详情',
        type: 'string',
        options: ['key-value', 'json'],
      },
    ],
  },
  {
    name: 'IMessageAction',
    description: '操作按钮自定义配置',
    fields: [
      {
        name: 'id',
        description: '唯一ID，如果是自定义的其他操作，此ID可以自定义，此时将会作为一个新的操作项追加',
        type: 'string | number ',
        options: ['assistant', 'details', 'fix', 'close'],
      },
      {
        name: 'text',
        description: '需要展示的文本，如果不设置显示默认',
        type: '() => string | string',
      },
      {
        name: 'icon',
        description: '需要展示的ICON，如果不设置显示默认',
        type: '() => VNode | string | VNode',
      },
      {
        name: 'onClick',
        description: '鼠标点击事件，如果返回false则阻止默认点击行为; 如果返回其他，默认行为不会阻止',
        type: '(...args) => Boolean | void',
      },
      {
        name: 'render',
        description:
          '自定义渲染 & 事件处理; 如果设置了render则整个渲染都需要自己处理，默认渲染将会被阻止, 此时其他配置将失效',
        type: '() => VNode',
      },
      {
        name: 'disabled',
        description: '是否禁用此功能，如果设置为true，则此功能不展示',
        type: 'boolean',
      },
      {
        name: 'readonly',
        type: 'boolean',
        description: '是否只读，如果设置为true，则此功能只做文本展示',
      },
      {
        name: 'classList',
        type: 'string | string[]',
        description: '需要添加到操作项外层元素的样式列表',
      },
    ],
  },
];

const slots = [
  {
    name: 'action',
    description: '操作项插槽，可以覆盖默认操作项列表，完全自定义，如果启用此插槽，IMessageActions 相关配置将不再生效',
  },
  {
    name: 'title',
    description: '操作项描述，默认格式 【错误码】错误概述 + 操作建议（面向用户）',
  },
];

// 组件分组
const group = NavGroupMeta.Feedback;

// 组件名称
const name = 'message';

// 组件标签
const title = 'Message';

// 组件中文标签
const titleCN = '消息提示';

// 组件描述
const description = '用户操作后的消息提示，用于成功、失败、警告等消息提醒。';

const wiki: IComponentWiki = {
  group,
  name,
  title,
  titleCN,
  props,
  emits,
  types,
  slots,
  presets,
  description,
};
export default wiki;
