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
// @ts-nocheck
import { createApp, Directive, DirectiveBinding, h, reactive, UnwrapRef } from 'vue';

import BkLoading from './loading';
const INSTANCE_KEY = Symbol('vBkLoading');

export type LoadingBinding = UnwrapRef<LoadingTypes>;
export interface BkLoading extends HTMLElement {
  [INSTANCE_KEY]?: {
    instance: LoadingInstance
    options: LoadingTypes
  }
}

const createInstance = (
  el: BkLoading,
  binding: DirectiveBinding<LoadingBinding>,
) => {
  const getBindingProp = <K extends keyof LoadingTypes>(
    key: K,
  ): LoadingTypes[K] => (binding.value?.[key] ?? undefined);

  const options: LoadingTypes = reactive({
    indicator: getBindingProp('indicator'),
    loading: getBindingProp('loading') ?? false,
    inline: getBindingProp('inline') ?? false,
    theme: getBindingProp('theme'),
    title: getBindingProp('title') ?? '',
    size: getBindingProp('size') ?? 'normal',
    mode: getBindingProp('mode'),
    opacity: getBindingProp('opacity'),
    color: getBindingProp('color') ?? 'white',
    zIndex: getBindingProp('zIndex'),
    isDirective: true,
  });
  const div = document.createElement('div');
  div.style = 'position: absolute; left:0; top:0; right:0; bottom:0;';
  el.style = 'position: relative;';
  const instance = createApp({
    render: () => h(BkLoading, options),
  });
  el[INSTANCE_KEY] = {
    options,
    instance,
    vm: instance.mount(div),
  };
  el.appendChild(div);
};

const updateOptions = (
  newOptions: UnwrapRef<LoadingTypes>,
  originalOptions: LoadingTypes,
) => {
  Object.keys(newOptions).forEach((key) => {
    if (newOptions[key] !== originalOptions[key]) {
      originalOptions[key] = newOptions[key];
    }
  });
};

export const vBkloading: Directive<BkLoading, LoadingBinding> = {
  name: 'loading',
  mounted(el, binding) {
    if (binding.value) {
      createInstance(el, binding);
    }
  },
  updated(el, binding) {
    const instance = el[INSTANCE_KEY];
    const { value } = binding;
    updateOptions(value, instance!.options);
  },
  unmounted(el) {
    const instance = el[INSTANCE_KEY];
    el?.removeChild(instance?.vm?.$el?.parentNode);
    instance?.instance?.unmount();
    el[INSTANCE_KEY] = null;
  },
};
