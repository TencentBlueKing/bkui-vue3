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
    title: '点状加载',
    description: '通过点状图标样式显示加载，点类型：通常用于整个页面、组件内容的加载状态；',
    props: {
      size: 'normal',
      title: '数据加载中',
    },
  },
  {
    title: '环状加载',
    description: '通过环图标样式显示加载，环类型：通常用于表示某种进程/动作任务正在执行中；主要用于局部页面中',
    props: {
      size: 'normal',
      mode: 'spin',
      title: '数据加载中',
      theme: 'primary',
    },
  },
  {
    title: '自定义加载',
    description: '通过环图标样式显示加载，环类型：通常用于表示某种进程/动作任务正在执行中；主要用于局部页面中',
    props: {
      size: 'small',
      mode: 'spin',
      title: '自定义加载',
      theme: 'primary',
    },
  },
];

// 组件属性
const props = [
  {
    name: 'size',
    description: 'loading 大小',
    type: 'string',
    options: ['mini', 'small', 'normal', 'large'],
    default: 'normal',
  },
  {
    name: 'loading',
    description: '是否显示 loading',
    type: 'boolean',
    options: [true, false],
    default: true,
  },
  {
    name: 'mode',
    description: '空白提示',
    type: 'string',
    options: ['spin', 'normal'],
    default: 'normal',
  },
  {
    name: 'title',
    description: '加载提示文字',
    type: 'string',
  },
  {
    name: 'theme',
    description: 'primary danger warning(spin模式下支持: primary danger warning success, white)',
    type: 'string',
    options: ['default', 'primary', 'danger', 'warning', 'white'],
  },
  {
    name: 'opacity',
    description: 'loading 遮罩的背景透明度 （注：如设置了 color 属性为 rgba 类型颜色则此属性将被覆盖）',
    type: 'number',
    default: 0.9,
  },
  {
    name: 'color',
    description: 'loading 遮罩的背景色 支持 rgb/hex/rgba',
    type: 'string',
  },
];

const emits = [];

const slots = [
  {
    name: 'default',
    description: '默认插槽',
  },
];

// 组件分组
const group = NavGroupMeta.Nav;

// 组件名称
const name = 'loading';

// 组件标签
const title = 'Loading';

// 组件中文标签
const titleCN = '加载';

// 组件描述
const description = '覆盖正在加载数据的组件一个 loading 层';

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
