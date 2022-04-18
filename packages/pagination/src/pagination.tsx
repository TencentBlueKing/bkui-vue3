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

import type {
  ExtractPropTypes,
} from 'vue';
import {
  defineComponent,
  ref,
  toRefs,
  watch,
} from 'vue';

import {
  classes,
  PropTypes,
} from '@bkui-vue/shared';

import useLimit from './use-limit';
import useList from './use-list';
import useSmallList from './use-small-list';
import useTotal from './use-total';

export const paginationProps = {
  modelValue: PropTypes.number.def(1),
  count: PropTypes.number.def(0).isRequired,
  limit: PropTypes.number.def(10),
  limitList: PropTypes.arrayOf(Number).def([10, 20, 50, 100]),
  showLimit: PropTypes.bool.def(true),
  type: PropTypes.oneOf(['default', 'compact']).def('default'),
  location: PropTypes.oneOf(['left', 'right']).def('right'),
  align: PropTypes.oneOf(['left', 'center', 'right']).def('left'),
  size: PropTypes.size(),
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

export type PaginationProps = Readonly<ExtractPropTypes<typeof paginationProps>>;

export default defineComponent({
  name: 'Pagination',
  props: paginationProps,
  emits: [
    'update:modelValue',
    'change',
    'update:limit',
    'limitChange',
  ],
  setup(props, context) {
    const totalPageNum = ref<number>(0);
    const {
      count,
      limit,
    } = toRefs(props);

    const renderTotal = useTotal();

    const {
      current: listCurrent,
      render: renderList,
    } = useList();

    const {
      current: smallListCurrent,
      render: renderSmallList,
    } = useSmallList();

    const {
      limit: localLimit,
      render: renderLimit,
    } = useLimit();

    watch([count, localLimit, limit], ([count, localLimit]) => {
      const total = Math.ceil(count / localLimit);
      totalPageNum.value =  total < 1 ? 1 : total;
    }, {
      immediate: true,
    });
    watch(listCurrent, (listCurrent) => {
      context.emit('update:modelValue', listCurrent);
      context.emit('change', listCurrent);
    });
    watch(smallListCurrent, (smallListCurrent) => {
      context.emit('update:modelValue', smallListCurrent);
      context.emit('change', smallListCurrent);
    });
    watch(localLimit, (localLimit) => {
      context.emit('limitChange', localLimit);
    });

    return {
      totalPageNum,
      renderTotal,
      renderList,
      renderLimit,
      renderSmallList,
    };
  },
  render() {
    const paginationClass = classes({
      'bk-pagination': true,
      [`bk-pagination--${this.size}`]: true,
      [`is-align-${this.align}`]: true,
    });
    const layoutMap = {
      total: this.renderTotal,
      list: this.small ? this.renderSmallList : this.renderList,
      limit: this.renderLimit,
    };

    return (
      <div class={paginationClass}>
        {this.layout.map((layout, index) => layoutMap[layout]({
          isFirst: index === 0,
          isLast: index === this.layout.length - 1,
        }))}
      </div>
    );
  },
});
