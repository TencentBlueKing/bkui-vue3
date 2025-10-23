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
  modelValue: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number]),
  extCls: { type: String, default: '' }, // 自定义class
  vertical: { type: Boolean, default: false }, // 是否为垂直模式
  height: { type: String, default: '200px' }, // 滑动选择器高度 vertical为true时使用
  disable: { type: Boolean, default: false }, // 是否禁用
  showTip: { type: Boolean, default: false }, // 是否显示tip
  maxValue: { type: [Number], default: 100 }, // 最大值
  minValue: { type: [Number], default: 0 }, // 最小值
  step: { type: [Number], default: 1 }, // 每一步的距离
  range: { type: Boolean, default: false }, // 是否为分段式滑块
  showInterval: { type: Boolean, default: false }, // 是否显示间断点
  showIntervalLabel: { type: Boolean, default: false }, // 是否显示间断点下的文字
  showButtonLabel: { type: Boolean, default: false }, // 滑块下是否显示值不可与间断点下的文字同时使用
  showBetweenLabel: { type: Boolean, default: false }, // 是否只显示首尾刻度
  showInput: { type: Boolean, default: false }, // 是否显示输入框
  customContent: { type: Object, default: null }, // 自定义内容
  formatterLabel: { type: Function, default: (value: number) => value }, // 自定义间断点下文字格式
  formatterButtonLabel: { type: Function, default: (value: number) => value }, // 自定义滑块下文字格式
  formatterTipLabel: { type: Function, default: (value: number) => value }, // 自定义tip格式
  labelClick: {
    type: [Boolean, Function],
    default: false,
  },
};

export type SliderProps = Readonly<ExtractPropTypes<typeof props>>;
