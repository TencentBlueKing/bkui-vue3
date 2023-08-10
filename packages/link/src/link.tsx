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

import { defineComponent } from 'vue';
import { toType } from 'vue-types';

import { usePrefix } from '@bkui-vue/config-provider';
import { classes, PropTypes } from '@bkui-vue/shared';

enum LinkThemeEnum {
  DANGER = 'danger',
  SUCCESS = 'success',
  PRIMARY = 'primary',
  WARNING = 'warning',
  DEFAULT = 'default',
}
export default defineComponent({
  name: 'Link',
  props: {
    theme: toType<`${LinkThemeEnum}`>('linkTheme', {}).def(LinkThemeEnum.DEFAULT),
    href: PropTypes.string.def(''),
    disabled: PropTypes.bool.def(false),
    underline: PropTypes.bool.def(false),
    target: PropTypes.string.def('_self'),
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = (event: Event) => {
      if (props.disabled) {
        event.preventDefault();
        return false;
      }
      emit('click', event);
    };

    const { resolveClassName } = usePrefix();

    return {
      handleClick,
      resolveClassName,
    };
  },
  render() {
    const linkClass = classes({
      'is-disabled': this.disabled,
      'has-underline': this.underline,
    }, `${this.theme} ${this.resolveClassName('link')}`);

    return (
      <a href={this.href}
        target={this.target}
        class={linkClass}
        onClick={this.handleClick}>
        <span>
          {this.$slots.default?.()}
        </span>
      </a>
    );
  },
});
