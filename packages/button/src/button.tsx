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

import { computed, defineComponent, ExtractPropTypes, PropType, ref } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import BkLoading, { BkLoadingMode, BkLoadingSize } from '@bkui-vue/loading';
import { classes, ElementType, PropTypes } from '@bkui-vue/shared';

type IButtonNativeType = PropType<'button' | 'submit' | 'reset'>;
const btnSizes = ['', 'small', 'large'] as const;
const buttonProps = {
  theme: PropTypes.theme(),
  hoverTheme: PropTypes.theme(),
  size: {
    type: String as PropType<ElementType<typeof btnSizes>>,
    default: btnSizes[0],
  },
  title: PropTypes.string,
  icon: PropTypes.string,
  iconRight: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  loadingMode: {
    type: String as PropType<`${BkLoadingMode}`>,
    default: 'default',
  },
  outline: PropTypes.bool,
  text: PropTypes.bool,
  selected: PropTypes.bool,
  // circle: PropTypes.bool,
  nativeType: {
    type: String as IButtonNativeType,
    default: 'button',
  },
};

export type ButtonPropTypes = ExtractPropTypes<typeof buttonProps>;

export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Button',
  props: buttonProps,
  emits: ['click', 'mouseover'],
  setup(props, { slots, emit }) {
    const isHover = ref(false);
    const showSlot = slots.default ?? false;
    const { resolveClassName } = usePrefix();
    const btnClsPrefix = resolveClassName('button');
    const isText = computed(() => props.text && !props.hoverTheme);
    const btnCls = computed(() => {
      const hoverTheme = props.hoverTheme ? `${btnClsPrefix}-hover-${props.hoverTheme}` : '';
      const btnThemeCls = props.theme ? `${btnClsPrefix}-${props.theme}` : '';
      const themeCls = props.hoverTheme ? '' : btnThemeCls;
      return classes(
        {
          'is-disabled': props.disabled,
          'is-outline': props.outline,
          'is-text': isText.value,
          'is-loading': props.loading,
          'is-selected': props.selected,
          // 'is-circle': props.circle,
          [`${btnClsPrefix}-${props.size}`]: props.size && btnSizes.includes(props.size),
          'no-slot': !showSlot,
        },
        `${themeCls} ${btnClsPrefix} ${hoverTheme}`,
      );
    });
    const loadingTheme = computed(() => {
      if (props.text || props.outline || props.hoverTheme) {
        if (isHover.value && !props.text) return 'white';
        if (props.text && props.disabled) return;
        return props.hoverTheme || props.theme;
      }
      return !props.theme ? undefined : 'white';
    });
    const loadingSize = computed(() =>
      isText.value || props.size === BkLoadingSize.Small ? BkLoadingSize.Mini : BkLoadingSize.Small,
    );
    const handleClick = (e: MouseEvent) => {
      if (props.loading) return;
      /**
       * Success event.
       * @event click
       */
      emit('click', e);
    };

    const handleMouseOver = (e: MouseEvent) => {
      isHover.value = true;
      emit('mouseover', e);
    };

    const handleMouseout = () => {
      isHover.value = false;
    };

    return () => (
      <button
        title={props.title}
        disabled={props.disabled}
        class={btnCls.value}
        type={props.nativeType}
        onClick={handleClick}
        onMouseover={handleMouseOver}
        onMouseleave={handleMouseout}
      >
        {props.loading && (
          <BkLoading
            loading
            class={`${btnClsPrefix}-loading`}
            mode={props.loadingMode}
            size={loadingSize.value}
            {...(loadingTheme.value
              ? {
                  theme: loadingTheme.value,
                }
              : {})}
          />
        )}
        {slots.default && <span class={`${btnClsPrefix}-text`}>{slots.default?.()}</span>}
      </button>
    );
  },
});
