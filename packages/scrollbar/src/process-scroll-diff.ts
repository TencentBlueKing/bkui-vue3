/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台 (BlueKing PaaS):
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
import { setScrollingClassInstantly } from './helper/class-names';

function createEvent(name) {
  if (typeof window.CustomEvent === 'function') {
    return new CustomEvent(name);
  } else {
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(name, false, false, undefined);
    return evt;
  }
}

export default function (i, axis, diff, useScrollingClass = true, forceFireReachEvent = false) {
  let fields;
  if (axis === 'top') {
    fields = ['contentHeight', 'containerHeight', 'scrollTop', 'y', 'up', 'down'];
  } else if (axis === 'left') {
    fields = ['contentWidth', 'containerWidth', 'scrollLeft', 'x', 'left', 'right'];
  } else {
    throw new Error('A proper axis should be provided');
  }

  processScrollDiff(i, diff, fields, useScrollingClass, forceFireReachEvent);
}

function processScrollDiff(
  i,
  diff,
  [contentHeight, containerHeight, scrollTop, y, up, down],
  useScrollingClass = true,
  forceFireReachEvent = false,
) {
  const element = i.element;

  // reset reach
  i.reach[y] = null;

  // 1 for subpixel rounding
  if (element[scrollTop] < 1) {
    i.reach[y] = 'start';
  }

  // 1 for subpixel rounding
  if (element[scrollTop] > i[contentHeight] - i[containerHeight] - 1) {
    i.reach[y] = 'end';
  }

  if (diff) {
    element.dispatchEvent(createEvent(`ps-scroll-${y}`));

    if (diff < 0) {
      element.dispatchEvent(createEvent(`ps-scroll-${up}`));
    } else if (diff > 0) {
      element.dispatchEvent(createEvent(`ps-scroll-${down}`));
    }

    if (useScrollingClass) {
      setScrollingClassInstantly(i, y);
    }
  }

  if (i.reach[y] && (diff || forceFireReachEvent)) {
    element.dispatchEvent(createEvent(`ps-${y}-reach-${i.reach[y]}`));
  }
}
