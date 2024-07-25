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
import { addScrollingClass, removeScrollingClass } from '../helper/class-names';
import updateGeometry from '../update-geometry';

export default function (i) {
  bindMouseScrollHandler(i, [
    'containerWidth',
    'contentWidth',
    'pageX',
    'railXWidth',
    'scrollbarX',
    'scrollbarXWidth',
    'scrollLeft',
    'x',
    'scrollbarXRail',
  ]);
  bindMouseScrollHandler(i, [
    'containerHeight',
    'contentHeight',
    'pageY',
    'railYHeight',
    'scrollbarY',
    'scrollbarYHeight',
    'scrollTop',
    'y',
    'scrollbarYRail',
  ]);
}

function bindMouseScrollHandler(
  i,
  [containerHeight, contentHeight, pageY, railYHeight, scrollbarY, scrollbarYHeight, scrollTop, y, scrollbarYRail],
) {
  const element = i.element;

  let startingScrollTop = null;
  let startingMousePageY = null;
  let scrollBy = null;

  function mouseMoveHandler(e) {
    if (e.touches?.[0]) {
      e[pageY] = e.touches[0].pageY;
    }
    element[scrollTop] = startingScrollTop + scrollBy * (e[pageY] - startingMousePageY);
    addScrollingClass(i, y);
    updateGeometry(i);

    e.stopPropagation();
    if (e.type.startsWith('touch') && e.changedTouches.length > 1) {
      e.preventDefault();
    }
  }

  function mouseUpHandler() {
    removeScrollingClass(i, y);
    i[scrollbarYRail].classList.remove(i.cls.state.clicking);
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  }

  function bindMoves(e, touchMode?) {
    startingScrollTop = element[scrollTop];
    if (touchMode && e.touches) {
      e[pageY] = e.touches[0].pageY;
    }
    startingMousePageY = e[pageY];
    scrollBy = (i[contentHeight] - i[containerHeight]) / (i[railYHeight] - i[scrollbarYHeight]);
    if (!touchMode) {
      i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
      i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);
      e.preventDefault();
    } else {
      i.event.bind(i.ownerDocument, 'touchmove', mouseMoveHandler);
    }

    i[scrollbarYRail].classList.add(i.cls.state.clicking);

    e.stopPropagation();
  }

  i.event.bind(i[scrollbarY], 'mousedown', e => {
    bindMoves(e);
  });
  i.event.bind(i[scrollbarY], 'touchstart', e => {
    bindMoves(e, true);
  });
}
