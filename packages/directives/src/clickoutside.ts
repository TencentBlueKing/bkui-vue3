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

import type {
  ComponentPublicInstance,
  DirectiveBinding,
  ObjectDirective,
} from 'vue';

type Nullable<T> = T | null;
type DocumentHandler = <T extends MouseEvent>(mouseup: T, mousedown: T) => void;
type FlushList = Map<HTMLElement, {
  documentHandler: DocumentHandler
  bindingFn: (...args: unknown[]) => unknown
}[]>;

const isElement = (e: unknown): e is Element => {
  if (typeof Element === 'undefined') return false;
  return e instanceof Element;
};

const nodeList: FlushList = new Map();

let startClick: MouseEvent;

document.addEventListener('mousedown', (e: MouseEvent) => (startClick = e));
document.addEventListener('mouseup', (e: MouseEvent) => {
  for (const handlers of nodeList.values()) {
    for (const { documentHandler } of handlers) {
      documentHandler(e as MouseEvent, startClick);
    }
  }
});

function createDocumentHandler(el: HTMLElement, binding: DirectiveBinding): DocumentHandler {
  let excludes: HTMLElement[] = [];
  if (Array.isArray(binding.arg)) {
    excludes = binding.arg;
  } else if (isElement(binding.arg)) {
    excludes.push(binding.arg as unknown as HTMLElement);
  }
  return function (mouseup, mousedown) {
    const { popperRef } = binding.instance as ComponentPublicInstance<{
      popperRef: Nullable<HTMLElement>
    }>;
    const mouseUpTarget = mouseup.target as Node;
    const mouseDownTarget = mousedown?.target as Node;
    const isBound = !binding || !binding.instance;
    const isTargetExists = !mouseUpTarget || !mouseDownTarget;
    const isContainedByEl = el.contains(mouseUpTarget) || el.contains(mouseDownTarget);
    const isSelf = el === mouseUpTarget;

    const isTargetExcluded = (excludes.length && excludes.some(item => item?.contains(mouseUpTarget)))
      || (excludes.length && excludes.includes(mouseDownTarget as HTMLElement));
    const isContainedByPopper = popperRef
      && (popperRef.contains(mouseUpTarget) || popperRef.contains(mouseDownTarget));
    if (
      isBound || isTargetExists || isContainedByEl
      || isSelf || isTargetExcluded || isContainedByPopper
    ) {
      return;
    }
    binding.value(mouseup, mousedown);
  };
}

const ClickOutside: ObjectDirective = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    if (!nodeList.has(el)) {
      nodeList.set(el, []);
    }

    nodeList.get(el).push({
      documentHandler: createDocumentHandler(el, binding),
      bindingFn: binding.value,
    });
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    if (!nodeList.has(el)) {
      nodeList.set(el, []);
    }

    const handlers = nodeList.get(el);
    const oldHandlerIndex = handlers.findIndex(item => item.bindingFn === binding.oldValue);
    const newHandler = {
      documentHandler: createDocumentHandler(el, binding),
      bindingFn: binding.value,
    };

    if (oldHandlerIndex >= 0) {
      // replace the old handler to the new handler
      handlers.splice(oldHandlerIndex, 1, newHandler);
    } else {
      handlers.push(newHandler);
    }
  },
  unmounted(el: HTMLElement) {
    // remove all listeners when a component unmounted
    nodeList.delete(el);
  },
};

export default ClickOutside;
