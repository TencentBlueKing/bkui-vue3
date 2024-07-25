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

import { VirtualElement } from '..';

class EventElement {
  element: Element | VirtualElement;
  handlers: Record<string, ((...args) => void)[]>;
  constructor(element: Element & VirtualElement) {
    this.element = element;
    this.handlers = {};
  }

  bind(eventName, handler) {
    if (typeof this.handlers[eventName] === 'undefined') {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(handler);
    (this.element as HTMLElement).addEventListener(eventName, handler, false);
  }

  unbind(eventName, target?) {
    this.handlers[eventName] = this.handlers[eventName].filter(handler => {
      if (target && handler !== target) {
        return true;
      }
      (this.element as HTMLElement).removeEventListener(eventName, handler, false);
      return false;
    });
  }

  unbindAll() {
    for (const name in this.handlers) {
      this.unbind(name);
    }
  }

  get isEmpty() {
    return Object.keys(this.handlers).every(key => this.handlers[key].length === 0);
  }
}

export default class EventManager {
  eventElements: EventElement[];
  constructor() {
    this.eventElements = [];
  }

  eventElement(element) {
    let ee = this.eventElements.filter(ee => ee.element === element)[0];
    if (!ee) {
      ee = new EventElement(element);
      this.eventElements.push(ee);
    }
    return ee;
  }

  bind(element, eventName, handler) {
    this.eventElement(element).bind(eventName, handler);
  }

  unbind(element, eventName, handler) {
    const ee = this.eventElement(element);
    ee.unbind(eventName, handler);

    if (ee.isEmpty) {
      // remove
      this.eventElements.splice(this.eventElements.indexOf(ee), 1);
    }
  }

  unbindAll() {
    this.eventElements.forEach(e => e.unbindAll());
    this.eventElements = [];
  }

  once(element, eventName, handler) {
    const ee = this.eventElement(element);
    const onceHandler = evt => {
      ee.unbind(eventName, onceHandler);
      handler(evt);
    };
    ee.bind(eventName, onceHandler);
  }
}
