/**
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

export type PopoverOverlayInstance = {
  hide: () => void;
  isOpen: () => boolean;
  isAlways?: () => boolean;
  getReferenceEl: () => HTMLElement | null;
  getFloatingEl: () => HTMLElement | null;
};

const popoverOverlayInstances = new Set<PopoverOverlayInstance>();

/**
 * 注册 Popover / Dropdown 等弹出层，供 Modal 打开时收起页面上无关的弹层。
 */
export const registerPopoverOverlay = (instance: PopoverOverlayInstance) => {
  popoverOverlayInstances.add(instance);
  return () => {
    popoverOverlayInstances.delete(instance);
  };
};

const isInsideContainer = (instance: PopoverOverlayInstance, container: HTMLElement) => {
  const referenceEl = instance.getReferenceEl();
  if (referenceEl && container.contains(referenceEl)) {
    return true;
  }
  const floatingEl = instance.getFloatingEl();
  return !!(floatingEl && container.contains(floatingEl));
};

/**
 * 收起不在指定容器内的弹出层。
 *
 * Popover 默认 z-index（~8000）高于 Dialog/Modal（~2000），
 * 页面上已展开的 Dropdown 会盖住后打开的 Dialog。
 * Dialog 内的 Select / DatePicker 等弹层（reference 在容器内）需要保留。
 */
export const hidePopoversOutside = (container?: HTMLElement | null) => {
  if (!container) {
    return;
  }
  popoverOverlayInstances.forEach(instance => {
    if (instance.isAlways?.()) {
      return;
    }
    if (!instance.isOpen()) {
      return;
    }
    if (isInsideContainer(instance, container)) {
      return;
    }
    instance.hide();
  });
};
