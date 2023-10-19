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
import { customRef, InjectionKey, onBeforeUnmount, onMounted, Ref, ref, watch } from 'vue';

import { observerResize } from '@bkui-vue/shared';

import { IOptionGroupContext, IPopoverConfig, ISelectContext } from './type';

export const selectKey: InjectionKey<ISelectContext> = Symbol('BkSelect');
export const optionGroupKey: InjectionKey<IOptionGroupContext> = Symbol('BkOptionGroup');

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

export function useRegistry<T>(data: Ref<Map<any, T>>) {
  // 注册item
  const register = (key: any, item: T) => {
    if (!item) return;
    if (data.value.has(key)) {
      // console.warn(`repeat ${key}`, item);
      return;
    }
    return data.value.set(key, item);
  };
  // 删除item
  const unregister = (key: any) => {
    data.value.delete(key);
  };
  return {
    register,
    unregister,
  };
}

export function useDebouncedRef<T>(value, delay = 200) {
  let timeout;
  let innerValue = value;
  return customRef<T>((track, trigger) => ({
    get() {
      track();
      return innerValue;
    },
    set(newValue: any) {
      clearTimeout(timeout);
      if (newValue === undefined || newValue === '') {
        innerValue = newValue;
        trigger();
      } else {
        timeout = setTimeout(() => {
          innerValue = newValue;
          trigger();
        }, delay);
      }
    },
  }));
}

export function usePopover(config: IPopoverConfig, triggerRef: Ref<HTMLElement>) {
  const { popoverMinWidth } = config;
  let observerIns = null;
  const popperWidth = ref<string | number>('auto');
  const isPopoverShow = ref(false);
  const togglePopover = () => {
    isPopoverShow.value = !isPopoverShow.value;
  };
  const hidePopover = () => {
    isPopoverShow.value = false;
  };
  const showPopover = () => {
    isPopoverShow.value = true;
  };
  const triggerRefResize = () => {
    popperWidth.value = Math.max(triggerRef.value?.offsetWidth, popoverMinWidth);
  };
  onMounted(() => {
    if (!triggerRef.value) return;
    observerIns = observerResize(triggerRef.value, triggerRefResize, 60, true);
    observerIns.start();
  });
  onBeforeUnmount(() => {
    observerIns?.stop();
    observerIns = null;
  });
  return {
    isPopoverShow,
    popperWidth,
    togglePopover,
    hidePopover,
    showPopover,
  };
}

export function useRemoteSearch(method: Function, callBack?: Function) {
  const searchKey = useDebouncedRef<string>('');
  const searchLoading = ref(false);
  watch(searchKey, async () => {
    try {
      searchLoading.value = true;
      await method(searchKey.value);
      searchLoading.value = false;
    } catch (err) {
      console.error(err);
    } finally {
      callBack?.();
    }
  });
  return {
    searchKey,
    searchLoading,
  };
}

export function toLowerCase(value = '') {
  if (!value) return value;

  return String(value).trim().toLowerCase();
}

export function isInViewPort (el: HTMLElement, client: HTMLElement) {
  if (!el || !client) return true;
  
  const { top: elTop, bottom: elBottom } = el.getBoundingClientRect();
  const { top: clientTop, bottom: clientBottom } = client.getBoundingClientRect();

  return elTop >= clientTop && elBottom <= clientBottom
}