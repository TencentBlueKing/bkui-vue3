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

import { computed, defineComponent, ExtractPropTypes, ref, watch } from 'vue';

import { useLocale } from '@bkui-vue/config-provider';
import { Close, DownSmall, Eye, Search, Unvisible } from '@bkui-vue/icon';
import {
  classes,
  InputBehaviorType,
  PropTypes,
  resolveClassName,
  useFormItem,
} from '@bkui-vue/shared';

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
  behavior: InputBehaviorType(),
  showWordLimit: PropTypes.bool,
  showControl: PropTypes.bool.def(true),
  showClearOnlyHover: PropTypes.bool.def(true),
  precision: PropTypes.number.def(0).validate(val => val as number >= 0 && val as number < 20),
  modelValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: PropTypes.size(),
  rows: PropTypes.number,
  selectReadonly: PropTypes.bool.def(false), // selectReadonly select组件使用，readonly属性，但是组件样式属于正常输入框样式
  withValidate: PropTypes.bool.def(true),
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

function EventFunction(_value: any, _evt?: KeyboardEvent|Event) {
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
  [EVENTS.PASTE]: EventFunction,
  [EVENTS.COMPOSITIONSTART]: CompositionEventFunction,
  [EVENTS.COMPOSITIONUPDATE]: CompositionEventFunction,
  [EVENTS.COMPOSITIONEND]: CompositionEventFunction,
};

// type InputEventUnion = `${EVENTS}`;
export type InputType = ExtractPropTypes<typeof inputType>;

export default defineComponent({
  name: 'Input',
  inheritAttrs: false,
  props: inputType,
  emits: inputEmitEventsType,
  setup(props, ctx) {
    const formItem = useFormItem();
    const t = useLocale('input');
    const isFocused = ref(false);
    const isCNInput = ref(false);
    const isTextArea = computed(() => props.type === 'textarea');
    const inputClsPrefix = computed(() => (isTextArea.value
      ? resolveClassName('textarea')
      : resolveClassName('input')));
    const { class: cls, style, ...inputAttrs } = ctx.attrs;

    const inputRef = ref();
    const inputCls = computed(() => classes(
      {
        [`${inputClsPrefix.value}--${props.size}`]: !!props.size,
        'is-focused': isFocused.value,
        'is-readonly': props.readonly && !props.selectReadonly,
        'is-disabled': props.disabled,
        'is-simplicity': props.behavior === 'simplicity',
        [`${cls}`]: !!cls,
      },
      inputClsPrefix.value,
    ));
    const suffixIconMap = {
      search: () => <Search/>,
      password: () => <Eye onClick={handleVisibleChange}/>,
    };
    const suffixCls = getCls('suffix-icon');
    const suffixIcon = computed(() => {
      const icon = suffixIconMap[props.type];
      if (pwdVisible.value) {
        return <Unvisible onClick={handleVisibleChange} class={suffixCls}/>;
      }
      return icon ? <icon class={suffixCls}/> : null;
    });
    const isNumberInput = computed(() => props.type === 'number');
    const ceilMaxLength = computed(() => Math.floor(props.maxlength));
    const pwdVisible = ref(false);
    const clearCls = computed(() => classes(
      {
        'show-clear-only-hover': props.showClearOnlyHover,
        [`${inputClsPrefix.value}--clear-icon`]: true,
      },
      suffixCls,
    ));
    const incControlCls = computed(() => classes({
      'is-disabled': props.disabled || props.modelValue as number >= props.max,
    }));

    const decControlCls = computed(() => classes({
      'is-disabled': props.disabled || props.modelValue as number <= props.min,
    }));

    watch(
      () => props.modelValue,
      () => {
        if (props.withValidate) {
          formItem?.validate?.('change');
        }
      },
    );

    ctx.expose({
      focus() {
        inputRef.value.focus();
      },
      clear,
    });

    function clear() {
      if (props.disabled) return;
      const resetVal = isNumberInput.value ? props.min : '';
      ctx.emit(EVENTS.UPDATE, resetVal);
      ctx.emit(EVENTS.CHANGE, resetVal);
      ctx.emit(EVENTS.CLEAR);
    }

    function handleFocus(e) {
      isFocused.value = true;
      ctx.emit(EVENTS.FOCUS, e);
    }

    function handleBlur(e) {
      isFocused.value = false;
      ctx.emit(EVENTS.BLUR, e);
      if (
        isNumberInput.value && Number.isInteger(parseInt(e.target.value, 10))
        && (e.target.value > props.max || e.target.value < props.min)
      ) {
        const val = e.target.value > props.max ? props.max : props.min;
        ctx.emit(EVENTS.UPDATE, val);
        ctx.emit(EVENTS.CHANGE, val);
      }
      if (props.withValidate) {
        formItem?.validate?.('blur');
      }
    }

    // 事件句柄生成器
    function eventHandler(eventName) {
      return (e) => {
        e.stopPropagation();
        if (
          eventName === EVENTS.KEYDOWN
          && (e.code === 'Enter' || e.key === 'Enter' || e.keyCode === 13)
        ) {
          ctx.emit(EVENTS.ENTER, e.target.value, e);
        }
        if (
          isCNInput.value
          && [EVENTS.INPUT, EVENTS.CHANGE].some(e => eventName === e)
        ) return;
        if (eventName === EVENTS.INPUT) {
          ctx.emit(
            EVENTS.UPDATE,
            e.target.value,
          );
        }

        ctx.emit(eventName, e.target.value, e);
      };
    }

    const [
      handleKeyup,
      handleKeydown,
      handleKeyPress,
      handlePaste,
      handleChange,
      handleInput,
    ] = [
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

    function handleNumber(step: number, INC = true) {
      const numStep = parseInt(String(step), 10);
      const precision = Number.isInteger(props.precision) ? props.precision : 0;
      const val: number = parseFloat((props.modelValue ?? 0).toString());
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

    function handleInc() {
      if (props.disabled) return;
      const newVal = handleNumber(props.step);
      ctx.emit(EVENTS.UPDATE, newVal);
      ctx.emit(EVENTS.CHANGE, newVal);
    }

    function handleDec() {
      if (props.disabled) return;
      const newVal = handleNumber(props.step, false);
      ctx.emit(EVENTS.UPDATE, newVal);
      ctx.emit(EVENTS.CHANGE, newVal);
    }

    function getCls(name) {
      return `${inputClsPrefix.value}--${name}`;
    }

    function handleVisibleChange() {
      pwdVisible.value = !pwdVisible.value;
    }

    const bindProps = computed(() => {
      const val = typeof props.modelValue === 'undefined' || props.modelValue === null
        ? {}
        : {
          value: props.modelValue,
        };
      return {
        ...val,
        maxlength: props.maxlength,
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
      <div class={inputCls.value} style={style as any}>
        {ctx.slots?.prefix?.()
          ?? (props.prefix && (
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
          />
        ) : (
          <input
            spellcheck={false}
            {...inputAttrs}
            ref={inputRef}
            class={`${inputClsPrefix.value}--text`}
            type={
              pwdVisible.value && props.type === 'password'
                ? 'text'
                : props.type
            }
            step={props.step}
            max={props.max}
            min={props.min}
            {...eventListener}
            {...bindProps.value}
          />
        )}
        {!isTextArea.value && props.clearable && !!props.modelValue && (
          <span class={clearCls.value} onClick={clear}>
            <Close/>
          </span>
        )}
        {suffixIcon.value}
        {typeof props.maxlength === 'number'
          && (props.showWordLimit || isTextArea.value) && (
            <p class={getCls('max-length')}>
              {(props.modelValue ?? '').toString().length}/
              <span>{ceilMaxLength.value}</span>
            </p>
        )}
        {isNumberInput.value && props.showControl && (
          <div class={getCls('number-control')}>
            <DownSmall class={incControlCls.value} onClick={handleInc}/>
            <DownSmall class={decControlCls.value} onClick={handleDec}/>
          </div>
        )}
        {ctx.slots?.suffix?.()
          ?? (props.suffix && (
            <div class={getCls('suffix-area')}>
              <span class={getCls('suffix-area--text')}>{props.suffix}</span>
            </div>
          ))}
      </div>
    );
  },
});
