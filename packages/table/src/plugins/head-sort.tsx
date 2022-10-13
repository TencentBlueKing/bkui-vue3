/*
* Tencent is pleased to support the open source community by making
* 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
*
* Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
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
import { defineComponent, ref } from 'vue';

import { AngleDownFill, AngleUpFill } from '@bkui-vue/icon/';
import { PropTypes, resolveClassName } from '@bkui-vue/shared';

import { SORT_OPTION, SORT_OPTIONS } from '../const';
import { getRowText } from '../utils';

export default defineComponent({
  name: 'HeadSort',
  props: {
    column: PropTypes.any.def({}),
    defaultSort: PropTypes.oneOf(SORT_OPTIONS).def(SORT_OPTION.ASC),
  },
  emits: ['change'],
  setup(props, { emit }) {
    const defSort = props.column?.sort?.value || props.defaultSort || SORT_OPTION.NULL;
    const sortType = ref(defSort);

    /**
     * 点击排序事件
     * @param e 鼠标事件
     * @param column 当前列
     * @param index 当前列index
     * @param type 排序类型
     */
    const handleSortClick = (e: MouseEvent, type: string) => {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();

      if (sortType.value === type) {
        sortType.value = SORT_OPTION.NULL;
      } else {
        sortType.value = type;
      }

      if (props.column.sort === 'custom') {
        emit('change', null, type);
        return;
      }

      const fieldName = props.column.field as string;
      const getVal = (row: any) => getRowText(row, fieldName, props.column);
      const sortFn0 = (a: any, b: any) => {
        const val0 = getVal(a);
        const val1 = getVal(b);
        if (typeof val0 === 'number' && typeof val1 === 'number') {
          return val0 - val1;
        }

        return String.prototype.localeCompare.call(val0, val1);
      };
      const sortFn = typeof (props.column.sort as any)?.sortFn === 'function'
        ? (props.column.sort as any)?.sortFn : sortFn0;
      const execFn = sortType.value === SORT_OPTION.NULL
        ? (() => true)
        : (_a, _b) => sortFn(_a, _b) * (type === SORT_OPTION.DESC ? -1 : 1);

      emit('change', execFn, type);
    };
    return () => <span class={ resolveClassName('head-cell-sort') }>
    <AngleDownFill class={['sort-action', 'sort-asc', sortType.value === SORT_OPTION.ASC ? 'active' : '']}
      onClick={(e: MouseEvent) => handleSortClick(e, SORT_OPTION.ASC)}/>
    <AngleUpFill class={['sort-action', 'sort-desc', sortType.value === SORT_OPTION.DESC ? 'active' : '']}
      onClick={(e: MouseEvent) => handleSortClick(e, SORT_OPTION.DESC)}/>
  </span>;
  },
});
