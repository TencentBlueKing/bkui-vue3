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

import { func } from 'vue-types';

import { PropTypes, SizeEnum } from '@bkui-vue/shared';

import type { ExtractPropTypes } from 'vue';

export const props = {
  modelValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]),
  label: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]),
  trueLabel: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]).def(true),
  falseLabel: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]).def(false),
  disabled: PropTypes.bool.def(false),
  checked: PropTypes.bool.def(false),
  indeterminate: PropTypes.bool,
  beforeChange: func<(event: boolean | number | string) => Promise<boolean> | boolean>().def(() => true),
  size: PropTypes.size().def(SizeEnum.DEFAULT),
  immediateEmitChange: PropTypes.bool.def(true), // 默认设置checked是否触发change事件
  readonly: PropTypes.bool.def(false),
  outline: PropTypes.bool.def(false),
};

export type CheckboxProps = Readonly<ExtractPropTypes<typeof props>>;
