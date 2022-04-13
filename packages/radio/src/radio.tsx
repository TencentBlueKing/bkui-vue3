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

import {
  classes,
  PropTypes,
} from '@bkui-vue/shared';
import type { ExtractPropTypes } from 'vue';
import { defineComponent } from 'vue';

import {
  useFocus,
  useRadio,
} from './common';

const radioProps = {
  name: PropTypes.string.def(''),
  label: PropTypes.oneOfType([String, Number, Boolean]).isRequired,
  modelValue: PropTypes.oneOfType([String, Number, Boolean]).def(''),
  checked: PropTypes.bool.def(false),
  disabled: PropTypes.bool.def(false),
};

export type RadioProps = Readonly<ExtractPropTypes<typeof radioProps>>;

export default defineComponent({
  name: 'Radio',
  props: radioProps,
  emits: [
    'change',
    'update:modelValue',
  ],
  setup() {
    const [
      isFocus,
      {
        blur: handleBlur,
        focus: handleFocus,
      },
    ] = useFocus();

    const  {
      name,
      isCheck,
      isDisabled,
      handlerChange,
    } = useRadio();

    return {
      isFocus,
      realName: name,
      isCheck,
      isDisabled,
      handleBlur,
      handleFocus,
      handlerChange,
    };
  },
  render() {
    const radioClass = classes({
      'bk-radio': true,
      'is-focus': this.isFocus,
      'is-disabled': this.isDisabled,
      'is-checked': this.isCheck,
    });
    return (
      <label
        class={radioClass}
        tabindex="0">
        <input
          class="bk-radio-input"
          type="radio"
          tabindex="0"
          name={this.realName}
          value={this.label as any}
          checked={this.isCheck}
          disabled={this.isDisabled}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={this.handlerChange} />
        <span class="bk-radio-text">
          {this.$slots.default ? this.$slots.default() : this.label}
        </span>
      </label>
    );
  },
});
