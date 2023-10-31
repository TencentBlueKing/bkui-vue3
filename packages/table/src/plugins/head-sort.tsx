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
import { defineComponent, ref, watch } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { AngleDownFill, AngleUpFill } from '@bkui-vue/icon/';
import { PropTypes } from '@bkui-vue/shared';

import { SORT_OPTION, SORT_OPTIONS } from '../const';
import { Column, IColumnType, ISortShape } from '../props';
import { getNextSortType, getSortFn, resolveSort } from '../utils';

type IHeadSortPropType = {
  column: Column;
  defaultSort: SORT_OPTION;
  active: boolean;
};

export default defineComponent({
  name: 'HeadSort',
  props: {
    column: IColumnType,
    defaultSort: PropTypes.oneOf(SORT_OPTIONS).def(SORT_OPTION.NULL),
    active: PropTypes.bool,
  },
  emits: ['change'],
  setup(props: IHeadSortPropType, { emit }) {
    const { resolveClassName } = usePrefix();

    const defSort = (props.column?.sort as ISortShape)?.value || props.defaultSort || SORT_OPTION.NULL;
    const sortType = ref(defSort);

    watch(
      () => [props.defaultSort],
      ([val]) => {
        sortType.value = val;
      },
    );

    /**
     * 点击排序事件
     * @param e 鼠标事件
     * @param type 排序类型
     */
    const handleSortClick = (e: MouseEvent, type: string) => {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();

      let currentSort = type;
      if (type === SORT_OPTION.NULL) {
        currentSort = getNextSortType(type);
      }

      // 第二次点击取消当前排序
      if (sortType.value === type) {
        currentSort = SORT_OPTION.NULL;
      }
      const execFn = getSortFn(props.column, currentSort);
      const sort = resolveSort(props.column.sort);
      if (sort?.value === 'custom') {
        emit('change', sort?.sortFn ?? execFn, currentSort);
        return;
      }

      emit('change', execFn, currentSort);
    };
    return () => (
      <span class={resolveClassName('head-cell-sort')}>
        <AngleDownFill
          class={['sort-action', 'sort-asc', props.active && sortType.value === SORT_OPTION.ASC ? 'active' : '']}
          style='align-items: flex-end;'
          onClick={(e: MouseEvent) => handleSortClick(e, SORT_OPTION.ASC)}
        />
        <AngleUpFill
          class={['sort-action', 'sort-desc', props.active && sortType.value === SORT_OPTION.DESC ? 'active' : '']}
          style='align-items: flex-start;'
          onClick={(e: MouseEvent) => handleSortClick(e, SORT_OPTION.DESC)}
        />
      </span>
    );
  },
});
