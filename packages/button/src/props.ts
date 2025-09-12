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
import { BkLoadingMode } from '@bkui-vue/loading';
import { PropTypes, ElementType } from '@bkui-vue/shared';

import type { ExtractPropTypes, PropType } from 'vue';
const btnSizes = ['', 'small', 'large'] as const;
type IButtonNativeType = PropType<'button' | 'reset' | 'submit'>;

export const props = {
  theme: PropTypes.theme(),
  hoverTheme: PropTypes.theme(),
  size: {
    type: String as PropType<ElementType<typeof btnSizes>>,
    default: btnSizes[0],
  },
  title: PropTypes.string,
  icon: PropTypes.string,
  iconRight: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  loadingMode: {
    type: String as PropType<`${BkLoadingMode}`>,
    default: 'default',
  },
  outline: PropTypes.bool,
  text: PropTypes.bool,
  selected: PropTypes.bool,
  // circle: PropTypes.bool,
  nativeType: {
    type: String as IButtonNativeType,
    default: 'button',
  },
};

export type ButtonProps = ExtractPropTypes<typeof props>;
