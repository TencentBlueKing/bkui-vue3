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
    description: '向下滚动以显示按钮',
    props: {
      target: '.edit-component-view',
      'visibility-height': 40,
    },
    style: {
      width: '100%',
      height: '1000px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transform: 'translate(0,0)', // 让Backtop基于容器定位
    },
  },
];

// 组件属性，用来自动生成属性文档
const props = [
  {
    name: 'visibility-height',
    description: '滚动高度达到此参数值才出现 Backtop',
    type: 'number',
    default: 200,
  },
  {
    name: 'target',
    description: '触发滚动的对象，可以是选择器字符串',
    type: 'string',
    default: '',
  },
  {
    name: 'right',
    description: 'Backtop 距离页面右侧的距离',
    type: 'number',
    default: 40,
  },
  {
    name: 'bottom',
    description: 'Backtop 距离页面底部的距离',
    type: 'number',
    default: 40,
  },
  {
    name: 'ext-cls',
    description: '自定义样式类名',
    type: 'string',
    default: '',
  },
];

// 组件分组
const group = NavGroupMeta.Nav;

// 组件名称
const name = 'backtop';

// 组件标签
const title = 'Backtop';

// 组件中文标签
const titleCN = '回到顶部';

// 组件描述
const description = 'Backtop 回到页面顶部的操作按钮';

export default {
  group,
  name,
  title,
  titleCN,
  props,
  presets,
  description,
};
