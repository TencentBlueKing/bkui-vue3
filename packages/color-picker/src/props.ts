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

import { toType } from 'vue-types';

import { PropTypes } from '@bkui-vue/shared';

import type { ExtractPropTypes } from 'vue';

enum ColorPickSizeEnum {
  LARGE = 'large',
  SMALL = 'small',
  UNKNOWN = '',
}

export const props = {
  modelValue: PropTypes.string.def(''),
  disabled: PropTypes.bool.def(false),
  readonly: PropTypes.bool.def(false),
  transfer: PropTypes.bool.def(false), // 控制面板是否出现在 body 内
  size: toType<`${ColorPickSizeEnum}`>('colorPickSize', {}).def(ColorPickSizeEnum.UNKNOWN),
  showValue: PropTypes.bool.def(true), // 是否在颜色选择器上显示色值
  // true 展示组件内置预设值
  // false 不展示预设值
  // 数组 自定义预设值
  recommend: PropTypes.oneOfType([PropTypes.array.def(() => []), PropTypes.bool.def(true)]).def(true),
  extCls: PropTypes.string.def(''),
  withValidate: PropTypes.bool.def(true),
  recommendEmpty: PropTypes.bool.def(true),
  // 初始化默认展开
  showOnInit: PropTypes.bool.def(false),
};

export type ColorPickerProps = Readonly<ExtractPropTypes<typeof props>>;
