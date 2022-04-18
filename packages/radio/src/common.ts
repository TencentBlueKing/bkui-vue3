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
import type {
  ComponentInternalInstance,
  InjectionKey,
  Ref,
} from 'vue';
import {
  computed,
  getCurrentInstance,
  inject,
  reactive,
  ref,
} from 'vue';

import { EMPTY_OBJ, isEmptyObj } from '@bkui-vue/shared';

import type { RadioProps } from './radio';
import type { IRadioGroupContext } from './type';

export const radioGroupKey: InjectionKey<IRadioGroupContext> = Symbol('RadioGroup');

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

export function useRadio() {
  const {
    props,
    emit,
  } = getCurrentInstance() as ComponentInternalInstance & { props: RadioProps };

  const radioGroup = inject<IRadioGroupContext>(radioGroupKey, EMPTY_OBJ);
  const isGroup = !isEmptyObj(radioGroup);

  const state = reactive({
    isLocalChecked: props.checked,
  });

  const isCheck = computed<boolean>(() => {
    if (isGroup) {
      return radioGroup.state.localValue === props.label;
    } if (props.modelValue !== '') {
      // 值判断
      return props.modelValue === props.label;
    }
    return state.isLocalChecked;
  });
  state.isLocalChecked = isCheck.value;

  const isDisabled = computed<boolean>(() => {
    if (isGroup && radioGroup.props.disabled) {
      return true;
    }
    return props.disabled;
  });

  const name = computed<string>(() => {
    if (isGroup && radioGroup.props.name) {
      return radioGroup.props.name;
    }
    return props.name;
  });

  const handlerChange = () => {
    if (isDisabled.value) {
      return;
    }
    emit('change', props.label);
    emit('update:modelValue', props.label);
    if (isGroup) {
      radioGroup.handleChange(props.label);
    }
  };

  return {
    name,
    isCheck,
    isDisabled,
    handlerChange,
  };
}
