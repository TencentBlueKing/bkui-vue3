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
export default fn => {
  const DELTA_SCALE = {
    STANDARD: 1,
    OTHERS: -3,
  };

  const DELTA_MODE = [1.0, 28.0, 500.0];

  const getDeltaMode = mode => DELTA_MODE[mode] || DELTA_MODE[0];
  let targetDom = null;

  const normalizeDelta = (evt: any) => {
    if ('deltaX' in evt) {
      const mode = getDeltaMode(evt.deltaMode);

      return {
        x: (evt.deltaX / DELTA_SCALE.STANDARD) * mode,
        y: (evt.deltaY / DELTA_SCALE.STANDARD) * mode,
        evt,
      };
    }

    if ('wheelDeltaX' in evt) {
      return {
        x: evt.wheelDeltaX / DELTA_SCALE.OTHERS,
        y: evt.wheelDeltaY / DELTA_SCALE.OTHERS,
        evt,
      };
    }

    // ie with touchpad
    return {
      x: 0,
      y: evt.wheelDelta / DELTA_SCALE.OTHERS,
      evt,
    };
  };

  const eventName =
    'onwheel' in window || document.implementation.hasFeature('Events.wheel', '3.0') ? 'wheel' : 'mousewheel';

  const resolveEventResponse = (e: Event) => {
    const result = normalizeDelta(e);

    const { scrollTop = 0, offsetHeight = 0, scrollHeight = 0 } = targetDom ?? {};
    const isWheelDown = result.y > 0 && scrollTop + offsetHeight + 2 < scrollHeight;
    const isWheelUp = result.y < 0 && scrollTop > 0;

    if (isWheelUp || isWheelDown) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
    }

    fn(result);
  };

  const addWheelEvent = (target: HTMLElement) => {
    targetDom = target;
    target.addEventListener(eventName, resolveEventResponse);
  };

  const removeWheelEvent = (target: HTMLElement) => {
    target.removeEventListener(eventName, resolveEventResponse);
    targetDom = null;
  };

  return {
    addWheelEvent,
    removeWheelEvent,
  };
};
