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

/**
 * @file v-virtual-render
 *
 * Copyright © 2012-2019 Tencent BlueKing. All Rights Reserved. 蓝鲸智云 版权所有
 */

import { throttle } from 'lodash';

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

export function computedVirtualIndex(lineHeight, callback, pagination, wrapper, event) {
  if (!wrapper || !event.offset) {
    return;
  }
  const elScrollTop = event.offset.y >= 0 ? event.offset.y : 0;
  const elScrollLeft = event.offset.x >= 0 ? event.offset.x : 0;
  const elScrollHeight = wrapper.scrollHeight;
  const elOffsetHeight = wrapper.offsetHeight;

  const { count, groupItemCount } = pagination;
  let targetStartIndex = 0;
  let targetEndIndex = 0;
  let translateY = 0;

  if (typeof lineHeight === 'number') {
    targetStartIndex = Math.ceil(elScrollTop / lineHeight);
    targetEndIndex = Math.ceil(elOffsetHeight / lineHeight) + targetStartIndex;
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

  const bottom = elScrollHeight - elOffsetHeight - elScrollTop;
  typeof callback === 'function' &&
    callback(event, targetStartIndex, targetEndIndex, elScrollTop, elScrollTop, elScrollLeft, {
      bottom: bottom >= 0 ? bottom : 0,
      scrollbar: event,
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
  private wrapper;
  private delay;
  private delegateWrapper;
  constructor(binding, el) {
    this.binding = binding;
    this.wrapper = el;
    const { throttleDelay } = binding.value;
    this.delay = throttleDelay;
    this.delegateWrapper = undefined;
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

  public render(e) {
    const { lineHeight = 30, handleScrollCallback, pagination = {}, onlyScroll } = this.binding.value;
    if (onlyScroll) {
      const elScrollTop = e.offset?.y;
      const elScrollLeft = e.offset?.x ?? 0;
      const bottom = this.scrollHeight - this.offsetHeight - elScrollTop;
      handleScrollCallback(e, null, null, elScrollTop, elScrollTop, elScrollLeft, {
        bottom: bottom >= 0 ? bottom : 0,
        scrollbar: e,
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
    );
  }

  public executeThrottledRender(e) {
    throttle(this.render.bind(this), this.delay)(this.getEvent(e));
  }

  public install() {
    this.wrapper?.addEventListener('scroll', this.executeThrottledRender.bind(this));
  }

  public uninstall() {
    this.wrapper?.removeListener?.('scroll', this.executeThrottledRender.bind(this));
  }

  public setBinding(binding) {
    this.binding = binding;
  }

  private getEvent = (event: { offset: number; target: HTMLElement } & Event) => {
    const { scrollbar = { enabled: false } } = this.binding.value;
    if (scrollbar.enabled) {
      return {
        offset: event.offset ?? {
          x: event.target.scrollLeft,
          y: event.target.scrollTop,
        },
      };
    }

    if (event?.offset) {
      return {
        offset: event?.offset,
      };
    }

    const elScrollTop = (event.target as HTMLElement).scrollTop;
    const elScrollLeft = (event.target as HTMLElement).scrollLeft;

    return {
      offset: {
        x: elScrollLeft,
        y: elScrollTop,
      },
    };
  };
}

let instance: VisibleRender = null;

export default {
  mounted(el, binding) {
    const wrapper = el.parentNode;
    instance = new VisibleRender(binding, el);
    wrapper.addEventListener('scroll', instance.executeThrottledRender.bind(instance));
  },

  updated(_el, binding) {
    instance?.setBinding(binding);
  },

  unbind(el) {
    if (el) {
      const wrapper = el.parentNode;
      if (!wrapper || !instance) {
        return;
      }
      wrapper.removeEventListener('scroll', instance.executeThrottledRender);
    }
  },
};
