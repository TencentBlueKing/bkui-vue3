/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
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

import { PropTypes } from '@bkui-vue/shared';

import type { ExtractPropTypes } from 'vue';

export const props = {
  // 栅格数，默认 24
  col: PropTypes.number.def(24),
  // 栅格间距，单位 px，左右平分
  gutter: PropTypes.number.def(20),
  // 栅格容器的左右外边距
  margin: PropTypes.number.def(20),
  // 控制 row 是否使用 flex 布局
  flex: PropTypes.bool.def(false),
  // 外部设置的 class name
  extCls: PropTypes.string,
};

export const rowProps = {
  // Row 组件没有独立的 props，继承 Container 的配置
  // 如果需要添加 props，可以在这里定义
};

export const colProps = {
  // 栅格的占位格数，可选值为 0~24 的整数，为 0 时，则为 col 相当于 width: 100%
  span: PropTypes.number.def(1),
  // 栅格的偏移
  offset: PropTypes.number.def(0),
  // 栅格向左移动格数
  pull: PropTypes.number.def(0),
  // 栅格向右移动格数
  push: PropTypes.number.def(0),
};

export type ContainerProps = ExtractPropTypes<typeof props>;
export type RowProps = ExtractPropTypes<typeof rowProps>;
export type ColProps = ExtractPropTypes<typeof colProps>;
