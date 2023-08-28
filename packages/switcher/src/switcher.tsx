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
import { computed, defineComponent, ref, watch } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import { SwitcherLoading } from '@bkui-vue/icon';
import {
  PropTypes,
  useFormItem,
} from '@bkui-vue/shared';
export default defineComponent({
  name: 'Switcher',
  props: {
    theme: PropTypes.theme(),
    size: PropTypes.size(),
    disabled: PropTypes.bool,
    showText: PropTypes.bool,
    isOutline: PropTypes.bool,
    onText: PropTypes.string.def('ON'),
    offText: PropTypes.string.def('OFF'),
    isSquare: PropTypes.bool,
    extCls: PropTypes.string,
    beforeChange: PropTypes.func.def(undefined),
    trueValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).def(true),
    falseValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).def(false),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).def(false),
    modelValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).def(false),
    withValidate: PropTypes.bool.def(true),
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const formItem = useFormItem();
    const { resolveClassName } = usePrefix();

    const isLoading = ref(false);

    const isChecked = computed(() => props.trueValue === localValue.value);

    const isModelValue = ref(props.modelValue !== false);

    const localValue = computed(() => (isModelValue.value ? props.modelValue : props.value));

    const classObject = computed(() => {
      const cls = {
        [props.extCls]: !!props.extCls,
        [`${resolveClassName('switcher')}`]: true,
        [`${resolveClassName('switcher-outline')}`]: props.isOutline,
        [`${resolveClassName('switcher-square')}`]: props.isSquare,
        'show-label': props.showText,
        'is-disabled': props.disabled,
        'is-checked': isChecked.value,
        'is-unchecked': !isChecked.value,
        'is-loading': isLoading.value,
        [`${resolveClassName('primary')}`]: props.theme === 'primary',
      };

      // 显示文本则size无效，使用固定尺寸
      if (props.size && !props.showText) {
        const sizeStr = `${resolveClassName(`switcher-${props.size}`)}`;
        cls[sizeStr] = true;
      }
      return cls;
    });

    watch(() => props.modelValue, () => {
      isModelValue.value = true;
      if (props.withValidate) {
        formItem?.validate?.('change');
      }
    });

    watch(() => props.value, () => {
      isModelValue.value = false;
    });

    const handleChange = (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (props.disabled || isLoading.value) {
        return;
      }
      const lastValue = isChecked.value ? props.falseValue : props.trueValue;
      const lastChecked = !isChecked.value;

      const trigger = () => {
        emit('update:modelValue', lastValue);
        emit('change', lastChecked);
      };

      let goodJob: any = true;

      if (typeof props.beforeChange === 'function') {
        goodJob = props.beforeChange(lastValue);
        if (typeof goodJob.then === 'function') {
          isLoading.value = true;
          return goodJob.then(() => {
            trigger();
          }).finally(() => {
            isLoading.value = false;
          });
        }
      }
      if (goodJob) {
        trigger();
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      // Enter 键盘事件可触发开关切换
      if (e.code === 'Enter' || e.key === 'Enter' || e.keyCode === 13) {
        handleChange(e);
      }
    };

    return () => (
      <div class={classObject.value} onClick={handleChange} tabindex="0" onKeydown={handleKeydown}>
          {
            isLoading.value ? <SwitcherLoading class={`${resolveClassName('switcher-loading')}`}></SwitcherLoading> : ''
          }
          {
            props.showText ? <span class="switcher-text">
              {
                isChecked.value ? props.onText : props.offText
              }
            </span>
              : ''
          }
      </div>
    );
  },
});
