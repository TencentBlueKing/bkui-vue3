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
import { NavGroupMeta } from '@bkui-vue/shared';

// 组件示例
const presets = [
  {
    title: '基础用法',
    description: '不传值时：默认直接固定在最顶端',
    props: {
      offsetBottom: 100,
    },
    slots: {
      default: `
        <section style="height: 40px; width: 100px; background-color: #3a84ff; line-height: 40px; color: #fff; text-align: center;">
          固定在顶部
        </section>
      `,
    },
  },
  {
    title: '固定在顶部',
    description: '设置offset-top属性',
    props: {
      offsetTop: 100,
    },
  },
  {
    title: '对象层级',
    description: '设置z-index属性，设置affix对象的层级',
    props: {
      offsetTop: 200,
      zIndex: 10,
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'offsetTop',
    description: '距离窗口顶部达到指定偏移量后触发',
    type: 'number',
    default: 0,
  },
  {
    name: 'offsetBottom',
    description: '距离窗口底部达到指定偏移量后触发',
    type: 'number',
  },
  {
    name: 'target',
    description: '设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数',
    type: 'string',
  },
  {
    name: 'zIndex',
    description: '设置 Affix 的 z-index',
    type: 'number',
    default: 1000,
  },
  {
    name: 'testType',
    description: '测试复杂类型',
    type: 'ITestType',
    link: '/component/affix/api#ITestType',
    default: 1000,
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'change',
    description: '固定状态发生改变时触发的事件',
    params: [
      {
        name: 'affixed',
        type: 'boolean',
      },
    ],
  },
];

// 组件自定义的复杂类型
const types = [
  {
    name: 'ITestType',
    description: '图钉状态',
    fields: [
      {
        name: 'type',
        type: 'string',
        description: '类型',
      },
      {
        name: 'value',
        type: 'ITestSubType',
        description: '值',
        link: '/component/affix/api#ITestSubType',
      },
    ],
  },
  {
    name: 'ITestSubType',
    description: '图钉子状态',
    fields: [
      {
        name: 'subType',
        type: 'string',
        description: '子类型',
      },
      {
        name: 'subValue',
        type: 'string',
        description: '子值',
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Nav;

// 组件名称
const name = 'affix';

// 组件标签
const title = 'Affix';

// 组件中文标签
const titleCN = '图钉';

// 组件描述
const description = '使用图钉，可以将内容固定在屏幕上，并且不随页面的滚动而滚动。';

export default {
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
