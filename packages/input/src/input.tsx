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

import { computed, defineComponent, ExtractPropTypes, nextTick, onMounted, ref, StyleValue, watch } from 'vue';

import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import { bkTooltips } from '@bkui-vue/directives';
import { Close, DownSmall, Eye, Search, Unvisible } from '@bkui-vue/icon';
import { classes, useFormItem } from '@bkui-vue/shared';
import isNumber from 'lodash/isNumber';
import trim from 'lodash/trim';

import { emits } from './emits';
import { props } from './props';
import { calcTextareaHeight } from './util';

export type InputAutoSize = { minRows?: number; maxRows?: number };

export const enum EVENTS {
  BLUR = 'blur',
  CHANGE = 'change',
  CLEAR = 'clear',
  COMPOSITIONEND = 'compositionend',
  COMPOSITIONSTART = 'compositionstart',
  COMPOSITIONUPDATE = 'compositionupdate',
  ENTER = 'enter',
  FOCUS = 'focus',
  INPUT = 'input',
  KEYDOWN = 'keydown',
  KEYPRESS = 'keypress',
  KEYUP = 'keyup',
  PASTE = 'paste',
  SEARCH = 'search',
  UPDATE = 'update:modelValue',
}

// type InputEventUnion = `${EVENTS}`;
export type InputType = ExtractPropTypes<typeof emits>;

export default defineComponent({
  name: 'Input',
  directives: {
    bkTooltips,
  },
  inheritAttrs: false,
  props,
  emits,
  setup(props, ctx) {
    const { resolveClassName } = usePrefix();
    const formItem = useFormItem();
    const t = useLocale('input');
    const isFocused = ref(false);
    const isTextArea = computed(() => props.type === 'textarea');
    const inputClsPrefix = computed(() =>
      isTextArea.value ? resolveClassName('textarea') : resolveClassName('input'),
    );
    const { class: cls, style, ...inputAttrs } = ctx.attrs;

    const inputRef = ref();
    const innerInputValue = ref<{ value?: number | string }>(
      typeof props.modelValue === 'undefined' || props.modelValue === null
        ? {}
        : {
            value: props.modelValue,
          },
    );
    const inputCls = computed(() =>
      classes(
        {
          [`${inputClsPrefix.value}--${props.size}`]: !!props.size,
          resizable: props.resize,
          'is-focused': isFocused.value,
          'is-readonly': props.readonly && !props.selectReadonly,
          'is-disabled': props.disabled,
          'is-simplicity': props.behavior === 'simplicity',
          [`${ctx.attrs.class}`]: !!ctx.attrs.class,
        },
        inputClsPrefix.value,
      ),
    );
    const isOverflow = ref(false);
    const textareaCalcStyle = ref<StyleValue>();

    const suffixCls = getCls('suffix-icon');

    const suffixIconMap = {
      search: () => <Search onClick={handleSearch} />,
      password: () => (
        <Unvisible
          class={suffixCls}
          onClick={handleVisibleChange}
        />
      ),
    };
    const suffixIcon = computed(() => {
      const icon = suffixIconMap[props.type];
      if (pwdVisible.value) {
        return (
          <Eye
            class={suffixCls}
            onClick={handleVisibleChange}
          />
        );
      }
      return icon ? <icon class={suffixCls} /> : null;
    });
    const isNumberInput = computed(() => props.type === 'number');
    const ceilMaxLength = computed(() => Math.floor(props.maxlength ?? props.maxcharacter ?? 0));
    const pwdVisible = ref(false);
    const clearCls = computed(() =>
      classes(
        {
          'show-clear-only-hover': props.showClearOnlyHover,
          [`${inputClsPrefix.value}--clear-icon`]: true,
        },
        suffixCls,
      ),
    );
    const maxLengthCls = computed(() =>
      classes({
        [getCls('max-length')]: true,
        'is-over-limit': ceilMaxLength.value - modelValueLength.value < 0,
      }),
    );
    const getValueLimits = (val: string) => {
      if (typeof props.maxcharacter === 'number') {
        return val.split('').reduce(
          (limit, char, index) => {
            limit.len += char.charCodeAt(0) > 255 ? 2 : 1;
            if (limit.len > props.maxcharacter && limit.pos === -1) {
              limit.pos = index;
            }
            return limit;
          },
          {
            len: 0,
            pos: -1,
          },
        );
      }
      return {
        len: val.length,
        pos: -1,
      };
    };

    const modelValueLength = computed(() => {
      const modelValue = (props.modelValue ?? '') as string;
      return getValueLimits(modelValue).len;
    });

    const incControlCls = computed(() =>
      classes({
        'is-disabled': props.disabled || Number(props.modelValue) >= props.max,
      }),
    );

    const decControlCls = computed(() =>
      classes({
        'is-disabled': props.disabled || Number(props.modelValue) <= props.min,
      }),
    );

    const tooltips = computed(() => {
      if (showMaxLimit.value && ceilMaxLength.value - modelValueLength.value === 0) {
        return {
          content: t.value.maxlengthLimitTips,
          ...(props.tooltipsOptions || {}),
        };
      }
      return props.showOverflowTooltips && isOverflow.value && props.modelValue
        ? {
            content: props.modelValue?.toString(),
            sameWidth: true,
            ...(props.tooltipsOptions || {}),
          }
        : {
            disabled: true,
            ...(props.tooltipsOptions || {}),
          };
    });

    const showMaxLimit = computed(() => {
      return typeof props.maxlength === 'number' || typeof props.maxcharacter === 'number';
    });

    watch(
      () => props.type,
      () => {
        nextTick(onResize);
      },
    );

    watch(
      () => props.modelValue,
      val => {
        if (props.withValidate) {
          formItem?.validate?.('change');
        }
        innerInputValue.value = {
          value: val,
        };
        nextTick(onResize);
      },
    );

    onMounted(() => {
      nextTick(onResize);
      // Hack: 修复autofocus属性失效问题 原生autofocus属性只在页面加载时生效
      if (Object.prototype.hasOwnProperty.call(ctx.attrs, 'autofocus')) {
        inputRef.value?.focus?.();
      }
    });

    ctx.expose({
      focus() {
        inputRef.value.focus();
      },
      blur() {
        inputRef.value.blur();
        isFocused.value = false;
      },
      clear,
    });

    function onResize() {
      autoResizeTextarea();
      setOverflow();
    }

    function autoResizeTextarea() {
      const isElHidden = inputRef.value?.offsetParent === null;
      if (!isTextArea.value || isElHidden || props.resize) return;

      if (props.autosize) {
        const minRows = (props.autosize as InputAutoSize)?.minRows;
        const maxRows = (props.autosize as InputAutoSize)?.maxRows;
        const textareaStyle = calcTextareaHeight(inputRef.value, minRows, maxRows);

        textareaCalcStyle.value = {
          overflowY: 'hidden',
          ...textareaStyle,
        };

        nextTick(() => {
          textareaCalcStyle.value = textareaStyle;
        });
      } else {
        textareaCalcStyle.value = {
          minHeight: calcTextareaHeight(inputRef.value).minHeight,
        };
      }
    }

    function detectOverflow() {
      return inputRef.value?.scrollWidth > inputRef.value?.clientWidth + 2;
    }

    function setOverflow() {
      setTimeout(() => {
        isOverflow.value = detectOverflow();
      });
    }

    function clear() {
      if (props.disabled) {
        return;
      }
      let value: number | string = '';
      if (props.type === 'number' && !props.allowEmptyValue) {
        value = props.min !== -Infinity ? props.min : 0;
      }
      ctx.emit(EVENTS.UPDATE, value, null);
      ctx.emit(EVENTS.CHANGE, value, null);
      ctx.emit(EVENTS.CLEAR);
    }

    function handleFocus(e: FocusEvent) {
      isFocused.value = true;
      ctx.emit(EVENTS.FOCUS, e);
    }

    function handleBlur(e) {
      isFocused.value = false;
      ctx.emit(EVENTS.BLUR, e);
      if (props.withValidate) {
        formItem?.validate?.('blur');
      }
    }
    // type = search suffix icon click event
    function handleSearch(e: Event) {
      ctx.emit(EVENTS.SEARCH, e);
    }

    // 事件句柄生成器
    function eventHandler(eventName) {
      return e => {
        props.stopPropagation && e.stopPropagation();
        if (e.isComposing) {
          // 跳过输入法复合事件
          return;
        }

        let inputValue: number | string = trim(e.target.value) || '';

        // 字符类型输入框才会有这种场景
        if (showMaxLimit.value && !props.overMaxLengthLimit) {
          const limit = getValueLimits(inputValue);
          if (limit.len >= ceilMaxLength.value && (eventName === EVENTS.KEYDOWN || eventName === EVENTS.INPUT)) {
            const val = limit.pos > 0 ? `${inputValue}`.slice(0, limit.pos) : inputValue;
            innerInputValue.value = {
              value: val,
            };
            ctx.emit(EVENTS.UPDATE, val, e);
            ctx.emit(EVENTS.INPUT, val, e);
            return;
          }
        }

        // 数字输入框需要处理空值和类型转换
        if (props.type === 'number') {
          if (inputValue === '') {
            // 处理空值(默认为0，可通过allowEmptyValue控制)
            if (!props.allowEmptyValue) {
              inputValue = props.min !== -Infinity ? props.min : 0;
            }
          } else {
            inputValue = Number(Number(inputValue).toFixed(props.precision));
          }
        }

        if (eventName === EVENTS.KEYDOWN && e.code === 'Enter') {
          // 输入框值改变时，数字输入框需要限制最大最小值
          if (isNumber(inputValue)) {
            inputValue = Math.min(Math.max(Number(inputValue), props.min), props.max);
          }
          ctx.emit(EVENTS.ENTER, inputValue, e);
          ctx.emit(EVENTS.UPDATE, inputValue, e);
        } else if (eventName === EVENTS.INPUT) {
          ctx.emit(EVENTS.INPUT, inputValue, e);
          ctx.emit(EVENTS.UPDATE, inputValue, e);
        } else if (eventName === EVENTS.CHANGE) {
          // 输入框值改变时，数字输入框需要限制最大最小值
          if (isNumber(inputValue)) {
            inputValue = Math.min(Math.max(Number(inputValue), props.min), props.max);
          }
          ctx.emit(EVENTS.CHANGE, inputValue, e);
          ctx.emit(EVENTS.UPDATE, inputValue, e);
        } else {
          ctx.emit(eventName, inputValue, e);
        }
      };
    }

    const [handleKeyup, handleKeydown, handleKeyPress, handlePaste, handleChange, handleInput] = [
      EVENTS.KEYUP,
      EVENTS.KEYDOWN,
      EVENTS.KEYPRESS,
      EVENTS.PASTE,
      EVENTS.CHANGE,
      EVENTS.INPUT,
    ].map(eventHandler);

    function handleInc(e) {
      if (props.disabled) {
        return;
      }
      const newValue = Number(Math.min(Number(props.modelValue) + props.step, props.max).toFixed(props.precision));
      ctx.emit(EVENTS.UPDATE, newValue, e);
      ctx.emit(EVENTS.CHANGE, newValue, e);
    }

    function handleDec(e) {
      if (props.disabled) {
        return;
      }
      const newValue = Number(Math.max(Number(props.modelValue) - props.step, props.min).toFixed(props.precision));
      ctx.emit(EVENTS.UPDATE, newValue, e);
      ctx.emit(EVENTS.CHANGE, newValue, e);
    }

    function getCls(name) {
      return `${inputClsPrefix.value}--${name}`;
    }

    function handleVisibleChange() {
      pwdVisible.value = !pwdVisible.value;
    }

    const bindProps = computed(() => {
      return {
        maxlength: !props.overMaxLengthLimit && props.maxlength,
        placeholder: props.placeholder || t.value.placeholder,
        readonly: props.readonly,
        disabled: props.disabled,
      };
    });

    const eventListener = {
      onInput: handleInput,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onPaste: handlePaste,
      onChange: handleChange,
      onKeypress: handleKeyPress,
      onKeydown: handleKeydown,
      onKeyup: handleKeyup,
    };
    return () => (
      <div
        style={style as StyleValue}
        class={inputCls.value}
        v-bk-tooltips={tooltips.value}
      >
        {ctx.slots?.prefix?.() ??
          (props.prefix && (
            <div class={getCls('prefix-area')}>
              <span class={getCls('prefix-area--text')}>{props.prefix}</span>
            </div>
          ))}
        {isTextArea.value ? (
          <textarea
            ref={inputRef}
            spellcheck={false}
            {...inputAttrs}
            {...eventListener}
            {...bindProps.value}
            style={textareaCalcStyle.value}
            rows={props.rows}
            {...innerInputValue.value}
          />
        ) : (
          <input
            spellcheck={false}
            {...inputAttrs}
            ref={inputRef}
            class={`${inputClsPrefix.value}--text`}
            max={props.max}
            min={props.min}
            step={props.step}
            type={pwdVisible.value && props.type === 'password' ? 'text' : props.type}
            {...eventListener}
            {...bindProps.value}
            {...innerInputValue.value}
          />
        )}
        {/* {!isTextarea.value && props.clearable && !!props.modelValue && ( */}
        {props.clearable && !!props.modelValue && (
          <span
            class={clearCls.value}
            onClick={clear}
          >
            <Close />
          </span>
        )}
        {suffixIcon.value}
        {showMaxLimit.value && (props.showWordLimit || isTextArea.value) && (
          <p class={maxLengthCls.value}>
            {props.overMaxLengthLimit ? (
              ceilMaxLength.value - modelValueLength.value
            ) : (
              <>
                {modelValueLength.value} / <span>{ceilMaxLength.value}</span>
              </>
            )}
          </p>
        )}
        {isNumberInput.value && props.showControl && (
          <div class={getCls('number-control')}>
            <DownSmall
              class={incControlCls.value}
              onClick={handleInc}
            />
            <DownSmall
              class={decControlCls.value}
              onClick={handleDec}
            />
          </div>
        )}
        {ctx.slots?.suffix?.() ??
          (props.suffix && (
            <div class={getCls('suffix-area')}>
              <span class={getCls('suffix-area--text')}>{props.suffix}</span>
            </div>
          ))}
      </div>
    );
  },
});
