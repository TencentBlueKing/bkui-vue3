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

import { computed, defineComponent, provide } from 'vue';

import { PropTypes } from '@bkui-vue/shared';

import { containerKey } from './interface';

export const containerProps = {
  // 栅格数，默认 24
  col: PropTypes.number.def(24),
  // 栅格间距，单位 px，左右平分
  gutter: PropTypes.number.def(20),
  // 栅格容器的左右外边距
  margin: PropTypes.number.def(20),
  // 控制 row 是否使用 flex 布局
  flex: PropTypes.bool.def(false),
  // 外部设置的 class name
  extCls: PropTypes.string,
};
export default defineComponent({
  name: 'Container',
  props: containerProps,
  emits: [],
  setup(props, ctx) {
    const { col, gutter, flex, extCls } = props;

    provide(containerKey, {
      col,
      gutter,
      flex,
    });

    const classes: any = computed(() => (extCls ? `bk-grid-container ${extCls}` : 'bk-grid-container'));

    const style: any = computed(() => {
      const { margin } = props;
      return { 'padding-right': `${margin}px`, 'padding-left': `${margin}px` };
    });

    return () => (
      <div class={classes.value} style={style.value}>
        {ctx.slots.default?.()}
      </div>
    );
  },
});
