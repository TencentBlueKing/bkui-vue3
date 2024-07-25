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
import { VirtualElement } from '..';
import * as CSS from './css';
import * as DOM from './dom';

export function toInt(x) {
  return parseInt(x, 10) || 0;
}

export function isEditable(el) {
  return (
    DOM.matches(el, 'input,[contenteditable]') ||
    DOM.matches(el, 'select,[contenteditable]') ||
    DOM.matches(el, 'textarea,[contenteditable]') ||
    DOM.matches(el, 'button,[contenteditable]')
  );
}

export function outerWidth(element) {
  const styles = CSS.get(element);
  return (
    toInt(styles.width) +
    toInt(styles.paddingLeft) +
    toInt(styles.paddingRight) +
    toInt(styles.borderLeftWidth) +
    toInt(styles.borderRightWidth)
  );
}

export const env = {
  isWebKit: typeof document !== 'undefined' && 'WebkitAppearance' in document.documentElement.style,
  supportsTouch:
    typeof window !== 'undefined' &&
    ('ontouchstart' in window ||
      ('maxTouchPoints' in window.navigator && window.navigator.maxTouchPoints > 0) ||
      // @ts-ignore
      (window.DocumentTouch && document instanceof window.DocumentTouch)),

  // @ts-ignore
  supportsIePointer: typeof navigator !== 'undefined' && navigator.msMaxTouchPoints,
  isChrome: typeof navigator !== 'undefined' && /Chrome/i.test(navigator?.userAgent),
};

export const getElement = (element: Partial<Element> | Partial<VirtualElement>) =>
  ((element as VirtualElement).isVirtualElement ? (element as VirtualElement).delegateElement : element) as Element;
