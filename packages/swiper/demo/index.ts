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
    title: '横向布局',
    description: '轮播框组件最基本的使用',
    props: {
      height: 400,
      'loop-time': 6000,
      pics: [],
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'is-loop',
    description: '是否自动轮询',
    type: 'boolean',
    default: true,
  },
  {
    name: 'loop-time',
    description: '自动轮询间隔时间',
    type: 'number',
    default: 8000,
  },
  {
    name: 'disabled',
    description: '是否禁用',
    type: 'boolean',
    default: false,
  },
  {
    name: 'pics',
    description: '图片列表，[{ link: String, url: String, color: String, class: String }]',
    type: 'Pics[]',
    link: '/component/swiper/api#Pics[]',
    default: [],
  },
  //  TODO: list属性, 根据现有文档，搭配slots使用
  {
    name: 'height',
    description: '轮播图高度，如果不传将使用父元素高度',
    type: 'number',
  },
  {
    name: 'width',
    description: '轮播图宽度，如果不传将使用父元素宽度',
    type: 'number',
  },
];

// 组件事件，用来自动生成事件文档
const emits = [
  {
    name: 'index-change',
    description: '轮播索引发生变化时回调函数',
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
    name: 'Pics[]',
    description: '图片列表',
    fields: [
      {
        name: 'link',
        description: '图片链接',
        type: 'string',
      },
      {
        name: 'url',
        description: '图片地址',
        type: 'string',
      },
      {
        name: 'color',
        description: '图片颜色',
        type: 'string',
      },
      {
        name: 'class',
        description: '图片类名',
        type: 'string',
      },
    ],
  },
];

// 组件分组
const group = NavGroupMeta.Data;

// 组件名称
const name = 'swiper';

// 组件标签
const title = 'Swiper';

// 组件中文标签
const titleCN = '轮播';

// 组件描述
const description = '在多个面板之间切换';

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
