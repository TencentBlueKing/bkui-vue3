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

import { computed, defineComponent, ExtractPropTypes, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { useLocale, usePrefix } from '@bkui-vue/config-provider';
import { bkTooltips } from '@bkui-vue/directives';
import { Close, DownSmall, Eye, Search, Unvisible } from '@bkui-vue/icon';
import { classes, InputBehaviorType, PropTypes, useFormItem } from '@bkui-vue/shared';

import { calcTextareaHeight } from './util';

export type InputAutoSize = { minRows?: number; maxRows?: number };

export const inputType = {
  type: PropTypes.string.def('text'),
  clearable: PropTypes.bool,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  placeholder: PropTypes.string.def(''),
  prefixIcon: PropTypes.string,
  suffixIcon: PropTypes.string,
  suffix: PropTypes.string,
  prefix: PropTypes.string,
  step: PropTypes.integer,
  max: PropTypes.integer,
  min: PropTypes.integer,
  maxlength: PropTypes.integer,
  maxcharacter: PropTypes.integer,
  behavior: InputBehaviorType(),
  showWordLimit: PropTypes.bool,
  showControl: PropTypes.bool.def(true),
  showClearOnlyHover: PropTypes.bool.def(true),
  precision: PropTypes.number.def(0).validate(val => (val as number) >= 0 && (val as number) < 20),
  modelValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: PropTypes.size(),
  rows: PropTypes.number,
  selectReadonly: PropTypes.bool.def(false), // selectReadonly select组件使用，readonly属性，但是组件样式属于正常输入框样式
  withValidate: PropTypes.bool.def(true),
  overMaxLengthLimit: PropTypes.bool.def(false),
  showOverflowTooltips: PropTypes.bool.def(true),
  resize: PropTypes.bool.def(true),
  autosize: PropTypes.oneOfType<Boolean | InputAutoSize>([Boolean, Object]).def(false),
};

export const enum EVENTS {
  UPDATE = 'update:modelValue',
  FOCUS = 'focus',
  BLUR = 'blur',
  CHANGE = 'change',
  CLEAR = 'clear',
  INPUT = 'input',
  KEYPRESS = 'keypress',
  KEYDOWN = 'keydown',
  KEYUP = 'keyup',
  ENTER = 'enter',
  PASTE = 'paste',
  COMPOSITIONSTART = 'compositionstart',
  COMPOSITIONUPDATE = 'compositionupdate',
  COMPOSITIONEND = 'compositionend',
}
function EventFunction(_value: any, _evt: KeyboardEvent);
function EventFunction(_value: any, _evt: Event) {
  return true;
}

function PastEventFunction(_value: any, _e: ClipboardEvent) {
  return true;
}

function CompositionEventFunction(evt: CompositionEvent) {
  return evt;
}

export const inputEmitEventsType = {
  [EVENTS.UPDATE]: EventFunction,
  [EVENTS.FOCUS]: (evt: FocusEvent) => evt,
  [EVENTS.BLUR]: (evt: FocusEvent) => evt,
  [EVENTS.CHANGE]: EventFunction,
  [EVENTS.CLEAR]: () => true,
  [EVENTS.INPUT]: EventFunction,
  [EVENTS.KEYPRESS]: EventFunction,
  [EVENTS.KEYDOWN]: EventFunction,
  [EVENTS.KEYUP]: EventFunction,
  [EVENTS.ENTER]: EventFunction,
  [EVENTS.PASTE]: PastEventFunction,
  [EVENTS.COMPOSITIONSTART]: CompositionEventFunction,
  [EVENTS.COMPOSITIONUPDATE]: CompositionEventFunction,
  [EVENTS.COMPOSITIONEND]: CompositionEventFunction,
};

// type InputEventUnion = `${EVENTS}`;
export type InputType = ExtractPropTypes<typeof inputType>;

export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Input',
  directives: {
    bkTooltips,
  },
  inheritAttrs: false,
  props: inputType,
  emits: inputEmitEventsType,
  setup(props, ctx) {
    const { resolveClassName } = usePrefix();
    const formItem = useFormItem();
    const t = useLocale('input');
    const isFocused = ref(false);
    const isCNInput = ref(false);
    const isTextArea = computed(() => props.type === 'textarea');
    const inputClsPrefix = computed(() =>
      isTextArea.value ? resolveClassName('textarea') : resolveClassName('input'),
    );
    const { class: cls, style, ...inputAttrs } = ctx.attrs;

    const inputRef = ref();
    const innerInputValue = ref<{ value?: string | number }>(
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
          [`${cls}`]: !!cls,
        },
        inputClsPrefix.value,
      ),
    );
    const isOverflow = ref(false);
    const textareaCalcStyle = ref({});
    const resizeTextarea = () => {
      if (!isTextArea.value) return;

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
    };

    const createOnceInitResize = (resizeTextarea: () => void) => {
      let isInit = false;
      return () => {
        if (isInit || !props.autosize) return;
        const isElHidden = inputRef.value?.offsetParent === null;
        if (!isElHidden) {
          resizeTextarea();
          isInit = true;
        }
      };
    };

    const onceInitSizeTextarea = createOnceInitResize(resizeTextarea);

    const suffixIconMap = {
      search: () => <Search />,
      // TODO: eye icon 有点偏小，需要调整
      password: () => (
        <Eye
          style={{ fontSize: '18px' }}
          onClick={handleVisibleChange}
        />
      ),
    };
    const suffixCls = getCls('suffix-icon');
    const suffixIcon = computed(() => {
      const icon = suffixIconMap[props.type];
      if (pwdVisible.value) {
        return (
          <Unvisible
            onClick={handleVisibleChange}
            class={suffixCls}
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
        'is-disabled': props.disabled || (props.modelValue as number) >= props.max,
      }),
    );

    const decControlCls = computed(() =>
      classes({
        'is-disabled': props.disabled || (props.modelValue as number) <= props.min,
      }),
    );

    const tooltips = computed(() =>
      props.showOverflowTooltips && isOverflow.value && props.modelValue
        ? {
            content: props.modelValue,
            sameWidth: true,
          }
        : {
            disabled: true,
          },
    );

    const showMaxLimit = computed(() => {
      return typeof props.maxlength === 'number' || typeof props.maxcharacter === 'number';
    });

    const resizeObserver = new ResizeObserver(() => {
      onceInitSizeTextarea();
    });

    watch(
      () => props.type,
      async () => {
        await nextTick();
        resizeTextarea();
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
        nextTick(() => resizeTextarea());
        // TODO: 值变化时实时检测是否溢出
        // isOverflow.value = detectOverflow();
      },
    );

    onMounted(() => {
      isOverflow.value = detectOverflow();
      resizeObserver.observe(inputRef.value);
      nextTick(() => resizeTextarea());
    });

    onBeforeUnmount(() => {
      resizeObserver.disconnect();
    });

    ctx.expose({
      focus() {
        inputRef.value.focus();
      },
      clear,
    });

    function detectOverflow() {
      return inputRef.value?.scrollWidth > inputRef.value?.clientWidth + 2;
    }

    function clear() {
      if (props.disabled) return;
      const resetVal = isNumberInput.value ? props.min : '';
      ctx.emit(EVENTS.UPDATE, resetVal, null);
      ctx.emit(EVENTS.CHANGE, resetVal, null);
      ctx.emit(EVENTS.CLEAR);
    }

    function handleFocus(e) {
      isFocused.value = true;
      ctx.emit(EVENTS.FOCUS, e);
    }

    function handleBlur(e) {
      isFocused.value = false;
      isOverflow.value = detectOverflow();
      ctx.emit(EVENTS.BLUR, e);
      if (props.withValidate) {
        formItem?.validate?.('blur');
      }
    }

    // 事件句柄生成器
    function eventHandler(eventName) {
      return e => {
        e.stopPropagation();
        if (showMaxLimit.value && !props.overMaxLengthLimit) {
          const limit = getValueLimits(e.target.value);
          if (
            limit.len >= ceilMaxLength.value &&
            (eventName === EVENTS.KEYDOWN || eventName === EVENTS.INPUT) &&
            !isCNInput.value
          ) {
            const val = limit.pos > 0 ? e.target.value.slice(0, limit.pos) : e.target.value;
            innerInputValue.value = {
              value: val,
            };
            ctx.emit(EVENTS.UPDATE, val, e);
            ctx.emit(EVENTS.INPUT, val, e);
            return;
          }
        }

        if (isCNInput.value && [EVENTS.INPUT, EVENTS.CHANGE].some(e => eventName === e)) return;
        if (eventName === EVENTS.INPUT) {
          ctx.emit(EVENTS.UPDATE, e.target.value, e);
        } else if (eventName === EVENTS.CHANGE && isNumberInput.value && e.target.value !== '') {
          const val = handleNumber(e.target.value, 0);
          ctx.emit(EVENTS.UPDATE, val, e);
          ctx.emit(eventName, val, e);
          return;
        }
        ctx.emit(eventName, e.target.value, e);
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

    // 输入法启用时
    function handleCompositionStart() {
      isCNInput.value = true;
    }

    // 输入法输入结束时
    function handleCompositionEnd(e) {
      isCNInput.value = false;
      handleInput(e);
    }

    function handleNumber(modelValue: number, step: number, INC = true) {
      const numStep = Number(step);
      const precision = Number.isInteger(props.precision) ? props.precision : 0;
      const val = Number(modelValue);
      const factor = Number.isInteger(numStep) ? numStep : 1;

      let newVal = val + (INC ? factor : -1 * factor);
      if (Number.isInteger(props.max)) {
        newVal = Math.min(newVal, props.max);
      }
      if (Number.isInteger(props.min)) {
        newVal = Math.max(newVal, props.min);
      }

      return +newVal.toFixed(precision);
    }

    function handleInc(e) {
      if (props.disabled) return;
      const newVal = handleNumber(props.modelValue as number, props.step);
      ctx.emit(EVENTS.UPDATE, newVal, e);
      ctx.emit(EVENTS.CHANGE, newVal, e);
    }

    function handleDec(e) {
      if (props.disabled) return;
      const newVal = handleNumber(props.modelValue as number, props.step, false);
      ctx.emit(EVENTS.UPDATE, newVal, e);
      ctx.emit(EVENTS.CHANGE, newVal, e);
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
      onCompositionstart: handleCompositionStart,
      onCompositionend: handleCompositionEnd,
    };
    return () => (
      <div
        class={inputCls.value}
        style={style as any}
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
            rows={props.rows}
            style={textareaCalcStyle.value}
            {...innerInputValue.value}
          />
        ) : (
          <input
            spellcheck={false}
            {...inputAttrs}
            ref={inputRef}
            class={`${inputClsPrefix.value}--text`}
            type={pwdVisible.value && props.type === 'password' ? 'text' : props.type}
            step={props.step}
            max={props.max}
            min={props.min}
            {...eventListener}
            {...bindProps.value}
            {...innerInputValue.value}
          />
        )}
        {!isTextArea.value && props.clearable && !!props.modelValue && (
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
