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
import { InjectionKey, ref, customRef } from 'vue';
import Option from './option';

export type OptionInstanceType = InstanceType<typeof Option>;

export interface ISelectContext {
  props: {
    // modelValue: any
    multiple?: boolean
  };
  selectedOptions: Set<any>;
  searchKey: string;
  isRemoteSearch: boolean;
  register(option: OptionInstanceType): any;
  unregister(option: OptionInstanceType): any;
  handleOptionSelected (option: OptionInstanceType): void;
}
export const selectKey: InjectionKey<ISelectContext> = Symbol('BkSelect');

export interface IOptionGroupContext {
  disabled: boolean;
  groupCollapse: boolean;
}
export const optionGroupKey: InjectionKey<IOptionGroupContext> = Symbol('BkOptionGroup');
export interface ISelectState {
  currentPlaceholder: string;
  options: Set<OptionInstanceType>;
  selectedOptions: Set<OptionInstanceType>;
  currentSelectedLabel: string;
}

export function useFocus() {
  const isFocus = ref(false);
  const handleFocus = () => {
    isFocus.value = true;
  };
  const handleBlur = () => {
    isFocus.value = false;
  };
  return {
    isFocus,
    handleFocus,
    handleBlur,
  };
}

export function useHover() {
  const isHover = ref(false);
  const setHover = () => {
    isHover.value = true;
  };
  const cancelHover = () => {
    isHover.value = false;
  };
  return {
    isHover,
    setHover,
    cancelHover,
  };
}

export default function useDebouncedRef<T>(value, delay = 200) {
  let timeout;
  return customRef<T>((track, trigger) => ({
    get() {
      track();
      return value;
    },
    set(newValue) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        value = newValue;
        trigger();
      }, delay);
    },
  }));
}
