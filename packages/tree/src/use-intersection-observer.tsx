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

import { computed } from 'vue';

import isElement from 'lodash/isElement';

import { IIntersectionObserver, TreePropTypes } from './props';
type IntersectionObserverOptions = {
  rootMargin?: string;
  threshold?: number | number[];
  root?: Element | null;
};

type IntersectionObserverResponseValue = {
  level: number;
  node: Record<string, any>;
  index: number;
  entry: IntersectionObserverEntry;
};

type IntersectionObserverResponse = {
  beforeResponse?: (entry: IntersectionObserverEntry) => IntersectionObserverResponseValue;
};

export default (props: TreePropTypes) => {
  const defOption = {
    enabled: props.intersectionObserver,
    once: false,
    callback: null,
  };

  let observerInstance = null;
  let observerTargets = [];

  let mutationObserverInstance = null;

  const resolveIntersectionObserverProp = () => {
    if (typeof props.intersectionObserver === 'boolean') {
      return defOption;
    }

    if (typeof props.intersectionObserver === 'object') {
      return Object.assign({}, defOption, props.intersectionObserver as IIntersectionObserver);
    }

    return defOption;
  };

  const intersectionObserver = computed(resolveIntersectionObserverProp);
  const getTargets = (target: Element | Element[] | Node | Node[]) => {
    if (target instanceof NodeList) {
      return Array.from(target) as Element[];
    }
    if (!Array.isArray(target)) {
      return [target as Element];
    }

    return target as Element[];
  };

  const initRootMutationObserver = (root: Element, callback) => {
    if (intersectionObserver.value.enabled && !props.virtualRender && isElement(root)) {
      const config = { attributes: true, childList: true, subtree: true };
      mutationObserverInstance = new MutationObserver((...args) => {
        callback?.(...args);
      });
      mutationObserverInstance.observe(root, config);
    }
  };

  const initIntersectionObserver = (
    target: Element | Element[] | Node | Node[],
    options: IntersectionObserverOptions,
    resp?: IntersectionObserverResponse,
  ) => {
    if (intersectionObserver.value.enabled) {
      if (!target) {
        console.error('intersectionObserver.target is undefined');
        return;
      }

      observerTargets = getTargets(target);

      const observerOptions = Object.assign({ rootMargin: '0px' }, options);

      // 创建观察者
      observerInstance = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
          console.log('entry', entry.target);
          if (entry.isIntersecting) {
            // 可以在这里执行更多的操作，比如加载内容或触发动画

            const result = resp?.beforeResponse?.(entry) ?? entry;
            intersectionObserver.value.callback?.(result);

            // 如果只想触发一次，可以在这里取消观测
            if (intersectionObserver.value.once) {
              observerInstance.unobserve(entry.target);
            }
          }
        });
      }, observerOptions);

      // 启动观察器，并观察所有目标
      observerTargets.forEach(item => {
        if (isElement(item)) {
          observerInstance.observe(item);
        }
      });
    }
  };

  const unobserveAll = () => {
    observerTargets?.forEach(item => {
      if (isElement(item)) {
        observerInstance?.unobserve(item);
      }
    });
    observerInstance?.disconnect();
    mutationObserverInstance?.disconnect();
  };

  const getLastVisibleElement = (offsetY: number, root: HTMLElement) => {
    const { offsetHeight } = root;
    const list = root.querySelectorAll('[data-tree-node]');
    const top = offsetHeight + offsetY;
    const elements = Array.from(list) as HTMLElement[];
    return elements.filter(node => node.offsetHeight + node.offsetTop >= top && node.offsetTop < top);
  };

  return {
    unobserveAll,
    intersectionObserver,
    initIntersectionObserver,
    initRootMutationObserver,
    getLastVisibleElement,
  };
};
