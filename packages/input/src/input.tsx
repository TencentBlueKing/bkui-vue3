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
import { classes, PropTypes } from '@bkui-vue/shared';
import { Close, Search, Eye, DownSmall, Unvisible } from '@bkui-vue/icon';

export const inputType = {
  type: PropTypes.string.def('text'),
  clearable: PropTypes.bool,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  placeholder: PropTypes.string,
  prefixIcon: PropTypes.string,
  suffixIcon: PropTypes.string,
  suffix: PropTypes.string,
  prefix: PropTypes.string,
  step: PropTypes.integer,
  max: PropTypes.integer,
  min: PropTypes.integer,
  maxlength: PropTypes.integer,
  showWordLimit: PropTypes.bool,
  showControl: PropTypes.bool.def(true),
  precision: PropTypes.number.def(0).validate(val => val >= 0 && val < 20),
  modelValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: PropTypes.size(),
};

export type InputType = ExtractPropTypes<typeof inputType> ;

export default defineComponent({
  name: 'Input',
  inheritAttrs: false,
  props: inputType,
  emits: ['update:modelValue', 'focus', 'blur', 'change', 'clear', 'input', 'keydown'],
  setup(props, ctx) {
    const isFocused = ref(false);
    const inputClsPrefix = 'bk-input';
    const { class: cls, style, ...inputAttrs } = ctx.attrs;
    const inputCls = computed(() => classes({
      [`${inputClsPrefix}--${props.size}`]: !!props.size,
      'is-focused': isFocused.value,
      'is-readonly': props.readonly,
      'is-disabled': props.disabled,
      [`${cls}`]: !!cls,
    }, inputClsPrefix));
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

    function clear() {
      ctx.emit('update:modelValue', '');
      ctx.emit('change', '');
      ctx.emit('clear');
    }

    function handleFocus(e) {
      isFocused.value = true;
      ctx.emit('focus', e);
    }

    function handleBlur(e) {
      isFocused.value = false;
      ctx.emit('blur', e);
    }

    function handleInput(e) {
      ctx.emit('update:modelValue', isNumberInput.value ? +e.target.value : e.target.value);
      ctx.emit('input', e.target.value);
    }

    function handleKeydown(e) {
      ctx.emit('keydown', e.target.value, e);
    }

    function handleChange(e) {
      ctx.emit('change', e.target.value, e);
    }

    function handleNumber(step: number, INC = true) {
      const precision = Number.isInteger(props.precision) ? props.precision : 0;
      const val: number = parseFloat(props.modelValue.toString());
      const factor = Number.isInteger(step) ? step : 1;

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
      const newVal = handleNumber(parseInt(String(props.step), 10));
      ctx.emit('update:modelValue', newVal);
    }

    function handleDec() {
      const newVal = handleNumber(parseInt(String(props.step), 10), false);
      ctx.emit('update:modelValue', newVal);
    }

    function getCls(name) {
      return `${inputClsPrefix}--${name}`;
    }

    function handleVisibleChange() {
      pwdVisible.value = !pwdVisible.value;
    }

    return () => (
      <div class={inputCls.value} style={style} >
        {
          ctx.slots?.prefix?.() ?? (props.prefix && <div class={getCls('prefix-area')}>
            <span class={getCls('prefix-area--text')}>{props.prefix}</span>
          </div>)
        }
        <input
          {...inputAttrs}
          class={`${inputClsPrefix}--text`}
          value={props.modelValue}
          type={ pwdVisible.value && props.type === 'password' ? 'text' : props.type}
          maxlength={props.maxlength}
          step={props.step}
          max={props.max}
          min={props.min}
          placeholder={props.placeholder}
          readonly={props.readonly}
          disabled={props.disabled}
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeydown={handleKeydown}
        />
        {props.clearable && !!props.modelValue && <Close onClick={clear} class={suffixCls} />}
        {suffixIcon.value}
        {
          typeof props.maxlength === 'number' && props.showWordLimit && (
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
