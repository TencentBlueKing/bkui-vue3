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
import updateGeometry from '../update-geometry';

export default function (i: BkScrollbar) {
  i.event.bind(i.scrollbarY, 'mousedown', e => e.stopPropagation());
  i.event.bind(i.scrollbarYRail, 'mousedown', e => {
    const positionTop = e.pageY - window.pageYOffset - i.scrollbarYRail.getBoundingClientRect().top;
    const direction = positionTop > i.scrollbarYTop ? 1 : -1;

    if (!(i.element as VirtualElement).isVirtualElement) {
      i.element.scrollTop += direction * i.containerHeight;
    } else {
      i.element.scrollTop = positionTop / ((i.element as HTMLElement).offsetHeight / i.element.scrollHeight);
    }

    i.element.scrollTop += direction * i.containerHeight;
    updateGeometry(i);

    e.stopPropagation();
  });

  i.event.bind(i.scrollbarX, 'mousedown', e => e.stopPropagation());
  i.event.bind(i.scrollbarXRail, 'mousedown', e => {
    const positionLeft = e.pageX - window.pageXOffset - i.scrollbarXRail.getBoundingClientRect().left;
    const direction = positionLeft > i.scrollbarXLeft ? 1 : -1;

    (i.element as HTMLElement).scrollLeft += direction * i.containerWidth;

    updateGeometry(i);

    e.stopPropagation();
  });
}
