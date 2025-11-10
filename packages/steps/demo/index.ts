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
    title: '带序号的水平步骤条',
    description: '适用于步骤数较多时，让用户更明确的了解步骤数量',
    props: {
      'cur-step': 1,
      direction: 'horizontal',
    },
  },
  {
    title: '不带序的水平步骤条',
    description: '适用于步骤数较少时，主要引导用户按步骤完成操作',
    props: {
      'cur-step': 1,
      steps: [
        { title: '步骤一', icon: 'icon1', description: '描述信息一' },
        { title: '步骤二', icon: 'icon2', description: '描述信息二' },
        { title: '步骤三', icon: 'icon3', description: '描述信息三' },
      ],
    },
  },
  {
    title: '带状态的步骤条',
    description: '包含“已完成、进行中、未完成”三种状态的步骤条',
    props: {
      'cur-step': 2,
      status: 'loading',
    },
  },
  {
    title: '带图标的步骤条',
    description: '适用于需要自定义图标的场景',
    props: {
      'cur-step': 1,
      steps: [
        { title: '步骤一', icon: 'icon1' },
        { title: '步骤二', icon: 'icon2' },
        { title: '步骤三', icon: 'icon3' },
      ],
    },
  },
  // 未看到下一步、上一步提示
  // {
  //   title: '带额外内容的步骤条',
  //   description: '适用于步骤数较多时，让用户更明确的了解步骤数量',
  //   props: {
  //     'cur-step': 2,
  //     status: 'error',
  //   },
  // },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'steps',
    description: '组件步骤内容，有四个可选的key：title icon description status。',
    type: 'Steps[]',
    default: [],
    link: '/component/steps/api#Steps',
  },
  {
    name: 'cur-step',
    description: '当前步骤的索引值，从 1 开始',
    type: 'number',
    default: 1,
  },
  {
    name: 'direction',
    description: '	步骤条方向，支持水平（horizontal）和竖直（vertical）两种方向',
    type: 'string',
    default: 'horizontal',
    options: ['horizontal', 'vertical'],
  },
  {
    name: 'size',
    description: '指定大小，目前支持普通（不设置）和小尺寸（small）',
    type: 'string',
    default: '',
    options: ['small'],
  },
  {
    name: 'line-type',
    description: '连线样式',
    type: 'string',
    default: 'line',
    options: ['solid', 'dashed'],
  },
  {
    name: 'status',
    description: '指定当前步骤状态，不指定则为默认状态（是否完成）',
    type: 'string',
    default: '',
    options: ['error', 'loading'],
  },
  {
    name: 'controllable',
    description: '步骤可否被控制前后跳转',
    type: 'boolean',
    default: false,
  },
  {
    name: 'theme',
    description: '组件的主题色',
    type: 'string',
    default: 'primary',
    options: ['primary', 'success', 'warning', 'danger'],
  },
  {
    name: 'ext-cls',
    description: '配置自定义样式类名，传入的类会被加在组件最外层的 DOM .bk-steps 上',
    type: 'string',
  },
  {
    name: 'before-change',
    description: '步骤切换前的钩子函数，支持异步函数',
    type: 'funcObj',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'update:cur-step',
    description: '更新 cur-step 的事件',
    params: [
      {
        name: 'index',
        type: 'number',
      },
    ],
  },
  {
    name: 'click',
    description: '当前步骤变化时的回调',
    params: [
      {
        name: 'index',
        type: 'number',
      },
    ],
  },
];

// 组件自定义的复杂类型
const types = [
  {
    name: 'Steps',
    description: '组件步骤内容',
    fields: [
      {
        name: 'title',
        type: 'string',
        description: '标题',
      },
      {
        name: 'icon',
        type: 'string',
        description: '图标',
      },
      {
        name: 'description',
        type: 'string',
        description: '描述',
      },
      {
        name: 'status',
        type: 'string',
        description: '状态',
        options: ['error', 'loading'],
      },
    ],
  },
  {
    name: 'funcObj',
    description: '函数对象',
    fields: [
      {
        name: 'title',
        type: 'string',
        description: '标题',
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Nav;

// 组件名称
const name = 'steps';

// 组件标签
const title = 'Steps';

// 组件中文标签
const titleCN = '步骤';

// 组件描述
const description = 'Steps步骤条，用于步骤类的场景组件';

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
