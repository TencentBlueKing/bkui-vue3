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

import { computed, defineComponent, inject, provide } from 'vue';

import { PropTypes } from '@bkui-vue/shared';

const colProps = {
  // 栅格的占位格数，可选值为 0~24 的整数，为 0 时，则为 col 相当于 width: 100%
  span: PropTypes.number.def(1),
  // 栅格的偏移
  offset: PropTypes.number.def(0),
  // 栅格向左移动格数
  pull: PropTypes.number.def(0),
  // 栅格向右移动格数
  push: PropTypes.number.def(0),
};

export default defineComponent({
  name: 'Col',
  props: colProps,
  emits: [],
  setup(props, ctx) {
    const { col, gutter, flex } = inject('containerProps');
    const { span, offset, pull, push } = props;
    const realSpan: any = computed(() => span || col);

    provide('containerProps', {
      col: realSpan.value,
      gutter,
      flex,
    });

    const formatPercentage = function (val) {
      return `${Number((val * 100).toFixed(3))}%`;
    };

    const style: any = computed(() => ({
      width: formatPercentage(realSpan.value / col),
      'padding-right': `${gutter / 2}px`,
      'padding-left': `${gutter / 2}px`,
      'margin-left': offset ? formatPercentage(offset / col) : null,
      right: pull ? formatPercentage(pull / col) : null,
      left: push ? formatPercentage(push / col) : null,
    }));

    return () => (
      <div class="bk-grid-col" style={style.value}>
        {ctx.slots.default?.()}
      </div>
    );
  },
});
