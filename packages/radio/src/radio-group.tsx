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
import {
  defineComponent,
  provide,
  reactive,
  watch,
} from 'vue';

import {
  PropTypes,
} from '@bkui-vue/shared';

import { radioGroupKey } from './common';
import type { IRadioGroupContext } from './type';

const radioGroupProps = {
  name: PropTypes.string.def(''),
  modelValue: PropTypes.oneOfType([String, Number, Boolean]),
  disabled: PropTypes.bool,
};

export type RadioGroupProps = Readonly<ExtractPropTypes<typeof radioGroupProps>>;

export default defineComponent({
  name: 'RadioGroup',
  props: radioGroupProps,
  emits: [
    'change',
    'update:modelValue',
  ],
  setup(props, context) {
    const state = reactive({
      localValue: props.modelValue,
    });

    watch(() => props.modelValue, () => {
      state.localValue = props.modelValue;
    });

    const handleChange: IRadioGroupContext['handleChange'] = (value) => {
      context.emit('update:modelValue', value);
      context.emit('change', value);
    };

    provide(radioGroupKey, {
      props,
      state,
      handleChange,
    });

    return {};
  },
  render() {
    return (
      <div class="bk-radio-group">
        {this.$slots.default()}
      </div>
    );
  },
});
