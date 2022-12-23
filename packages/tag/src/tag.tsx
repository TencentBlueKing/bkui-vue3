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
import { toType } from 'vue-types';

import { Error } from '@bkui-vue/icon';
import { classes, PropTypes, TagThemeType } from '@bkui-vue/shared';

enum TagStrokeType {
  UNKNOWN = '',
  FILLED = 'filled',
  STROKE = 'stroke',
}

export default defineComponent({
  name: 'Tag',
  props: {
    theme: TagThemeType,
    closable: PropTypes.bool.def(false),
    type: toType<`${TagStrokeType}`>('tagStorkeType', {}).def(TagStrokeType.UNKNOWN),
    checkable: PropTypes.bool.def(false),
    checked: PropTypes.bool.def(false),
    radius: PropTypes.string.def('2px'),
    extCls: PropTypes.string.def(''),
  },
  emits: ['change', 'close'],
  slots: ['icon'],
  setup(props, { emit }) {
    const wrapperCls = computed(() => classes({
      'bk-tag-closable': props.closable,
      'bk-tag-checkable': props.checkable,
      'bk-tag-check': props.checked,
      [`bk-tag-${props.type}`]: props.type,
      [`bk-tag-${props.theme}`]: props.theme,
      [props.extCls]: !!props.extCls,
    }, 'bk-tag'));
    const wrapperStyle = computed(() => ({
      borderRadius: props.radius,
    }));

    const handleClose = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();

      emit('close', e);
    };

    const handleClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();

      if (props.checkable) {
        emit('change', !props.checked);
      }
    };

    return {
      wrapperCls,
      wrapperStyle,
      handleClose,
      handleClick,
    };
  },
  render() {
    return (
      <div class={this.wrapperCls} style={this.wrapperStyle} onClick={this.handleClick}>
        { this.$slots.icon ? <span class="bk-tag-icon">{this.$slots.icon()}</span> : '' }
        <span class="bk-tag-text">{ this.$slots.default?.() }</span>
        { this.closable ? <Error class="bk-tag-close" onClick={this.handleClose} /> : '' }
      </div>
    );
  },
});
