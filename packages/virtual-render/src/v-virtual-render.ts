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

/**
 * @file v-virtual-render
 *
 * Copyright © 2012-2019 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
 */

import throttle from 'lodash/throttle';

export function getMatchedIndex(maxCount: number, maxHeight: number, callback: (agrs: { index: number }) => 0) {
  let startIndex = 0;
  let height = 0;
  let diffHeight = 0;
  let lastHeight = 0;
  for (; startIndex < maxCount; startIndex++) {
    lastHeight = callback({
      index: startIndex,
    });
    if (height + lastHeight > maxHeight) {
      diffHeight = maxHeight - height;
      startIndex = startIndex + Math.round(diffHeight / lastHeight);
      break;
    }

    height += lastHeight;
  }

  return { startIndex, height, diffHeight };
}

export function computedVirtualIndex(lineHeight, callback, pagination, wrapper, event, scrollOffsetTop = 0) {
  if (!wrapper || !event.offset) {
    return;
  }
  const rawScrollTop = event.offset.y >= 0 ? event.offset.y : 0;
  const elScrollTop = Math.max(0, rawScrollTop - (scrollOffsetTop ?? 0));
  const elScrollLeft = event.offset.x >= 0 ? event.offset.x : 0;
  const elScrollHeight = wrapper.scrollHeight;
  const elOffsetHeight = wrapper.offsetHeight;

  const { count, groupItemCount } = pagination;
  let targetStartIndex = 0;
  let targetEndIndex = 0;
  let translateY = 0;

  if (typeof lineHeight === 'number') {
    targetStartIndex = Math.floor(elScrollTop / lineHeight);
    targetEndIndex = Math.ceil(elOffsetHeight / lineHeight) + targetStartIndex + 1;
    translateY = elScrollTop % lineHeight;
  }

  if (typeof lineHeight === 'function') {
    const maxCount = Math.ceil(count / groupItemCount);
    const startValue = getMatchedIndex(maxCount, elScrollTop, lineHeight);
    targetStartIndex = startValue.startIndex > 0 ? startValue.startIndex : 0;
    translateY = startValue.diffHeight;
    const endValue = getMatchedIndex(maxCount, elOffsetHeight, lineHeight);
    targetEndIndex = endValue.startIndex + targetStartIndex + 1;
  }

  // bottom 计算应使用真实 scrollTop（包含顶部偏移），确保触底判定准确
  const bottom = elScrollHeight - elOffsetHeight - rawScrollTop;
  typeof callback === 'function' &&
    callback(event, targetStartIndex, targetEndIndex, elScrollTop, translateY, elScrollLeft, {
      bottom: bottom >= 0 ? bottom : 0,
    });

  return {
    targetStartIndex,
    targetEndIndex,
    elScrollTop,
    translateY,
    elScrollLeft,
  };
}

export class VisibleRender {
  private binding;
  private wrapper: HTMLElement;
  private delay: number;
  private delegateWrapper;
  private boundScrollHandler: (e: Event) => void;
  private throttledRender: (e: { offset: { x: number; y: number } }) => void;

  constructor(binding, el: HTMLElement) {
    this.binding = binding;
    this.wrapper = el;
    const { throttleDelay } = binding.value;
    this.delay = throttleDelay;
    this.delegateWrapper = undefined;
    this.boundScrollHandler = this.handleScroll.bind(this);
    this.throttledRender = throttle((e: { offset: { x: number; y: number } }) => {
      this.render(e);
    }, this.delay);
  }

  get scrollHeight() {
    return this.delegateWrapper?.scrollHeight ?? this.wrapper?.scrollHeight;
  }

  get offsetHeight() {
    return this.delegateWrapper?.offsetHeight ?? this.wrapper?.offsetHeight;
  }

  public setDelegateWrapper(el) {
    this.delegateWrapper = el;
  }

  public render(e: { offset: { x: number; y: number } }) {
    const {
      lineHeight = 30,
      handleScrollCallback,
      pagination = {},
      onlyScroll,
      scrollOffsetTop = 0,
    } = this.binding.value;
    if (onlyScroll) {
      const elScrollTop = e.offset?.y;
      const elScrollLeft = e.offset?.x ?? 0;
      const bottom = this.scrollHeight - this.offsetHeight - elScrollTop;
      handleScrollCallback(e, null, null, elScrollTop, elScrollTop, elScrollLeft, {
        bottom: bottom >= 0 ? bottom : 0,
      });
      return;
    }

    const { startIndex, endIndex, groupItemCount, count, scrollTop, scrollLeft } = pagination;
    computedVirtualIndex(
      lineHeight,
      handleScrollCallback,
      { scrollTop, startIndex, endIndex, groupItemCount, count, scrollLeft },
      this.delegateWrapper ?? this.wrapper,
      e,
      scrollOffsetTop,
    );
  }

  public executeThrottledRender(e: { offset?: { x: number; y: number } }) {
    const event = this.getEvent(e);
    this.throttledRender(event);
  }

  public install() {
    this.wrapper?.addEventListener('scroll', this.boundScrollHandler, { passive: true });
  }

  public uninstall() {
    this.wrapper?.removeEventListener('scroll', this.boundScrollHandler);
  }

  public setBinding(binding) {
    this.binding = binding;
    // 更新节流延迟
    const { throttleDelay } = binding.value;
    if (throttleDelay !== this.delay) {
      this.delay = throttleDelay;
      this.throttledRender = throttle((e: { offset: { x: number; y: number } }) => {
        this.render(e);
      }, this.delay);
    }
  }

  /**
   * 原生滚动事件处理
   */
  private handleScroll(e: Event) {
    const target = e.target as HTMLElement;
    this.executeThrottledRender({
      offset: {
        x: target.scrollLeft,
        y: target.scrollTop,
      },
    });
  }

  /**
   * 统一事件格式
   */
  private getEvent = (event: {
    offset?: { x: number; y: number };
    target?: HTMLElement;
  }): { offset: { x: number; y: number } } => {
    if (event?.offset) {
      return {
        offset: event.offset,
      };
    }

    // 从 target 元素获取滚动位置
    if (event?.target) {
      return {
        offset: {
          x: event.target.scrollLeft ?? 0,
          y: event.target.scrollTop ?? 0,
        },
      };
    }

    // 默认返回 0
    return {
      offset: {
        x: 0,
        y: 0,
      },
    };
  };
}

let instance: VisibleRender = null;

export default {
  mounted(el, binding) {
    const wrapper = el.parentNode as HTMLElement;
    instance = new VisibleRender(binding, wrapper);
    instance.install();
  },

  updated(_el, binding) {
    instance?.setBinding(binding);
  },

  unbind(_el) {
    instance?.uninstall();
    instance = null;
  },
};
