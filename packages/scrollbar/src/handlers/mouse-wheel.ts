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
import * as CSS from '../helper/css';
import { env } from '../helper/util';
import updateGeometry from '../update-geometry';

export default function (i: BkScrollbar) {
  const isVirtualElement = (i.element as VirtualElement).isVirtualElement;
  const element = isVirtualElement ? (i.element as VirtualElement).delegateElement : i.element;

  function shouldPreventDefault(deltaX, deltaY) {
    const scrollTopValue = isVirtualElement ? (i.element as VirtualElement).virtualScrollTop : element.scrollTop;
    const roundedScrollTop = Math.floor(scrollTopValue);

    const isTop = scrollTopValue === 0;
    const isBottom = () => {
      if (isVirtualElement) {
        return roundedScrollTop + i.scrollbarYHeight >= i.railYHeight;
      }

      return roundedScrollTop + (i.element as HTMLElement).offsetHeight === i.element.scrollHeight;
    };
    const isLeft = (element as HTMLElement).scrollLeft === 0;
    const isRight =
      (element as HTMLElement).scrollLeft + (element as HTMLElement).offsetWidth ===
      (element as HTMLElement).scrollWidth;

    let hitsBound;

    // pick axis with primary direction
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      hitsBound = isTop || isBottom();
    } else {
      hitsBound = isLeft || isRight;
    }

    return hitsBound ? !i.settings.wheelPropagation : true;
  }

  function getDeltaFromEvent(e) {
    let deltaX = e.deltaX;
    let deltaY = -1 * e.deltaY;

    if (typeof deltaX === 'undefined' || typeof deltaY === 'undefined') {
      // OS X Safari
      deltaX = (-1 * e.wheelDeltaX) / 6;
      deltaY = e.wheelDeltaY / 6;
    }

    if (e.deltaMode && e.deltaMode === 1) {
      // Firefox in deltaMode 1: Line scrolling
      deltaX *= 10;
      deltaY *= 10;
    }

    if (deltaX !== deltaX && deltaY !== deltaY /* NaN checks */) {
      // IE in some mouse drivers
      deltaX = 0;
      deltaY = e.wheelDelta;
    }

    if (e.shiftKey) {
      // reverse axis with shift key
      return [-deltaY, -deltaX];
    }
    return [deltaX, deltaY];
  }

  function shouldBeConsumedByChild(target, deltaX, deltaY) {
    // FIXME: this is a workaround for <select> issue in FF and IE #571
    if (!env.isWebKit && (element as HTMLElement).querySelector('select:focus')) {
      return true;
    }

    if (!(element as HTMLElement).contains(target)) {
      return false;
    }

    let cursor = target;

    while (cursor && cursor !== element) {
      if (cursor.classList.contains(i.cls.element.consuming)) {
        return true;
      }

      const style = CSS.get(cursor);

      // if deltaY && vertical scrollable
      if (deltaY && style.overflowY.match(/(scroll|auto)/)) {
        const maxScrollTop = cursor.scrollHeight - cursor.clientHeight;
        if (maxScrollTop > 0) {
          if ((cursor.scrollTop > 0 && deltaY < 0) || (cursor.scrollTop < maxScrollTop && deltaY > 0)) {
            return true;
          }
        }
      }
      // if deltaX && horizontal scrollable
      if (deltaX && style.overflowX.match(/(scroll|auto)/)) {
        const maxScrollLeft = cursor.scrollWidth - cursor.clientWidth;
        if (maxScrollLeft > 0) {
          if ((cursor.scrollLeft > 0 && deltaX < 0) || (cursor.scrollLeft < maxScrollLeft && deltaX > 0)) {
            return true;
          }
        }
      }

      cursor = cursor.parentNode;
    }

    return false;
  }

  const getMaxValue = () => {
    return i.element.scrollHeight - (i.element as HTMLElement).offsetHeight;
  };

  function setScrollTop(diff) {
    let newValue = i.element.scrollTop - diff;
    const maxValue = getMaxValue();

    if (newValue > maxValue) {
      newValue = maxValue;
    }

    if (newValue < 0) {
      newValue = 0;
    }

    i.element.scrollTop = newValue;
  }

  function mousewheelHandler(e) {
    const [deltaX, deltaY] = getDeltaFromEvent(e);

    if (shouldBeConsumedByChild(e.target, deltaX, deltaY)) {
      return;
    }

    let shouldPrevent = false;
    if (!i.settings.useBothWheelAxes) {
      // deltaX will only be used for horizontal scrolling and deltaY will
      // only be used for vertical scrolling - this is the default
      setScrollTop(deltaY * i.settings.wheelSpeed);
      (element as HTMLElement).scrollLeft += deltaX * i.settings.wheelSpeed;
    } else if (i.scrollbarYActive && !i.scrollbarXActive) {
      // only vertical scrollbar is active and useBothWheelAxes option is
      // active, so let's scroll vertical bar using both mouse wheel axes
      if (deltaY) {
        setScrollTop(deltaY * i.settings.wheelSpeed);
      } else {
        setScrollTop(-deltaX * i.settings.wheelSpeed);
      }
      shouldPrevent = true;
    } else if (i.scrollbarXActive && !i.scrollbarYActive) {
      // useBothWheelAxes and only horizontal bar is active, so use both
      // wheel axes for horizontal bar
      if (deltaX) {
        (element as HTMLElement).scrollLeft += deltaX * i.settings.wheelSpeed;
      } else {
        (element as HTMLElement).scrollLeft -= deltaY * i.settings.wheelSpeed;
      }
      shouldPrevent = true;
    }

    updateGeometry(i);

    shouldPrevent = shouldPrevent || shouldPreventDefault(deltaX, deltaY);
    if (shouldPrevent && !e.ctrlKey) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  if (typeof window.onwheel !== 'undefined') {
    i.event.bind(element, 'wheel', mousewheelHandler);
    // @ts-ignore
  } else if (typeof window.onmousewheel !== 'undefined') {
    i.event.bind(element, 'mousewheel', mousewheelHandler);
  }
}
