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

import { Ref } from 'vue';

import { usePrefix } from '@bkui-vue/config-provider';
import BkScrollbar from '@bkui-vue/scrollbar';

import { VirtualRenderProps } from './props';

export default (target: Ref<HTMLElement>, props: VirtualRenderProps) => {
  let instance: BkScrollbar = null;
  const { resolveClassName } = usePrefix();
  const classNames = {
    contentEl: resolveClassName('scrollbar-content-el'),
    wrapper: resolveClassName('scrollbar-wrapper'),
    scrollbar: resolveClassName('scrollbar'),
    track: `${resolveClassName('scrollbar-track')} track-${props.scrollbar?.size ?? 'normal'}`,
    visible: resolveClassName('scrollbar-visible'),
    horizontal: resolveClassName('scrollbar-horizontal'),
    vertical: resolveClassName('scrollbar-vertical'),
    hover: resolveClassName('scrollbar-hover'),
    dragging: resolveClassName('scrollbar-dragging'),
    scrolling: resolveClassName('scrollbar-scrolling'),
    scrollable: resolveClassName('scrollbar-scrollable'),
    mouseEntered: resolveClassName('scrollbar-mouse-entered'),
  };

  const init = (scrollFn?, delegateXContent?, delegateYContent?) => {
    instance = new BkScrollbar(target.value, {
      classNames,
      wrapperNode: target.value,
      scrollDelegate: {
        scrollHeight: null,
        scrollWidth: null,
      },
      useSystemScrollYBehavior: !props.enabled,
      useSystemScrollXBehavior: true,
      delegateXContent,
      delegateYContent,
      onScrollCallback: scrollFn,
    });
  };

  const scrollTo = (x, y) => {
    if (props.scrollbar?.enabled) {
      instance.scrollTo({ left: x, top: y });
      return;
    }

    target.value.scrollTo(x, y);
  };

  const updateScrollHeight = (height: number) => {
    instance?.setOptions({
      scrollDelegate: {
        scrollHeight: height,
        scrollWidth: null,
      },
    });

    instance?.recalculate();
  };

  return {
    init,
    instance,
    scrollTo,
    classNames,
    updateScrollHeight,
  };
};
