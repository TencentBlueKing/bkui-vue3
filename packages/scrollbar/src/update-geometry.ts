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
import BkScrollbar, { VirtualElement } from '.';
import * as CSS from './helper/css';
import * as DOM from './helper/dom';
import { toInt } from './helper/util';

export type Placement = {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
};

export default function (i: BkScrollbar) {
  const element = i.element;
  const roundedScrollTop = Math.floor(element.scrollTop);
  const rect = (element as HTMLElement).getBoundingClientRect();

  i.containerWidth = Math.round(rect.width);
  i.containerHeight = Math.round(rect.height);

  i.contentWidth = (element as HTMLElement).scrollWidth;
  i.contentHeight = element.scrollHeight;

  if (!(element as HTMLElement).contains(i.scrollbarXRail)) {
    // clean up and append
    DOM.queryChildren(element, i.cls.element.rail('x')).forEach(el => DOM.remove(el));
    (element as HTMLElement).appendChild(i.scrollbarXRail);
  }
  if (!(element as HTMLElement).contains(i.scrollbarYRail)) {
    // clean up and append
    DOM.queryChildren(element, i.cls.element.rail('y')).forEach(el => DOM.remove(el));
    (element as HTMLElement).appendChild(i.scrollbarYRail);
  }

  if (!i.settings.suppressScrollX && i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth) {
    i.scrollbarXActive = true;
    i.railXWidth = i.containerWidth - i.railXMarginWidth;
    i.railXRatio = i.containerWidth / i.railXWidth;
    i.scrollbarXWidth = getThumbSize(i, toInt((i.railXWidth * i.containerWidth) / i.contentWidth));
    i.scrollbarXLeft = toInt(
      ((i.negativeScrollAdjustment + (element as HTMLElement).scrollLeft) * (i.railXWidth - i.scrollbarXWidth)) /
        (i.contentWidth - i.containerWidth),
    );
  } else {
    i.scrollbarXActive = false;
  }

  if (!i.settings.suppressScrollY && i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight) {
    i.scrollbarYActive = true;
    i.railYHeight = i.containerHeight - i.railYMarginHeight;
    i.railYRatio = i.containerHeight / i.railYHeight;

    i.scrollbarYHeight = getThumbSize(i, toInt((i.railYHeight * i.containerHeight) / i.contentHeight));
    i.scrollbarYTop = (i.element as VirtualElement).isVirtualElement
      ? getThumbTop(i)
      : toInt((roundedScrollTop * (i.railYHeight - i.scrollbarYHeight)) / (i.contentHeight - i.containerHeight));
  } else {
    i.scrollbarYActive = false;
  }

  if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
    i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
  }
  if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
    i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
  }

  updateCss(element, i);

  if (i.scrollbarXActive) {
    (element as HTMLElement).classList.add(i.cls.state.active('x'));
  } else {
    (element as HTMLElement).classList.remove(i.cls.state.active('x'));
    i.scrollbarXWidth = 0;
    i.scrollbarXLeft = 0;
    (element as HTMLElement).scrollLeft = i.isRtl === true ? i.contentWidth : 0;
  }
  if (i.scrollbarYActive) {
    (element as HTMLElement).classList.add(i.cls.state.active('y'));
  } else {
    (element as HTMLElement).classList.remove(i.cls.state.active('y'));
    i.scrollbarYHeight = 0;
    i.scrollbarYTop = 0;
    element.scrollTop = 0;
  }
}

function getThumbTop(i) {
  const top = toInt(i.element.virtualScrollTop);
  if (top >= 0) {
    return top;
  }

  return 0;
}

function getThumbSize(i, thumbSize) {
  if (i.settings.minScrollbarLength) {
    thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
  }
  if (i.settings.maxScrollbarLength) {
    thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
  }
  return thumbSize;
}

function updateCss(element: Partial<Element> | Partial<VirtualElement>, i) {
  const xRailOffset: Placement & { width: number } = {
    width: i.railXWidth,
  };
  const roundedScrollTop = (element as VirtualElement).isVirtualElement ? 0 : Math.floor(element.scrollTop);

  if (i.isRtl) {
    xRailOffset.left =
      i.negativeScrollAdjustment + (element as HTMLElement).scrollLeft + i.containerWidth - i.contentWidth;
  } else {
    xRailOffset.left = (element as HTMLElement).scrollLeft;
  }
  if (i.isScrollbarXUsingBottom) {
    xRailOffset.bottom = i.scrollbarXBottom - roundedScrollTop;
  } else {
    xRailOffset.top = i.scrollbarXTop + roundedScrollTop;
  }
  CSS.set(i.scrollbarXRail, xRailOffset);

  const yRailOffset: Placement & { height: number } = { top: roundedScrollTop, height: i.railYHeight };
  if (i.isScrollbarYUsingRight) {
    if (i.isRtl) {
      yRailOffset.right =
        i.contentWidth -
        (i.negativeScrollAdjustment + (element as HTMLElement).scrollLeft) -
        i.scrollbarYRight -
        i.scrollbarYOuterWidth -
        9;
    } else {
      yRailOffset.right = i.scrollbarYRight - (element as HTMLElement).scrollLeft;
    }
  } else {
    if (i.isRtl) {
      yRailOffset.left =
        i.negativeScrollAdjustment +
        (element as HTMLElement).scrollLeft +
        i.containerWidth * 2 -
        i.contentWidth -
        i.scrollbarYLeft -
        i.scrollbarYOuterWidth;
    } else {
      yRailOffset.left = i.scrollbarYLeft + (element as HTMLElement).scrollLeft;
    }
  }
  CSS.set(i.scrollbarYRail, yRailOffset);

  CSS.set(i.scrollbarX, {
    left: i.scrollbarXLeft,
    width: i.scrollbarXWidth - i.railBorderXWidth,
  });
  CSS.set(i.scrollbarY, {
    top: i.scrollbarYTop,
    height: i.scrollbarYHeight - i.railBorderYWidth,
  });
}
