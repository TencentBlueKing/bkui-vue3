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
  type InjectionKey,
  type Ref,
  computed,
  getCurrentInstance,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';

import {
  EMPTY_OBJ,
  isEmptyObj,
} from '@bkui-vue/shared';

import type {
  CheckboxProps,
} from './checkbox';
import type {
  ICheckboxGroupContext,
  ICheckboxInstance,
} from './type';

export const checkboxGroupKey: InjectionKey<ICheckboxGroupContext> = Symbol('CheckboxGroup');

export function useFocus(): [Ref<boolean>, { blur: () => void, focus: () => void }];
export function useFocus() {
  const isFocus = ref<boolean>(false);
  const blur = () => {
    isFocus.value = false;
  };
  const focus = () => {
    isFocus.value = true;
  };
  return [
    isFocus,
    {
      blur,
      focus,
    },
  ];
};

export const useCheckbox = () => {
  const currentInstance = getCurrentInstance() as
  ComponentInternalInstance & { props: CheckboxProps };

  const {
    props,
    emit,
  } = currentInstance;

  const checkboxGroup = inject<ICheckboxGroupContext>(checkboxGroupKey, EMPTY_OBJ);
  const isGroup = !isEmptyObj(checkboxGroup);

  const isChecked = ref<boolean>(props.checked);

  // 禁用状态
  const isDisabled = computed<boolean>(() => {
    if (isGroup && checkboxGroup.props.disabled) {
      return true;
    }
    return props.disabled;
  });

  // 响应modelValue
  if (isGroup) {
    watch(() => checkboxGroup.props.modelValue, (modelValue) => {
      isChecked.value = modelValue.includes(props.label);
    }, {
      deep: true,
    });
  } else {
    watch(() => props.modelValue, (modelValue) => {
      if (modelValue === '') {
        return;
      }
      isChecked.value = modelValue === props.trueLabel;
    }, {
      immediate: true,
    });
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

    const nextValue = isChecked.value ? props.trueLabel : props.falseLabel;

    emit('update:modelValue', nextValue);
    emit('change', nextValue);
    // 更新 checkbox-group
    if (isGroup) {
      checkboxGroup.handleChange();
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
      checkboxGroup.register(currentInstance.proxy as ICheckboxInstance);
    }
  });

  onBeforeUnmount(() => {
    if (isGroup) {
      checkboxGroup.unregister(currentInstance.proxy as ICheckboxInstance);
    }
  });

  return {
    isChecked,
    isDisabled,
    setChecked,
    handleChange,
  };
};
