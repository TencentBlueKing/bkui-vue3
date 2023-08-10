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

import { computed, defineComponent } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { classes, PropTypes } from '@bkui-vue/shared';
export default defineComponent({
  name: 'Badge',
  props: {
    /** badge theme */
    theme: PropTypes.string.def('primary'),
    /** Number to show in badge */
    count: PropTypes.oneOfType([String, Number]).def(1),
    position: PropTypes.string.def('top-right'),
    radius: PropTypes.string,
    valLength: PropTypes.number.def(3),
    /** Show capped numeric value */
    overflowCount: PropTypes.number.def(99),
    /** Whether to show red dots with no content */
    dot: PropTypes.bool.def(false),
    visible: PropTypes.bool.def(false),
    /** 外部设置的 class name */
    extCls: PropTypes.string,
  },
  emits: ['hover', 'leave'],
  setup(props, { emit }) {
    const numberCount = computed(() => {
      if (typeof props.count === 'string') {
        let valueText = props.count;
        valueText += '';
        const output = [];
        let count = 0;
        valueText.split('').forEach((char) => {
          if (count < Number(props.valLength)) {
            count += /[\u4e00-\u9fa5]/.test(char) ? 2 : 1;
            output.push(char);
          }
        });

        return output.join('');
      }
      return (
        (props.count as number) > (props.overflowCount as number)
          ? `${props.overflowCount}+`
          : props.count
      );
    });
    const radiusStyle = computed(() => {
      const isRadius = props.radius !== undefined && /^\d+(%|px|em|rem|vh|vw)?$/.test(props.radius);
      const radiusValue = (isRadius && /^\d+$/.test(props.radius) && `${props.radius}px`) || props.radius;
      return { borderRadius: radiusValue };
    });
    const handleHover = () => {
      /**
       * Hover event.
       * @event hover
       */
      emit('hover');
    };
    const handleLeave = () => {
      /**
       * Leave event.
       * @event Leave
       */
      emit('leave');
    };

    const { resolveClassName } = usePrefix();

    return {
      numberCount,
      handleHover,
      handleLeave,
      radiusStyle,
      resolveClassName,
    };
  },
  render() {
    const wrapperClasses = classes({
      [`${this.resolveClassName('badge-main')}`]: true,
    }, this.$props.extCls);
    const badgeClass = classes({
      [`${this.resolveClassName('badge')} ${this.resolveClassName(this.$props.theme)}`]: !!this.$props.theme,
      ['pinned ']: this.$slots.default,
      ['dot']: this.$props.dot,
      [`${this.$props.position}`]: this.$slots.default,
      [`${this.resolveClassName('badge-icon')} is-icon`]: this.$slots.icon,
    }, '');
    const number = !this.$props.dot ? <span>{this.numberCount}</span> : '';

    return <div class={wrapperClasses}>
      {this.$slots.default?.() ?? ''}
      {
        !this.$props.visible ? <span class={badgeClass} style={this.radiusStyle}
          onMouseenter={this.handleHover}
          onMouseleave={this.handleLeave}>
          {this.$slots.icon?.() ?? number}
        </span> : ''
      }
    </div>;
  },
});
