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

import { defineComponent, ref, toRefs, watch } from 'vue';

import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import { classes } from '@bkui-vue/shared';

import useLimit from './use-limit';
import useList from './use-list';
import useSmallList from './use-small-list';
import useTotal from './use-total';

import { emits } from './emits';
import { props } from './props';

export default defineComponent({
  name: 'Pagination',
  props,
  emits,
  setup(props, context) {
    const t = useLocale('pagination');
    const totalPageNum = ref<number>(0);
    const { count, limit } = toRefs(props);

    const renderTotal = useTotal(t);

    const { current: listCurrent, render: renderList } = useList();

    const { current: smallListCurrent, render: renderSmallList } = useSmallList();

    const { limit: localLimit, render: renderLimit } = useLimit(t);

    watch(
      [count, localLimit, limit],
      ([count, localLimit]) => {
        const total = Math.ceil(count / localLimit);
        totalPageNum.value = total < 1 ? 1 : total;
      },
      {
        immediate: true,
      },
    );
    watch(listCurrent, listCurrent => {
      if (props.small) {
        return;
      }
      context.emit('update:modelValue', listCurrent);
      context.emit('change', listCurrent);
    });
    watch(smallListCurrent, smallListCurrent => {
      if (!props.small) {
        return;
      }
      context.emit('update:modelValue', smallListCurrent);
      context.emit('change', smallListCurrent);
    });
    watch(localLimit, localLimit => {
      context.emit('limitChange', localLimit);
    });

    const { resolveClassName } = usePrefix();

    return {
      totalPageNum,
      renderTotal,
      renderList,
      renderLimit,
      renderSmallList,
      resolveClassName,
    };
  },
  render() {
    const paginationClass = classes({
      [`${this.resolveClassName('pagination')}`]: true,
      [`is-align-${this.align}`]: true,
      'is-disabled': this.disabled,
    });
    const layoutMap = {
      total: this.renderTotal,
      list: this.small ? this.renderSmallList : this.renderList,
      limit: this.renderLimit,
    };

    return (
      <div class={paginationClass}>
        {this.layout.map((layout, index) =>
          layoutMap[layout]({
            isFirst: index === 0,
            isLast: index === this.layout.length - 1,
          }),
        )}
      </div>
    );
  },
});
