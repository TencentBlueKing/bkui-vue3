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
import { PropType, ExtractPropTypes } from 'vue';

import { PropTypes } from '@bkui-vue/shared';

export const props = {
  type: PropTypes.string.def('text'),
  clearable: PropTypes.bool,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  placeholder: PropTypes.string.def(''),
  prefixIcon: PropTypes.string,
  suffixIcon: PropTypes.string,
  suffix: PropTypes.string,
  prefix: PropTypes.string,
  step: PropTypes.number.def(1),
  max: PropTypes.number.def(Infinity),
  min: PropTypes.number.def(-Infinity),
  maxlength: PropTypes.number,
  maxcharacter: PropTypes.number,
  behavior: PropTypes.oneOf(['normal', 'simplicity']).def('normal'),
  showWordLimit: PropTypes.bool,
  showControl: PropTypes.bool.def(true),
  showClearOnlyHover: PropTypes.bool.def(true),
  precision: PropTypes.number.def(0).validate(val => (val as number) >= 0 && (val as number) < 20),
  modelValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: PropTypes.size(),
  rows: PropTypes.number,
  selectReadonly: PropTypes.bool.def(false),
  withValidate: PropTypes.bool.def(true),
  overMaxLengthLimit: PropTypes.bool.def(false),
  showOverflowTooltips: PropTypes.bool.def(true),
  tooltipsOptions: {
    type: Object as PropType<Partial<Record<string, any>>>,
    default: () => ({}),
  },
  resize: PropTypes.bool.def(true),
  autosize: PropTypes.oneOfType([Boolean, Object]).def(false),
  stopPropagation: PropTypes.bool.def(true),
  allowEmptyValue: PropTypes.bool.def(false),
};

export type InputProps = ExtractPropTypes<typeof props>;
