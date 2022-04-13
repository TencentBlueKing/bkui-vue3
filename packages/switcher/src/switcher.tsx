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
import { SwitcherLoading } from '@bkui-vue/icon';
import { PropTypes } from '@bkui-vue/shared';
import { computed, defineComponent, ref, watch } from 'vue';
export default defineComponent({
  name: 'Switcher',
  props: {
    theme: PropTypes.theme().def(''),
    size: PropTypes.size(),
    disabled: PropTypes.bool,
    showText: PropTypes.bool,
    isOutline: PropTypes.bool,
    onText: PropTypes.string.def('ON'),
    offText: PropTypes.string.def('OFF'),
    isSquare: PropTypes.bool,
    extCls: PropTypes.string,
    preCheck: PropTypes.func.def(undefined),
    trueValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).def(true),
    falseValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).def(false),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).def(false),
    modelValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).def(false),
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const isLoading = ref(false);

    const isChecked = computed(() => props.trueValue === localValue.value);

    const isModelValue = ref(props.modelValue !== false);

    const localValue = computed(() => (isModelValue.value ? props.modelValue : props.value));

    const classObject = computed(() => {
      const cls = {
        [props.extCls]: !!props.extCls,
        'bk-switcher': true,
        'bk-switcher-outline': props.isOutline,
        'bk-switcher-square': props.isSquare,
        'show-label': props.showText,
        'is-disabled': props.disabled,
        'is-checked': isChecked.value,
        'is-unchecked': !isChecked.value,
        'is-loading': isLoading.value,
        primary: props.theme === 'primary',
      };

      // 显示文本则size无效，使用固定尺寸
      if (props.size && !props.showText) {
        const sizeStr = `bk-switcher-${props.size}`;
        cls[sizeStr] = true;
      }
      if (!props.size) {
        cls['bk-switcher-nomal'] = true;
      }
      return cls;
    });

    watch(() => props.modelValue, () => {
      isModelValue.value = true;
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

      if (typeof props.preCheck === 'function') {
        goodJob = props.preCheck(lastValue);
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

    return () => (
      <div class={classObject.value} onClick={handleChange} tabindex="0" onKeydown={handleChange}>
          {
            isLoading.value ? <SwitcherLoading class="bk-switcher-loading"></SwitcherLoading> : ''
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
