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
  onMounted,
  provide,
  reactive,
  watch,
} from 'vue';

import {
  PropTypes,
} from '@bkui-vue/shared';

import type { CheckboxProps } from './checkbox';
import {
  checkboxGroupKey,
} from './common';
import type {
  ICheckboxGroupContext,
  ICheckboxInstance,
} from './type';

const checkboxGroupProps = {
  name: PropTypes.string.def(''),
  modelValue: PropTypes.array,
  disabled: PropTypes.bool,
};

export type CheckboxGroupProps = Readonly<ExtractPropTypes<typeof checkboxGroupProps>>;

export default defineComponent({
  name: 'CheckboxGroup',
  props: checkboxGroupProps,
  emits: [
    'change',
    'update:modelValue',
  ],
  setup(props, context) {
    const state = reactive<ICheckboxGroupContext['state']>({
      localValue: props.modelValue ? [...props.modelValue] as CheckboxProps['label'][] : [],
    });
    watch(() => props.modelValue, (modelValue = []) => {
      state.localValue = [...modelValue] as CheckboxProps['label'][];
    });
    const checkboxInstanceList: ICheckboxInstance[] = [];
    const register: ICheckboxGroupContext['register'] = (checkboxContext) => {
      checkboxInstanceList.push(checkboxContext);
    };
    const unregister: ICheckboxGroupContext['unregister'] = (checkboxContext) => {
      const index = checkboxInstanceList.indexOf(checkboxContext);
      if (index > -1) {
        checkboxInstanceList.splice(index, 1);
      }
    };

    const handleChange: ICheckboxGroupContext['handleChange'] = (nextChecked, value) => {
      let nextValue = [...state.localValue];
      if (nextChecked) {
        nextValue = [...state.localValue, value];
      } else {
        nextValue = state.localValue.reduce((result, item) => {
          if (item !== value) {
            result.push(item);
          }
          return result;
        }, [] as CheckboxProps['label'][]);
      }
      if (!props.modelValue) {
        state.localValue = nextValue;
      }
      context.emit('update:modelValue', nextValue);
      context.emit('change', nextValue);
    };

    provide(checkboxGroupKey, {
      name: 'CheckboxGroup',
      props,
      state,
      register,
      unregister,
      handleChange,
    });

    onMounted(() => {
      checkboxInstanceList.forEach((checkboxContext) => {
        if (checkboxContext.isChecked || checkboxContext.checked) {
          state.localValue.push(checkboxContext.label);
        }
      });
    });

    return {};
  },
  render() {
    return  (
      <div class="bk-checkbox-group">
        {this.$slots.default()}
      </div>
    );
  },
});
