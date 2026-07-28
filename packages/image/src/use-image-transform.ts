/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 *
 * Copyright (C) 2025 Tencent.  All rights reserved.
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
import { computed, shallowRef } from 'vue';

import type { CSSProperties } from 'vue';

const ZOOM_STEP = 0.15;
const ZOOM_MIN = 0.1;
const ZOOM_MAX = 10;

export function useImageTransform() {
  const scale = shallowRef(1);
  const rotate = shallowRef(0);
  const translateX = shallowRef(0);
  const translateY = shallowRef(0);
  const isDragging = shallowRef(false);
  const skipTransition = shallowRef(false);

  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartTranslateX = 0;
  let dragStartTranslateY = 0;
  let handleDragMove: ((ev: MouseEvent) => void) | null = null;
  let handleDragEnd: (() => void) | null = null;

  const imageStyle = computed<CSSProperties>(() => ({
    transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value}) rotate(${rotate.value}deg)`,
    cursor: isDragging.value ? 'grabbing' : 'grab',
    transition: isDragging.value || skipTransition.value ? 'none' : 'transform 0.3s ease',
  }));

  const resetTransform = () => {
    skipTransition.value = true;
    scale.value = 1;
    rotate.value = 0;
    translateX.value = 0;
    translateY.value = 0;
    requestAnimationFrame(() => {
      skipTransition.value = false;
    });
  };

  const zoomIn = () => {
    scale.value = Math.min(ZOOM_MAX, scale.value * (1 + ZOOM_STEP));
  };

  const zoomOut = () => {
    scale.value = Math.max(ZOOM_MIN, scale.value * (1 - ZOOM_STEP));
  };

  const rotateCW = () => {
    rotate.value += 90;
  };

  const handleWheel = (e: WheelEvent) => {
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  const cleanupDragListeners = () => {
    if (handleDragMove) {
      document.removeEventListener('mousemove', handleDragMove);
      handleDragMove = null;
    }
    if (handleDragEnd) {
      document.removeEventListener('mouseup', handleDragEnd);
      handleDragEnd = null;
    }
  };

  const handleDragStart = (e: MouseEvent) => {
    if (e.button !== 0) {
      return;
    }
    isDragging.value = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragStartTranslateX = translateX.value;
    dragStartTranslateY = translateY.value;

    handleDragMove = (ev: MouseEvent) => {
      if (!isDragging.value) {
        return;
      }
      translateX.value = dragStartTranslateX + (ev.clientX - dragStartX);
      translateY.value = dragStartTranslateY + (ev.clientY - dragStartY);
    };

    handleDragEnd = () => {
      isDragging.value = false;
      cleanupDragListeners();
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  return {
    imageStyle,
    isDragging,
    resetTransform,
    zoomIn,
    zoomOut,
    rotateCW,
    handleWheel,
    handleDragStart,
    cleanupDragListeners,
  };
}
