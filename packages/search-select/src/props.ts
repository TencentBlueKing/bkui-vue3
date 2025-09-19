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

import { ExtractPropTypes, PropType } from 'vue';

import { GetMenuListFunc, ISearchItem, ISearchValue, ICommonItem, ValidateValuesFunc, ValueBehavior } from './utils';

const MENU_ITEM_MIN_HEIGHT = 32;

export const props = {
  data: {
    type: Array as PropType<Omit<ISearchItem, 'isSelected' | 'value'>[]>,
    default: () => [],
  },
  modelValue: {
    type: Array as PropType<ISearchValue[]>,
    default: () => [],
  },
  maxHeight: {
    type: Number,
    // 默认展示12条，加上列表8px的padding
    default: MENU_ITEM_MIN_HEIGHT * 12 + 8,
  },
  conditions: {
    type: Array as PropType<ICommonItem[]>,
    default: () => [],
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  placeholder: String,
  getMenuList: Function as PropType<GetMenuListFunc>,
  validateValues: Function as PropType<ValidateValuesFunc>,
  uniqueSelect: {
    type: Boolean,
    default: false,
  },
  valueBehavior: {
    type: String as PropType<`${ValueBehavior}`>,
    default: ValueBehavior.ALL,
    validator(v: ValueBehavior) {
      return [ValueBehavior.ALL, ValueBehavior.NEED_KEY].includes(v);
    },
  },
  // deleteBehavior: {
  //   type: String as PropType<`${DeleteBehavior}`>,
  //   default: DeleteBehavior.CHAR,
  //   validator(v: DeleteBehavior) {
  //     return [DeleteBehavior.CHAR, DeleteBehavior.VALUE].includes(v);
  //   },
  // },
};

export type SearchSelectProps = ExtractPropTypes<typeof props>;
