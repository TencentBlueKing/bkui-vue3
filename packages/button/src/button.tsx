/**
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

import { defineComponent, computed, ExtractPropTypes, PropType } from 'vue';
import { classes, PropTypes } from '@bkui-vue/shared';
import BkLoading, { BkLoadingSize } from '@bkui-vue/loading';

type IButtonNativeType = PropType<'button' | 'submit' | 'reset'>;

const buttonProps = {
  theme: PropTypes.theme().def(''),
  hoverTheme: PropTypes.theme(['primary', 'warning', 'success', 'danger']).def(''),
  size: PropTypes.size(),
  title: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  outline: PropTypes.bool,
  text: PropTypes.bool,
  nativeType: {
    type: String as IButtonNativeType,
  },
};

export type ButtonPropTypes = ExtractPropTypes<typeof buttonProps>;

export default defineComponent({
  name: 'Button',
  emits: ['click'],
  props: buttonProps,
  setup(props, { slots, attrs, emit }) {
    const showSlot = slots.default ?? false;
    const btnClsPrefix = 'bk-button';
    const btnCls = computed(() => {
      const hoverTheme = props.hoverTheme
        ? `${btnClsPrefix}-hover-${props.hoverTheme}`
        : '';
      const btnThemeCls = props.theme ? `${btnClsPrefix}-${props.theme}` : '';
      const themeCls = props.hoverTheme ? '' : btnThemeCls;
      return classes({
        'is-disabled': props.disabled,
        'is-outline': props.outline,
        'is-text': props.text && !props.hoverTheme,
        [`${btnClsPrefix}-${props.size}`]: props.size !== '',
        'no-slot': !showSlot,
      }, `${themeCls} ${btnClsPrefix} ${hoverTheme}`);
    });

    const bkLoadingCls = `${btnClsPrefix}-loading`;
    const loadingTheme = ['', 'default'].includes(props.theme) ? 'default' : 'white';

    const handleClick = () => {
      /**
       * Success event.
       * @event click
       */
      emit('click');
    };

    return () => (
      <button
        title={props.title}
        disabled={props.disabled}
        class={btnCls.value}
        type={props.nativeType}
        {...attrs}
        onClick={handleClick}
      >
        {
          props.loading ? (
            <div class={bkLoadingCls}>
              <BkLoading theme={loadingTheme} size={BkLoadingSize.Small} />
            </div>
          ) : (
            <div class="bk-button-content-wrapper">
              <span>{slots.default?.() ?? 'default'}</span>
            </div>
          )
        }
      </button>
    );
  },
});
