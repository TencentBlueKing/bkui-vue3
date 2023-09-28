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

import type { ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { classes, PropTypes, SizeEnum } from '@bkui-vue/shared';

import { useCheckbox, useFocus } from './common';

export const checkboxProps = {
  modelValue: PropTypes.oneOfType([String, Number, Boolean]),
  label: PropTypes.oneOfType([String, Number, Boolean]),
  trueLabel: PropTypes.oneOfType([String, Number, Boolean]).def(true),
  falseLabel: PropTypes.oneOfType([String, Number, Boolean]).def(false),
  disabled: PropTypes.bool.def(false),
  checked: PropTypes.bool.def(false),
  indeterminate: PropTypes.bool,
  beforeChange: PropTypes.func,
  size: PropTypes.size().def(SizeEnum.LARGE),
  immediateEmitChange: PropTypes.bool.def(true), // 默认设置checked是否触发change事件
};

export type CheckboxProps = Readonly<ExtractPropTypes<typeof checkboxProps>>;

export default defineComponent({
  name: 'Checkbox',
  props: checkboxProps,
  emits: {
    'update:modelValue': (value: unknown) => value !== undefined,
    change: (value: unknown) => value !== undefined,
  },
  setup(props) {
    const [isFocus, { blur: handleBlur, focus: handleFocus }] = useFocus();

    const { inputRef, isChecked, isDisabled, setChecked, handleChange } = useCheckbox();

    const { resolveClassName } = usePrefix();

    return {
      inputRef,
      isFocus,
      isChecked,
      isDisabled,
      setChecked,
      handleBlur,
      handleFocus,
      handleChange,
      size: props.size,
      resolveClassName,
    };
  },
  render() {
    const checkboxClass = classes({
      [`${this.resolveClassName('checkbox')}`]: true,
      'is-focused': this.isFocus,
      'is-checked': this.isChecked,
      'is-disabled': this.isDisabled,
      'is-indeterminated': this.indeterminate,
    });

    const renderLabel = () => {
      if (!this.label && !this.$slots.default) {
        return null;
      }

      return (
        <span class={`${this.resolveClassName('checkbox-label')}`}>
          {this.$slots.default ? this.$slots.default() : this.label}
        </span>
      );
    };

    return (
      <label class={checkboxClass}>
        <span class={[this.resolveClassName('checkbox-input'), this.size]}>
          <input
            ref='inputRef'
            role='checkbox'
            type='checkbox'
            class={`${this.resolveClassName('checkbox-original')}`}
            disabled={this.isDisabled}
            checked={this.isChecked}
            onChange={this.handleChange}
          />
        </span>
        {renderLabel()}
      </label>
    );
  },
});
