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
import BkScrollbar, { VirtualElement } from '..';
import * as DOM from '../helper/dom';
import { isEditable } from '../helper/util';
import updateGeometry from '../update-geometry';

export default function (i: BkScrollbar) {
  const element = i.element;

  const elementHovered = () => DOM.matches(element, ':hover');
  const scrollbarFocused = () => DOM.matches(i.scrollbarX, ':focus') || DOM.matches(i.scrollbarY, ':focus');

  function shouldPreventDefault(deltaX, deltaY) {
    const scrollTop = Math.floor(element.scrollTop);
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
        return !i.settings.wheelPropagation;
      }
    }

    const scrollLeft = (element as HTMLElement).scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  function getPageHeight() {
    if ((element as VirtualElement).isVirtualElement) {
      return (i.containerHeight / i.element.scrollHeight) * i.containerHeight;
    }

    return i.containerHeight;
  }

  function getContentHeight() {
    if ((element as VirtualElement).isVirtualElement) {
      return i.containerHeight;
    }

    return i.contentHeight;
  }

  i.event.bind(i.ownerDocument, 'keydown', e => {
    const step = 30;
    if (e.isDefaultPrevented?.() || e.defaultPrevented) {
      return;
    }

    if (!elementHovered() && !scrollbarFocused()) {
      return;
    }

    let activeElement = document.activeElement ? document.activeElement : i.ownerDocument.activeElement;
    if (activeElement) {
      if (activeElement.tagName === 'IFRAME') {
        // @ts-ignore
        activeElement = activeElement.contentDocument.activeElement;
      } else {
        // go deeper if element is a webcomponent
        while (activeElement.shadowRoot) {
          activeElement = activeElement.shadowRoot.activeElement;
        }
      }
      if (isEditable(activeElement)) {
        return;
      }
    }

    let deltaX = 0;
    let deltaY = 0;

    switch (e.which) {
      case 37: // left
        if (e.metaKey) {
          deltaX = -i.contentWidth;
        } else if (e.altKey) {
          deltaX = -i.containerWidth;
        } else {
          deltaX = -step;
        }
        break;
      case 38: // up
        if (e.metaKey) {
          deltaY = getContentHeight();
        } else if (e.altKey) {
          deltaY = getPageHeight();
        } else {
          deltaY = step;
        }
        break;
      case 39: // right
        if (e.metaKey) {
          deltaX = i.contentWidth;
        } else if (e.altKey) {
          deltaX = i.containerWidth;
        } else {
          deltaX = step;
        }
        break;
      case 40: // down
        if (e.metaKey) {
          deltaY = -getContentHeight();
        } else if (e.altKey) {
          deltaY = -getPageHeight();
        } else {
          deltaY = -step;
        }
        break;
      case 32: // space bar
        if (e.shiftKey) {
          deltaY = getPageHeight();
        } else {
          deltaY = -getPageHeight();
        }
        break;
      case 33: // page up
        deltaY = getPageHeight();
        break;
      case 34: // page down
        deltaY = -getPageHeight();
        break;
      case 36: // home
        deltaY = getContentHeight();
        break;
      case 35: // end
        deltaY = -getContentHeight();
        break;
      default:
        return;
    }

    if (i.settings.suppressScrollX && deltaX !== 0) {
      return;
    }
    if (i.settings.suppressScrollY && deltaY !== 0) {
      return;
    }

    element.scrollTop -= deltaY;

    (element as HTMLElement).scrollLeft += deltaX;
    updateGeometry(i);

    if (shouldPreventDefault(deltaX, deltaY)) {
      e.preventDefault();
    }
  });
}
