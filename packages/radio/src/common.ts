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
  type ComponentInternalInstance,
  computed,
  getCurrentInstance,
  inject,
  type InjectionKey,
  nextTick,
  onBeforeUnmount,
  onMounted,
  type Ref,
  ref,
  watch,
} from 'vue';

import { EMPTY_OBJ, isEmptyObj } from '@bkui-vue/shared';

import type { RadioProps } from './radio';
import type { IRadioGroupContext, IRadioInstance } from './type';

export const radioGroupKey: InjectionKey<IRadioGroupContext> = Symbol('RadioGroup');

export function useFocus(): [Ref<boolean>, { blur: () => void; focus: () => void }];
export function useFocus() {
  const isFocused = ref<boolean>(false);
  const blur = () => {
    isFocused.value = false;
  };
  const focus = () => {
    isFocused.value = true;
  };
  return [
    isFocused,
    {
      blur,
      focus,
    },
  ];
}

export const useRadio = () => {
  const currentInstance = getCurrentInstance() as ComponentInternalInstance & { props: RadioProps };

  const { props, emit } = currentInstance;

  const radioGroup = inject<IRadioGroupContext>(radioGroupKey, EMPTY_OBJ);
  const isGroup = !isEmptyObj(radioGroup);

  const isChecked = ref<boolean>(false);

  // 禁用状态
  const isDisabled = computed<boolean>(() => {
    if (isGroup && radioGroup.props.disabled) {
      return true;
    }
    return props.disabled;
  });

  // 响应modelValue
  if (isGroup) {
    watch(
      () => radioGroup.props.modelValue,
      modelValue => {
        isChecked.value = modelValue === props.label;
      },
      {
        immediate: true,
      },
    );
  } else {
    watch(
      () => props.modelValue,
      modelValue => {
        if (modelValue === '') {
          return;
        }
        isChecked.value = modelValue === props.label;
      },
      {
        immediate: true,
      },
    );
  }

  const setChecked = (value = true) => {
    isChecked.value = value;
  };

  // 值更新
  const handleChange = (event: Event) => {
    if (isDisabled.value) {
      return;
    }
    const $targetInput = event.target as HTMLInputElement;
    isChecked.value = $targetInput.checked;

    const nextValue = isChecked.value ? props.label : '';
    emit('update:modelValue', nextValue);
    emit('change', nextValue);
    // 更新 radio-group
    if (isGroup) {
      radioGroup.handleChange(currentInstance.proxy as IRadioInstance);
    }

    nextTick(() => {
      // 选中状态保持同步
      if ($targetInput.checked !== isChecked.value) {
        $targetInput.checked = isChecked.value;
      }
    });
  };

  onMounted(() => {
    if (isGroup) {
      radioGroup.register(currentInstance.proxy as IRadioInstance);
    }
  });

  onBeforeUnmount(() => {
    if (isGroup) {
      radioGroup.unregister(currentInstance.proxy as IRadioInstance);
    }
  });

  return {
    isChecked,
    isDisabled,
    setChecked,
    handleChange,
  };
};
