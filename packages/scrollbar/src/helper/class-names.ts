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

class Cls {
  main: string;
  rtl: string;
  element: {
    thumb: (x: string) => string;
    rail: (x: string) => string;
    size: (size: string) => string;
    consuming: string;
  };
  state: {
    focus: string;
    clicking: string;
    active: (x: string) => string;
    scrolling: (x: string) => string;
  };

  constructor(prefix = 'bk') {
    this.main = `${prefix}-scrollbar`;
    this.rtl = `${prefix}-rtl`;
    this.element = {
      thumb: x => `${prefix}__thumb-${x}`,
      rail: x => `${prefix}__rail-${x}`,
      size: x => `${prefix}-scroll-size-${x}`,
      consuming: `${prefix}__child--consume`,
    };
    this.state = {
      focus: `${prefix}--focus`,
      clicking: `${prefix}--clicking`,
      active: x => `${prefix}--active-${x}`,
      scrolling: x => `${prefix}--scrolling-${x}`,
    };
  }
}

export default Cls;

/*
 * Helper methods
 */
const scrollingClassTimeout = { x: null, y: null };

export function addScrollingClass(i, x) {
  const classList = i.element.classList;
  const className = i.cls.state.scrolling(x);

  if (classList.contains(className)) {
    clearTimeout(scrollingClassTimeout[x]);
  } else {
    classList.add(className);
  }
}

export function removeScrollingClass(i, x) {
  scrollingClassTimeout[x] = setTimeout(
    () => i.isAlive && i.element.classList.remove(i.cls.state.scrolling(x)),
    i.settings.scrollingThreshold,
  );
}

export function setScrollingClassInstantly(i, x) {
  addScrollingClass(i, x);
  removeScrollingClass(i, x);
}
