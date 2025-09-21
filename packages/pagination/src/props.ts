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

import type { ExtractPropTypes } from 'vue';

export const props = {
  modelValue: PropTypes.number.def(1),
  count: PropTypes.number.def(0).isRequired,
  limit: PropTypes.number.def(10),
  limitList: PropTypes.arrayOf(Number).def([10, 20, 50, 100]),
  showLimit: PropTypes.bool.def(true),
  type: PropTypes.oneOf(['default', 'compact']).def('default'),
  location: PropTypes.oneOf(['left', 'right']).def('right'),
  align: PropTypes.oneOf(['left', 'center', 'right']).def('left'),
  small: PropTypes.bool.def(false),
  showTotalCount: PropTypes.bool.def(true),
  prevText: PropTypes.string,
  nextText: PropTypes.string,
  disabled: PropTypes.bool.def(false),
  layout: PropTypes.custom((value: string[]) => {
    const layoutNameMap = {
      total: true,
      list: true,
      limit: true,
    };
    return value.some(item => layoutNameMap[item]);
  }, 'layout 的值只支持 * total、list、limit *').def(['total', 'list', 'limit']),
};

export type PaginationProps = ExtractPropTypes<typeof props>;
