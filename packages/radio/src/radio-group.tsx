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

import { defineComponent, onMounted, provide, watch } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { useFormItem } from '@bkui-vue/shared';

import { RADIO_GROUP_KEY } from './common';
import { radioGroupEmits } from './emits';
import { radioGroupProps } from './props';

import type { IRadioGroupContext } from './type';

export default defineComponent({
  name: 'RadioGroup',
  props: radioGroupProps,
  emits: radioGroupEmits,
  setup(props, context) {
    const formItem = useFormItem();
    const radioInstanceList = [];
    const register: IRadioGroupContext['register'] = radioContext => {
      radioInstanceList.push(radioContext);
    };
    const unregister: IRadioGroupContext['unregister'] = radioContext => {
      const index = radioInstanceList.indexOf(radioContext);
      if (index > -1) {
        radioInstanceList.splice(index, 1);
      }
    };

    const handleChange: IRadioGroupContext['handleChange'] = checkedRadioInstance => {
      const nextValue = checkedRadioInstance.label;
      radioInstanceList.forEach(radioInstance => {
        if (radioInstance !== checkedRadioInstance) {
          radioInstance.setChecked(false);
        }
      });

      context.emit('update:modelValue', nextValue);
      context.emit('change', nextValue);
    };

    provide(RADIO_GROUP_KEY, {
      props,
      register,
      unregister,
      handleChange,
    });

    watch(
      () => props.modelValue,
      () => {
        if (props.withValidate) {
          formItem?.validate?.('change');
        }
      },
    );

    onMounted(() => {
      if (props.modelValue === '') {
        return;
      }
      radioInstanceList.forEach(radioInstance => {
        radioInstance.setChecked(radioInstance.label === props.modelValue);
      });
    });

    const { resolveClassName } = usePrefix();

    return {
      resolveClassName,
    };
  },
  render() {
    return (
      <div class={[`${this.resolveClassName('radio-group')}`, `${this.resolveClassName(`radio-${this.type}`)}`]}>
        {this.$slots?.default()}
      </div>
    );
  },
});
