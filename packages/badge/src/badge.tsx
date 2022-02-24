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

import { defineComponent, computed } from 'vue';
import { PropTypes, classes } from '@bkui-vue/shared';

export default defineComponent({
  name: 'Badge',
  props: {
    /** badge theme */
    theme: PropTypes.string.def('primary'),
    /** Number to show in badge */
    count: PropTypes.number,
    position: PropTypes.string.def('top-right'),
    radius: PropTypes.string,
    valLength: PropTypes.number,
    /** Show capped numeric value */
    overflowCount: PropTypes.number.def(99),
    /** Whether to show red dots with no content */
    dot: PropTypes.bool.def(false),
    visible: PropTypes.bool.def(false),
  },
  setup(props) {
    const numberCount = computed(() => (
      (props.count as number) > (props.overflowCount as number)
        ? `${props.overflowCount}+`
        : props.count
    ));
    return {
      numberCount,
    };
  },
  render() {
    const badgeClass = classes({
      [`bk-badge pinned bk-${this.$props.theme}`]: !!this.$props.theme,
      ['dot']: this.$props.dot,
      [`${this.$props.position}`]: this.$props.position,
      ['bk-badge-icon is-icon']: this.$slots.icon,
    }, '');
    const number = !this.$props.dot ? <span>{this.numberCount}</span> : '';
    return <div class="bk-badge-main">
      <div>{this.$slots.default?.() ?? ''}</div>
      {
        !this.$props.visible ? <span class={badgeClass}>
          {this.$slots.icon?.() ?? number}
        </span> : ''
      }
    </div>;
  },
});
