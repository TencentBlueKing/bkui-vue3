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

import { PropTypes } from '@bkui-vue/shared';

import type { ExtractPropTypes, PropType } from 'vue';

enum BkLoadingMode {
  Default = 'default',
  Spin = 'spin',
}

enum BkLoadingSize {
  Large = 'large',
  Mini = 'mini',
  Normal = '',
  Small = 'small',
}

export const props = {
  indicator: {
    type: Function,
  },
  loading: PropTypes.bool.def(true),
  inline: PropTypes.bool.def(true),
  theme: {
    type: String as PropType<'danger' | 'default' | 'primary' | 'success' | 'warning' | 'white'>,
  },
  title: PropTypes.string.def(''),
  size: {
    type: String as PropType<`${BkLoadingSize}`>,
    default: BkLoadingSize.Normal,
  },
  mode: {
    type: String as PropType<`${BkLoadingMode}`>,
    default: 'default',
  },
  opacity: PropTypes.number.def(0.9),
  color: PropTypes.string.def('white'),
  zIndex: PropTypes.number.def(1),
  isDirective: PropTypes.bool.def(false),
};

export type LoadingProps = ExtractPropTypes<typeof props>;
