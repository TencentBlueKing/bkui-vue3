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

import { ExtractPropTypes } from 'vue';

import { ProgressStrokeLineCapType, PropTypes, ThemeEnum } from '@bkui-vue/shared';

export const props = {
  extCls: PropTypes.string,
  type: PropTypes.oneOf(['line', 'circle', 'dashboard']).def('line'),
  percent: PropTypes.number.def(0),
  theme: PropTypes.theme().def(ThemeEnum.PRIMARY),
  size: PropTypes.size(),
  width: PropTypes.number.def(126),
  strokeWidth: PropTypes.number,
  strokeLinecap: ProgressStrokeLineCapType(),
  textInside: PropTypes.bool.def(false),
  showText: PropTypes.bool.def(true),
  color: PropTypes.string,
  bgColor: PropTypes.string,
  fixed: PropTypes.number
    .validate((value: unknown) => {
      const num = typeof value === 'number' ? value : Number(String(value));
      return Number.isFinite(num) && num >= 0 && num <= 20;
    })
    .def(0),
  format: PropTypes.func.def((percent: number): string => `${percent}%`),
  titleStyle: PropTypes.object.def({
    fontSize: '16px',
    verticalAlign: 'middle',
  }),
};

export type ProgressProps = ExtractPropTypes<typeof props>;
