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

import { computed, defineComponent, ExtractPropTypes, ref } from 'vue';

import { Close, DownSmall, Eye, Search, Unvisible } from '@bkui-vue/icon';
import { classes, ElementType, PropTypes, stringEnum } from '@bkui-vue/shared';


export const inputType = {
  type: PropTypes.string.def('text'),
  clearable: PropTypes.bool,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  placeholder: PropTypes.string.def('Enter'),
  prefixIcon: PropTypes.string,
  suffixIcon: PropTypes.string,
  suffix: PropTypes.string,
  prefix: PropTypes.string,
  step: PropTypes.integer,
  max: PropTypes.integer,
  min: PropTypes.integer,
  maxlength: PropTypes.integer,
  behavior: PropTypes.commonType(['simplicity', 'normal']).def('normal'),
  showWordLimit: PropTypes.bool,
  showControl: PropTypes.bool.def(true),
  showClearOnlyHover: PropTypes.bool.def(false),
  precision: PropTypes.number.def(0).validate(val => val >= 0 && val < 20),
  modelValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(''),
  size: PropTypes.size(),
  rows: PropTypes.number,
};


const inputEvents = ['update:modelValue', 'focus', 'blur', 'change', 'clear', 'input', 'keypress', 'keydown', 'keyup', 'enter', 'paste'] as const;
const EventEnum = stringEnum([...inputEvents]);
type InputEventUnion = ElementType<typeof inputEvents>;
export type InputType = ExtractPropTypes<typeof inputType> ;

export default defineComponent({
  name: 'Input',
  inheritAttrs: false,
  props: inputType,
  emits: [...inputEvents],
  setup(props, ctx) {
    const isFocused = ref(false);
    const isCNInput = ref(false);
    const isTextArea = computed(() => props.type === 'textarea');
    const inputClsPrefix = computed(() => (isTextArea.value ? 'bk-textarea' : 'bk-input'));
    const { class: cls, style, ...inputAttrs } = ctx.attrs;
    const inputRef = ref();
    const inputCls = computed(() => classes({
      [`${inputClsPrefix.value}--${props.size}`]: !!props.size,
      'is-focused': isFocused.value,
      'is-readonly': props.readonly,
      'is-disabled': props.disabled,
      'is-simplicity': props.behavior === 'simplicity',
      [`${cls}`]: !!cls,
    }, inputClsPrefix.value));
    const suffixIconMap = {
      search: () => <Search />,
      password: () => <Eye onClick={handleVisibleChange} />,
    };
    const suffixCls = getCls('suffix-icon');
    const suffixIcon = computed(() => {
      const icon = suffixIconMap[props.type];
      if (pwdVisible.value) {
        return <Unvisible onClick={handleVisibleChange} class={suffixCls} />;
      }
      return icon ? <icon class={suffixCls} /> : null;
    });
    const isNumberInput = computed(() => props.type === 'number');
    const ceilMaxLength = computed(() => Math.floor(props.maxlength));
    const pwdVisible = ref(false);
    const clearCls = computed(() => classes({
      'show-clear-only-hover': props.showClearOnlyHover,
    }, suffixCls));

    ctx.expose({
      focus() {
        inputRef.value.focus();
      },
      clear,
    });

    function clear() {
      ctx.emit(EventEnum['update:modelValue'], '');
      ctx.emit(EventEnum.change, '');
      ctx.emit(EventEnum.clear);
    }

    function handleFocus(e) {
      isFocused.value = true;
      ctx.emit(EventEnum.focus, e);
    }

    function handleBlur(e) {
      isFocused.value = false;
      ctx.emit(EventEnum.blur, e);
    }
    // 事件句柄生成器
    function eventHandler(eventName: InputEventUnion) {
      return (e) => {
        if (e.code === 'Enter' || e.key === 'Enter' || e.keyCode === 13) {
          ctx.emit(EventEnum.enter, e.target.value, e);
        }
        if (isCNInput.value && [EventEnum.input, EventEnum.change].some(e => eventName === e)) return;
        if (eventName === EventEnum.input) {
          ctx.emit(EventEnum['update:modelValue'], isNumberInput.value ? +e.target.value : e.target.value);
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
      EventEnum.keyup,
      EventEnum.keydown,
      EventEnum.keypress,
      EventEnum.paste,
      EventEnum.change,
      EventEnum.input,
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
      const val: number = parseFloat(props.modelValue.toString());
      const factor = Number.isInteger(numStep) ? numStep : 1;

      let newVal = val + (INC ? factor :  -1 * factor);
      if (Number.isInteger(props.max)) {
        newVal = Math.min(newVal, props.max);
      }
      if (Number.isInteger(props.min)) {
        newVal = Math.max(newVal, props.min);
      }

      return +newVal.toFixed(precision);
    }

    function handleInc() {
      const newVal = handleNumber(props.step);
      ctx.emit(EventEnum['update:modelValue'], newVal);
    }

    function handleDec() {
      const newVal = handleNumber(props.step, false);
      ctx.emit(EventEnum['update:modelValue'], newVal);
    }

    function getCls(name) {
      return `${inputClsPrefix.value}--${name}`;
    }

    function handleVisibleChange() {
      pwdVisible.value = !pwdVisible.value;
    }

    const bindProps = computed(() => ({
      value: props.modelValue,
      maxlength: props.maxlength,
      placeholder: props.placeholder,
      readonly: props.readonly,
      disabled: props.disabled,
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
    }));
    return () => (
        <div class={inputCls.value} style={style} >
        {
          ctx.slots?.prefix?.() ?? (props.prefix && <div class={getCls('prefix-area')}>
            <span class={getCls('prefix-area--text')}>{props.prefix}</span>
          </div>)
        }
        {isTextArea.value ? (
            <textarea
              ref={inputRef}
              {...inputAttrs}
              {...bindProps.value}
              rows={props.rows}
            />
        ) : (
          <input
            {...inputAttrs}
            ref={inputRef}
            class={`${inputClsPrefix.value}--text`}
            type={ pwdVisible.value && props.type === 'password' ? 'text' : props.type}
            step={props.step}
            max={props.max}
            min={props.min}
            {...bindProps.value}
          />
        )}
        {!isTextArea.value && props.clearable && !!props.modelValue && <Close onClick={clear} class={clearCls.value} />}
        {suffixIcon.value}
        {
          typeof props.maxlength === 'number' && (props.showWordLimit || isTextArea.value) && (
            <p class={getCls('max-length')}>
              {props.modelValue.toString().length}/<span>{ceilMaxLength.value}</span>
            </p>
          )
        }
        {
          isNumberInput.value && props.showControl && (<div class={getCls('number-control')}>
          <DownSmall onClick={handleInc} />
          <DownSmall onClick={handleDec}/>
        </div>)
        }
        {
            ctx.slots?.suffix?.() ?? (props.suffix && <div class={getCls('suffix-area')}>
              <span class={getCls('suffix-area--text')}>{props.suffix}</span>
            </div>)
        }
      </div>

    );
  },
});
